import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { journeyStops, moonStories, moonPanelMarkup, locationMapMarkup } from "../src/moon-stories.js";

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
    assert.ok(story.reveal.fact.length > 40);
    assert.ok(story.reveal.credit.startsWith("Image credit: NASA"));
    assert.ok(story.reveal.source[1].startsWith("https://science.nasa.gov/"));
    const image = readFileSync(new URL(`../public${story.reveal.image}`, import.meta.url));
    assert.ok(image.length > 100_000);
    assert.deepEqual(Array.from(image.subarray(0, 3)), [255, 216, 255]);
  }
  const markup = moonPanelMarkup();
  assert.equal((markup.match(/data-moon-story=/g) || []).length, 2);
  assert.ok(markup.includes("NO STAMP"));
  assert.ok(!markup.includes("data-stamp"));
  assert.ok(!markup.includes("data-exhibit"));
  assert.equal((markup.match(/class="moon-story-flip"/g) || []).length, 2);
  assert.equal((markup.match(/Image credit: NASA/g) || []).length, 2);
  assert.ok(markup.includes("television camera and soil scoop home to Earth"));
});

test("location strip routes four training machines and only two Moon stories", () => {
  const markup = locationMapMarkup();
  assert.deepEqual(journeyStops, ["earth", "apollo17", "surveyor3", "curiosity", "ingenuity", "webb", "voyager"]);
  assert.equal((markup.match(/data-journey-stop=/g) || []).length, 7);
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
  const moon = markup.indexOf('data-frontier="moon"');
  const mars = markup.indexOf('data-frontier="mars"');
  const deepSpace = markup.indexOf('data-frontier="deep-space"');
  assert.ok(moon > -1 && moon < mars && mars < deepSpace);
  assert.equal((markup.match(/class="earth-marker"/g) || []).length, 1);
  const earth = markup.match(/<div class="earth-marker"[\s\S]*?<\/div>/)?.[0] || "";
  assert.ok(earth.includes("YOU ARE HERE"));
  assert.ok(!earth.includes("data-map-"));
  assert.ok(!earth.includes("<button"));
  for (const label of [
    "≈ 384,400 km from Earth",
    "≈ 7 months by spacecraft",
    "Webb · ≈ 1.5 million km · Sun–Earth L2",
    "Voyager 1 · Almost one light-day from Earth",
  ]) assert.ok(markup.includes(label), label);
  assert.ok(markup.includes("journey-route-line"));
  assert.ok(markup.includes("journey-progress-status"));
  assert.ok(markup.includes("Background: Webb's First Deep Field · NASA, ESA, CSA, STScI"));
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
  assert.ok(main.includes('const JOURNEY_KEY = "mission-alive-journey-v1"'));
  assert.ok(index.indexOf('id="location-map-slot"') < index.indexOf('id="lobby-missions"'));
});
