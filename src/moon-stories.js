export const moonStories = Object.freeze({
  apollo17: Object.freeze({
    name: "Apollo 17 Lunar Roving Vehicle",
    year: "1972 · TAURUS-LITTROW VALLEY",
    facts: Object.freeze([
      ["WHAT IT IS", "The last car humans drove on another world: a battery-powered, two-seat vehicle used by Gene Cernan and Harrison Schmitt during Apollo 17."],
      ["WHY IT WENT", "It carried astronauts, tools, and samples so the crew could explore farther across the Taurus-Littrow valley."],
      ["WHAT IT DID", "Across three moonwalks, it helped the crew survey the valley, set up experiments, and collect lunar material."],
      ["WHERE IT IS NOW", "Cernan parked it at its final spot so its television camera could show the lunar module lifting off. It is still there on the Moon."],
    ]),
    sources: Object.freeze([
      ["NASA · Apollo 17 mission details", "https://www.nasa.gov/missions/apollo/apollo-17-mission-details/"],
      ["NASA · Apollo 17 at Taurus-Littrow", "https://www.nasa.gov/history/50-years-ago-apollo-17-lands-at-taurus-littrow/"],
    ]),
    reveal: Object.freeze({
      fact: "NASA's Apollo 17 mission summary records 30.5 kilometers of travel by the lunar rover across the Taurus-Littrow valley.",
      image: "/assets/moon-apollo17-lrv.jpg",
      alt: "Apollo 17 commander Gene Cernan driving the Lunar Roving Vehicle on the Moon, with the lunar module behind him.",
      credit: "Image credit: NASA/Harrison Schmitt",
      source: ["NASA · Apollo 17 LRV image", "https://science.nasa.gov/resource/apollo-17-gene-cernan-in-lunar-roving-vehicle/"],
    }),
  }),
  surveyor3: Object.freeze({
    name: "Surveyor 3",
    year: "1967 · OCEANUS PROCELLARUM",
    facts: Object.freeze([
      ["WHAT IT IS", "An uncrewed NASA lander that reached the Moon's Oceanus Procellarum in April 1967."],
      ["WHY IT WENT", "It tested a soft landing and studied the surface so NASA could prepare for future Apollo crews."],
      ["WHAT IT DID", "It sent more than 6,000 pictures and used a scoop to examine lunar soil."],
      ["WHERE IT IS NOW", "Apollo 12 astronauts visited it in 1969 and brought its television camera and soil scoop to Earth for study. Most of Surveyor 3 remains on the Moon."],
    ]),
    sources: Object.freeze([
      ["NASA · Humans and machine meet on the Moon", "https://science.nasa.gov/solar-system/moon/footpads-and-footprints-humans-and-machine-meet-on-the-moon/"],
      ["NASA JPL · Surveyor 3 camera returned", "https://www.jpl.nasa.gov/blog/2012/1/surveyor-3-camera-returned-from-the-moon"],
    ]),
    reveal: Object.freeze({
      fact: "This was the first—and so far only—time humans met a robotic spacecraft on another world. Apollo 12 brought Surveyor 3's television camera and soil scoop home to Earth.",
      image: "/assets/moon-surveyor3-apollo12.jpg",
      alt: "Surveyor 3 resting inside its lunar crater, photographed by Apollo 12 astronauts in 1969.",
      credit: "Image credit: NASA/JSC",
      source: ["NASA · Surveyor 3 in its crater", "https://science.nasa.gov/resource/view-of-surveyor-iii-in-its-crater/"],
    }),
  }),
});

export const journeyStops = Object.freeze([
  "earth",
  "apollo17",
  "surveyor3",
  "curiosity",
  "ingenuity",
  "webb",
  "voyager",
]);

const shipMarkup = () => `<span class="journey-ship" role="img" aria-label="Academy crew ship at the current stop">
  <svg viewBox="0 0 52 30" aria-hidden="true" focusable="false"><path d="M3 16 20 8 36 3l-5 10 17 3-17 3 5 9-16-6z"/><path class="ship-window" d="M21 12h8l-3 5h-8z"/><path class="ship-flame" d="m10 14-8-5 4 7-4 6 8-4z"/></svg>
</span>`;

function clampJourneyProgress(progress) {
  const value = Number.parseInt(progress, 10);
  return Number.isFinite(value) ? Math.max(0, Math.min(journeyStops.length - 1, value)) : 0;
}

function updateJourneyRoute(root, progress) {
  const index = clampJourneyProgress(progress);
  const current = journeyStops[index];
  const next = journeyStops[index + 1] || null;
  root.querySelectorAll("[data-journey-stop]").forEach((stop) => {
    const isCurrent = stop.dataset.journeyStop === current;
    const isNext = stop.dataset.journeyStop === next;
    stop.classList.toggle("is-current-stop", isCurrent);
    stop.classList.toggle("is-next-stop", isNext);
    stop.querySelectorAll(":scope > .journey-ship, :scope > .route-stop-state").forEach((node) => node.remove());
    if (isCurrent) stop.insertAdjacentHTML("beforeend", `${shipMarkup()}<span class="route-stop-state">CURRENT STOP</span>`);
    else if (isNext) stop.insertAdjacentHTML("beforeend", '<span class="route-stop-state">NEXT STOP</span>');
  });
  const status = root.querySelector(".journey-progress-status");
  if (status) status.textContent = "Journey position updated. All stops remain open.";
}

const storyCard = (id, story) => `<article class="module-story-card moon-story-card" data-moon-story="${id}" aria-labelledby="moon-${id}-title">
  <button type="button" class="moon-story-flip" aria-expanded="false" aria-controls="moon-${id}-reveal">
    <span class="moon-story-face moon-story-front">
      <span class="eyebrow">${story.year}</span>
      <span class="moon-story-title" id="moon-${id}-title" role="heading" aria-level="3" tabindex="-1">${story.name}</span>
      <span class="moon-story-facts">${story.facts.map(([label, copy]) => `<span><strong>${label}</strong><span>${copy}</span></span>`).join("")}</span>
      <span class="moon-reveal-prompt">Tap to reveal one more Moon fact →</span>
    </span>
    <span class="moon-story-face moon-story-back" id="moon-${id}-reveal" hidden>
      <span class="eyebrow">MOON ARCHIVE REVEAL</span>
      <span class="moon-story-title">${story.name}</span>
      <img src="${story.reveal.image}" alt="${story.reveal.alt}" width="1800" height="1200" loading="lazy" decoding="async">
      <span class="moon-reveal-fact">${story.reveal.fact}</span>
      <small>${story.reveal.credit}</small>
      <span class="moon-reveal-prompt">Tap to return to the story →</span>
    </span>
  </button>
  <p class="moon-story-sources"><strong>OFFICIAL SOURCES</strong>${[...story.sources, story.reveal.source].map(([label, href]) => `<a href="${href}" target="_blank" rel="noopener">${label} ↗</a>`).join("")}</p>
</article>`;

export function moonPanelMarkup() {
  return `<dialog class="moon-panel" id="moon-panel" aria-labelledby="moon-panel-title">
    <div class="dialog-top"><p class="eyebrow">VOYAGE PROLOGUE · MOON STORY ARCHIVE · NO STAMP</p><button type="button" id="moon-panel-close" aria-label="Close Moon stories">Close</button></div>
    <h2 id="moon-panel-title">Two machines still on the Moon</h2>
    <p class="moon-panel-intro">Your crew's voyage begins here. These are short story stops, not training modules, and your certification still has exactly four stamps.</p>
    <div class="moon-story-grid">${Object.entries(moonStories).map(([id, story]) => storyCard(id, story)).join("")}</div>
  </dialog>`;
}

export function locationMapMarkup() {
  return `<section class="location-map" aria-labelledby="location-map-title">
    <div class="location-map-heading"><div><p class="eyebrow">WHERE THEY ARE</p><h2 id="location-map-title">Six machines, three frontiers</h2></div><p>The four training machines remain the path to certification. Open two extra Moon stories without adding a stamp.</p></div>
    <div class="location-map-field" role="group" aria-label="Schematic locations of the six machines">
      <span class="journey-route-line" aria-hidden="true"></span>
      <div class="location-journey">
        <div class="earth-marker" data-journey-stop="earth" aria-label="You are here: Earth"><i aria-hidden="true"></i><span><strong>YOU ARE HERE</strong><small>EARTH · START</small></span></div>
        <section class="frontier frontier-moon" data-frontier="moon" aria-labelledby="frontier-moon-title">
          <div class="frontier-heading"><span id="frontier-moon-title">01 · MOON</span><a href="https://science.nasa.gov/moon/by-the-numbers/" target="_blank" rel="noopener">≈ 384,400 km from Earth · NASA ↗</a></div>
          <div class="frontier-stops">
            <button class="location-dot is-moon" data-map-moon="apollo17" data-journey-stop="apollo17" aria-label="Open Apollo 17 Lunar Roving Vehicle Moon story"><i aria-hidden="true"></i><span>Apollo 17 LRV<small>MOON STORY</small></span></button>
            <button class="location-dot is-moon" data-map-moon="surveyor3" data-journey-stop="surveyor3" aria-label="Open Surveyor 3 Moon story"><i aria-hidden="true"></i><span>Surveyor 3<small>MOON STORY</small></span></button>
          </div>
        </section>
        <section class="frontier frontier-mars" data-frontier="mars" aria-labelledby="frontier-mars-title">
          <div class="frontier-heading"><span id="frontier-mars-title">02 · MARS</span><a href="https://science.nasa.gov/wp-content/uploads/2024/03/44745_mro-arrival.pdf" target="_blank" rel="noopener">≈ 7 months by spacecraft · NASA ↗</a></div>
          <div class="frontier-stops">
            <button class="location-dot is-mars" data-map-exhibit="curiosity" data-journey-stop="curiosity" aria-label="Open Curiosity training module"><i aria-hidden="true"></i><span>Curiosity<small>MARS · TRAINING</small></span></button>
            <button class="location-dot is-mars" data-map-exhibit="ingenuity" data-journey-stop="ingenuity" aria-label="Open Ingenuity training module"><i aria-hidden="true"></i><span>Ingenuity<small>MARS · TRAINING</small></span></button>
          </div>
        </section>
        <section class="frontier frontier-deep" data-frontier="deep-space" aria-labelledby="frontier-deep-title">
          <div class="frontier-heading"><span id="frontier-deep-title">03 · DEEP SPACE</span><span class="frontier-distance-pair"><a href="https://science.nasa.gov/mission/webb/orbit/" target="_blank" rel="noopener">Webb · ≈ 1.5 million km · Sun–Earth L2 · NASA ↗</a><a href="https://science.nasa.gov/mission/voyager/voyager-1/voyager-1-what-is-a-light-day/" target="_blank" rel="noopener">Voyager 1 · Almost one light-day from Earth · NASA ↗</a></span></div>
          <div class="frontier-stops">
            <button class="location-dot is-deep" data-map-exhibit="webb" data-journey-stop="webb" aria-label="Open Webb training module"><i aria-hidden="true"></i><span>Webb<small>DEEP SPACE · TRAINING</small></span></button>
            <button class="location-dot is-deep" data-map-exhibit="voyager" data-journey-stop="voyager" aria-label="Open Voyager training module"><i aria-hidden="true"></i><span>Voyager 1<small>INTERSTELLAR · TRAINING</small></span></button>
          </div>
        </section>
      </div>
      <p class="sr-only journey-progress-status" aria-live="polite"></p>
    </div>
    <p class="fine location-map-credit">Schematic: Mission Alive · not to scale. <a href="https://science.nasa.gov/mission/webb/webbs-first-images/" target="_blank" rel="noopener">Background: Webb's First Deep Field · NASA, ESA, CSA, STScI ↗</a></p>
  </section>`;
}

export function mountMoonPanel(root) {
  root.innerHTML = moonPanelMarkup();
  const dialog = root.querySelector("#moon-panel");
  const closeButton = root.querySelector("#moon-panel-close");
  let returnFocus = null;
  const close = () => dialog.close();
  closeButton.addEventListener("click", close);
  for (const card of root.querySelectorAll(".moon-story-card")) {
    const flip = card.querySelector(".moon-story-flip");
    const front = card.querySelector(".moon-story-front");
    const back = card.querySelector(".moon-story-back");
    flip.addEventListener("click", () => {
      const revealed = flip.getAttribute("aria-expanded") !== "true";
      flip.setAttribute("aria-expanded", String(revealed));
      card.classList.toggle("is-revealed", revealed);
      front.hidden = revealed;
      back.hidden = !revealed;
    });
  }
  dialog.addEventListener("click", (event) => { if (event.target === dialog) close(); });
  dialog.addEventListener("close", () => {
    if (returnFocus?.isConnected) returnFocus.focus({ preventScroll: true });
    returnFocus = null;
  });
  return {
    dialog,
    open(id, trigger) {
      if (!moonStories[id]) return false;
      returnFocus = trigger || document.activeElement;
      if (!dialog.open) dialog.showModal();
      const heading = dialog.querySelector(`#moon-${id}-title`);
      heading?.scrollIntoView({ block: "center", behavior: "instant" });
      heading?.focus({ preventScroll: true });
      return true;
    },
  };
}

export function mountLocationMap(root, { onExhibit = () => {}, onMoon = () => {}, journeyProgress = 0 } = {}) {
  root.innerHTML = locationMapMarkup();
  updateJourneyRoute(root, journeyProgress);
  const click = (event) => {
    const exhibit = event.target.closest("[data-map-exhibit]");
    if (exhibit) return onExhibit(exhibit.dataset.mapExhibit, exhibit);
    const moon = event.target.closest("[data-map-moon]");
    if (moon) onMoon(moon.dataset.mapMoon, moon);
  };
  root.addEventListener("click", click);
  return {
    setProgress(progress) { updateJourneyRoute(root, progress); },
    dispose() { root.removeEventListener("click", click); },
  };
}
