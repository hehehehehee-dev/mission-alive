import test from "node:test";
import assert from "node:assert/strict";
import { ONE_LIGHT_DAY_TARGET, ONE_LIGHT_DAY_TARGET_MS, ONE_LIGHT_DAY_AFTER, oneLightDayState, voyagerCountdownMarkup } from "../src/voyager-countdown.js";

test("light-day countdown advances by visitor-clock minutes without a network dependency", () => {
  const before = ONE_LIGHT_DAY_TARGET_MS - (2 * 1440 + 3 * 60 + 7) * 60_000;
  assert.deepEqual(oneLightDayState(before), {crossed: false, remainingMs: (2 * 1440 + 187) * 60_000, days: 2, hours: 3, minutes: 7});
  assert.equal(oneLightDayState(before + 60_000).minutes, 6);
  assert.equal(oneLightDayState(ONE_LIGHT_DAY_TARGET_MS - 1).minutes, 1);
});

test("exact light-day boundary and later dates replace countdown with the supplied past-tense copy", () => {
  assert.equal(ONE_LIGHT_DAY_TARGET, "2026-11-18T10:16:07Z");
  for (const now of [ONE_LIGHT_DAY_TARGET_MS, ONE_LIGHT_DAY_TARGET_MS + 86_400_000]) {
    assert.equal(oneLightDayState(now).crossed, true);
    const html = voyagerCountdownMarkup(now);
    assert.ok(html.includes(ONE_LIGHT_DAY_AFTER));
    assert.doesNotMatch(html, /COUNTDOWN|role="timer"|10:16|5:16|T10:/);
  }
  assert.doesNotMatch(voyagerCountdownMarkup(ONE_LIGHT_DAY_TARGET_MS - 86400_000), /10:16|5:16|T10:/);
});
