import { createTranslator, supportedLanguages } from "./i18n-core.js";
import * as interfaceCopy from "./locales/interface.js";
import * as storyCopy from "./locales/stories.js";
import * as teacherCopy from "./locales/teachers.js";
import * as supplementalCopy from "./locales/supplemental.js";
import * as greetingCopy from "./locales/greeting-translations.js";
import * as serviceCopy from "./locales/service-errors.js";
import * as creditCopy from './locales/credits.js';
import * as journeyExperienceCopy from './locales/journey-experience.js';
import * as accessibilityCopy from './locales/accessibility.js';
import * as moonGameCopy from './locales/moon-games.js';
import * as sixMissionCopy from './locales/six-missions.js';

export const LANGUAGE_STORAGE_KEY = "mission-alive-language-v1";
const catalogs = { es: {}, vi: {} };
const modules = [interfaceCopy, storyCopy, teacherCopy, supplementalCopy, greetingCopy, serviceCopy, creditCopy, journeyExperienceCopy, accessibilityCopy, moonGameCopy, sixMissionCopy];
for (const locale of ["es", "vi"]) {
  // Country names also remain searchable in their canonical English form.
  const english = new Intl.DisplayNames(["en"], { type: "region" });
  const localized = new Intl.DisplayNames([locale], { type: "region" });
  for (let a = 65; a <= 90; a++) for (let b = 65; b <= 90; b++) {
    const code = String.fromCharCode(a, b);
    const name = english.of(code);
    if (name !== code) catalogs[locale][name] = localized.of(code);
  }
  for (const code of ["001", "002", "009", "019", "142", "150", "419"]) catalogs[locale][english.of(code)] = localized.of(code);
  for (const copy of modules) Object.assign(catalogs[locale], copy[locale] || {});
}
const translate = createTranslator(catalogs, modules.flatMap((copy) => copy.patterns || []));
let language = "en";
try {
  const stored = globalThis.localStorage?.getItem(LANGUAGE_STORAGE_KEY);
  if (supportedLanguages.includes(stored)) language = stored;
} catch { /* Shared classroom browsers may disable storage. */ }
export const getLanguage = () => language;
export const t = (value, locale = language) => translate(value, locale);
export function canonicalOptionValue(value, choices) {
  const normalize = (text) => String(text).normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[đĐ]/g, "d").replace(/\s+/g, " ").trim().toLowerCase();
  const query = normalize(value);
  return choices.find((choice) => supportedLanguages.some((locale) => normalize(t(choice, locale)) === query)) || value;
}

const textSources = new WeakMap();
const attributeSources = new WeakMap();
const reverse = new Map();
const attributes = ["aria-label", "aria-valuetext", "alt", "title", "placeholder"];
const ignored = "script,style,code,pre,textarea,canvas,[data-i18n-skip],#certificate-name,#class-active-title,#class-active-code,#class-teacher-key,.personal-record-item h5,.community-record-item h5,.personal-record-item blockquote,.class-record-item blockquote,.community-record-item blockquote,[data-user-content]";
function remember(output, source) {
  if (output === source) return;
  reverse.set(output, source);
  if (reverse.size > 2048) reverse.delete(reverse.keys().next().value);
}
function sourceFor(value, previous) {
  return previous && value === previous.output ? previous.source : (reverse.get(value) || value);
}
export function getSourceText(element) {
  const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
  let source = "";
  while (walker.nextNode()) source += sourceFor(walker.currentNode.data, textSources.get(walker.currentNode));
  return source;
}
function localizeText(node) {
  const parent = node.parentElement;
  if (!parent || parent.closest(ignored)) return;
  // An option without an explicit value derives its value from its visible text.
  // Freeze that canonical value before translating its label.
  if (parent.tagName === "OPTION" && !parent.hasAttribute("value")) parent.value = parent.textContent;
  const source = sourceFor(node.data, textSources.get(node));
  const output = t(source);
  textSources.set(node, { source, output });
  remember(output, source);
  if (node.data !== output) node.data = output;
}
function localizeAttributes(element) {
  if (element.closest(ignored)) return;
  if (element.hasAttribute("data-i18n-original")) element.hidden = language === "en";
  if (element.tagName === "OPTION" && element.parentElement?.tagName === "DATALIST") {
    const sourceValue = element.dataset.i18nValue || element.value;
    element.dataset.i18nValue = sourceValue;
    element.value = t(sourceValue);
  }
  let saved = attributeSources.get(element);
  if (!saved) attributeSources.set(element, saved = new Map());
  for (const attr of attributes) {
    if (!element.hasAttribute(attr)) continue;
    const value = element.getAttribute(attr);
    const source = sourceFor(value, saved.get(attr));
    const output = t(source);
    saved.set(attr, { source, output });
    remember(output, source);
    if (value !== output) element.setAttribute(attr, output);
  }
  if (element.hasAttribute("data-i18n-date")) {
    const date = new Date(element.getAttribute("data-i18n-date"));
    if (Number.isFinite(date.valueOf())) element.textContent = new Intl.DateTimeFormat(language, { dateStyle: "long", ...(element.dataset.i18nTimezone ? { timeZone: element.dataset.i18nTimezone } : {}) }).format(date);
  }
}
function localizeTree(root) {
  if (root.nodeType === 3) return localizeText(root);
  if (root.nodeType !== 1 && root.nodeType !== 9 && root.nodeType !== 11) return;
  if (root.nodeType === 1) localizeAttributes(root);
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      if (node.nodeType === 1 && node.matches(ignored)) return NodeFilter.FILTER_REJECT;
      return NodeFilter.FILTER_ACCEPT;
    },
  });
  while (walker.nextNode()) {
    const node = walker.currentNode;
    if (node.nodeType === 3) localizeText(node);
    else localizeAttributes(node);
  }
}
let mounted = false;
function applyLanguage() {
  if (!mounted) return;
  document.documentElement.lang = language;
  const selector = document.querySelector("#ui-language");
  if (selector) selector.value = language;
  localizeTree(document.body);
  localizeTree(document.querySelector("title"));
  const meta = document.querySelector('meta[name="description"]');
  if (meta) {
    const source = meta.dataset.i18nSource || meta.content;
    meta.dataset.i18nSource = source;
    meta.content = t(source);
  }
}
export function setLanguage(locale) {
  if (!supportedLanguages.includes(locale)) return false;
  language = locale;
  try { globalThis.localStorage?.setItem(LANGUAGE_STORAGE_KEY, language); } catch { /* Keep this tab usable without persistence. */ }
  applyLanguage();
  if (mounted) window.dispatchEvent(new CustomEvent("mission-language-change", { detail: { language } }));
  return true;
}
export function mountLanguageSwitcher() {
  if (mounted) return;
  mounted = true;
  document.querySelector("#ui-language")?.addEventListener("change", (event) => setLanguage(event.target.value));
  applyLanguage();
  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type === "characterData") localizeText(mutation.target);
      else if (mutation.type === "attributes") localizeAttributes(mutation.target);
      else for (const node of mutation.addedNodes) localizeTree(node);
    }
  });
  observer.observe(document.body, { subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: attributes });
}

// Development QA inspects canonical source copy, including previously translated
// nodes, so a language round trip cannot conceal stale or untranslated labels.
export function inspectLocalization(root = document.body) {
  const records = [];
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT);
  while (walker.nextNode()) {
    const node = walker.currentNode;
    const element = node.nodeType === 3 ? node.parentElement : node;
    if (!element || element.closest(ignored)) continue;
    const add = (value, saved, attribute = null) => {
      if (!value?.trim()) return;
      const source = saved?.source || value;
      records.push({ source, actual: value, expected: t(source), attribute, id: element.id, tag: element.tagName });
    };
    if (node.nodeType === 3) add(node.data, textSources.get(node));
    else for (const attr of attributes) if (node.hasAttribute(attr)) add(node.getAttribute(attr), attributeSources.get(node)?.get(attr), attr);
  }
  return records;
}
