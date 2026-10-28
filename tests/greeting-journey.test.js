import test from "node:test";
import assert from "node:assert/strict";
import { imaginedDistanceKm } from "../src/greeting-journey.js";

test("journey advances at NASA's approximate Voyager 1 Sun-relative speed", () => {
  assert.equal(imaginedDistanceKm("2026-01-01T00:00:00.000Z", Date.parse("2026-01-01T00:01:00.000Z")), 1020);
});

test("future or invalid timestamps never show negative travel", () => {
  assert.equal(imaginedDistanceKm("2026-01-02T00:00:00.000Z", Date.parse("2026-01-01T00:00:00.000Z")), 0);
  assert.equal(imaginedDistanceKm("not a date"), 0);
});
