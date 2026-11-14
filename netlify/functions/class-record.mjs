import { createHash, randomBytes, randomUUID, timingSafeEqual } from "node:crypto";
import { getStore } from "@netlify/blobs";

const MAX_AUDIO_BYTES = 2 * 1024 * 1024;
const MAX_BODY_BYTES = 3 * 1024 * 1024;
const MAX_CLASS_RECORDS = 60;
const audioTypes = new Set(["audio/webm", "audio/webm;codecs=opus", "audio/ogg", "audio/ogg;codecs=opus", "audio/mp4"]);
const json = (data, status = 200) => Response.json(data, { status, headers: { "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" } });
const clean = (value, max) => typeof value === "string" ? value.replace(/[\u0000-\u001f\u007f]/g, " ").trim().slice(0, max) : "";
const hash = (value) => createHash("sha256").update(value).digest("hex");
const codeOk = (value) => /^[A-F0-9]{12}$/.test(value || "");
const idOk = (value) => /^[0-9a-f-]{36}$/.test(value || "");
const entryKey = (code, id) => `entry/${code}/${id}`;
const audioKey = (code, id) => `audio/${code}/${id}`;
const publicEntry = ({ id, name, language, country, message, translation, createdAt, audioType }) => ({
  id, name, language, country, message, translation, createdAt, hasAudio: Boolean(audioType),
});

function teacherOwns(record, key) {
  if (!record || typeof key !== "string" || !/^[a-f0-9]{64}$/.test(key)) return false;
  const actual = Buffer.from(hash(key), "hex");
  const expected = Buffer.from(record.teacherHash, "hex");
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}

async function moderateText(text) {
  const apiKey = process.env.CLASSROOM_OPENAI_API_KEY;
  if (!apiKey) return "not-configured";
  try {
    const response = await fetch("https://api.openai.com/v1/moderations", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({ model: "omni-moderation-latest", input: text }),
      signal: AbortSignal.timeout(8000),
    });
    if (!response.ok) return "unavailable";
    const result = await response.json();
    return result.results?.[0]?.flagged ? "flagged" : "clear";
  } catch { return "unavailable"; }
}

async function transcribeAudio(bytes, mimeType) {
  const apiKey = process.env.CLASSROOM_OPENAI_API_KEY;
  if (!apiKey) return "";
  try {
    const form = new FormData();
    form.set("model", "gpt-4o-mini-transcribe");
    form.set("file", new File([bytes], `greeting.${mimeType.includes("mp4") ? "m4a" : mimeType.includes("ogg") ? "ogg" : "webm"}`, { type: mimeType }));
    const response = await fetch("https://api.openai.com/v1/audio/transcriptions", {
      method: "POST", headers: { Authorization: `Bearer ${apiKey}` }, body: form,
      signal: AbortSignal.timeout(15000),
    });
    return response.ok ? clean((await response.json()).text, 1000) : "";
  } catch { return ""; }
}

async function entriesFor(store, code) {
  const { blobs } = await store.list({ prefix: `entry/${code}/` });
  return (await Promise.all(blobs.slice(0, MAX_CLASS_RECORDS + 1).map(({ key }) => store.get(key, { type: "json", consistency: "strong" })))).filter(Boolean);
}

export async function handleClassRecord(request, store) {
  const url = new URL(request.url);
  const action = url.searchParams.get("action");
  try {
    if (request.method === "GET") {
      if (action === "gallery") {
        const { blobs } = await store.list({ prefix: "public/" });
        const selected = blobs.sort((a, b) => b.key.localeCompare(a.key)).slice(0, 40);
        const entries = (await Promise.all(selected.map(({ key }) => store.get(key, { type: "json", consistency: "strong" })))).filter(Boolean);
        return json({ recordings: entries });
      }
      const code = (url.searchParams.get("code") || "").toUpperCase();
      if (!codeOk(code)) return json({ error: "Enter a valid class code." }, 400);
      const classroom = await store.get(`class/${code}`, { type: "json" });
      if (!classroom) return json({ error: "Class record not found." }, 404);
      if (action === "class") {
        const entries = (await entriesFor(store, code)).filter((entry) => entry.status === "approved").sort((a, b) => a.createdAt.localeCompare(b.createdAt));
        return json({ code, title: classroom.title, createdAt: classroom.createdAt, recordings: entries.map(publicEntry) });
      }
      if (action === "audio") {
        const id = url.searchParams.get("id");
        if (!idOk(id)) return json({ error: "Invalid recording." }, 400);
        const entry = await store.get(entryKey(code, id), { type: "json" });
        if (entry?.status !== "approved" || !entry.audioType) return json({ error: "Recording not found." }, 404);
        const bytes = await store.get(audioKey(code, id), { type: "arrayBuffer" });
        return bytes ? new Response(bytes, { headers: { "Content-Type": entry.audioType, "Cache-Control": "public, max-age=3600", "X-Content-Type-Options": "nosniff" } }) : json({ error: "Audio unavailable." }, 404);
      }
      return json({ error: "Unknown action." }, 404);
    }
    if (request.method !== "POST") return json({ error: "Method not allowed." }, 405);
    if (Number(request.headers.get("content-length")) > MAX_BODY_BYTES) return json({ error: "Request too large." }, 413);
    const raw = await request.text();
    if (Buffer.byteLength(raw) > MAX_BODY_BYTES) return json({ error: "Request too large." }, 413);
    let body;
    try { body = JSON.parse(raw); } catch { return json({ error: "Invalid JSON." }, 400); }
    if (body.action === "create") {
      const title = clean(body.title, 70);
      if (title.length < 3) return json({ error: "Give your class record a title." }, 400);
      const teacherKey = randomBytes(32).toString("hex");
      for (let attempt = 0; attempt < 5; attempt++) {
        const code = randomBytes(6).toString("hex").toUpperCase();
        const createdAt = new Date().toISOString();
        const result = await store.setJSON(`class/${code}`, { title, teacherHash: hash(teacherKey), createdAt }, { onlyIfNew: true });
        if (result.modified) return json({ code, title, teacherKey, createdAt }, 201);
      }
      return json({ error: "Could not create a unique class code. Try again." }, 503);
    }
    const code = clean(body.code, 12).toUpperCase();
    if (!codeOk(code)) return json({ error: "Enter a valid class code." }, 400);
    const classroom = await store.get(`class/${code}`, { type: "json" });
    if (!classroom) return json({ error: "Class record not found." }, 404);
    if (body.action === "queue" || body.action === "review" || body.action === "pending-audio" || body.action === "remove") {
      if (!teacherOwns(classroom, body.teacherKey)) return json({ error: "Teacher key required." }, 403);
      if (body.action === "queue") {
        const entries = (await entriesFor(store, code)).filter((entry) => entry.status === "pending");
        return json({ recordings: entries.map(({ aiReview, transcript, ...entry }) => ({ ...publicEntry(entry), aiReview, transcript })) });
      }
      const id = clean(body.id, 36);
      if (!idOk(id)) return json({ error: "Invalid recording." }, 400);
      const entry = await store.get(entryKey(code, id), { type: "json" });
      if (body.action === "remove") {
        if (!entry || entry.status !== "approved") return json({ error: "Published greeting not found." }, 404);
        await Promise.all([
          store.delete(entryKey(code, id)),
          store.delete(audioKey(code, id)),
          store.delete(`public/${entry.approvedAt}/${id}`),
        ]);
        return json({ status: "removed" });
      }
      if (!entry || entry.status !== "pending") return json({ error: "Pending recording not found." }, 404);
      if (body.action === "pending-audio") {
        if (!entry.audioType) return json({ error: "No audio." }, 404);
        const bytes = await store.get(audioKey(code, id), { type: "arrayBuffer" });
        return json({ mimeType: entry.audioType, audioBase64: Buffer.from(bytes || []).toString("base64") });
      }
      if (!["approve", "reject"].includes(body.decision)) return json({ error: "Choose approve or reject." }, 400);
      if (body.decision === "approve" && entry.aiReview === "flagged") return json({ error: "AI flagged this submission. Reject it or review outside the site." }, 409);
      if (body.decision === "reject") {
        await Promise.all([store.delete(entryKey(code, id)), store.delete(audioKey(code, id))]);
        return json({ status: "rejected" });
      }
      entry.status = "approved";
      entry.approvedAt = new Date().toISOString();
      await store.setJSON(entryKey(code, id), entry);
      await store.setJSON(`public/${entry.approvedAt}/${id}`, { ...publicEntry(entry), code, classTitle: classroom.title });
      return json({ status: "approved" });
    }
    if (body.action !== "submit") return json({ error: "Unknown action." }, 404);
    if (body.consent !== true) return json({ error: "Sharing consent is required." }, 400);
    const name = clean(body.name, 40) || "Anonymous Earthling";
    const language = clean(body.language, 40);
    const country = clean(body.country, 50);
    const message = clean(body.message, 240);
    const translation = clean(body.translation, 240);
    const mimeType = clean(body.mimeType, 60).toLowerCase();
    if (!language || (!message && !body.audioBase64)) return json({ error: "Add a language and a greeting." }, 400);
    let bytes = null;
    if (body.audioBase64) {
      if (!audioTypes.has(mimeType) || typeof body.audioBase64 !== "string" || !/^[A-Za-z0-9+/]+={0,2}$/.test(body.audioBase64)) return json({ error: "Unsupported audio format." }, 400);
      bytes = Buffer.from(body.audioBase64, "base64");
      if (!bytes.length || bytes.length > MAX_AUDIO_BYTES) return json({ error: "Audio must be under 2 MB." }, 413);
    }
    const existing = await entriesFor(store, code);
    if (existing.length >= MAX_CLASS_RECORDS) return json({ error: "This class record is full." }, 409);
    const transcript = bytes ? await transcribeAudio(bytes, mimeType) : "";
    const textReview = await moderateText([name, language, country, message, translation, transcript].filter(Boolean).join("\n"));
    const aiReview = bytes && !transcript && textReview === "clear" ? "audio-unchecked" : textReview;
    if (aiReview === "flagged") return json({ error: "This greeting needs revision before submitting. Try different wording." }, 422);
    const id = randomUUID();
    const savedAt = Date.parse(body.createdAt);
    const now = Date.now();
    const createdAt = Number.isFinite(savedAt) && savedAt <= now && savedAt >= now - 2 * 365 * 86400e3
      ? new Date(savedAt).toISOString() : new Date(now).toISOString();
    const entry = { id, name, language, country, message, translation, createdAt, submittedAt: new Date(now).toISOString(), audioType: bytes ? mimeType : "", transcript, aiReview, status: "pending" };
    if (bytes) await store.set(audioKey(code, id), bytes);
    await store.setJSON(entryKey(code, id), entry);
    return json({ id, status: "pending", aiReview }, 202);
  } catch (error) {
    console.error("Class record function failed", error);
    return json({ error: "The class record is temporarily unavailable." }, 503);
  }
}

export default (request) => handleClassRecord(request, getStore({ name: "mission-alive-class-records", consistency: "strong" }));

export const config = {
  path: "/api/class-record",
  rateLimit: { windowLimit: 120, windowSize: 60, aggregateBy: ["ip", "domain"] },
};
