import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { moonStories, moonPanelMarkup, locationMapMarkup } from "../src/moon-stories.js";

test("Moon archive contains exactly two sourced, content-only stories", () => {
  assert.deepEqual(Object.keys(moonStories), ["apollo17", "surveyor3"]);
  for (const story of Object.values(moonStories)) {
    assert.equal(story.facts.length, 4);
    assert.deepEqual(story.facts.map(([label]) => label), ["WHAT IT IS", "WHY IT WENT", "WHAT IT DID", "WHERE IT IS NOW"]);
    assert.ok(story.sources.length >= 1);
    for (const [, source] of story.sources) {
      const host = new URL(source).hostname;
      assert.ok(host === "www.nasa.gov" || host === "science.nasa.gov" || host === "www.jpl.nasa.gov");
    }
  }
  const markup = moonPanelMarkup();
  assert.equal((markup.match(/data-moon-story=/g) || []).length, 2);
  assert.ok(markup.includes("NO STAMP"));
  assert.ok(!markup.includes("data-stamp"));
  assert.ok(!markup.includes("data-exhibit"));
});

test("location strip routes four training machines and only two Moon stories", () => {
  const markup = locationMapMarkup();
  assert.equal((markup.match(/data-map-exhibit=/g) || []).length, 4);
  assert.equal((markup.match(/data-map-moon=/g) || []).length, 2);
  assert.deepEqual(
    [...markup.matchAll(/data-map-exhibit="([^"]+)"/g)].map((match) => match[1]),
    ["curiosity", "ingenuity", "webb", "voyager"],
  );
  assert.deepEqual(
    [...markup.matchAll(/data-map-moon="([^"]+)"/g)].map((match) => match[1]),
    ["apollo17", "surveyor3"],
  );
  assert.ok(markup.includes("not to scale"));
});

test("the original certification UI remains exactly four modules and four certificate stamps", () => {
  const index = readFileSync(new URL("../index.html", import.meta.url), "utf8");
  const main = readFileSync(new URL("../src/main.js", import.meta.url), "utf8");
  const finale = index.match(/<div class="finale-stamps"[\s\S]*?<\/div>/)?.[0] || "";
  const certificate = index.match(/<div class="certificate-stamps"[\s\S]*?<\/div>/)?.[0] || "";
  assert.equal((finale.match(/<span>/g) || []).length, 4);
  assert.equal((certificate.match(/<span>/g) || []).length, 4);
  assert.ok(index.includes("4 / 4 STAMPS"));
  assert.ok(!index.includes("5 / 5"));
  assert.ok(!main.includes("apollo17: {"));
  assert.ok(!main.includes("surveyor3: {"));
});
