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

test("unconfigured community sharing adds no dead controls or unlock copy; HTTPS classroom controls remain", async (t) => {
  useLocation(t, { protocol: "https:", port: "", origin: "https://training.example" });
  const { personalRecordMarkup } = await import("../src/personal-records.js");
  const markup = personalRecordMarkup();
  assert.doesNotMatch(markup, /will unlock|publishing unavailable|community-library|id="publish-consent"|id="refresh-community-records"/i);
  for (const id of ["start-personal-recording", "save-written-greeting", "personal-message", "personal-record-list", "class-create", "class-join", "class-consent", "class-gallery-list"])
    assert.ok(markup.includes(`id="${id}"`), `${id} remains available`);
});

test("offline classroom markup is omitted and its no-op controller touches no absent DOM", async (t) => {
  useLocation(t, { protocol: "http:", port: "5173", origin: "http://localhost:5173" });
  const { classRecordMarkup, mountClassRecord } = await import("../src/class-record.js?offline-availability-check");
  assert.equal(classRecordMarkup(), "");
  const controller = mountClassRecord({ querySelector() { throw new Error("No unavailable classroom DOM should be queried"); } });
  assert.equal(controller.available, false);
  assert.equal(controller.activeCode, "");
  controller.setReduced(true);
  await assert.rejects(controller.submit({ message: "Hello" }), /Open a class record first/);
  controller.dispose();
});
