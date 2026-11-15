import { createHash, randomBytes, randomUUID, timingSafeEqual } from "node:crypto";
import { moderateText, transcribeAudio } from "./greeting-screening.mjs";

// Public Golden Record greetings. The owner chose direct publishing: a shared
// greeting appears for everyone immediately, with no review queue. Safeguards
// that do not delay it: explicit consent, size and length limits, optional
// automatic screening that blocks flagged words, one-tap reporting that hides
// a greeting at once, a private delete key for the person who shared it, and
// an owner token to remove or restore anything.
export const MAX_AUDIO_BYTES = 2 * 1024 * 1024;
const MAX_BODY_BYTES = 3 * 1024 * 1024;
const LIST_LIMIT = 40;
const audioTypes = new Set(["audio/webm", "audio/webm;codecs=opus", "audio/ogg", "audio/ogg;codecs=opus", "audio/mp4"]);
const json = (data, status = 200) => Response.json(data, { status, headers: { "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" } });
const clean = (value, max) => typeof value === "string" ? value.replace(/[\u0000-\u001f\u007f]/g, " ").trim().slice(0, max) : "";
const hash = (value) => createHash("sha256").update(value).digest("hex");
const idOk = (value) => /^[0-9a-f-]{36}$/.test(value || "");
const keyOk = (value) => typeof value === "string" && /^[a-f0-9]{64}$/.test(value);
const entryKey = (id) => `greeting/${id}`;
const audioKey = (id) => `audio/${id}`;
const listKey = (entry) => `public/${entry.publishedAt}/${entry.id}`;
export const publicEntry = ({ id, name, language, country, message, translation, transcript, publishedAt, audioType }) => ({
  id, name, language, country, message, translation, transcript: transcript || "", publishedAt, hasAudio: Boolean(audioType),
});

function sameSecret(secret, expectedHash) {
  if (!keyOk(secret) || typeof expectedHash !== "string") return false;
  const actual = Buffer.from(hash(secret), "hex");
  const expected = Buffer.from(expectedHash, "hex");
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}

function ownerOk(token) {
  const expected = process.env.COMMUNITY_ADMIN_TOKEN;
  if (!expected || typeof token !== "string" || token.length < 16) return false;
  return timingSafeEqual(Buffer.from(hash(token), "hex"), Buffer.from(hash(expected), "hex"));
}

async function hide(store, entry) {
  await Promise.all([
    store.delete(listKey(entry)),
    store.setJSON(entryKey(entry.id), { ...entry, status: "hidden", hiddenAt: new Date().toISOString() }),
  ]);
}

async function erase(store, entry) {
  await Promise.all([store.delete(listKey(entry)), store.delete(entryKey(entry.id)), store.delete(audioKey(entry.id))]);
}

export async function handleSharedGreetings(request, store) {
  const url = new URL(request.url);
  try {
    if (request.method === "GET") {
      const action = url.searchParams.get("action") || "list";
      if (action === "list") {
        const { blobs } = await store.list({ prefix: "public/" });
        const selected = blobs.sort((a, b) => b.key.localeCompare(a.key)).slice(0, LIST_LIMIT);
        const entries = (await Promise.all(selected.map(({ key }) => store.get(key, { type: "json", consistency: "strong" })))).filter(Boolean);
        return json({ greetings: entries });
      }
      if (action === "audio") {
        const id = url.searchParams.get("id");
        if (!idOk(id)) return json({ error: "Invalid greeting." }, 400);
        const entry = await store.get(entryKey(id), { type: "json" });
        if (entry?.status !== "public" || !entry.audioType) return json({ error: "Greeting not found." }, 404);
        const bytes = await store.get(audioKey(id), { type: "arrayBuffer" });
        return bytes
          ? new Response(bytes, { headers: { "Content-Type": entry.audioType, "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" } })
          : json({ error: "Audio unavailable." }, 404);
      }
      return json({ error: "Unknown action." }, 404);
    }
    if (request.method !== "POST") return json({ error: "Method not allowed." }, 405);
    if (Number(request.headers.get("content-length")) > MAX_BODY_BYTES) return json({ error: "Request too large." }, 413);
    const raw = await request.text();
    if (Buffer.byteLength(raw) > MAX_BODY_BYTES) return json({ error: "Request too large." }, 413);
    let body;
    try { body = JSON.parse(raw); } catch { return json({ error: "Invalid JSON." }, 400); }

    if (["report", "delete", "owner-remove", "owner-restore"].includes(body.action)) {
      const id = clean(body.id, 36);
      if (!idOk(id)) return json({ error: "Invalid greeting." }, 400);
      const entry = await store.get(entryKey(id), { type: "json", consistency: "strong" });
      if (!entry) return json({ error: "Greeting not found." }, 404);
      if (body.action === "report") {
        // One report hides a greeting immediately; the owner can restore it later.
        if (entry.status === "public") await hide(store, { ...entry, reports: (entry.reports || 0) + 1 });
        return json({ status: "hidden" });
      }
      if (body.action === "delete") {
        if (!sameSecret(body.deleteKey, entry.deleteHash)) return json({ error: "Only the person who shared this greeting can delete it." }, 403);
        await erase(store, entry);
        return json({ status: "deleted" });
      }
      if (!ownerOk(body.ownerToken)) return json({ error: "Owner token required." }, 403);
      if (body.action === "owner-remove") {
        await erase(store, entry);
        return json({ status: "deleted" });
      }
      const restored = { ...entry, status: "public" };
      delete restored.hiddenAt;
      await Promise.all([store.setJSON(entryKey(id), restored), store.setJSON(listKey(restored), publicEntry(restored))]);
      return json({ status: "public" });
    }

    if (body.action !== "share") return json({ error: "Unknown action." }, 404);
    if (body.consent !== true) return json({ error: "Tick the sharing box first." }, 400);
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
    const transcript = bytes ? await transcribeAudio(bytes, mimeType) : "";
    const screening = await moderateText([name, language, country, message, translation, transcript].filter(Boolean).join("\n"));
    if (screening === "flagged") return json({ error: "This greeting can't be shared. Try different words." }, 422);
    const id = randomUUID();
    const deleteKey = randomBytes(32).toString("hex");
    const publishedAt = new Date().toISOString();
    const entry = { id, name, language, country, message, translation, publishedAt, audioType: bytes ? mimeType : "", transcript, screening, deleteHash: hash(deleteKey), status: "public" };
    if (bytes) await store.set(audioKey(id), bytes);
    await store.setJSON(entryKey(id), entry);
    await store.setJSON(listKey(entry), publicEntry(entry));
    return json({ id, deleteKey, greeting: publicEntry(entry), screening }, 201);
  } catch (error) {
    console.error("Shared greetings function failed", error);
    return json({ error: "Sharing is temporarily unavailable." }, 503);
  }
}
