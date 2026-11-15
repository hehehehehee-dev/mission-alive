import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";

const read = (file) => fs.readFile(new URL(`../${file}`, import.meta.url), "utf8");

test("mission completion celebrates in place before revealing the result", async () => {
  const [index, main, ceremony, style] = await Promise.all([
    read("index.html"),
    read("src/main.js"),
    read("src/stamp-ceremony.js"),
    read("src/style.css"),
  ]);

  assert.match(index, /id="mission-complete-dialog"/);
  assert.match(index, /id="mission-complete-stamp"/);
  assert.match(main, /openMissionCompleteDialog\(id\)/);
  assert.match(main, /scrollIntoView: false/);
  assert.match(main, /mission-complete-dialog.*?addEventListener\("close"/s);
  assert.doesNotMatch(main, /\.completion-panel"\)\.scrollIntoView/);
  assert.match(ceremony, /scrollIntoView = true/);
  assert.match(style, /\.mission-complete-dialog/);
});
