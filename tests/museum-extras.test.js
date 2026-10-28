import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { missionHistory, pickMissionHistory } from "../src/mission-history.js";
import { hiddenFacts, hiddenFactProgress, loadHiddenFactKeys } from "../src/hidden-facts.js";
import { marsSounds } from "../src/mars-sounds.js";

test("mission history calls a date an anniversary only when its calendar day matches", () => {
  const landing = pickMissionHistory(new Date(2026, 7, 6));
  assert.equal(landing.anniversary, true);
  assert.equal(landing.title, "A sky crane lowered a rover to Mars");
  const ordinary = pickMissionHistory(new Date(2026, 9, 7));
  assert.equal(ordinary.anniversary, false);
  assert.ok(missionHistory.includes(missionHistory.find((item) => item.title === ordinary.title)));
  assert.ok(missionHistory.every((item) => item.source.startsWith("https://science.nasa.gov/")));
});

test("sixteen distinct sourced clues survive storage round trips", () => {
  const pairs = Object.entries(hiddenFacts).flatMap(([exhibit, facts]) => facts.map((fact) => `${exhibit}:${fact.part}`));
  assert.equal(pairs.length, 16);
  assert.equal(new Set(pairs).size, 16);
  assert.ok(Object.values(hiddenFacts).every((facts) => facts.length === 4 && facts.every((fact) => /^https:\/\/(science\.nasa\.gov|www\.nasa\.gov|www\.jpl\.nasa\.gov)\//.test(fact.source))));
  const storage = { getItem: () => JSON.stringify([...pairs, "unknown:part"]), setItem: () => {} };
  assert.equal(loadHiddenFactKeys(storage).size, 16);
  assert.equal(hiddenFactProgress(storage).complete, true);
});

test("three local Mars recordings are playable MP3 assets linked to their NASA context", () => {
  assert.equal(marsSounds.length, 3);
  for (const clip of marsSounds) {
    const bytes = readFileSync(join(process.cwd(), "public", clip.file));
    assert.ok(bytes.length > 100_000);
    assert.ok(bytes.subarray(0, 3).toString() === "ID3" || bytes[0] === 0xff);
    assert.ok(clip.source.startsWith("https://science.nasa.gov/"));
  }
});
