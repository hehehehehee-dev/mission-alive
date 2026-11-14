export const supportedLanguages = ["en", "es", "vi"];
export const normalizeCopy = (value) => String(value).replace(/\s+/gu, " ").trim();

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// All substitutions are plain text. Visitor messages never enter this translator.
export function createTranslator(catalogs, templates = []) {
  const maps = Object.fromEntries(["es", "vi"].map((locale) => [locale,
    new Map(Object.entries(catalogs[locale] || {}).map(([key, value]) => [normalizeCopy(key), value]))]));
  const compiled = templates.map((template) => {
    const names = [];
    let position = 0;
    let expression = "^";
    for (const match of normalizeCopy(template.en).matchAll(/\{(\w+)\}/g)) {
      expression += escapeRegex(normalizeCopy(template.en).slice(position, match.index)) + "(.+?)";
      names.push(match[1]);
      position = match.index + match[0].length;
    }
    expression += escapeRegex(normalizeCopy(template.en).slice(position)) + "$";
    return { ...template, names, regex: new RegExp(expression, "u") };
  });
  return function translate(value, locale = "en", depth = 0) {
    const original = String(value);
    if (!["es", "vi"].includes(locale) || depth > 8) return original;
    const key = normalizeCopy(original);
    if (!key) return original;
    let translated = maps[locale].get(key);
    if (translated === undefined) {
      for (const template of compiled) {
        const match = key.match(template.regex);
        if (!match || !template[locale]) continue;
        const captures = Object.fromEntries(template.names.map((name, i) => [name, match[i + 1]]));
        translated = template[locale].replace(/\{(\w+)\}/g, (_, name) => {
          const captured = captures[name] ?? `{${name}}`;
          if (name === "labels") return captured.split(", ").map((label) => translate(label, locale, depth + 1)).join(", ");
          return ["name", "code", "message", "transcript"].includes(name) ? captured : translate(captured, locale, depth + 1);
        });
        break;
      }
    }
    if (translated === undefined) {
      const wrapped = key.match(/^(“|«)(.+)(”|»)$/u);
      const suffix = key.match(/^(.*?)\s+([↗→↓✓])$/u);
      if (wrapped) {
        const inner = translate(wrapped[2], locale, depth + 1);
        if (inner !== wrapped[2]) translated = wrapped[1] + inner + wrapped[3];
      } else if (suffix) {
        const inner = translate(suffix[1], locale, depth + 1);
        if (inner !== suffix[1]) translated = `${inner} ${suffix[2]}`;
      }
    }
    if (translated === undefined) return original;
    return (original.match(/^\s*/u)?.[0] || "") + translated + (original.match(/\s*$/u)?.[0] || "");
  };
}
