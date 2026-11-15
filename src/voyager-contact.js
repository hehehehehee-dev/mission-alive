import { getLanguage } from "./i18n.js";
const SOURCE_LABEL = "Live data: NASA Deep Space Network";
const NO_CONTACT = "No one is listening right now. I'm still talking.";
const CONTACT_UNAVAILABLE = "Live DSN contact is unavailable. Please check again later.";
const CONTACT_MAX_AGE_MS = 2 * 60 * 1000;
const REQUEST_TIMEOUT_MS = 15_000;
const STATIONS = new Set(["Goldstone", "Madrid", "Canberra"]);

export function voyagerContactMarkup() {
  // Hidden until there is real DSN data to show; an "unavailable" card says nothing useful.
  return `<aside class="voyager-contact" aria-label="Voyager 1 Deep Space Network contact" hidden>
    <div data-voyager-contact-messages><p>${CONTACT_UNAVAILABLE}</p></div>
    <p class="fine voyager-contact-source" data-voyager-contact-source>${SOURCE_LABEL}</p>
  </aside>`;
}

export function voyagerContactState(snapshot, now = Date.now()) {
  const contacts = snapshot?.live !== false && Array.isArray(snapshot?.voyager1) ? snapshot.voyager1 : [];
  const messages = [];
  const uniqueStations = new Set();
  for (const contact of contacts) {
    const observed = Date.parse(contact.observedAt);
    const antennas = [...new Set(Array.isArray(contact.antennas) ? contact.antennas.filter((value) => typeof value === "string" && /^DSS\d+$/.test(value)) : [])];
    if (contact.active !== true || !STATIONS.has(contact.station) || uniqueStations.has(contact.station) || !antennas.length
      || !Number.isFinite(observed) || now - observed > CONTACT_MAX_AGE_MS || now - observed < -30_000) continue;
    uniqueStations.add(contact.station);
    let message = `Voyager 1 is talking to ${contact.station} right now.`;
    message += ` ${antennas.length === 1 ? "Antenna" : "Antennas"}: ${antennas.map((value) => value.replace("DSS", "DSS ")).join(", ")}.`;
    if (Number.isFinite(contact.rangeKm) && contact.rangeKm > 0) message += ` Range: ${new Intl.NumberFormat(getLanguage(), { maximumFractionDigits: 0 }).format(contact.rangeKm)} km. Its signal has been travelling for almost a day to get here.`;
    messages.push(message);
  }
  const observed = Date.parse(snapshot?.observedAt);
  const freshFeed = snapshot?.live === true && Number.isFinite(observed)
    && now - observed <= CONTACT_MAX_AGE_MS && now - observed >= -30_000;
  return {
    messages: messages.length ? messages : [freshFeed ? NO_CONTACT : CONTACT_UNAVAILABLE],
    observedAt: Number.isFinite(observed) ? new Date(observed).toISOString() : null,
  };
}

export function mountVoyagerContact(container, { onAnnounce = () => {}, fetcher = fetch } = {}) {
  const messages = container.querySelector("[data-voyager-contact-messages]");
  const source = container.querySelector("[data-voyager-contact-source]");
  if (!messages || !source) return { dispose() {} };
  let requestController = null;
  let requestTimeout = 0;
  let disposed = false;
  let busy = false;
  let snapshot = null;
  let previousMessage = CONTACT_UNAVAILABLE;

  function render() {
    if (disposed) return;
    const state = voyagerContactState(snapshot);
    const nextMessage = state.messages.join(" ");
    const unavailable = state.messages.length === 1 && state.messages[0] === CONTACT_UNAVAILABLE;
    const card = messages.closest?.(".voyager-contact");
    if (card) card.hidden = unavailable;
    messages.replaceChildren(...state.messages.map((message) => {
      const paragraph = document.createElement("p");
      paragraph.textContent = message;
      return paragraph;
    }));
    source.textContent = SOURCE_LABEL;
    if (state.observedAt) {
      source.append(" · ");
      const time = document.createElement("time");
      time.dateTime = state.observedAt;
      time.textContent = new Intl.DateTimeFormat(getLanguage(), {
        month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit", timeZone: "UTC", timeZoneName: "short",
      }).format(new Date(state.observedAt));
      source.append(time);
    }
    if (nextMessage !== previousMessage && !unavailable) onAnnounce(nextMessage);
    previousMessage = nextMessage;
  }

  async function refresh() {
    if (disposed || document.hidden) return;
    // Age the last snapshot even when the preceding request is still pending.
    render();
    if (busy) return;
    busy = true;
    const controller = new AbortController();
    requestController = controller;
    requestTimeout = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
    try {
      // NASA XML is fetched and cached by our host, never from the browser.
      const response = await fetcher("/api/dsn-now", { signal: controller.signal, cache: "no-store" });
      if (!response.ok) throw new Error("DSN snapshot unavailable");
      const candidate = await response.json();
      if (!candidate || !Array.isArray(candidate.stations)) throw new Error("Invalid DSN snapshot");
      snapshot = candidate;
    } catch {
      // A failed check cannot support a “right now” claim, even if the preceding
      // snapshot was recent. The next successful poll can establish contact.
      snapshot = null;
    } finally {
      window.clearTimeout(requestTimeout);
      requestTimeout = 0;
      requestController = null;
      busy = false;
      render();
    }
  }

  refresh();
  const timer = window.setInterval(refresh, 60_000);
  document.addEventListener("visibilitychange", refresh);
  window.addEventListener?.("mission-language-change", render);
  return {
    dispose() {
      disposed = true;
      requestController?.abort();
      window.clearTimeout(requestTimeout);
      requestTimeout = 0;
      window.clearInterval(timer);
      document.removeEventListener("visibilitychange", refresh);
      window.removeEventListener?.("mission-language-change", render);
    },
  };
}
