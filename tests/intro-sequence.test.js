import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { INTRO_BEATS, INTRO_SPEAKERS, beatDuration, introMarkup, shouldAutoPlayIntro } from "../src/intro-sequence.js";
import { es, vi } from "../src/locales/nov14.js";

test("the intro is a story told only in speech bubbles, ending with a start button", () => {
  assert.equal(INTRO_BEATS.filter((beat) => beat.last).length, 1);
  assert.equal(INTRO_BEATS.at(-1).last, true);
  assert.deepEqual(Object.keys(INTRO_SPEAKERS).sort(), ["cadet", "mira"]);
  const machines = INTRO_BEATS.filter((beat) => beat.scene === "message");
  assert.equal(machines.length, 6, "one message from each of the six machines");
  for (const beat of machines) assert.ok(beat.photo.startsWith("/assets/") && beat.label);
  assert.doesNotMatch(introMarkup(), /<audio|<video/);
  assert.match(introMarkup(), /role="dialog" aria-modal="true"/);
});

test("every intro line and label has Spanish and Vietnamese copy", () => {
  const words = [...INTRO_BEATS.map((beat) => beat.text), ...INTRO_BEATS.filter((beat) => beat.label).map((beat) => beat.label),
    ...Object.values(INTRO_SPEAKERS).map((speaker) => speaker.name.toUpperCase()), "Skip", "Next",
    "INCOMING MESSAGE", "MISSION ALIVE ACADEMY · EARTH ORBIT"];
  for (const text of words) assert.ok(es[text] && vi[text], `missing: ${text}`);
});

test("bubbles stay long enough to read, and reduced motion never auto-advances", async () => {
  assert.ok(beatDuration("Me?!") >= 1800);
  assert.ok(beatDuration("x".repeat(70)) > beatDuration("x".repeat(10)));
  const source = await readFile(new URL("../src/intro-sequence.js", import.meta.url), "utf8");
  assert.match(source, /if \(!reduced && !beat\.last\) timer = /);
  assert.match(source, /event\.key === "Escape"/);
  assert.match(source, /appRoot\.inert = true/);
});

test("the story plays straight away on the landing page, with no button to find first", async () => {
  assert.equal(shouldAutoPlayIntro(0), true);
  assert.equal(shouldAutoPlayIntro(1), false, "learners who already have a stamp go straight to the lobby");
  const html = await readFile(new URL("../index.html", import.meta.url), "utf8");
  const main = await readFile(new URL("../src/main.js", import.meta.url), "utf8");
  assert.doesNotMatch(html, /replay-intro|Watch the story/);
  assert.match(main, /if \(shouldAutoPlayIntro\(completed\.size\)\) startIntro\(\);/);
});
