import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { missionViews } from "../src/journey-experience.js";
import { storyLayer } from "../src/story-layer.js";
import { es, vi, patterns } from "../src/locales/nov14.js";
import { missionCalls, missionCallMarkup } from '../src/mission-calls.js';

const main = await readFile(new URL("../src/main.js", import.meta.url), "utf8");

test("arriving at a mission no longer opens the intro dialog first", () => {
  const navigate = main.slice(main.indexOf("async function navigateTo"), main.indexOf("function setRoute"));
  assert.doesNotMatch(navigate, /openExhibitStory/);
  assert.match(main, /\$\("#story-reopen"\)\.onclick = \(\) => openExhibitStory\(current\)/, "the story stays available on request");
});

test("the story opening sits between the machine's voice and the mission, with a credited real image", () => {
  assert.match(main, /const opening = missionOpening\(id\);\s*if \(opening\) \$\("#machine-voice"\)\.after\(opening\);/);
  for (const id of ["curiosity", "ingenuity", "webb", "voyager"]) {
    const view = missionViews[id];
    assert.ok(view.image && view.alt && view.caption && view.credit && view.source, id);
    assert.equal(storyLayer[id].beats.slice(0, 2).map(([label]) => label).join("|"), "Built for|It did");
    for (const [, copy] of storyLayer[id].beats.slice(0, 2)) {
      assert.ok(copy.trim().split(/\s+/).length <= 18, `${id} opening beat should stay glanceable`);
    }
  }
});

test("new opening copy is translated", () => {
  assert.ok(es["Earth is here"] && vi["Earth is here"]);
  assert.ok(patterns.some((row) => row.en === "{name} · mission opening" && row.es && row.vi));
});

test("both Moon pages use the same opening: real photo, Built for, It did", async () => {
  const { moonPanelMarkup, moonStories } = await import("../src/moon-stories.js");
  const source = await readFile(new URL("../src/moon-stories.js", import.meta.url), "utf8");
  const markup = moonPanelMarkup();
  assert.match(markup, /class="mission-opening moon-route-opening"/);
  assert.match(markup, /id="moon-route-mission-call"/);
  assert.match(markup, /<figure class="moon-route-photo mission-opening-view">/);
  assert.match(markup, /<dt>Built for<\/dt><dd id="moon-route-purpose"><\/dd>.*<dt>It did<\/dt><dd id="moon-route-did"><\/dd>/s);
  assert.doesNotMatch(source, /moon-route-photo'\)\.hidden = true/, "leaving a Moon page must not hide the photo for the next visit");
  for (const id of ["apollo17", "surveyor3"]) {
    const story = moonStories[id];
    assert.equal(story.facts[1][0], "WHY IT WENT");
    assert.equal(story.facts[2][0], "WHAT IT DID");
    assert.ok(story.reveal.image && story.reveal.alt && story.reveal.credit);
  }
});

test('all six missions explain the problem, the move, and the stamp before play', () => {
  for (const id of ['apollo17', 'surveyor3', 'curiosity', 'ingenuity', 'webb', 'voyager']) {
    const call = missionCalls[id];
    assert.ok(call?.problem && call.move && call.reward && call.request, id);
    const markup = missionCallMarkup(id, { elementId: `${id}-call` });
    for (const label of ['PROBLEM', 'YOUR MOVE', 'REWARD']) assert.match(markup, new RegExp(label));
    assert.match(markup, /Academy simulation based on a real mission problem\./);
  }
  assert.match(main, /missionCallMarkup\(id\)/);
});

test('the lobby map presents six help requests and replaces completed status', async () => {
  const source = await readFile(new URL('../src/moon-stories.js', import.meta.url), 'utf8');
  const { locationMapMarkup } = await import('../src/moon-stories.js');
  const markup = locationMapMarkup();
  assert.equal((markup.match(/class="map-help-signal"/g) || []).length, 6);
  assert.equal((markup.match(/HELP REQUEST/g) || []).length, 6);
  for (const call of Object.values(missionCalls)) assert.match(markup, new RegExp(call.request.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  assert.match(source, /textContent = 'MISSION HELPED ✓'/);
});

test("Moon photo credits stay verbatim instead of half-translated", async () => {
  const source = await readFile(new URL("../src/moon-stories.js", import.meta.url), "utf8");
  assert.match(source, /credit\.dataset\.i18nSkip = '';/);
  assert.ok(source.includes(String.raw`story.reveal.credit.replace(/^Image credit:\s*/i, '')`));
});
