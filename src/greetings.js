import {
  greetings,
  filterGreetings,
  greetingSource,
} from "./greetings-catalog.js";
import {
  mountPersonalRecords,
  personalRecordMarkup,
} from "./personal-records.js";
import "./greetings.css";
const files = import.meta.glob("../golden-record-greetings/*.mp3", {
  eager: true,
  query: "?url",
  import: "default",
});
const urls = new Map(
  Object.entries(files).map(([path, url]) => [
    path.split("/").pop().slice(0, 2),
    url,
  ]),
);
const countryNames = [...new Set(greetings.flatMap((g) => g.countries))].sort(
  (a, b) => a.localeCompare(b),
);
let selectedId = "11";
const quickGreetingIds = ["11", "45", "53"];

export function greetingMarkup() {
  return `<section class="greeting-library" aria-labelledby="greeting-heading">
 <div class="library-heading"><h3 id="greeting-heading">Voices from Earth</h3><span>55 GREETINGS</span></div>
 <div class="greeting-browser">
 <label for="greeting-search">Find a language or country</label><input type="search" id="greeting-search" placeholder="Try Vietnamese, India, Español…" autocomplete="off">
 <label for="greeting-country" class="sr-only">Filter by country or region</label><select id="greeting-country"><option value="">All countries & regions</option>${countryNames.map((c) => `<option>${c}</option>`).join("")}</select>
 <div class="results-heading"><span id="greeting-count">55 greetings</span><button id="clear-greetings" type="button">Clear filters</button></div>
 <div class="greeting-results" id="greeting-results" role="group" aria-label="Matching greetings"></div></div>
 <div class="greeting-player"><div class="greeting-quick-list" role="group" aria-label="Choose a greeting">${quickGreetingIds.map((id) => `<button type="button" data-quick-greeting="${id}" aria-pressed="${String(id === selectedId)}">${greetings.find((item) => item.id === id).language}</button>`).join("")}</div><button type="button" id="browse-all-greetings" class="greeting-browse-all" aria-controls="greeting-search">Browse all 55 greetings</button><p class="eyebrow">SELECTED GREETING</p><h4 id="selected-language"></h4><p id="selected-region" class="fine"></p><figure class="greeting-translation"><blockquote id="selected-translation"></blockquote><figcaption>English translation published by NASA</figcaption></figure><details class="greeting-original" data-i18n-original hidden><summary>Read NASA’s original English text</summary><blockquote id="original-greeting-translation" lang="en" data-i18n-skip></blockquote></details><audio id="greeting-audio" controls preload="none" aria-label="Golden Record greeting player"></audio><button id="play-greeting" class="primary" type="button">Play greeting</button><p id="greeting-status" class="fine">Select a greeting, then press play.</p></div>
 <p class="fine association-note">Countries and regions are discovery guides, not the speaker’s nationality or a complete list of where a language is spoken. Ancient languages are labeled.</p>
 <a class="greeting-source" href="${greetingSource}" target="_blank" rel="noopener">NASA greeting list & English translations</a>
 </section>${personalRecordMarkup()}`;
}

export function mountGreetings(container, { onPlay, onPause, onSave, onCount = () => {}, onAnnounce = () => {}, reducedMotion = false }) {
  const find = (selector) => container.querySelector(selector),
    search = find("#greeting-search"),
    country = find("#greeting-country"),
    results = find("#greeting-results"),
    audio = find("#greeting-audio"),
    play = find("#play-greeting"),
    status = find("#greeting-status");
  let disposed = false,
    selectionRevision = 0;
  const personalRecords = mountPersonalRecords(container, {
    onPlay,
    onPause,
    onSave,
    onAnnounce,
    reducedMotion,
  });
  function setStatus(message, announce = true) {
    status.textContent = message;
    if (announce && !disposed) onAnnounce(message);
  }
  function openCatalog({ focus = true, scroll = true } = {}) {
    if (disposed) return;
    // The layout may move the existing browser into More to explore. Reveal
    // its real ancestors so all existing handlers keep using the same nodes.
    let disclosure = search.closest("details");
    while (disclosure && container.contains(disclosure)) {
      disclosure.open = true;
      disclosure = disclosure.parentElement?.closest("details");
    }
    if (scroll)
      search.closest(".greeting-browser").scrollIntoView({
        behavior: reducedMotion ? "instant" : "smooth",
        block: "start",
      });
    if (focus) search.focus({ preventScroll: true });
  }
  function draw() {
    const matches = filterGreetings(search.value, country.value);
    find("#greeting-count").textContent =
      `${matches.length} of ${greetings.length} greetings`;
    onCount(matches.length);
    results.replaceChildren();
    if (!matches.length) {
      const empty = document.createElement("p");
      empty.className = "empty-greetings";
      empty.textContent =
        "No greetings match. Try another language or clear the filters.";
      results.append(empty);
      return;
    }
    for (const item of matches) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "greeting-choice";
      button.dataset.greeting = item.id;
      button.setAttribute("aria-pressed", String(item.id === selectedId));
      const label = document.createElement("strong");
      label.textContent = item.language;
      const region = document.createElement("span");
      region.textContent = item.region;
      button.append(label, region);
      button.addEventListener("click", () => select(item.id));
      results.append(button);
    }
  }
  function select(id, announce = true) {
    selectionRevision++;
    audio.pause();
    audio.removeAttribute("src");
    audio.load();
    selectedId = id;
    const item = greetings.find((g) => g.id === id);
    find("#selected-language").textContent = item.language;
    find("#selected-region").textContent = item.region;
    find("#selected-translation").textContent = `“${item.translation}”`;
    find("#original-greeting-translation").textContent = `“${item.translation}”`;
    audio.setAttribute("aria-label", `${item.language} Golden Record greeting`);
    audio.src = urls.get(id) || "";
    audio.muted = false;
    play.textContent = "Play greeting";
    play.disabled = !urls.has(id);
    setStatus(
      urls.has(id)
        ? `${item.language} selected. Press play to listen.`
        : "This recording is unavailable. Choose another greeting.",
      announce,
    );
    results
      .querySelectorAll("button")
      .forEach((b) =>
        b.setAttribute("aria-pressed", String(b.dataset.greeting === id)),
      );
    container.querySelectorAll("[data-quick-greeting]").forEach((button) =>
      button.setAttribute("aria-pressed", String(button.dataset.quickGreeting === id)),
    );
  }
  container.querySelectorAll("[data-quick-greeting]").forEach((button) =>
    button.addEventListener("click", () => select(button.dataset.quickGreeting)),
  );
  find("#browse-all-greetings").addEventListener("click", () => openCatalog());
  audio.addEventListener("playing", () => {
    if (disposed) return;
    play.textContent = "Pause greeting";
    const item = greetings.find((g) => g.id === selectedId);
    setStatus(`Playing ${item.language} Golden Record greeting.`);
    onPlay(item);
  });
  audio.addEventListener("pause", () => {
    if (disposed) return;
    play.textContent = "Play greeting";
    if (audio.currentTime > 0 && !audio.ended)
      setStatus("Paused. Resume whenever you’re ready.");
    onPause();
  });
  audio.addEventListener("ended", () => {
    play.textContent = "Replay greeting";
    setStatus("Greeting complete. Choose another voice from Earth.");
    onPause();
  });
  audio.addEventListener("error", () => {
    if (disposed) return;
    setStatus(
      "This recording could not load. Try again or choose another language.",
    );
    play.textContent = "Retry greeting";
    onPause();
  });
  play.addEventListener("click", async () => {
    if (!audio.paused) {
      audio.pause();
      return;
    }
    const revision = selectionRevision;
    audio.muted = false;
    setStatus("Loading greeting…");
    try {
      await audio.play();
    } catch (error) {
      if (disposed || revision !== selectionRevision) return;
      if (error.name !== "AbortError")
        setStatus(
          "Playback could not start. Try the audio controls or another greeting.",
        );
    }
  });
  search.addEventListener("input", () => {
    openCatalog({ focus: false, scroll: false });
    draw();
  });
  country.addEventListener("change", () => {
    openCatalog({ focus: false, scroll: false });
    draw();
  });
  const compareCountry = (event) => {
    if (!countryNames.includes(event.detail?.country)) return;
    country.value = event.detail.country;
    search.value = "";
    openCatalog({ focus: false });
    draw();
    country.focus({ preventScroll: true });
  };
  container.addEventListener("compare-greeting-country", compareCountry);
  find("#clear-greetings").addEventListener("click", () => {
    search.value = "";
    country.value = "";
    openCatalog({ focus: false });
    draw();
    search.focus();
  });
  draw();
  select(selectedId, false);
  const lifecycle = new AbortController();
  if (document.modelContext?.registerTool) {
    const register = (tool) => {
      try {
        Promise.resolve(
          document.modelContext.registerTool(tool, {
            signal: lifecycle.signal,
          }),
        ).catch(() => {});
      } catch {
        /* Optional browser capability; visible controls remain available. */
      }
    };
    register({
      name: "search_golden_record_greetings",
      description:
        "Filter the visible greeting library by language or country. Does not play audio.",
      inputSchema: {
        type: "object",
        properties: { query: { type: "string" }, country: { type: "string" } },
        additionalProperties: false,
      },
      annotations: { readOnlyHint: false },
      execute(input) {
        if (
          !input ||
          typeof input !== "object" ||
          (input.query !== undefined && typeof input.query !== "string") ||
          (input.country !== undefined && typeof input.country !== "string") ||
          (input.country && !countryNames.includes(input.country))
        )
          throw new Error(
            "Provide a text query and an available country or region.",
          );
        search.value = input.query || "";
        country.value = input.country || "";
        openCatalog({ focus: false });
        draw();
        return filterGreetings(search.value, country.value).map(
          ({ id, language, region, translation }) => ({
            id,
            language,
            region,
            translation,
          }),
        );
      },
    });
    register({
      name: "select_golden_record_greeting",
      description:
        "Select a greeting in the visible player using its two-digit ID. Stops any current recording; does not autoplay.",
      inputSchema: {
        type: "object",
        properties: { id: { type: "string" } },
        required: ["id"],
        additionalProperties: false,
      },
      annotations: { readOnlyHint: false },
      execute(input) {
        if (!input || !greetings.some((g) => g.id === input.id))
          throw new Error("Unknown greeting ID.");
        openCatalog({ focus: false, scroll: false });
        select(input.id);
        return {
          selectedId,
          language: greetings.find((g) => g.id === selectedId).language,
          translation: greetings.find((g) => g.id === selectedId).translation,
          playing: false,
        };
      },
    });
  }
  return {
    openCatalog,
    setReduced(value) { reducedMotion = value; personalRecords.setReduced(value); },
    pause() {
      audio.pause();
      personalRecords.pause();
    },
    dispose() {
      disposed = true;
      selectionRevision++;
      lifecycle.abort();
      container.removeEventListener("compare-greeting-country", compareCountry);
      audio.pause();
      audio.removeAttribute("src");
      audio.load();
      personalRecords.dispose();
    },
  };
}
