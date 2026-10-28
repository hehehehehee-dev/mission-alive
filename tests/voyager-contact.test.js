import test from "node:test";
import assert from "node:assert/strict";
import { DSN_CONFIG_URL, DSN_LAST_GOOD_CACHE_MS, createDsnRelay, parseDsnNow } from "../server/dsn-now.mjs";
import { mountVoyagerContact, voyagerContactMarkup, voyagerContactState } from "../src/voyager-contact.js";

const now = Date.parse("2026-10-21T12:00:00Z");
const config = `<config><sites>
  <site friendlyName="Goldstone"><dish name="DSS14"/></site>
  <site friendlyName="Madrid"><dish name="DSS63"/></site>
  <site friendlyName="Canberra"><dish name="DSS34"/><dish name="DSS43"/><dish name="DSS35"/></site>
</sites><spacecraftMap><spacecraft name="vgr1" friendlyName="Voyager 1"/></spacecraftMap></config>`;
const target = '<target name="VGR1" id="31" downlegRange="25800000000" uplegRange="25800000000"/>';
const downSignal = '<downSignal active="true" spacecraft="VGR1"/>';
const upSignal = '<upSignal active="true" spacecraft="VGR1"/>';
const station = (name, time = now) => `<station friendlyName="${name}" timeUTC="${time}"/>`;
const feed = (dishes, time = now) => `<dsn>${station("Goldstone", time)}${station("Madrid", time)}${station("Canberra", time)}${dishes}<timestamp>${time}</timestamp></dsn>`;

test("Voyager contact uses active signals and counts antennas once, not duplicate downlink signals", () => {
  const xml = feed(`<dish name="DSS43">${downSignal}${downSignal}${target}${target}</dish><dish name="DSS34">${upSignal}${target}</dish>`);
  const snapshot = parseDsnNow(xml, config, now);
  assert.deepEqual(snapshot.voyager1, [{ station: "Canberra", observedAt: new Date(now).toISOString(), active: true, antennas: ["DSS43", "DSS34"], rangeKm: 25800000000 }]);
  assert.deepEqual(voyagerContactState(snapshot, now).messages, ["Voyager 1 is talking to Canberra right now. Antennas: DSS 43, DSS 34. Range: 25,800,000,000 km. Its signal has been travelling for almost a day to get here."]);
});

test("assignment alone, inactive signals, and a different spacecraft's signal never establish Voyager contact", () => {
  for (const signals of ["", '<downSignal active="false" spacecraft="VGR1"/>', '<upSignal active="false" spacecraft="VGR1"/>', '<downSignal active="true" spacecraft="JWST"/>']) {
    const snapshot = parseDsnNow(feed(`<dish name="DSS43">${target}${signals}</dish>`), config, now);
    assert.equal(snapshot.stations[2].targets.length, 1, "the assignment may be retained separately");
    assert.deepEqual(snapshot.voyager1, []);
    assert.deepEqual(voyagerContactState(snapshot, now).messages, ["No one is listening right now. I'm still talking."]);
  }
});

test("only active Voyager dishes contribute to the antenna list or reported range", () => {
  const snapshot = parseDsnNow(feed(`<dish name="DSS43">${downSignal}<target name="VGR1" id="31" downlegRange="25800000001"/></dish><dish name="DSS34">${target}</dish>`), config, now);
  assert.deepEqual(snapshot.voyager1[0].antennas, ["DSS43"]);
  assert.equal(snapshot.voyager1[0].rangeKm, 25800000001);
  const withoutTarget = parseDsnNow(feed(`<dish name="DSS43">${upSignal}</dish>`), config, now);
  assert.deepEqual(voyagerContactState(withoutTarget, now).messages, ["Voyager 1 is talking to Canberra right now. Antenna: DSS 43."]);
});

test("range sentence requires a positive VGR1 range and counts stay specific to each station", () => {
  const noRangeTarget = '<target name="VGR1" id="31" downlegRange="-1" uplegRange=""/>';
  const snapshot = parseDsnNow(feed(`<dish name="DSS14">${upSignal}${noRangeTarget}</dish><dish name="DSS43">${downSignal}${target}</dish><dish name="DSS34">${upSignal}${target}</dish><dish name="DSS35">${downSignal}${target}</dish>`), config, now);
  const state = voyagerContactState(snapshot, now);
  assert.equal(state.messages[0], "Voyager 1 is talking to Goldstone right now. Antenna: DSS 14.");
  assert.equal(state.messages[1], "Voyager 1 is talking to Canberra right now. Antennas: DSS 43, DSS 34, DSS 35. Range: 25,800,000,000 km. Its signal has been travelling for almost a day to get here.");
  assert.equal(state.observedAt, new Date(now).toISOString());
});

test("no active signal, stale feed, missing data, and old assignment-only snapshots use the exact quiet fallback", () => {
  for (const snapshot of [null, {}, parseDsnNow(feed(`<dish name="DSS43">${target}</dish>`), config, now), parseDsnNow(feed(`<dish name="DSS43">${downSignal}${target}</dish>`, now - 180_000), config, now), {voyager1:[{station:"Canberra", observedAt:new Date(now).toISOString(), antennas:["DSS43"], rangeKm:25800000000}]}]) {
    assert.deepEqual(voyagerContactState(snapshot, now).messages, ["No one is listening right now. I'm still talking."]);
  }
  const snapshot = parseDsnNow(feed(`<dish name="DSS43">${downSignal}${target}</dish>`), config, now);
  assert.deepEqual(voyagerContactState(snapshot, now + 180_000).messages, ["No one is listening right now. I'm still talking."]);
  assert.match(voyagerContactMarkup(), /Live data: NASA Deep Space Network/);
  assert.doesNotMatch(voyagerContactMarkup(), /aria-live|role="status"/);
});

test("relay retains last-good XML for five minutes but a failed refresh immediately removes contact", async () => {
  const relay = createDsnRelay();
  const success = async (url) => new Response(url === DSN_CONFIG_URL ? config : feed(`<dish name="DSS43">${downSignal}${target}</dish>`));
  const failure = async () => { throw new Error("NASA is offline"); };
  const first = await relay(success, now);
  assert.equal(first.voyager1.length, 1);
  const cached = await relay(failure, now + 60_000);
  assert.equal(cached.cached, true);
  assert.equal(cached.voyager1.length, 0);
  assert.equal(cached.live, false);
  assert.equal(cached.observedAt, new Date(now).toISOString());
  const throttledAfterFailure = await relay(failure, now + 65_000);
  assert.equal(throttledAfterFailure.voyager1.length, 0, "a throttled poll cannot revive failed-refresh contact");
  const expiredContact = await relay(failure, now + DSN_LAST_GOOD_CACHE_MS);
  assert.equal(expiredContact.cached, true);
  assert.equal(expiredContact.observedAt, new Date(now).toISOString());
  assert.equal(expiredContact.voyager1.length, 0);
  assert.equal(expiredContact.live, false);
  const recovered = await relay(async (url) => new Response(url === DSN_CONFIG_URL ? config : feed(`<dish name="DSS43">${downSignal}${target}</dish>`, now + 330_000)), now + 330_000);
  assert.equal(recovered.live, true);
  assert.equal(recovered.voyager1.length, 1);
});

test("initial upstream errors and malformed XML produce silent snapshots, then can recover", async () => {
  const relay = createDsnRelay();
  const bad = await relay(async () => { throw new Error("offline"); }, now);
  assert.equal(bad.live, false);
  assert.equal(bad.error, undefined);
  assert.deepEqual(bad.voyager1, []);
  const malformed = await relay(async (url) => new Response(url === DSN_CONFIG_URL ? config : "<dsn><dish>"), now + 31_000);
  assert.equal(malformed.live, false);
  const recovered = await relay(async (url) => new Response(url === DSN_CONFIG_URL ? config : feed(`<dish name="DSS43">${downSignal}${target}</dish>`, now + 62_000)), now + 62_000);
  assert.equal(recovered.voyager1.length, 1);
});

test("a failed or hanging browser request removes current contact, recovers, ages honestly, and aborts on disposal", async (t) => {
  let currentTime = now;
  t.mock.method(Date, "now", () => currentTime);
  const priorWindow = Object.getOwnPropertyDescriptor(globalThis, "window");
  const priorDocument = Object.getOwnPropertyDescriptor(globalThis, "document");
  let ui;
  t.after(() => {
    ui?.dispose();
    if (priorWindow) Object.defineProperty(globalThis, "window", priorWindow);
    else delete globalThis.window;
    if (priorDocument) Object.defineProperty(globalThis, "document", priorDocument);
    else delete globalThis.document;
  });

  const timeouts = new Map();
  const intervals = new Map();
  const listeners = new Map();
  let nextTimer = 0;
  const element = () => ({
    textContent: "", children: [],
    replaceChildren(...children) { this.children = children; },
    append(...children) { this.children.push(...children); },
  });
  const messages = element();
  const source = element();
  Object.defineProperty(globalThis, "window", { configurable: true, value: {
    setTimeout(callback, delay) { const id = ++nextTimer; timeouts.set(id, { callback, delay }); return id; },
    clearTimeout(id) { timeouts.delete(id); },
    setInterval(callback) { const id = ++nextTimer; intervals.set(id, callback); return id; },
    clearInterval(id) { intervals.delete(id); },
  } });
  Object.defineProperty(globalThis, "document", { configurable: true, value: {
    hidden: false,
    createElement: element,
    addEventListener(type, callback) { listeners.set(type, callback); },
    removeEventListener(type, callback) { if (listeners.get(type) === callback) listeners.delete(type); },
  } });

  let requestCount = 0;
  const requestSignals = [];
  const announcements = [];
  ui = mountVoyagerContact({ querySelector(selector) {
    return selector === "[data-voyager-contact-messages]" ? messages : source;
  } }, {
    onAnnounce: (message) => announcements.push(message),
    fetcher: async (_url, { signal }) => {
      requestSignals.push(signal);
      requestCount += 1;
      if (requestCount % 2 === 0) return new Promise((_resolve, reject) => {
        signal.addEventListener("abort", () => reject(new DOMException("Aborted", "AbortError")), { once: true });
      });
      const snapshot = parseDsnNow(feed(`<dish name="DSS43">${downSignal}${target}</dish>`, currentTime), config, currentTime);
      return { ok: true, json: async () => snapshot };
    },
  });
  const flush = () => new Promise(setImmediate);
  const renderedMessage = () => messages.children.map((child) => child.textContent).join(" ");
  await flush();
  assert.match(renderedMessage(), /^Voyager 1 is talking to Canberra right now\./);
  assert.equal(announcements.length, 1);
  assert.equal(timeouts.size, 0);

  const poll = [...intervals.values()][0];
  currentTime += 60_000;
  poll();
  assert.equal(requestCount, 2);
  const timeout = [...timeouts.values()][0];
  assert.ok(timeout.delay > 0 && timeout.delay <= 20_000, "each request has a short, bounded timeout");

  timeout.callback();
  await flush();
  assert.equal(requestSignals[1].aborted, true);
  assert.equal(timeouts.size, 0);
  assert.equal(renderedMessage(), "No one is listening right now. I'm still talking.", "a failed refresh cannot reuse even a recent contact");
  assert.equal(announcements.length, 2);

  poll();
  await flush();
  assert.equal(requestCount, 3, "polling recovers after a timed-out request");
  assert.match(renderedMessage(), /^Voyager 1 is talking to Canberra right now\./);
  assert.equal(announcements.length, 3);

  poll();
  assert.equal(requestCount, 4);
  // A throttled timer or stalled connection must not preserve “right now”.
  currentTime += 120_001;
  poll();
  assert.equal(requestCount, 4, "polling does not overlap a pending request");
  assert.equal(renderedMessage(), "No one is listening right now. I'm still talking.");
  assert.equal(announcements.length, 4);
  ui.dispose();
  await flush();
  assert.equal(requestSignals[3].aborted, true);
  assert.equal(timeouts.size, 0);
  assert.equal(intervals.size, 0);
  assert.equal(listeners.size, 0);
  assert.equal(announcements.length, 4, "leaving the module cannot publish a late state change");
  poll();
  assert.equal(requestCount, 4);
});
