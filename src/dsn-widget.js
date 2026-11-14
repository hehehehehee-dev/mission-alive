import { DSN_CONFIG_URL, DSN_FEED_URL, parseDsnNow } from "../server/dsn-now.mjs";
import { getLanguage } from "./i18n.js";

const sourceUrl = "https://eyes.nasa.gov/apps/dsn-now/dsn.html";
const favoriteCodes = new Set(["VGR1", "VGR2", "JWST", "MSL"]);

export function dsnWidgetMarkup() {
  return `<aside class="dsn-widget" aria-labelledby="dsn-title">
    <div class="dsn-heading"><span class="dsn-pulse" aria-hidden="true"></span><p class="eyebrow">NASA DEEP SPACE NETWORK · LIVE SNAPSHOT</p></div>
    <h2 id="dsn-title">Who is Earth talking to?</h2>
    <p class="dsn-intro">Three ground stations listen and send commands across deep space. These are the spacecraft links NASA reports right now.</p>
    <div class="dsn-stations" id="dsn-stations" aria-live="off">
      <p class="fine">Checking NASA's current antenna data…</p>
    </div>
    <p class="dsn-status" id="dsn-status" role="status">Contacting DSN Now…</p>
    <a href="${sourceUrl}" target="_blank" rel="noopener">Explore NASA DSN Now ↗</a>
    <p class="dsn-caveat">A snapshot, not a schedule. Some reported links may be engineering tests; an absent mission may still be active at another time.</p>
  </aside>`;
}

async function directNasa(signal) {
  const [feed, config] = await Promise.all([
    fetch(DSN_FEED_URL, { signal, cache: "no-store" }),
    fetch(DSN_CONFIG_URL, { signal, cache: "force-cache" }),
  ]);
  if (!feed.ok || !config.ok) throw new Error("NASA feed unavailable");
  return parseDsnNow(await feed.text(), await config.text());
}

async function getSnapshot(signal) {
  if (location.protocol === "https:") {
    try {
      const response = await fetch("/api/dsn-now", { signal });
      if (!response.ok) throw new Error("DSN relay unavailable");
      return await response.json();
    } catch (error) {
      if (error.name === "AbortError") throw error;
    }
  }
  return directNasa(signal);
}

export function mountDsnWidget(container) {
  const list = container.querySelector("#dsn-stations");
  const status = container.querySelector("#dsn-status");
  const controller = new AbortController();
  let disposed = false;
  let busy = false;
  let latestSnapshotTime = null;

  function refreshLanguage() {
    if (!latestSnapshotTime || disposed) return;
    const stamp = new Intl.DateTimeFormat(getLanguage(), { hour: "numeric", minute: "2-digit", timeZone: "UTC", timeZoneName: "short" }).format(latestSnapshotTime);
    status.textContent = `NASA snapshot ${stamp} · refreshes about every minute`;
  }

  function stationCard(station) {
    const card = document.createElement("article");
    card.className = `dsn-station${station.available && station.links?.length ? " is-active" : ""}`;
    const heading = document.createElement("h3");
    heading.textContent = station.name;
    card.append(heading);
    if (!station.available) {
      const unavailable = document.createElement("p");
      unavailable.textContent = "Station data unavailable";
      card.append(unavailable);
      return card;
    }
    if (!station.links?.length) {
      const quiet = document.createElement("p");
      quiet.textContent = "No active link in this snapshot";
      card.append(quiet);
      return card;
    }
    const links = document.createElement("ul");
    const ordered = [...station.links].sort((a, b) => Number(favoriteCodes.has(b.code)) - Number(favoriteCodes.has(a.code)));
    for (const link of ordered.slice(0, 5)) {
      const item = document.createElement("li");
      const mission = document.createElement("strong");
      mission.textContent = link.spacecraft;
      const detail = document.createElement("span");
      detail.textContent = `${link.antenna.replace("DSS", "DSS ")} · ${link.sending && link.receiving ? "sending + receiving" : link.receiving ? "receiving" : "sending"}`;
      item.append(mission, detail);
      links.append(item);
    }
    card.append(links);
    if (ordered.length > 5) {
      const more = document.createElement("p");
      more.textContent = `+ ${ordered.length - 5} more links`;
      card.append(more);
    }
    return card;
  }

  async function refresh() {
    if (busy || disposed || document.hidden) return;
    busy = true;
    try {
      const snapshot = await getSnapshot(controller.signal);
      if (disposed) return;
      const stations = Array.isArray(snapshot.stations) ? snapshot.stations : [];
      if (!snapshot.live || !stations.length) throw new Error("NASA feed has no recent station data");
      list.replaceChildren(...stations.map(stationCard));
      const observed = stations.map((station) => Date.parse(station.observedAt)).filter(Number.isFinite);
      const latest = observed.length ? new Date(Math.max(...observed)) : null;
      latestSnapshotTime = latest;
      const stamp = latest ? new Intl.DateTimeFormat(getLanguage(), { hour: "numeric", minute: "2-digit", timeZone: "UTC", timeZoneName: "short" }).format(latest) : "time unavailable";
      status.textContent = `NASA snapshot ${stamp} · refreshes about every minute`;
      container.classList.add("has-live-data");
    } catch (error) {
      if (error.name === "AbortError" || disposed) return;
      latestSnapshotTime = null;
      list.replaceChildren();
      const fallback = document.createElement("p");
      fallback.className = "fine";
      fallback.textContent = "NASA's current DSN feed is unavailable. Open DSN Now to check again.";
      list.append(fallback);
      status.textContent = "Live data temporarily unavailable";
      container.classList.remove("has-live-data");
    } finally { busy = false; }
  }

  refresh();
  const timer = window.setInterval(refresh, 60_000);
  document.addEventListener("visibilitychange", refresh);
  window.addEventListener("mission-language-change", refreshLanguage);
  return {
    dispose() {
      disposed = true;
      controller.abort();
      clearInterval(timer);
      document.removeEventListener("visibilitychange", refresh);
      window.removeEventListener("mission-language-change", refreshLanguage);
    },
  };
}
