import test from "node:test";
import assert from "node:assert/strict";
import { handleClassRecord } from "../netlify/functions/class-record.mjs";

function memoryStore() {
  const data = new Map();
  return {
    async get(key, options = {}) {
      const value = data.get(key);
      if (value === undefined) return null;
      if (options.type === "json") return structuredClone(value);
      if (options.type === "arrayBuffer") return Uint8Array.from(value).buffer;
      return value;
    },
    async setJSON(key, value, options = {}) {
      if (options.onlyIfNew && data.has(key)) return { modified: false };
      data.set(key, structuredClone(value));
      return { modified: true };
    },
    async set(key, value) { data.set(key, Uint8Array.from(value)); },
    async delete(key) { data.delete(key); },
    async list({ prefix }) { return { blobs: [...data.keys()].filter((key) => key.startsWith(prefix)).map((key) => ({ key })) }; },
  };
}

function post(store, body) {
  return handleClassRecord(new Request("https://museum.example/api/class-record", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }), store);
}

test("class greetings require teacher review before public audio and text appear", async () => {
  const store = memoryStore();
  const created = await post(store, { action: "create", title: "Room 8" });
  assert.equal(created.status, 201);
  const { code, teacherKey } = await created.json();
  assert.match(code, /^[A-F0-9]{12}$/);
  const audioBase64 = Buffer.from("fake-webm-payload").toString("base64");
  const submission = await post(store, { action: "submit", code, consent: true, name: "Student", language: "Vietnamese", country: "Vietnam", message: "Xin chào", translation: "Hello", mimeType: "audio/webm", audioBase64 });
  assert.equal(submission.status, 202);
  const { id } = await submission.json();
  const before = await handleClassRecord(new Request(`https://museum.example/api/class-record?action=class&code=${code}`), store);
  assert.equal((await before.json()).recordings.length, 0);
  const hiddenAudio = await handleClassRecord(new Request(`https://museum.example/api/class-record?action=audio&code=${code}&id=${id}`), store);
  assert.equal(hiddenAudio.status, 404);
  const wrongKey = await post(store, { action: "queue", code, teacherKey: "0".repeat(64) });
  assert.equal(wrongKey.status, 403);
  const queue = await post(store, { action: "queue", code, teacherKey });
  assert.equal((await queue.json()).recordings[0].message, "Xin chào");
  const approved = await post(store, { action: "review", code, teacherKey, id, decision: "approve" });
  assert.equal(approved.status, 200);
  const gallery = await handleClassRecord(new Request("https://museum.example/api/class-record?action=gallery"), store);
  const publicEntry = (await gallery.json()).recordings[0];
  assert.equal(publicEntry.classTitle, "Room 8");
  assert.equal(publicEntry.code, code);
  const after = await handleClassRecord(new Request(`https://museum.example/api/class-record?action=class&code=${code}`), store);
  const entry = (await after.json()).recordings[0];
  assert.equal(entry.translation, "Hello");
  assert.equal(entry.hasAudio, true);
  const publicAudio = await handleClassRecord(new Request(`https://museum.example/api/class-record?action=audio&code=${code}&id=${id}`), store);
  assert.equal(publicAudio.status, 200);
  assert.equal(Buffer.from(await publicAudio.arrayBuffer()).toString(), "fake-webm-payload");
  const removed = await post(store, { action: "remove", code, teacherKey, id });
  assert.equal(removed.status, 200);
  const emptyGallery = await handleClassRecord(new Request("https://museum.example/api/class-record?action=gallery"), store);
  assert.equal((await emptyGallery.json()).recordings.length, 0);
});

test("class submissions require explicit consent and at least text or audio", async () => {
  const store = memoryStore();
  const { code } = await (await post(store, { action: "create", title: "Room 9" })).json();
  assert.equal((await post(store, { action: "submit", code, language: "Welsh", message: "Hello" })).status, 400);
  assert.equal((await post(store, { action: "submit", code, language: "Welsh", consent: true })).status, 400);
});
