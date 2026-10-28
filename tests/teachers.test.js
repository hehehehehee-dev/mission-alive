import test from "node:test";
import assert from "node:assert/strict";
import { teacherPageMarkup } from "../src/teachers.js";

test("teacher page includes every classroom section and five print resources", () => {
  const html = teacherPageMarkup();
  for (const heading of [
    "At a glance",
    "Four ways to run the visit",
    "Before · During · After",
    "Teaching guides",
    "Printable resources",
    "Assessment ideas",
    "Extension activities",
    "Standards map",
    "Accessibility & tech",
    "FAQ",
  ])
    assert.match(html, new RegExp(heading.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));

  assert.equal((html.match(/class="print-resource"/g) || []).length, 5);
  assert.equal((html.match(/class="exhibit-guide"/g) || []).length, 4);
  assert.equal((html.match(/<details><summary>/g) || []).length, 8);
  assert.match(html, /Mission Alive Graduate certificate/);
});

test("teacher copy exposes core standards and accurate privacy language", () => {
  const html = teacherPageMarkup();
  for (const code of [
    "MS-ESS1-3",
    "MS-ESS2-2",
    "MS-ETS1-4",
    "MS-PS2-2",
    "MS-ETS1-3",
    "MS-PS4-2",
    "MS-PS4-3",
    "HS-ESS1-2",
  ])
    assert.match(html, new RegExp(code));
  assert.match(html, /No server collection by default/);
  assert.match(html, /planned up to 5 demonstration flights and got 72/);
  assert.doesNotMatch(html, /guaranteed 5 flights/);
});
