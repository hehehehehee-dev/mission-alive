import test from "node:test";
import assert from "node:assert/strict";

function useLocation(t, value) {
  const previous = Object.getOwnPropertyDescriptor(globalThis, "location");
  Object.defineProperty(globalThis, "location", { configurable: true, value });
  t.after(() => {
    if (previous) Object.defineProperty(globalThis, "location", previous);
    else delete globalThis.location;
  });
}

test("the studio shares with everyone behind a consent box, with no classroom or private-save path", async (t) => {
  useLocation(t, { protocol: "https:", port: "", origin: "https://training.example" });
  const { personalRecordMarkup } = await import("../src/personal-records.js");
  const markup = personalRecordMarkup();
  for (const id of ["start-personal-recording", "save-personal-recording", "share-consent", "personal-message", "personal-record-list", "shared-greetings-list"])
    assert.ok(markup.includes(`id="${id}"`), `${id} is present`);
  assert.match(markup, /id="save-personal-recording" disabled>Share with everyone</);
  assert.match(markup, /I did not say my full name, my school, or where I live\. Everyone can hear it\./);
  assert.doesNotMatch(markup, /class-code|class-create|class-join|Save privately|PRIVATE UNTIL PUBLISHED/);
  assert.equal((markup.match(/id="save-personal-recording"/g) || []).length, 1, "one action handles text and audio");
});

test("sharing is refused without consent and flagged words never go public", async () => {
  const { handleSharedGreetings } = await import("../server/shared-greetings.mjs");
  const blobs = new Map();
  const store = {
    async list({ prefix }) { return { blobs: [...blobs.keys()].filter((key) => key.startsWith(prefix)).map((key) => ({ key })) }; },
    async get(key) { return blobs.get(key) ?? null; },
    async set(key, value) { blobs.set(key, value); },
    async setJSON(key, value) { blobs.set(key, value); },
    async delete(key) { blobs.delete(key); },
  };
  const post = (body) => handleSharedGreetings(new Request("https://x.test/api/greetings", { method: "POST", body: JSON.stringify(body) }), store);
  assert.equal((await post({ action: "share", language: "Vietnamese", message: "Xin chào" })).status, 400);

  const shared = await post({ action: "share", consent: true, language: "Vietnamese", message: "Xin chào", name: "Space listener" });
  assert.equal(shared.status, 201);
  const { id, deleteKey } = await shared.json();
  const list = async () => (await (await handleSharedGreetings(new Request("https://x.test/api/greetings?action=list"), store)).json()).greetings;
  assert.equal((await list()).length, 1, "a shared greeting is public immediately");
  assert.equal((await list())[0].deleteHash, undefined, "secrets never reach the public list");

  assert.equal((await post({ action: "delete", id, deleteKey: "0".repeat(64) })).status, 403);
  assert.equal((await post({ action: "report", id })).status, 200);
  assert.equal((await list()).length, 0, "one report hides it at once");
  assert.equal((await post({ action: "delete", id, deleteKey })).status, 200);
  assert.equal(blobs.size, 0, "the sharer's delete removes every stored copy");
});
