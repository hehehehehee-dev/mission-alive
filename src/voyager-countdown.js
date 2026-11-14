export const ONE_LIGHT_DAY_TARGET = "2026-11-18T10:16:07Z";
export const ONE_LIGHT_DAY_TARGET_MS = Date.parse(ONE_LIGHT_DAY_TARGET);
export const ONE_LIGHT_DAY_BEFORE = "On November 18, 2026, Voyager 1 crosses one light-day from Earth. No human-made object has ever been this far from home.";
export const ONE_LIGHT_DAY_AFTER = "On November 18, 2026, Voyager 1 crossed one light-day from Earth, the first human-made object ever to do it. Everything it says now takes a full day to reach home, and it is still saying it.";

export function oneLightDayState(now = Date.now()) {
  const remainingMs = Math.max(0, ONE_LIGHT_DAY_TARGET_MS - now);
  const totalMinutes = Math.ceil(remainingMs / 60_000);
  return {
    crossed: now >= ONE_LIGHT_DAY_TARGET_MS,
    remainingMs,
    days: Math.floor(totalMinutes / 1440),
    hours: Math.floor((totalMinutes % 1440) / 60),
    minutes: totalMinutes % 60,
  };
}

export function voyagerCountdownMarkup(now = Date.now()) {
  const value = oneLightDayState(now);
  if (value.crossed)
    return `<section class="voyager-data-card voyager-countdown" id="voyager-countdown" aria-label="Voyager 1 light-day milestone"><p>${ONE_LIGHT_DAY_AFTER}</p></section>`;
  return `<section class="voyager-data-card voyager-countdown" id="voyager-countdown" aria-labelledby="voyager-countdown-heading"><h3 id="voyager-countdown-heading">COUNTDOWN TO ONE LIGHT-DAY</h3><p>${ONE_LIGHT_DAY_BEFORE}</p><div class="countdown-value" role="timer" aria-live="off" aria-label="${value.days} days, ${value.hours} hours, ${value.minutes} minutes"><span><b>${value.days}</b>days</span><span><b>${String(value.hours).padStart(2, "0")}</b>hours</span><span><b>${String(value.minutes).padStart(2, "0")}</b>minutes</span></div></section>`;
}

export function mountVoyagerCountdown(container, { now = Date.now } = {}) {
  let root = container.querySelector("#voyager-countdown");
  let timer = 0;
  let disposed = false;
  function render() {
    if (disposed || !root?.isConnected) return;
    clearTimeout(timer);
    const time = now();
    root.outerHTML = voyagerCountdownMarkup(time);
    root = container.querySelector("#voyager-countdown");
    const remaining = oneLightDayState(time).remainingMs;
    timer = window.setTimeout(render, remaining > 0 ? Math.min(60_000, remaining) : 60_000);
  }
  const onVisibility = () => { if (!document.hidden) render(); };
  document.addEventListener("visibilitychange", onVisibility);
  render();
  return { dispose() { disposed = true; clearTimeout(timer); document.removeEventListener("visibilitychange", onVisibility); } };
}
