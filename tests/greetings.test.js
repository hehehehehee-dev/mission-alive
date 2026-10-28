import test from "node:test";
import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { greetings, filterGreetings } from "../src/greetings-catalog.js";
const dir = new URL("../golden-record-greetings/", import.meta.url);
test("All 55 catalog entries resolve to one nonempty MP3 with an MPEG/ID3 header", () => {
  const files = readdirSync(dir).filter((x) => x.endsWith(".mp3"));
  assert.equal(files.length, 55);
  assert.equal(greetings.length, 55);
  assert.equal(new Set(greetings.map((g) => g.id)).size, 55);
  for (const g of greetings) {
    const matches = files.filter((f) => f.startsWith(g.id + "-"));
    assert.equal(matches.length, 1, g.language);
    const bytes = readFileSync(new URL(matches[0], dir));
    assert.ok(bytes.length > 1000, g.language);
    assert.ok(
      bytes.subarray(0, 3).toString() === "ID3" ||
        (bytes[0] === 255 && (bytes[1] & 224) === 224),
      g.language,
    );
    assert.ok(g.translation.length > 2, `${g.language} translation`);
  }
});
test("Every recording is paired with a distinct NASA-published English translation", () => {
  assert.equal(greetings.filter((g) => g.translation).length, 55);
  assert.equal(
    greetings.find((g) => g.language === "English").translation,
    "Hello from the children of planet Earth.",
  );
  assert.equal(
    greetings.find((g) => g.language === "Vietnamese").translation,
    "Sincerely send you our friendly greetings.",
  );
});
test("Language, country, aliases and accent-insensitive queries find the greeting", () => {
  for (const q of [
    "Vietnam",
    "Vietnamese",
    "Việt Nam",
    "Tiếng Việt",
    "tieng viet",
  ])
    assert.equal(filterGreetings(q)[0]?.language, "Vietnamese", q);
  assert.equal(filterGreetings("Farsi")[0].language, "Persian");
  assert.equal(filterGreetings("Oriya")[0].language, "Odia");
  assert.equal(filterGreetings("Español")[0].language, "Spanish");
  assert.ok(filterGreetings("India").some((g) => g.language === "Hindi"));
  assert.ok(filterGreetings("", "India").some((g) => g.language === "Punjabi"));
  assert.equal(filterGreetings("Vietnamese", "India").length, 0);
  assert.equal(filterGreetings("nothing-matches-here").length, 0);
  assert.equal(filterGreetings("").length, 55);
});
test("Historical associations are explicit and all recordings are searchable", () => {
  for (const g of greetings) {
    assert.ok(g.countries.length > 0);
    assert.ok(filterGreetings(g.language).some((x) => x.id === g.id));
  }
  for (const name of ["Akkadian", "Hittite", "Latin", "Sumerian"])
    assert.match(
      greetings.find((g) => g.language === name).region,
      /historical/,
    );
});
