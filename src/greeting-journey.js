// A thought experiment: a greeting saved today is not physically aboard Voyager.
import { getLanguage } from "./i18n.js";
// NASA lists Voyager 1's Sun-relative speed as about 17 km/s.
export const VOYAGER_KM_PER_SECOND = 17;

export function imaginedDistanceKm(createdAt, now = Date.now()) {
  const start = Date.parse(createdAt);
  if (!Number.isFinite(start)) return 0;
  return Math.max(0, Math.floor((now - start) / 1000 * VOYAGER_KM_PER_SECOND));
}

export function formatJourney(createdAt, now = Date.now(), locale = getLanguage()) {
  return `${new Intl.NumberFormat(locale).format(imaginedDistanceKm(createdAt, now))} km`;
}
