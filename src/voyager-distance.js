import { getLanguage } from "./i18n.js";
import { ONE_LIGHT_DAY_TARGET_MS } from "./voyager-countdown.js";

const sameOriginMissionApi =
  typeof location !== "undefined" && location.protocol === "https:" ? "/api" : "";
const missionApi = (
  import.meta.env?.VITE_MISSION_API_URL ||
  import.meta.env?.VITE_COMMUNITY_API_URL ||
  sameOriginMissionApi
)
  .trim()
  .replace(/\/$/, "");

// Ties the live number to the countdown card beneath it. The switch uses NASA's
// published milestone date (the same one the countdown uses), not the Horizons
// estimate, so the two cards can never disagree about whether it has happened.
export const LIGHT_DAY_LINK_BEFORE = "When this number passes one light-day (about 25.9 billion km), a message from Voyager will take a full day to reach us.";
export const LIGHT_DAY_LINK_AFTER = "Voyager 1 is past one light-day: a message from it now takes more than a full day to reach us.";
export const VOYAGER_ESTIMATE_LIVE = "Estimate from NASA/JPL Horizons, not a signal from the spacecraft · updates every second";
export const VOYAGER_ESTIMATE_STATIC = "Estimate from NASA/JPL Horizons, not a signal from the spacecraft · press Read current distance to update";

export function lightDayLink(now = Date.now()) {
  return now >= ONE_LIGHT_DAY_TARGET_MS ? LIGHT_DAY_LINK_AFTER : LIGHT_DAY_LINK_BEFORE;
}

export function formatVoyagerDistanceKm(distanceKm) {
  return `${new Intl.NumberFormat(getLanguage(), { maximumFractionDigits: 0 }).format(distanceKm)} km`;
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
    lightTime.textContent = lightDayLink(currentTime);
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
    status.textContent = reduced ? VOYAGER_ESTIMATE_STATIC : VOYAGER_ESTIMATE_LIVE;
  }

  function refreshLanguage() {
    if (!anchor || disposed) return;
    renderLiveValue(reduced ? lastRenderedAt : now());
    updateStatus();
  }

  async function load() {
    if (!apiUrl) {
      distance.textContent = "Live estimate unavailable";
      lightTime.textContent = lightDayLink(now());
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
