import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { missionViews } from "../src/journey-experience.js";
import { storyLayer } from "../src/story-layer.js";
import { es, vi, patterns } from "../src/locales/nov14.js";

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
  }
});

test("new opening copy is translated", () => {
  assert.ok(es["Earth is here"] && vi["Earth is here"]);
  assert.ok(patterns.some((row) => row.en === "{name} · mission opening" && row.es && row.vi));
});
