import { XMLParser, XMLValidator } from "fast-xml-parser";

export const DSN_FEED_URL = "https://eyes.nasa.gov/dsn/data/dsn.xml";
export const DSN_CONFIG_URL = "https://eyes.nasa.gov/apps/dsn-now/config.xml";
const STALE_AFTER_MS = 2 * 60 * 1000;
export const DSN_LAST_GOOD_CACHE_MS = 5 * 60 * 1000;
const REFRESH_AFTER_MS = 30_000;
const stationOrder = ["Goldstone", "Madrid", "Canberra"];
const asArray = (value) => value === undefined ? [] : Array.isArray(value) ? value : [value];
const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: "@_", processEntities: false });
const clean = (value, limit = 80) => String(value ?? "").replace(/[\u0000-\u001f\u007f]/g, " ").trim().slice(0, limit);
const isoTime = (value) => Number.isFinite(Number(value)) && Number(value) > 0
  ? new Date(Number(value)).toISOString() : null;
const validRange = (value) => Number.isFinite(Number(value)) && Number(value) > 0 ? Number(value) : null;

export function parseDsnNow(feedXml, configXml, now = Date.now()) {
  if (XMLValidator.validate(feedXml) !== true || XMLValidator.validate(configXml) !== true) throw new Error("Invalid DSN XML");
  const feed = parser.parse(feedXml)?.dsn;
  const config = parser.parse(configXml)?.config;
  if (!feed || !config) throw new Error("Invalid DSN feed or configuration");
  const sites = asArray(config.sites?.site);
  const stations = asArray(feed.station);
  const dishes = asArray(feed.dish);
  const spacecraft = new Map(asArray(config.spacecraftMap?.spacecraft).map((item) => [
    clean(item["@_name"]).toUpperCase(), clean(item["@_friendlyName"]),
  ]));
  const dishSite = new Map(sites.flatMap((site) => asArray(site.dish).map((dish) => [
    clean(dish["@_name"]).toUpperCase(), clean(site["@_friendlyName"]),
  ])));
  const observed = new Map(stations.map((site) => [
    clean(site["@_friendlyName"]), Number(site["@_timeUTC"]),
  ]));
  const result = stationOrder.map((name) => ({
    name,
    observedAt: Number.isFinite(observed.get(name)) ? new Date(observed.get(name)).toISOString() : null,
    available: Number.isFinite(observed.get(name)) && now - observed.get(name) >= -30_000 && now - observed.get(name) <= STALE_AFTER_MS,
    links: [],
    targets: [],
  }));
  for (const dish of dishes) {
    const antenna = clean(dish["@_name"], 16).toUpperCase();
    const station = result.find((item) => item.name === dishSite.get(antenna));
    if (!station?.available) continue;
    for (const target of asArray(dish.target)) {
      const code = clean(target["@_name"], 24).toUpperCase();
      const id = Number(target["@_id"]);
      if (code !== "VGR1" && Math.abs(id) !== 31) continue;
      if (station.targets.some((item) => item.antenna === antenna && item.code === "VGR1")) continue;
      station.targets.push({
        antenna,
        code: "VGR1",
        id: 31,
        rangeKm: validRange(target["@_downlegRange"]) ?? validRange(target["@_uplegRange"]),
      });
    }
    const connections = new Map();
    for (const signal of asArray(dish.upSignal)) {
      if (signal?.["@_active"] !== "true") continue;
      const id = clean(signal["@_spacecraft"], 24).toUpperCase();
      if (!id || ["DSN", "DSS", "DOUG", "SHAN"].includes(id)) continue;
      const value = connections.get(id) || { code: id, spacecraft: spacecraft.get(id) || id, sending: false, receiving: false };
      value.sending = true;
      connections.set(id, value);
    }
    for (const signal of asArray(dish.downSignal)) {
      if (signal?.["@_active"] !== "true") continue;
      const id = clean(signal["@_spacecraft"], 24).toUpperCase();
      if (!id || ["DSN", "DSS", "DOUG", "SHAN"].includes(id)) continue;
      const value = connections.get(id) || { code: id, spacecraft: spacecraft.get(id) || id, sending: false, receiving: false };
      value.receiving = true;
      connections.set(id, value);
    }
    station.links.push(...[...connections.values()].map((link) => ({ antenna, ...link })));
  }
  return {
    source: "NASA DSN Now",
    sourceUrl: "https://eyes.nasa.gov/apps/dsn-now/dsn.html",
    fetchedAt: new Date(now).toISOString(),
    observedAt: isoTime(feed.timestamp) ?? [...result].map((site) => site.observedAt).filter(Boolean).sort().at(-1) ?? null,
    live: result.some((site) => site.available),
    stations: result,
    // A scheduled target is an assignment, not evidence that a radio signal is
    // active. Only the active up/down links above establish current contact.
    voyager1: result.flatMap((site) => {
      const antennas = [...new Set(site.links.filter((link) => link.code === "VGR1" && (link.sending || link.receiving)).map((link) => link.antenna))];
      if (!site.available || !antennas.length) return [];
      return [{
        station: site.name,
        observedAt: site.observedAt,
        active: true,
        antennas,
        rangeKm: site.targets.find((target) => antennas.includes(target.antenna) && target.rangeKm !== null)?.rangeKm ?? null,
      }];
    }),
  };
}

export function emptyDsnSnapshot(now = Date.now()) {
  return {
    source: "NASA DSN Now",
    sourceUrl: "https://eyes.nasa.gov/apps/dsn-now/dsn.html",
    fetchedAt: new Date(now).toISOString(),
    observedAt: null,
    live: false,
    stations: stationOrder.map((name) => ({ name, observedAt: null, available: false, links: [], targets: [] })),
    voyager1: [],
  };
}

// Keep the original XML for at least five minutes. Re-parsing on a failed
// refresh retains the source timestamp for context, but cannot establish current
// contact. The lobby and Voyager share this same server-side cache.
export function createDsnRelay() {
  let cachedConfig = null;
  let configFetchedAt = 0;
  let cachedFeed = null;
  let feedFetchedAt = 0;
  let lastAttemptAt = null;
  let lastFetchFailed = false;
  let inFlight = null;

  function cachedOrEmpty(now) {
    if (cachedFeed && cachedConfig && now - feedFetchedAt <= DSN_LAST_GOOD_CACHE_MS) {
      const snapshot = { ...parseDsnNow(cachedFeed, cachedConfig, now), cached: true };
      if (!lastFetchFailed) return snapshot;
      return {
        ...snapshot,
        live: false,
        stations: snapshot.stations.map((site) => ({ ...site, available: false, links: [], targets: [] })),
        voyager1: [],
      };
    }
    return emptyDsnSnapshot(now);
  }

  return async function fetchStatus(fetcher = fetch, now = Date.now()) {
    if (inFlight) return inFlight;
    if (lastAttemptAt !== null && now - lastAttemptAt < REFRESH_AFTER_MS) return cachedOrEmpty(now);
    lastAttemptAt = now;
    inFlight = Promise.resolve().then(async () => {
      try {
        const needsConfig = !cachedConfig || now - configFetchedAt >= 86_400_000;
        const configPromise = needsConfig
          ? fetcher(DSN_CONFIG_URL, { signal: AbortSignal.timeout(12_000) }).then(async (response) => {
            if (!response.ok) throw new Error("DSN configuration unavailable");
            return response.text();
          }) : Promise.resolve(cachedConfig);
        const feedPromise = fetcher(DSN_FEED_URL, { signal: AbortSignal.timeout(12_000), headers: { "Cache-Control": "no-cache" } }).then(async (response) => {
          if (!response.ok) throw new Error("DSN feed unavailable");
          return response.text();
        });
        const [configXml, feedXml] = await Promise.all([configPromise, feedPromise]);
        const status = parseDsnNow(feedXml, configXml, now);
        lastFetchFailed = false;
        cachedConfig = configXml;
        if (needsConfig) configFetchedAt = now;
        cachedFeed = feedXml;
        feedFetchedAt = now;
        return { ...status, cached: false };
      } catch {
        lastFetchFailed = true;
        return cachedOrEmpty(now);
      }
    });
    try {
      return await inFlight;
    } finally {
      inFlight = null;
    }
  };
}

export const fetchDsnNow = createDsnRelay();
