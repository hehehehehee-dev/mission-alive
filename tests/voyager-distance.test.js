import test from "node:test";
import assert from "node:assert/strict";
import { formatVoyagerDistanceKm, mountVoyagerDistance, lightDayLink, LIGHT_DAY_LINK_BEFORE, LIGHT_DAY_LINK_AFTER, VOYAGER_ESTIMATE_LIVE, VOYAGER_ESTIMATE_STATIC } from "../src/voyager-distance.js";

const observedAt = Date.parse("2026-10-21T12:00:00Z");
const anchor = { observedAt: new Date(observedAt).toISOString(), distanceKm: 25_827_000_000.25, rangeRateKmS: 17.01 };
const flush = () => new Promise(setImmediate);

function harness(t) {
  const priorWindow = Object.getOwnPropertyDescriptor(globalThis, "window");
  const intervals = new Map();
  const cleanups = [];
  let nextTimer = 0;
  Object.defineProperty(globalThis, "window", { configurable: true, value: {
    setInterval(callback, delay) { const id = ++nextTimer; intervals.set(id, { callback, delay }); return id; },
    clearInterval(id) { intervals.delete(id); },
  } });
  t.after(() => {
    for (const cleanup of cleanups) cleanup();
    if (priorWindow) Object.defineProperty(globalThis, "window", priorWindow);
    else delete globalThis.window;
  });
  const element = (textContent = "") => ({
    textContent, dataset: {}, attributes: new Map(),
    setAttribute(name, value) { this.attributes.set(name, value); },
  });
  const distance = element("Awaiting mission data…");
  const lightTime = element("JPL Horizons range and range-rate");
  const status = element("Checking mission data…");
  const elements = {
    "#voyager-live-distance": distance,
    "#voyager-live-light-time": lightTime,
    "#voyager-live-status": status,
  };
  return { distance, lightTime, status, intervals, cleanup: (callback) => cleanups.push(callback), container: { querySelector: (selector) => elements[selector] } };
}

test("Voyager distance shows grouped whole kilometres, without hiding movement in billions", () => {
  assert.equal(formatVoyagerDistanceKm(25_827_000_000.25), "25,827,000,000 km");
  assert.equal(formatVoyagerDistanceKm(25_827_000_017.7), "25,827,000,018 km");
});

test("the live counter advances each second from the actual Horizons anchor and exposes numeric kilometres", async (t) => {
  const ui = harness(t);
  let now = observedAt + 10_000;
  let requestedUrl;
  const mounted = mountVoyagerDistance(ui.container, {
    apiUrl: "/api", now: () => now,
    fetcher: async (url) => { requestedUrl = url; return { ok: true, json: async () => anchor }; },
  });
  ui.cleanup(() => mounted.dispose());
  await flush();
  assert.equal(requestedUrl, "/api/voyager-distance");
  assert.equal(ui.distance.textContent, "25,827,000,170 km");
  assert.equal(Number(ui.distance.dataset.distanceKm), anchor.distanceKm + anchor.rangeRateKmS * 10);
  const firstAccessibleLabel = ui.distance.attributes.get("aria-label");
  const [{ callback, delay }] = ui.intervals.values();
  assert.equal(delay, 1000);
  now += 1000;
  callback();
  assert.equal(ui.distance.textContent, "25,827,000,187 km");
  assert.equal(Number(ui.distance.dataset.distanceKm), anchor.distanceKm + anchor.rangeRateKmS * 11);
  assert.equal(ui.lightTime.textContent, lightDayLink(now));
  assert.doesNotMatch(ui.lightTime.textContent, /\d+\.\d+ hours/, "no rounded light-time that looks like it contradicts the countdown");
  assert.match(ui.status.textContent, /^Estimate from NASA\/JPL Horizons, not a signal from the spacecraft · updates every second$/);
  assert.notEqual(ui.distance.attributes.get("aria-label"), firstAccessibleLabel, "accessible wording follows the visible value without a live announcement");
  assert.equal(ui.distance.attributes.get("aria-label"), `Voyager 1 estimated distance from Earth: ${ui.distance.textContent}`);
  assert.equal(ui.distance.attributes.has("aria-live"), false, "the counter creates no per-second live announcements");
  now += 29_000;
  callback();
  assert.notEqual(ui.distance.attributes.get("aria-label"), firstAccessibleLabel);
  mounted.dispose();
  assert.equal(ui.intervals.size, 0);
  const stoppedText = ui.distance.textContent;
  now += 1000;
  callback();
  assert.equal(ui.distance.textContent, stoppedText, "an already queued tick cannot update a disposed module");
});

test("reduced motion freezes the distance until explicitly refreshed and can resume ticking", async (t) => {
  const ui = harness(t);
  let now = observedAt;
  const mounted = mountVoyagerDistance(ui.container, {
    reduced: true, apiUrl: "/api", now: () => now,
    fetcher: async () => ({ ok: true, json: async () => anchor }),
  });
  ui.cleanup(() => mounted.dispose());
  await flush();
  assert.equal(ui.intervals.size, 0);
  const frozen = ui.distance.textContent;
  now += 10000;
  assert.equal(ui.distance.textContent, frozen);
  mounted.refresh();
  assert.equal(ui.distance.textContent, '25,827,000,170 km');
  assert.match(ui.status.textContent, /not a signal from the spacecraft · press Read current distance to update/);
  mounted.setReduced(true);
  assert.equal(ui.intervals.size, 0);
  mounted.setReduced(false);
  assert.equal(ui.intervals.size, 1);
  const [{ callback, delay }] = ui.intervals.values();
  assert.equal(delay, 1000);
  now += 1000;
  callback();
  assert.equal(ui.distance.textContent, "25,827,000,187 km");
  assert.match(ui.status.textContent, /updates every second/);
});

test("unavailable or invalid mission data cannot start a fabricated live counter", async (t) => {
  const ui = harness(t);
  const offline = mountVoyagerDistance(ui.container, {
    apiUrl: "", fetcher: async () => { throw new Error("should not fetch"); },
  });
  assert.equal(ui.distance.textContent, "Live estimate unavailable");
  assert.equal(ui.distance.dataset.distanceKm, undefined);
  assert.equal(ui.intervals.size, 0);
  offline.dispose();
  for (const fetcher of [
    async () => { throw new Error("offline"); },
    async () => ({ ok: false }),
    async () => ({ ok: true, json: async () => ({ ...anchor, distanceKm: "25827000000" }) }),
  ]) {
    const mounted = mountVoyagerDistance(ui.container, { apiUrl: "/api", fetcher });
    await flush();
    assert.match(ui.status.textContent, /live estimate is temporarily unavailable/);
    assert.equal(ui.distance.dataset.distanceKm, undefined);
    assert.equal(ui.intervals.size, 0);
    mounted.dispose();
  }
});

test("leaving Voyager aborts a pending request and ignores a response that arrives afterward", async (t) => {
  const ui = harness(t);
  let requestSignal;
  let finishResponse;
  const mounted = mountVoyagerDistance(ui.container, {
    apiUrl: "/api", now: () => observedAt,
    fetcher: async (_url, { signal }) => {
      requestSignal = signal;
      return new Promise((resolve) => { finishResponse = resolve; });
    },
  });
  mounted.dispose();
  assert.equal(requestSignal.aborted, true);
  finishResponse({ ok: true, json: async () => anchor });
  await flush();
  assert.equal(ui.distance.textContent, "Awaiting mission data…");
  assert.equal(ui.distance.dataset.distanceKm, undefined);
  assert.equal(ui.intervals.size, 0);
});

test("the live card names the same light-day milestone as the countdown, switching on NASA's date", async () => {
  const { ONE_LIGHT_DAY_TARGET_MS } = await import("../src/voyager-countdown.js");
  const { es, vi } = await import("../src/locales/nov14.js");
  assert.equal(lightDayLink(ONE_LIGHT_DAY_TARGET_MS - 1), LIGHT_DAY_LINK_BEFORE);
  assert.equal(lightDayLink(ONE_LIGHT_DAY_TARGET_MS), LIGHT_DAY_LINK_AFTER);
  for (const line of [LIGHT_DAY_LINK_BEFORE, LIGHT_DAY_LINK_AFTER, VOYAGER_ESTIMATE_LIVE, VOYAGER_ESTIMATE_STATIC, "How this estimate works ↗"]) {
    assert.ok(es[line] && vi[line], `missing translation: ${line}`);
  }
});

test("the countdown lives inside the live distance card instead of a second card", async () => {
  const { readFile } = await import("node:fs/promises");
  const main = await readFile(new URL("../src/main.js", import.meta.url), "utf8");
  const layout = await readFile(new URL("../src/exhibit-layout.js", import.meta.url), "utf8");
  const css = await readFile(new URL("../src/style.css", import.meta.url), "utf8");
  assert.match(main, /\$\("#voyager-live-light-time"\)\.insertAdjacentHTML\("afterend", voyagerCountdownMarkup\(\)\)/);
  assert.doesNotMatch(layout, /"#voyager-countdown"/, "layout must not pull the countdown back out of the card");
  assert.match(css, /\.voyager-live \.voyager-countdown \{[^}]*border: 0;[^}]*background: none;/);
  assert.doesNotMatch(layout, /one-way light-time is shown below/);
});
