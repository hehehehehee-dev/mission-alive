import { getLanguage } from "./i18n.js";

const sameOriginMissionApi =
  typeof location !== "undefined" && location.protocol === "https:" ? "/api" : "";
const missionApi = (
  import.meta.env?.VITE_MISSION_API_URL ||
  import.meta.env?.VITE_COMMUNITY_API_URL ||
  sameOriginMissionApi
)
  .trim()
  .replace(/\/$/, "");
const LIGHT_SPEED_KM_S = 299792.458;

export function formatVoyagerDistanceKm(distanceKm) {
  return `${new Intl.NumberFormat(getLanguage(), { maximumFractionDigits: 0 }).format(distanceKm)} km`;
}

function formatUtc(value) {
  return new Intl.DateTimeFormat(getLanguage(), {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "UTC",
    timeZoneName: "short",
  }).format(value);
}

export function mountVoyagerDistance(container, {
  apiUrl = missionApi,
  fetcher = fetch,
  now = Date.now,
  reduced = false,
} = {}) {
  const distance = container.querySelector("#voyager-live-distance");
  const lightTime = container.querySelector("#voyager-live-light-time");
  const status = container.querySelector("#voyager-live-status");
  const controller = new AbortController();
  let timer = 0;
  let anchor = null;
  let lastRenderedAt = null;
  let disposed = false;
  delete distance.dataset.distanceKm;

  function renderLiveValue(currentTime = now()) {
    if (!anchor || disposed) return;
    lastRenderedAt = currentTime;
    const seconds = (currentTime - anchor.observedAt) / 1000;
    const distanceKm = anchor.distanceKm + anchor.rangeRateKmS * seconds;
    distance.textContent = formatVoyagerDistanceKm(distanceKm);
    distance.dataset.distanceKm = String(distanceKm);
    lightTime.textContent = `${(distanceKm / LIGHT_SPEED_KM_S / 3600).toFixed(2)} hours one way at light speed`;
    distance.setAttribute("aria-label", `Voyager 1 estimated distance from Earth: ${distance.textContent}`);
  }

  function startTimer() {
    window.clearInterval(timer);
    if (!anchor || disposed) return;
    renderLiveValue();
    if (!reduced) timer = window.setInterval(renderLiveValue, 1000);
    updateStatus();
  }

  function updateStatus() {
    status.textContent = reduced
      ? `JPL Horizons ephemeris anchored ${formatUtc(new Date(anchor.observedAt))} · static distance · press Read current distance to update`
      : `JPL Horizons ephemeris anchored ${formatUtc(new Date(anchor.observedAt))} · counter updates every second · refreshed by the server hourly`;
  }

  function refreshLanguage() {
    if (!anchor || disposed) return;
    renderLiveValue(reduced ? lastRenderedAt : now());
    updateStatus();
  }

  async function load() {
    if (!apiUrl) {
      distance.textContent = "Live estimate unavailable";
      lightTime.textContent = "The NASA milestone below remains available.";
      status.textContent =
        "No current Horizons anchor is available here.";
      return;
    }
    status.textContent = "Contacting JPL Horizons through the mission server…";
    try {
      const response = await fetcher(`${apiUrl}/voyager-distance`, {
        signal: controller.signal,
      });
      if (!response.ok) throw new Error("Distance service unavailable");
      const payload = await response.json();
      if (disposed) return;
      const observedAt = Date.parse(payload.observedAt);
      if (
        !Number.isFinite(payload.distanceKm) ||
        !Number.isFinite(payload.rangeRateKmS) ||
        !Number.isFinite(observedAt)
      )
        throw new Error("Invalid distance response");
      anchor = {
        distanceKm: payload.distanceKm,
        rangeRateKmS: payload.rangeRateKmS,
        observedAt,
      };
      startTimer();
    } catch (error) {
      if (disposed || error.name === "AbortError") return;
      status.textContent =
        "The live estimate is temporarily unavailable. The NASA milestone below is still shown.";
    }
  }

  load();
  window.addEventListener?.("mission-language-change", refreshLanguage);
  return {
    refresh() { renderLiveValue(); },
    setReduced(value) {
      if (reduced === Boolean(value)) return;
      reduced = Boolean(value);
      startTimer();
    },
    dispose() {
      disposed = true;
      controller.abort();
      window.clearInterval(timer);
      window.removeEventListener?.("mission-language-change", refreshLanguage);
    },
  };
}
