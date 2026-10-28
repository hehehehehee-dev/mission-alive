import { createServer } from "node:http";
import { randomUUID, timingSafeEqual } from "node:crypto";
import { mkdir, readFile, rename, rm, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { fetchVoyagerDistance } from "./voyager-horizons.mjs";

const PORT = Number(process.env.PORT || 8787);
const DATA_DIR = resolve(process.env.COMMUNITY_DATA_DIR || "community-data");
const AUDIO_DIR = join(DATA_DIR, "audio");
const INDEX_FILE = join(DATA_DIR, "recordings.json");
const ALLOWED_ORIGIN = process.env.COMMUNITY_ALLOWED_ORIGIN || "http://127.0.0.1:5173";
const ADMIN_TOKEN = process.env.COMMUNITY_ADMIN_TOKEN || "";
const MAX_BODY_BYTES = 12 * 1024 * 1024;
const MAX_AUDIO_BYTES = 8 * 1024 * 1024;
const RATE_WINDOW_MS = 60 * 60 * 1000;
const RATE_LIMIT = 5;
const rateLimits = new Map();
const mimeExtensions = new Map([
  ["audio/webm", ".webm"],
  ["audio/webm;codecs=opus", ".webm"],
  ["audio/ogg", ".ogg"],
  ["audio/ogg;codecs=opus", ".ogg"],
  ["audio/mp4", ".m4a"],
]);

function cleanText(value, max) {
  return typeof value === "string"
    ? value.replace(/[\u0000-\u001f\u007f]/g, " ").trim().slice(0, max)
    : "";
}

function corsHeaders(request) {
  const origin = request.headers.origin || "";
  const allow = ALLOWED_ORIGIN === "*" || origin === ALLOWED_ORIGIN;
  return {
    ...(allow ? { "Access-Control-Allow-Origin": ALLOWED_ORIGIN === "*" ? "*" : origin } : {}),
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    Vary: "Origin",
  };
}

function sendJson(request, response, status, payload) {
  response.writeHead(status, {
    ...corsHeaders(request),
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
  });
  response.end(JSON.stringify(payload));
}

function publicOrigin(request) {
  const protocol = request.headers["x-forwarded-proto"] || "http";
  return `${protocol}://${request.headers.host}`;
}

async function readIndex() {
  try {
    const parsed = JSON.parse(await readFile(INDEX_FILE, "utf8"));
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    if (error.code === "ENOENT") return [];
    throw error;
  }
}

async function writeIndex(records) {
  const temporary = `${INDEX_FILE}.tmp`;
  await writeFile(temporary, JSON.stringify(records, null, 2), "utf8");
  await rename(temporary, INDEX_FILE);
}

async function readJsonBody(request) {
  const chunks = [];
  let size = 0;
  for await (const chunk of request) {
    size += chunk.length;
    if (size > MAX_BODY_BYTES) throw Object.assign(new Error("Request too large"), { status: 413 });
    chunks.push(chunk);
  }
  try {
    return JSON.parse(Buffer.concat(chunks).toString("utf8"));
  } catch {
    throw Object.assign(new Error("Invalid JSON"), { status: 400 });
  }
}

function checkRateLimit(request) {
  const ip = String(request.headers["x-forwarded-for"] || request.socket.remoteAddress || "unknown")
    .split(",")[0]
    .trim();
  const now = Date.now();
  const recent = (rateLimits.get(ip) || []).filter((time) => now - time < RATE_WINDOW_MS);
  if (recent.length >= RATE_LIMIT) return false;
  recent.push(now);
  rateLimits.set(ip, recent);
  return true;
}

function authorized(request) {
  if (!ADMIN_TOKEN) return false;
  const supplied = String(request.headers.authorization || "").replace(/^Bearer\s+/i, "");
  const expected = Buffer.from(ADMIN_TOKEN);
  const actual = Buffer.from(supplied);
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}

async function submitRecording(request, response) {
  if (!checkRateLimit(request)) {
    sendJson(request, response, 429, { error: "Submission limit reached. Try again later." });
    return;
  }
  const body = await readJsonBody(request);
  const name = cleanText(body.name, 40) || "Anonymous Earthling";
  const language = cleanText(body.language, 40);
  const country = cleanText(body.country, 50);
  const message = cleanText(body.message, 240);
  const mimeType = cleanText(body.mimeType, 60).toLowerCase();
  if (!body.consent || !language || !mimeExtensions.has(mimeType) || typeof body.audioBase64 !== "string") {
    sendJson(request, response, 400, { error: "Language, consent, and a supported audio recording are required." });
    return;
  }
  if (!/^[A-Za-z0-9+/]+={0,2}$/.test(body.audioBase64)) {
    sendJson(request, response, 400, { error: "Audio payload is not valid base64." });
    return;
  }
  let audio;
  try {
    audio = Buffer.from(body.audioBase64, "base64");
  } catch {
    audio = Buffer.alloc(0);
  }
  if (!audio.length || audio.length > MAX_AUDIO_BYTES) {
    sendJson(request, response, 413, { error: "Audio must be between 1 byte and 8 MB." });
    return;
  }
  const id = randomUUID();
  const fileName = `${id}${mimeExtensions.get(mimeType)}`;
  await writeFile(join(AUDIO_DIR, fileName), audio, { flag: "wx" });
  const records = await readIndex();
  records.push({
    id,
    name,
    language,
    country,
    message,
    mimeType,
    fileName,
    status: "pending",
    submittedAt: new Date().toISOString(),
  });
  await writeIndex(records);
  sendJson(request, response, 202, { id, status: "pending" });
}

async function listRecordings(request, response) {
  const records = (await readIndex())
    .filter((record) => record.status === "published")
    .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))
    .map(({ id, name, language, country, message, publishedAt }) => ({
      id,
      name,
      language,
      country,
      message,
      publishedAt,
      audioUrl: `${publicOrigin(request)}/recordings/${id}/audio`,
    }));
  sendJson(request, response, 200, { recordings: records });
}

async function serveAudio(request, response, id) {
  const record = (await readIndex()).find(
    (item) => item.id === id && item.status === "published",
  );
  if (!record) {
    sendJson(request, response, 404, { error: "Recording not found." });
    return;
  }
  const file = join(AUDIO_DIR, record.fileName);
  const bytes = await readFile(file);
  response.writeHead(200, {
    ...corsHeaders(request),
    "Content-Type": record.mimeType,
    "Content-Length": bytes.length,
    "Cache-Control": "public, max-age=3600",
    "X-Content-Type-Options": "nosniff",
  });
  response.end(bytes);
}

async function moderateRecording(request, response, id, action) {
  if (!authorized(request)) {
    sendJson(request, response, 401, { error: "Admin authorization required." });
    return;
  }
  const records = await readIndex();
  const record = records.find((item) => item.id === id);
  if (!record) {
    sendJson(request, response, 404, { error: "Recording not found." });
    return;
  }
  if (action === "approve") {
    record.status = "published";
    record.publishedAt = new Date().toISOString();
    await writeIndex(records);
    sendJson(request, response, 200, { id, status: record.status });
    return;
  }
  await rm(join(AUDIO_DIR, record.fileName), { force: true });
  await writeIndex(records.filter((item) => item.id !== id));
  sendJson(request, response, 200, { id, status: "rejected" });
}

async function route(request, response) {
  if (request.method === "OPTIONS") {
    response.writeHead(204, corsHeaders(request));
    response.end();
    return;
  }
  const url = new URL(request.url, publicOrigin(request));
  if (request.method === "GET" && url.pathname === "/health") {
    sendJson(request, response, 200, { ok: true });
    return;
  }
  if (request.method === "GET" && url.pathname === "/voyager-distance") {
    const payload = await fetchVoyagerDistance();
    sendJson(request, response, 200, payload);
    return;
  }
  if (url.pathname === "/recordings" && request.method === "GET") {
    await listRecordings(request, response);
    return;
  }
  if (url.pathname === "/recordings" && request.method === "POST") {
    await submitRecording(request, response);
    return;
  }
  const audioMatch = url.pathname.match(/^\/recordings\/([0-9a-f-]+)\/audio$/i);
  if (request.method === "GET" && audioMatch) {
    await serveAudio(request, response, audioMatch[1]);
    return;
  }
  const adminMatch = url.pathname.match(/^\/admin\/recordings\/([0-9a-f-]+)\/(approve|reject)$/i);
  if (request.method === "POST" && adminMatch) {
    await moderateRecording(request, response, adminMatch[1], adminMatch[2]);
    return;
  }
  sendJson(request, response, 404, { error: "Not found." });
}

export async function startCommunityServer({ port = PORT } = {}) {
  await mkdir(AUDIO_DIR, { recursive: true });
  const server = createServer((request, response) => {
    route(request, response).catch((error) => {
      console.error(error);
      if (!response.headersSent)
        sendJson(request, response, error.status || 500, {
          error: error.status ? error.message : "Internal server error.",
        });
      else response.destroy();
    });
  });
  await new Promise((resolve) => server.listen(port, resolve));
  return server;
}

if (fileURLToPath(import.meta.url) === resolve(process.argv[1] || "")) {
  startCommunityServer().then(() => {
    console.log(`Community recording API listening on http://127.0.0.1:${PORT}`);
    console.log(`Persistent data directory: ${DATA_DIR}`);
    if (!ADMIN_TOKEN) console.warn("COMMUNITY_ADMIN_TOKEN is not set; moderation actions are disabled.");
  });
}
