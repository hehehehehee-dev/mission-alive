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

test("earned stamps are visible: a slot per mission, a thicker bar, and a marked map card", async () => {
  const moon = await readFile(new URL("../src/moon-stories.js", import.meta.url), "utf8");
  assert.match(main, /slots\.id = "passport-stamp-row"/);
  assert.match(main, /missionIds\.map\(\(id, index\) => `<li data-stamp-slot="\$\{id\}">/, "slots come from the mission registry, not a hard-coded six");
  assert.match(main, /slot\.classList\.toggle\("is-earned", earned\)/);
  assert.match(main, /slots\.setAttribute\("aria-hidden", "true"\)/, "the count is already announced in text");
  assert.match(moon, /classList\.add\('is-earned'\)/);
  assert.match(css, /body \.passport-track \{ height: 12px;/);
  assert.match(css, /\.passport-stamp-row b \{[^}]*width: 44px; height: 44px;/);
  assert.match(css, /#location-map-slot \.diagram-callout\.is-earned::after \{ content: "✓";/);
});

test("phone header links stay visible in one swipeable row, not behind a menu", async () => {
  const html = await readFile(new URL("../index.html", import.meta.url), "utf8");
  assert.doesNotMatch(html, /class="mobile-header-menu"/);
  const start = css.indexOf("/* Phones: the header links stay visible");
  const rule = css.slice(start, css.indexOf("/* Mars:", start));
  assert.match(rule, /\.desktop-header-tools \{[^}]*display: flex;[^}]*flex-wrap: nowrap;[^}]*overflow-x: auto;/s);
  assert.match(rule, /\.desktop-header-tools button \{[^}]*min-height: 44px;[^}]*white-space: nowrap;/s);
  assert.doesNotMatch(rule, /display:\s*none/);
  assert.match(rule, /\.header-actions \{ min-width: 0; \}/, "the row must not widen the page on a phone");
  assert.match(rule, /min-width: 0;\s*max-width: 100%;/);
});

test("the header starts with a Home link back to the lobby, translated", async () => {
  const html = await readFile(new URL("../index.html", import.meta.url), "utf8");
  const { es, vi } = await import("../src/locales/nov14.js");
  assert.match(html, /<div class="desktop-header-tools"><a class="home-link" id="home-link" href="\/#lobby">/);
  assert.match(css, /\.home-link \{[^}]*min-height: 44px;/);
  assert.ok(es.Home && vi.Home);
});

test("map cards around the same planet are pushed apart so they cannot overlap", () => {
  assert.match(css, /#location-map-slot \.mars-ingenuity \.diagram-callout \{ top: -112px; \}/);
  assert.match(css, /#location-map-slot \.mars-curiosity \.diagram-callout \{ top: 84px; \}/);
  assert.match(css, /#location-map-slot \.moon-surveyor \.diagram-callout \{ top: 115px; \}/);
});
