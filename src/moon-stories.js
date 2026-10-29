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

const shipMarkup = () => `<span class="scroll-journey-ship" role="img" aria-label="Academy crew ship following the route as you scroll">
  <span class="scroll-ship-sprite"><svg viewBox="0 0 64 38" aria-hidden="true" focusable="false"><path class="ship-hull" d="M4 20 24 10 45 4l-7 13 22 3-22 4 7 11-21-8z"/><path class="ship-window" d="M25 14h10l-4 7H21z"/><path class="ship-wing" d="m28 24 13 10-5-12z"/><path class="ship-flame" d="m13 17-11-7 5 10-5 9 11-6z"/></svg></span>
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
    stop.querySelectorAll(".route-stop-state").forEach((node) => node.remove());
    const stateHost = stop.querySelector(".diagram-callout") || stop;
    if (isCurrent) stateHost.insertAdjacentHTML("beforeend", '<span class="route-stop-state">CURRENT STOP</span>');
    else if (isNext) stateHost.insertAdjacentHTML("beforeend", '<span class="route-stop-state">NEXT STOP</span>');
  });
  root.querySelectorAll("[data-visual-stop]").forEach((site) => {
    site.classList.toggle("is-current-site", site.dataset.visualStop === current);
    site.classList.toggle("is-next-site", site.dataset.visualStop === next);
  });
  const status = root.querySelector(".journey-progress-status");
  if (status) status.textContent = "Journey position updated. All stops remain open.";
}

function mountScrollJourney(root) {
  const field = root.querySelector(".location-map-field");
  const route = root.querySelector(".journey-scroll-route");
  const path = root.querySelector(".journey-path-line");
  const progressPath = root.querySelector(".journey-path-progress");
  const ship = root.querySelector(".scroll-journey-ship");
  const sprite = root.querySelector(".scroll-ship-sprite");
  const scenes = [...root.querySelectorAll("[data-journey-scene]")];
  if (!field || !route || !path || !ship) return { dispose() {} };
  let frame = 0;
  let lastScrollY = window.scrollY;
  let direction = 1;
  let previousDirection = 1;
  let turnTimer = 0;
  const render = () => {
    frame = 0;
    const bounds = field.getBoundingClientRect();
    const routeBounds = route.getBoundingClientRect();
    const progress = Math.max(0, Math.min(1, (innerHeight * .5 - bounds.top) / bounds.height));
    const length = path.getTotalLength();
    const at = length * progress;
    const point = path.getPointAtLength(at);
    const probe = path.getPointAtLength(Math.max(0, Math.min(length, at + 3)));
    let angle = Math.atan2(probe.y - point.y, probe.x - point.x) * 180 / Math.PI;
    if (direction < 0) angle += 180;
    const x = routeBounds.left - bounds.left + point.x / 1000 * routeBounds.width;
    const y = routeBounds.top - bounds.top + point.y / 2600 * routeBounds.height;
    ship.style.transform = `translate3d(${x - 32}px, ${y - 19}px, 0) rotate(${angle}deg)`;
    progressPath?.style.setProperty("--route-progress", String(progress));
    const sceneIndex = Math.max(0, Math.min(scenes.length - 1, Math.round(progress * (scenes.length - 1))));
    scenes.forEach((scene, index) => scene.classList.toggle("is-in-view", index === sceneIndex));
  };
  const schedule = () => { if (!frame) frame = requestAnimationFrame(render); };
  const onScroll = () => {
    const delta = window.scrollY - lastScrollY;
    if (Math.abs(delta) > 1) direction = delta > 0 ? 1 : -1;
    if (direction !== previousDirection) {
      previousDirection = direction;
      sprite?.classList.remove("is-turning");
      void sprite?.offsetWidth;
      sprite?.classList.add("is-turning");
      clearTimeout(turnTimer);
      turnTimer = window.setTimeout(() => sprite?.classList.remove("is-turning"), 460);
    }
    lastScrollY = window.scrollY;
    schedule();
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", schedule);
  render();
  return {
    dispose() {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", schedule);
      cancelAnimationFrame(frame);
      clearTimeout(turnTimer);
    },
  };
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
    <div class="location-map-heading"><div><p class="eyebrow">WHERE THEY ARE</p><h2 id="location-map-title">One route. Four honest scales.</h2></div><div><p>Earth is the origin. Each stop below is a labeled scale inset—not another planet on one continuous scale.</p><p class="scroll-flight-instruction">Scroll to fly outward · Scroll up to turn home</p></div></div>
    <div class="location-map-field" role="group" aria-label="Scroll journey from Earth to the Moon, Mars, Webb, and Voyager">
      <svg class="journey-scroll-route" viewBox="0 0 1000 2600" preserveAspectRatio="none" aria-hidden="true">
        <path class="journey-path-glow" d="M500 100 C760 250 790 420 620 590 C430 790 220 860 340 1100 C480 1360 780 1350 650 1600 C530 1840 250 1900 360 2160 C440 2350 650 2410 770 2530"/>
        <path class="journey-path-line" d="M500 100 C760 250 790 420 620 590 C430 790 220 860 340 1100 C480 1360 780 1350 650 1600 C530 1840 250 1900 360 2160 C440 2350 650 2410 770 2530"/>
        <path class="journey-path-progress" pathLength="1" d="M500 100 C760 250 790 420 620 590 C430 790 220 860 340 1100 C480 1360 780 1350 650 1600 C530 1840 250 1900 360 2160 C440 2350 650 2410 770 2530"/>
      </svg>
      ${shipMarkup()}
      <div class="journey-scenes">
        <article class="journey-scene scene-earth" data-journey-scene="earth">
          <div class="scene-scale"><span>START · EARTH</span><small>ORIGIN</small></div>
          <div class="earth-origin" data-journey-stop="earth" data-visual-stop="earth" aria-label="You are here: Earth"><i aria-hidden="true"></i><span><strong>YOU ARE HERE</strong><small>EARTH · START</small></span></div>
          <p>This is the only Earth on the route. The diagrams that follow change scale so each relationship stays readable.</p>
        </article>

        <article class="journey-scene scene-moon" data-journey-scene="moon" data-frontier="moon" aria-labelledby="frontier-moon-title">
          <div class="scene-heading"><div><span>01 · MOON</span><h3 id="frontier-moon-title">Earth and its Moon</h3></div><a href="https://science.nasa.gov/moon/by-the-numbers/" target="_blank" rel="noopener">≈ 384,400 km from Earth · NASA ↗</a></div>
          <p class="scale-key">LOCAL INSET · EARTH–MOON SYSTEM · NOT TO SCALE</p>
          <div class="system-canvas moon-system">
            <span class="diagram-body diagram-earth"><i></i><small>EARTH</small></span>
            <span class="moon-orbit" aria-hidden="true"></span>
            <span class="diagram-body diagram-moon"><i></i><small>MOON</small></span>
            <svg class="diagram-leaders" viewBox="0 0 500 250" preserveAspectRatio="none" aria-hidden="true"><path d="M245 88 C310 70 326 58 348 58"/><path d="M272 157 C318 177 329 187 348 187"/></svg>
            <button class="diagram-pin moon-apollo" data-map-moon="apollo17" data-journey-stop="apollo17" data-visual-stop="apollo17" aria-label="Open Apollo 17 Lunar Roving Vehicle Moon story"><i></i><span class="diagram-callout"><strong>Apollo 17 LRV</strong><small>TAURUS–LITTROW · STORY</small></span></button>
            <button class="diagram-pin moon-surveyor" data-map-moon="surveyor3" data-journey-stop="surveyor3" data-visual-stop="surveyor3" aria-label="Open Surveyor 3 Moon story"><i></i><span class="diagram-callout"><strong>Surveyor 3</strong><small>OCEANUS PROCELLARUM · STORY</small></span></button>
          </div>
        </article>

        <article class="journey-scene scene-mars" data-journey-scene="mars" data-frontier="mars" aria-labelledby="frontier-mars-title">
          <div class="scene-heading"><div><span>02 · MARS</span><h3 id="frontier-mars-title">From Earth to Mars</h3></div><a href="https://science.nasa.gov/wp-content/uploads/2024/03/44745_mro-arrival.pdf" target="_blank" rel="noopener">≈ 7 months by spacecraft · NASA ↗</a></div>
          <p class="scale-key">TRANSFER INSET · DISTANCE CHANGES AS BOTH PLANETS ORBIT</p>
          <div class="system-canvas mars-system">
            <span class="diagram-body mars-earth"><i></i><small>EARTH</small></span>
            <svg class="mars-transfer" viewBox="0 0 500 250" preserveAspectRatio="none" aria-hidden="true"><path d="M86 135 C164 38 250 39 309 103"/><path class="transfer-arrow" d="m298 89 13 15-19 2"/></svg>
            <span class="diagram-body diagram-mars"><i></i><small>MARS</small></span>
            <svg class="diagram-leaders" viewBox="0 0 500 250" preserveAspectRatio="none" aria-hidden="true"><path d="M340 83 C389 62 404 56 423 56"/><path d="M320 154 C376 178 399 188 423 188"/></svg>
            <button class="diagram-pin mars-curiosity" data-map-exhibit="curiosity" data-journey-stop="curiosity" data-visual-stop="curiosity" aria-label="Open Curiosity training module"><i></i><span class="diagram-callout"><strong>Curiosity</strong><small>GALE CRATER · TRAINING</small></span></button>
            <button class="diagram-pin mars-ingenuity" data-map-exhibit="ingenuity" data-journey-stop="ingenuity" data-visual-stop="ingenuity" aria-label="Open Ingenuity training module"><i></i><span class="diagram-callout"><strong>Ingenuity</strong><small>JEZERO CRATER · TRAINING</small></span></button>
          </div>
        </article>

        <article class="journey-scene scene-webb" data-journey-scene="webb" data-frontier="deep-space" aria-labelledby="frontier-webb-title">
          <div class="scene-heading"><div><span>03 · WEBB</span><h3 id="frontier-webb-title">Sun, Earth, then L2</h3></div><a href="https://science.nasa.gov/mission/webb/orbit/" target="_blank" rel="noopener">≈ 1.5 million km from Earth · NASA ↗</a></div>
          <p class="scale-key">LOCAL INSET · SUN–EARTH L2 · NOT TO SCALE</p>
          <div class="system-canvas webb-system">
            <span class="diagram-sun"><i></i><small>SUN</small></span>
            <span class="sun-earth-line" aria-hidden="true"></span>
            <span class="diagram-body webb-earth"><i></i><small>EARTH</small></span>
            <span class="l2-marker"><i></i><small>L2</small></span>
            <button class="diagram-pin webb-pin" data-map-exhibit="webb" data-journey-stop="webb" data-visual-stop="webb" aria-label="Open Webb training module"><i></i><span class="diagram-callout"><strong>Webb</strong><small>ORBITS L2 · TRAINING</small></span></button>
            <p class="diagram-note">L2 and Webb are on the side of Earth away from the Sun.</p>
          </div>
        </article>

        <article class="journey-scene scene-voyager" data-journey-scene="voyager" data-frontier="deep-space" aria-labelledby="frontier-voyager-title">
          <div class="scene-heading"><div><span>04 · VOYAGER 1</span><h3 id="frontier-voyager-title">Beyond the Sun's protective bubble</h3></div><a href="https://science.nasa.gov/mission/voyager/voyager-1/voyager-1-what-is-a-light-day/" target="_blank" rel="noopener">Almost one light-day from Earth · NASA ↗</a></div>
          <p class="scale-key">SOLAR-SYSTEM INSET · DISTANCES COMPRESSED</p>
          <div class="system-canvas voyager-system">
            <span class="voyager-sun"><i></i><small>SUN</small></span>
            <span class="solar-orbit orbit-one"></span><span class="solar-orbit orbit-two"></span><span class="solar-orbit orbit-three"></span>
            <span class="heliopause"><small>HELIOPAUSE</small></span>
            <svg class="voyager-outbound" viewBox="0 0 500 250" preserveAspectRatio="none" aria-hidden="true"><path d="M250 135 C315 119 349 89 392 61"/><path class="transfer-arrow" d="m378 58 16 2-7 15"/></svg>
            <button class="diagram-pin voyager-pin" data-map-exhibit="voyager" data-journey-stop="voyager" data-visual-stop="voyager" aria-label="Open Voyager training module"><i></i><span class="diagram-callout"><strong>Voyager 1</strong><small>INTERSTELLAR SPACE · TRAINING</small></span></button>
          </div>
        </article>
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
  let activeProgress = clampJourneyProgress(journeyProgress);
  updateJourneyRoute(root, activeProgress);
  const scrollJourney = mountScrollJourney(root);
  const animateTo = async (stop) => {
    const target = root.querySelector(`[data-visual-stop="${stop}"]`)?.closest("[data-journey-scene]");
    if (!target) return false;
    target.scrollIntoView({ behavior: document.body.classList.contains("motion-reduced") ? "instant" : "smooth", block: "center" });
    if (!document.body.classList.contains("motion-reduced")) await new Promise((resolve) => window.setTimeout(resolve, 640));
    return true;
  };
  const click = (event) => {
    const exhibit = event.target.closest("[data-map-exhibit]");
    const moon = event.target.closest("[data-map-moon]");
    const stop = exhibit?.dataset.mapExhibit || moon?.dataset.mapMoon;
    if (!stop) return;
    if (exhibit) onExhibit(stop, exhibit);
    else onMoon(stop, moon);
  };
  root.addEventListener("click", click);
  return {
    animateTo,
    setProgress(progress) {
      activeProgress = clampJourneyProgress(progress);
      updateJourneyRoute(root, activeProgress);
    },
    dispose() {
      root.removeEventListener("click", click);
      scrollJourney.dispose();
    },
  };
}
