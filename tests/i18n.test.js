import test from "node:test";
import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { createTranslator, normalizeCopy, supportedLanguages } from "../src/i18n-core.js";
import { getLanguage, setLanguage, t, canonicalOptionValue } from "../src/i18n.js";
import { filterGreetings, greetings } from "../src/greetings-catalog.js";
import { localizedNasaImageTitle } from "../src/curiosity-gallery.js";

const catalogDirectory = new URL("../src/locales/", import.meta.url);
const catalogModules = await Promise.all(
  readdirSync(catalogDirectory)
    .filter((name) => name.endsWith(".js"))
    .map(async (name) => [name, await import(new URL(name, catalogDirectory))]),
);
const placeholders = (value) => [...String(value).matchAll(/\{(\w+)\}/g)]
  .map((match) => match[1]).sort();

test("normalized copy ignores layout whitespace but retains punctuation and accents", () => {
  assert.equal(normalizeCopy("\n  Căn\tchỉnh\u00a0Webb  \r\n"), "Căn chỉnh Webb");
  assert.equal(normalizeCopy("Voyager 1 — 17.2 km/s"), "Voyager 1 — 17.2 km/s");
  assert.equal(normalizeCopy(0), "0");
});

test("exact translations match normalized keys and preserve surrounding text-node spacing", () => {
  const translate = createTranslator({
    es: { "Ready\tfor launch": "Listo para despegar" },
    vi: { "Ready for launch": "Sẵn sàng phóng" },
  });
  assert.equal(translate("\n Ready  for\tlaunch \u00a0", "es"), "\n Listo para despegar \u00a0");
  assert.equal(translate(" Ready\nfor launch ", "vi"), " Sẵn sàng phóng ");
  assert.equal(translate("\t \n", "es"), "\t \n");
  assert.equal(translate("Ready for launch!", "es"), "Ready for launch!");
});

test("English, unknown copy, and unsupported locales pass through verbatim", () => {
  const translate = createTranslator({ es: { Launch: "Despegue" }, vi: { Launch: "Phóng" } });
  assert.equal(translate(" \tLaunch\n", "en"), " \tLaunch\n");
  assert.equal(translate("Words not in the catalog", "es"), "Words not in the catalog");
  for (const locale of ["fr", "ES", "", "__proto__", "constructor", "toString", null]) {
    assert.equal(translate(" Launch ", locale), " Launch ", String(locale));
  }
});

test("dynamic templates retain measured values and translate known captured labels", () => {
  const translate = createTranslator({
    es: { ready: "listo" },
    vi: { ready: "sẵn sàng" },
  }, [{
    en: "{machine}: {status} · {distance} km",
    es: "{machine}: {status} · {distance} km de distancia",
    vi: "{machine}: {status} · cách {distance} km",
  }]);
  assert.equal(translate("Voyager 1: ready · 25,827,123,456 km", "es"),
    "Voyager 1: listo · 25,827,123,456 km de distancia");
  assert.equal(translate("\tVoyager 1: ready · 25,827,123,456 km\n", "vi"),
    "\tVoyager 1: sẵn sàng · cách 25,827,123,456 km\n");
  assert.equal(translate("Voyager 2: waiting · 19.5 km", "es"),
    "Voyager 2: waiting · 19.5 km de distancia");
});

test("templates treat punctuation, brackets, currency, and backslashes literally", () => {
  const translate = createTranslator({}, [{
    en: "Signal [A+B] ({distance} km)? Cost $5.00 | C:\\NASA",
    es: "Señal: {distance} km",
    vi: "Tín hiệu: {distance} km",
  }]);
  const source = "Signal [A+B] (17.2 km)? Cost $5.00 | C:\\NASA";
  assert.equal(translate(source, "es"), "Señal: 17.2 km");
  assert.equal(translate(source, "vi"), "Tín hiệu: 17.2 km");
  for (const changed of [
    source.replace("[A+B]", "AAAB"),
    source.replace("5.00", "5x00"),
    source.replace("?", "!"),
    source.replace("C:\\NASA", "C:/NASA"),
  ]) assert.equal(translate(changed, "es"), changed);
});

test("a visitor name matching a UI word is never translated inside a template", () => {
  const translate = createTranslator({ es: { Drive: "Conducir" }, vi: { Drive: "Lái xe" } }, [
    { en: "Greeting from {name}", es: "Saludo de {name}", vi: "Lời chào từ {name}" },
  ]);
  assert.equal(translate("Greeting from Drive", "es"), "Saludo de Drive");
  assert.equal(translate("Greeting from Drive", "vi"), "Lời chào từ Drive");
});

test("nested status templates resolve without unbounded recursion", () => {
  const translate = createTranslator({ es: { ready: "listo" } }, [
    { en: "Result: {status}", es: "Resultado: {status}" },
    { en: "Status: {status}", es: "Estado: {status}" },
    { en: "{value}", es: "{value}" },
  ]);
  assert.equal(translate("Result: Status: ready", "es"), "Resultado: Estado: listo");
  assert.equal(translate("Unknown status", "es"), "Unknown status");
});

test("quoted story text and source-link arrows retain their wrappers", () => {
  const translate = createTranslator({
    es: { "A message from Earth": "Un mensaje de la Tierra" },
    vi: { "A message from Earth": "Thông điệp từ Trái Đất" },
  });
  assert.equal(translate("“A message from Earth”", "es"), "“Un mensaje de la Tierra”");
  assert.equal(translate("«A message from Earth»", "vi"), "«Thông điệp từ Trái Đất»");
  assert.equal(translate(" A message from Earth ↗ ", "es"), " Un mensaje de la Tierra ↗ ");
  assert.equal(translate(" A message from Earth → ", "es"), " Un mensaje de la Tierra → ");
});

test("all locale catalogs have matching keys and retain each template placeholder", () => {
  for (const [name, catalog] of catalogModules) {
    assert.ok(catalog.es && catalog.vi, `${name}: both requested languages exist`);
    assert.deepEqual(Object.keys(catalog.es).sort(), Object.keys(catalog.vi).sort(), `${name}: key parity`);
    for (const [english, spanish] of Object.entries(catalog.es)) {
      assert.ok(typeof spanish === "string" && spanish.trim(), `${name}: Spanish ${english}`);
      assert.ok(typeof catalog.vi[english] === "string" && catalog.vi[english].trim(), `${name}: Vietnamese ${english}`);
      assert.deepEqual(placeholders(spanish), placeholders(english), `${name}: Spanish placeholders ${english}`);
      assert.deepEqual(placeholders(catalog.vi[english]), placeholders(english), `${name}: Vietnamese placeholders ${english}`);
    }
    for (const pattern of catalog.patterns || []) {
      assert.ok(pattern.en && pattern.es && pattern.vi, `${name}: template is available in all languages`);
      assert.deepEqual(placeholders(pattern.es), placeholders(pattern.en), `${name}: Spanish template ${pattern.en}`);
      assert.deepEqual(placeholders(pattern.vi), placeholders(pattern.en), `${name}: Vietnamese template ${pattern.en}`);
    }
  }
});

test("translated science copy preserves mission, instrument, agency, and standards identifiers", () => {
  const identifiers = /\b(?:Curiosity|Ingenuity|Webb|Voyager(?: [12])?|Mastcam|CheMin|SAM|NASA|JPL|Horizons|Carl Sagan|Gale|Jezero|(?:MS|HS)-[A-Z0-9]+-\d+)\b/g;
  let checked = 0;
  for (const [name, catalog] of catalogModules) {
    for (const [english, spanish] of Object.entries(catalog.es)) {
      for (const identifier of new Set(english.match(identifiers) || [])) {
        // This quotation uses the ordinary noun "ingenuity", rather than naming the helicopter.
        if (identifier === "Ingenuity" && /^“?Ingenuity is what allows people to accomplish/.test(english)) continue;
        for (const [locale, translated] of [["es", spanish], ["vi", catalog.vi[english]]]) {
          assert.ok(translated.includes(identifier), `${name}/${locale}: ${identifier} in ${english}`);
          checked++;
        }
      }
    }
  }
  assert.ok(checked > 100, "exercise real science copy across catalogs");
});

test("the language service rejects invalid settings without changing the active language", () => {
  assert.deepEqual(supportedLanguages, ["en", "es", "vi"]);
  try {
    assert.equal(setLanguage("vi"), true);
    for (const locale of ["fr", "ES", "__proto__", "constructor", null]) {
      assert.equal(setLanguage(locale), false);
      assert.equal(getLanguage(), "vi");
    }
    assert.equal(t("Language"), "Ngôn ngữ");
    assert.equal(t("Language", "es"), "Idioma");
    assert.equal(getLanguage(), "vi", "an explicit translation locale does not change the setting");
  } finally {
    setLanguage("en");
  }
});

test("Spanish greeting search understands localized labels and retains English discovery", () => {
  try {
    setLanguage("es");
    assert.ok(filterGreetings("vietnamita").some((g) => g.language === "Vietnamese"));
    assert.ok(filterGreetings("Japón").some((g) => g.language === "Japanese"));
    assert.ok(filterGreetings("Japan").some((g) => g.language === "Japanese"));
    assert.ok(filterGreetings("japon", "Japan").some((g) => g.language === "Japanese"));
    assert.equal(filterGreetings("japon", "India").length, 0, "country filters still use canonical values");
  } finally {
    setLanguage("en");
  }
});

test("Vietnamese greeting search handles accents and country names without changing NASA text", () => {
  const original = greetings.map(({ id, language, countries, translation }) => ({
    id, language, countries: [...countries], translation,
  }));
  try {
    setLanguage("vi");
    for (const query of ["tiếng Nhật", "tieng nhat", "Nhật Bản", "nhat ban"]) {
      assert.ok(filterGreetings(query).some((g) => g.language === "Japanese"), query);
    }
    assert.ok(filterGreetings("Ấn Độ").some((g) => g.language === "Hindi"));
    assert.ok(filterGreetings("Vietnamese").some((g) => g.language === "Vietnamese"));
    assert.deepEqual(greetings.map(({ id, language, countries, translation }) => ({
      id, language, countries: [...countries], translation,
    })), original, "canonical labels and NASA-published greeting translations remain unchanged");
    assert.equal(greetings.find((g) => g.language === "English").translation,
      "Hello from the children of planet Earth.");
  } finally {
    setLanguage("en");
  }
  assert.equal(getLanguage(), "en");
});

test("all 55 NASA greeting meanings have local captions without changing the source text", () => {
  const original = greetings.map((entry) => entry.translation);
  for (const locale of ["vi", "es"]) {
    for (const entry of greetings) {
      assert.notEqual(t(entry.translation, locale), entry.translation, `${locale}/${entry.id}`);
      assert.notEqual(t(`“${entry.translation}”`, locale), `“${entry.translation}”`, `${locale}/${entry.id} quote`);
    }
  }
  assert.deepEqual(greetings.map((entry) => entry.translation), original);
});

test("rover accessibility labels translate each combined cell role and nested direction", () => {
  assert.equal(t("Column 1, row 1: start, rover facing north", "vi"), "Cột 1, hàng 1: điểm xuất phát, xe hướng về bắc");
  assert.equal(t("Column 5, row 5: goal, rover facing east", "es"), "Columna 5, fila 5: meta, rover orientado al este");
});

test("English location markers do not leak into the translated mission directions", () => {
  for (const [name, catalog] of catalogModules) {
    for (const locale of ["vi", "es"]) {
      for (const [source, value] of Object.entries(catalog[locale])) {
        if (/DRILL OUTCROP|UPLINK/.test(source)) assert.doesNotMatch(value, /DRILL OUTCROP|UPLINK/, `${name}/${locale}/${source}`);
      }
    }
  }
});

test("future NASA photo titles use a local, honest archive caption instead of leaking English", () => {
  const item = { id: "PIA99999", title: "An unknown future English image title" };
  try {
    setLanguage("vi");
    assert.equal(localizedNasaImageTitle(item), "Ảnh từ kho tư liệu NASA · PIA99999");
    setLanguage("es");
    assert.equal(localizedNasaImageTitle(item), "Imagen del archivo de la NASA · PIA99999");
    setLanguage("en");
    assert.equal(localizedNasaImageTitle(item), item.title);
  } finally { setLanguage("en"); }
});

test("translated autocomplete choices resolve to stable countries even after another language is selected", () => {
  const countries = ["Spain", "Vietnam", "United States"];
  try {
    setLanguage("vi");
    assert.equal(canonicalOptionValue("España", countries), "Spain");
    assert.equal(canonicalOptionValue("Viet Nam", countries), "Vietnam");
    assert.equal(canonicalOptionValue("Hoa Kỳ", countries), "United States");
    assert.equal(canonicalOptionValue("My own place", countries), "My own place");
  } finally { setLanguage("en"); }
});

test("every classroom API error and moderation status has a local message", () => {
  const source = readFileSync(new URL("../netlify/functions/class-record.mjs", import.meta.url), "utf8");
  const messages = [...source.matchAll(/error:\s*"([^"]+)"/g)].map((match) => match[1]);
  assert.ok(messages.length > 20);
  for (const locale of ["vi", "es"]) {
    for (const message of messages) assert.notEqual(t(message, locale), message, `${locale}: ${message}`);
    for (const status of ["clear", "flagged", "unavailable", "not-configured", "audio-unchecked"]) {
      const translated = t(`· AI check: ${status}`, locale);
      assert.ok(!translated.includes(status), `${locale}: ${status}`);
    }
  }
});
