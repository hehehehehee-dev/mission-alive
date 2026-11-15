import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const css = await readFile(new URL("../src/readable-type.css", import.meta.url), "utf8");
const main = await readFile(new URL("../src/main.js", import.meta.url), "utf8");

test("the child-readable type floor loads last and never sets text below 12px", () => {
  const imports = [...main.matchAll(/^import '\.\/([\w-]+\.css)';/gm)].map((match) => match[1]);
  assert.equal(imports.at(-1), "readable-type.css");
  const sizes = [...css.matchAll(/font-size:\s*([\d.]+)rem/g)].map((match) => Number(match[1]));
  assert.ok(sizes.length >= 5);
  assert.ok(sizes.every((size) => size >= 0.75), "every size is at least 12px at the default root size");
  assert.doesNotMatch(css, /font-size:\s*[\d.]+px/, "rem keeps the larger-text access setting working");
});

test("on phones the six-mission switcher is one swipeable row that keeps names for screen readers", () => {
  const phone = css.slice(css.indexOf("@media (max-width: 700px)"));
  assert.match(phone, /body \.exhibits \{[^}]*display: flex;[^}]*overflow-x: auto;/s);
  assert.match(phone, /min-height: 48px/);
  assert.doesNotMatch(phone, /\.exhibits (small|\.module-number)[^{]*\{[^}]*display:\s*none/, "labels are visually hidden, not removed");
  assert.match(main, /switcher\.scrollLeft = /, "the current mission is scrolled into view without moving the page");
});
