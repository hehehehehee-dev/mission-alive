import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
const facts = JSON.parse(
  readFileSync(new URL("../src/facts.json", import.meta.url)),
);
test("Every displayed mission fact carries a NASA source and explicit date/status", () => {
  for (const record of Object.values(facts)) {
    assert.ok(record.claim);
    assert.match(record.as_of, /^\d{4}-\d{2}-\d{2}$/);
    assert.ok(["official", "estimated", "creative"].includes(record.status));
    const url = new URL(record.source_url);
    assert.equal(url.protocol, "https:");
    assert.ok(
      url.hostname === "nasa.gov" || url.hostname.endsWith(".nasa.gov"),
    );
    assert.ok(record.source_title);
  }
});
test("Mission cards stay within the 45-word reading budget", () => {
  for (const key of ["curiosity", "ingenuity", "webb", "voyager"])
    assert.ok(facts[key].claim.split(/\s+/).length <= 45, key);
});
test("Projected distance is not represented as live data", () => {
  assert.equal(facts.distance.status, "estimated");
  assert.match(facts.distance.uncertainty, /not a current or live position/);
  assert.ok(facts.distance.as_of);
  assert.equal(facts.distance.signal_hours, 24);
});
