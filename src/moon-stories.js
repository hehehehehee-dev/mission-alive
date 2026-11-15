import { mountJourneyGlobes } from './journey-globes.js';
import { moonLabMarkup, mountMoonLabs } from './moon-labs.js';
import { trainingMissions } from './certification.js';

function routeMissionNavigationMarkup() {
  return `<nav class="exhibits moon-route-modules" aria-label="Choose a training module" hidden>${Object.entries(trainingMissions)
    .map(([id, mission], index) => `<button type="button" data-route-mission="${id}"><span class="number">0${index + 1}</span><span><span class="module-number">TRAINING MODULE ${index + 1}</span><strong>${mission.name}</strong><small>${mission.action} · Discover <span class="current-marker" hidden>(current)</span></small></span><span class="done" aria-label="Completed" hidden>✦</span></button>`)
    .join('')}</nav>`;
}

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
    callback: "On the same Moon, Surveyor 3 is still standing where Apollo 12 visited it.",
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
    callback: "On the same Moon, Apollo 17's rover is still parked where its crew left it.",
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

const journeyRoutes = {
  desktop: 'M480 180 C520 400 550 530 570 700 S120 890 220 1120 S880 1300 880 1580 S140 1810 220 2100 S790 2290 660 2590 S260 2870 420 3100 S750 3260 790 3340',
  mobile: 'M850 180 C620 400 150 530 220 700 S290 890 230 1120 S290 1300 250 1580 S180 1810 250 2100 S310 2290 240 2590 S180 2870 300 3100 S550 3260 790 3340',
};

const shipMarkup = () => `<span class="scroll-journey-ship" role="img" aria-label="Academy crew ship following the route as you scroll">
  <span class="scroll-ship-heading"><span class="scroll-ship-sprite">
    <svg viewBox="0 0 144 96" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="crew-hull" x2="0" y2="1"><stop stop-color="#fffef6"/><stop offset=".48" stop-color="#e6edf1"/><stop offset="1" stop-color="#8faabc"/></linearGradient>
        <linearGradient id="crew-glass" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#b8faff"/><stop offset=".4" stop-color="#39badb"/><stop offset="1" stop-color="#134565"/></linearGradient>
        <linearGradient id="crew-exhaust"><stop stop-color="#68d9ff" stop-opacity="0"/><stop offset=".55" stop-color="#8ce6ff"/><stop offset="1" stop-color="#fff5d1"/></linearGradient>
      </defs>
      <g class="ship-exhaust"><path d="M4 34Q14 22 34 28V38Q14 43 4 34"/><path d="M4 62Q14 53 34 58V68Q14 74 4 62"/></g>
      <path class="ship-fin" d="M55 35 30 5 52 8 94 33M55 61 30 91 52 88 94 63"/>
      <path class="ship-engine" d="M28 23h29l14 10-14 10H28zM28 53h29l14 10-14 10H28z"/>
      <path class="ship-hull" d="M39 34Q76 12 112 32L137 48 112 64Q76 84 39 62L48 48z"/>
      <path class="ship-nose" d="M111 32Q128 37 137 48L111 64 119 48z"/>
      <path class="ship-window" d="M72 34Q91 27 108 39L111 48 104 56Q88 67 72 58L66 48z"/>
      <path class="ship-glint" d="M76 36Q88 32 99 37M72 40l-2 7"/>
      <path class="ship-seam" d="m58 34 5 14-5 15M49 48h15M114 43h10M114 53h10"/>
      <path class="ship-stripe" d="m46 36 7-3 5 12-7 2zm5 14 7 2-5 12-7-3z"/>
      <circle cx="59" cy="48" r="2" fill="#ffbd61"/>
    </svg>
  </span></span>
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
  const heading = root.querySelector(".scroll-ship-heading");
  const scenes = [...root.querySelectorAll("[data-journey-scene]")];
  if (!field || !route || !path || !ship) return { dispose() {} };
  let frame = 0;
  let lastScrollY = window.scrollY;
  let direction = 1;
  let directionTravel = 0;
  let previousTime = 0;
  let currentLength = null;
  let currentAngle = null;
  let disposed = false;
  let length = path.getTotalLength();
  const resizeRoute = () => {
    const shape = innerWidth <= 680 ? journeyRoutes.mobile : journeyRoutes.desktop;
    route.querySelectorAll('path').forEach(node => node.setAttribute('d', shape));
    length = path.getTotalLength();
    currentLength = null;
    schedule();
  };
  const render = (time = performance.now()) => {
    frame = 0;
    const bounds = field.getBoundingClientRect();
    const routeBounds = route.getBoundingClientRect();
    if (disposed || !routeBounds.width || !bounds.height) return;
    const reducedMotion = document.body.classList.contains('motion-reduced') || matchMedia('(prefers-reduced-motion: reduce)').matches;
    const dt = Math.min(40, Math.max(1, time - (previousTime || time - 16.7)));
    previousTime = time;
    const progress = Math.max(0, Math.min(1, (innerHeight * .54 - bounds.top) / bounds.height));
    // Match the viewport's vertical position, even where the route bends sideways.
    const targetY = progress * 3400;
    let lower = 0;
    let upper = length;
    for (let step = 0; step < 14; step++) {
      const middle = (lower + upper) / 2;
      if (path.getPointAtLength(middle).y < targetY) lower = middle;
      else upper = middle;
    }
    const targetLength = (lower + upper) / 2;
    currentLength = currentLength === null || reducedMotion ? targetLength : currentLength + (targetLength - currentLength) * (1 - Math.exp(-dt / 90));
    const point = path.getPointAtLength(currentLength);
    const before = path.getPointAtLength(Math.max(0, currentLength - 3));
    const after = path.getPointAtLength(Math.min(length, currentLength + 3));
    let angle = Math.atan2((after.y - before.y) * routeBounds.height / 3400, (after.x - before.x) * routeBounds.width / 1000) * 180 / Math.PI;
    if (direction < 0) angle += 180;
    if (currentAngle === null) currentAngle = angle;
    const angleDelta = (((angle - currentAngle + 180) % 360) + 360) % 360 - 180;
    currentAngle = reducedMotion ? angle : currentAngle + angleDelta * (1 - Math.exp(-dt / 175));
    const x = routeBounds.left - bounds.left + point.x / 1000 * routeBounds.width;
    const y = routeBounds.top - bounds.top + point.y / 3400 * routeBounds.height;
    ship.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    heading.style.transform = `rotate(${currentAngle}deg)`;
    ship.style.setProperty('--ship-bank', `${Math.max(-14, Math.min(14, angleDelta * .12))}deg`);
    ship.dataset.flightDirection = direction > 0 ? 'outward' : 'homeward';
    progressPath?.style.setProperty("--route-progress", String(currentLength / length));
    const sceneIndex = scenes.reduce((nearest, scene, index) => Math.abs(scene.getBoundingClientRect().top + scene.offsetHeight / 2 - innerHeight * .54) < Math.abs(scenes[nearest].getBoundingClientRect().top + scenes[nearest].offsetHeight / 2 - innerHeight * .54) ? index : nearest, 0);
    scenes.forEach((scene, index) => scene.classList.toggle("is-in-view", index === sceneIndex));
    if (!reducedMotion && (Math.abs(targetLength - currentLength) > .1 || Math.abs(angleDelta) > .1)) schedule();
  };
  const schedule = () => { if (!frame) frame = requestAnimationFrame(render); };
  const onScroll = () => {
    const delta = window.scrollY - lastScrollY;
    if (Math.sign(delta) !== Math.sign(directionTravel)) directionTravel = 0;
    directionTravel += delta;
    // Small trackpad/touch jitter should not repeatedly flip the spacecraft.
    if (Math.abs(directionTravel) > 18) {
      direction = directionTravel > 0 ? 1 : -1;
      directionTravel = Math.max(-80, Math.min(80, directionTravel));
    }
    lastScrollY = window.scrollY;
    schedule();
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", resizeRoute);
  resizeRoute();
  return {
    dispose() {
      disposed = true;
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", resizeRoute);
      cancelAnimationFrame(frame);
    },
  };
}

const storyCard = (id, story) => `<article class="module-story-card moon-story-card" data-moon-story="${id}" aria-labelledby="moon-${id}-title">
  <button type="button" class="moon-story-flip" aria-expanded="false" aria-controls="moon-${id}-reveal">
    <span class="moon-story-face moon-story-front">
      <span class="eyebrow">${story.year}</span>
      <span class="moon-story-title" id="moon-${id}-title" role="heading" aria-level="3" tabindex="-1">${story.name}</span>
      <span class="moon-story-facts">${story.facts.map(([label, copy]) => `<span><strong>${label}</strong><span>${copy}</span></span>`).join("")}</span>
      <span class="moon-story-callback">${story.callback}</span>
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
    <div class="dialog-top"><p class="eyebrow">MOON TRAINING · TWO MISSIONS · TWO STAMPS</p><button type="button" id="moon-panel-close" aria-label="Close Moon training">Close</button></div>
    ${routeMissionNavigationMarkup()}
    <h2 id="moon-panel-title">Two machines still on the Moon</h2>
    <p class="moon-panel-intro">Your crew's voyage begins here. Repair a rover and investigate the ground. Earn two Moon stamps toward your six-mission certification.</p>
    <div class="moon-route-summary" id="moon-route-summary" hidden><p class="eyebrow" id="moon-route-year"></p><section class="mission-opening moon-route-opening" aria-labelledby="moon-panel-title"><figure class="moon-route-photo mission-opening-view"><div class="mission-opening-photo"><img alt="" decoding="async"></div><figcaption><a target="_blank" rel="noopener"></a></figcaption></figure><div><dl class="mission-opening-beats"><div><dt>Built for</dt><dd id="moon-route-purpose"></dd></div><div><dt>It did</dt><dd id="moon-route-did"></dd></div></dl><a class="moon-route-source" id="moon-route-source" target="_blank" rel="noopener"></a></div></section></div>
    ${moonLabMarkup()}
    <div class="moon-story-grid">${Object.entries(moonStories).map(([id, story]) => storyCard(id, story)).join("")}</div>
  </dialog>`;
}

export function locationMapMarkup() {
  return `<section class="location-map" aria-labelledby="location-map-title">
    <div class="location-map-heading"><div><p class="eyebrow">WHERE THEY ARE</p><h2 id="location-map-title">Tap a machine to play</h2></div><div><p>Follow the route. Tap a named button to start its mission.</p><p class="scroll-flight-instruction">Scroll to fly outward · Scroll up to turn home</p><button type="button" class="compare-planets-trigger" data-compare-planets aria-haspopup="dialog" aria-controls="planet-comparison">Put Earth beside Mars ↗</button></div></div>
    <div class="location-map-field" role="group" aria-label="Scroll journey from Earth to the Moon, Mars, Webb, and Voyager">
      <svg class="journey-scroll-route" viewBox="0 0 1000 3400" preserveAspectRatio="none" aria-hidden="true">
        <path class="journey-path-glow" d="${journeyRoutes.desktop}"/>
        <path class="journey-path-line" d="${journeyRoutes.desktop}"/>
        <path class="journey-path-progress" pathLength="1" d="${journeyRoutes.desktop}"/>
      </svg>
      ${shipMarkup()}
      <div class="journey-scenes">
        <article class="journey-scene scene-earth" data-journey-scene="earth">
          <div class="earth-origin" data-journey-stop="earth" data-visual-stop="earth" aria-label="You are here: Earth"><div class="planet-globe earth-globe"><img src="/assets/journey-earth-nasa.jpg" alt="Earth's oceans, continents, and swirling clouds in NASA's Blue Marble composite" width="800" height="800" decoding="async"></div><span class="earth-origin-label"><strong>YOU ARE HERE</strong><small>EARTH · START</small></span></div>
          <div class="scene-copy earth-copy"><p class="eyebrow">START · EARTH</p><h3>Every journey begins at home.</h3><p class="body-diameter">12,756 km</p><p class="scale-key">DIAMETER · OUR SHARED SIZE SCALE</p><a class="planet-credit" href="https://science.nasa.gov/resource/blue-marble-2002/" target="_blank" rel="noopener">Earth image: NASA Earth Observatory ↗</a></div>
        </article>

        <article class="journey-scene scene-moon" data-journey-scene="moon" data-frontier="moon" aria-labelledby="frontier-moon-title">
          <div class="scene-heading"><div><span>01 · MOON</span><h3 id="frontier-moon-title">Earth and its Moon</h3></div><a href="https://science.nasa.gov/moon/by-the-numbers/" target="_blank" rel="noopener">≈ 384,400 km from Earth · NASA ↗</a></div>
          <p class="scale-key">MOON DIAMETER · 3,475 KM · 27% OF EARTH</p>
          <div class="system-canvas moon-system">
            <div class="planet-globe moon-globe"><canvas data-globe="moon" role="img" aria-label="The Moon's near side, rendered from NASA LRO surface imagery"></canvas></div>
            <svg class="diagram-leaders" aria-hidden="true"><path data-leader="apollo17"/><path data-leader="surveyor3"/></svg>
            <button class="diagram-pin moon-apollo" data-map-moon="apollo17" data-journey-stop="apollo17" data-visual-stop="apollo17" aria-label="Open Apollo 17 Lunar Roving Vehicle Moon training"><i></i><span class="diagram-callout"><strong>Apollo 17 LRV</strong><small>TAURUS–LITTROW · TRAINING</small></span></button>
            <button class="diagram-pin moon-surveyor" data-map-moon="surveyor3" data-journey-stop="surveyor3" data-visual-stop="surveyor3" aria-label="Open Surveyor 3 Moon training"><i></i><span class="diagram-callout"><strong>Surveyor 3</strong><small>OCEANUS PROCELLARUM · TRAINING</small></span></button>
          </div>
          <p class="planet-credit"><a href="https://svs.gsfc.nasa.gov/4720/" target="_blank" rel="noopener">Moon surface: NASA SVS / LRO ↗</a></p>
        </article>

        <article class="journey-scene scene-mars" data-journey-scene="mars" data-frontier="mars" aria-labelledby="frontier-mars-title">
          <div class="scene-heading"><div><span>02 · MARS</span><h3 id="frontier-mars-title">From Earth to Mars</h3></div><a href="https://science.nasa.gov/wp-content/uploads/2024/03/44745_mro-arrival.pdf" target="_blank" rel="noopener">≈ 7 months by spacecraft · NASA ↗</a></div>
          <p class="scale-key">MARS DIAMETER · 6,792 KM · 53% OF EARTH</p>
          <div class="system-canvas mars-system">
            <div class="planet-globe mars-globe"><canvas data-globe="mars" role="img" aria-label="Mars rendered from NASA Viking surface imagery"></canvas></div>
            <svg class="diagram-leaders" aria-hidden="true"><path data-leader="curiosity"/><path data-leader="ingenuity"/></svg>
            <button class="diagram-pin mars-curiosity" data-map-exhibit="curiosity" data-journey-stop="curiosity" data-visual-stop="curiosity" aria-label="Open Curiosity training module"><i></i><span class="diagram-callout"><strong>Curiosity</strong><small>GALE CRATER · TRAINING</small></span></button>
            <button class="diagram-pin mars-ingenuity" data-map-exhibit="ingenuity" data-journey-stop="ingenuity" data-visual-stop="ingenuity" aria-label="Open Ingenuity training module"><i></i><span class="diagram-callout"><strong>Ingenuity</strong><small>JEZERO CRATER · TRAINING</small></span></button>
          </div>
          <p class="planet-credit"><a href="https://space.jpl.nasa.gov/tmaps/mars.html" target="_blank" rel="noopener">Mars surface: NASA / JPL / USGS · Viking ↗</a></p>
        </article>

        <article class="journey-scene scene-webb" data-journey-scene="webb" data-frontier="deep-space" aria-labelledby="frontier-webb-title">
          <div class="scene-heading"><div><span>03 · WEBB</span><h3 id="frontier-webb-title">Sun, Earth, then L2</h3></div><a href="https://science.nasa.gov/mission/webb/orbit/" target="_blank" rel="noopener">≈ 1.5 million km from Earth · NASA ↗</a></div>
          <p class="scale-key">LOCAL INSET · SUN–EARTH L2 · NOT TO SCALE</p>
          <div class="system-canvas webb-system">
            <span class="diagram-sun"><i><img class="sun-observation" src="/assets/journey-sun-sdo.jpg" alt="NASA SDO observation of the Sun at 171 angstroms, shown in gold false color" width="4096" height="4096" loading="lazy" decoding="async"></i><small>SUN</small></span>
            <span class="sun-earth-line" aria-hidden="true"></span>
            <span class="diagram-body webb-earth"><img src="/assets/journey-earth-nasa.jpg" alt="" width="800" height="800" loading="lazy"><small>EARTH</small></span>
            <span class="l2-marker"><i></i><small>L2</small></span>
            <button class="diagram-pin webb-pin" data-map-exhibit="webb" data-journey-stop="webb" data-visual-stop="webb" aria-label="Open Webb training module"><i class="webb-miniature" aria-hidden="true"><img src="/assets/journey-webb-esa.png" alt="" width="4096" height="4096" loading="lazy" decoding="async"></i><span class="diagram-callout"><strong>Webb</strong><small>ORBITS L2 · TRAINING</small></span></button>
            <p class="diagram-note">L2 and Webb are on the side of Earth away from the Sun.</p>
          </div>
          <p class="planet-credit orbit-image-credits"><a href="https://science.nasa.gov/photojournal/image-of-sun-from-nasas-solar-dynamics-observatory/" target="_blank" rel="noopener">Sun: NASA/GSFC/SDO · 171 Å, false color ↗</a><a href="https://www.esa.int/ESA_Multimedia/Images/2021/06/Webb_spacecraft_artist_s_impression" target="_blank" rel="noopener">Webb: ©ESA/ATG medialab · artist's impression ↗</a></p>
        </article>

        <article class="journey-scene scene-voyager" data-journey-scene="voyager" data-frontier="deep-space" aria-labelledby="frontier-voyager-title">
          <div class="scene-heading"><div><span>04 · VOYAGER 1</span><h3 id="frontier-voyager-title">Beyond the Sun's protective bubble</h3></div><a href="https://science.nasa.gov/mission/voyager/voyager-1/voyager-1-what-is-a-light-day/" target="_blank" rel="noopener">Almost one light-day from Earth · NASA ↗</a></div>
          <p class="scale-key">SOLAR-SYSTEM INSET · DISTANCES COMPRESSED</p>
          <div class="system-canvas voyager-system">
            <span class="voyager-sun"><i><img class="sun-observation" src="/assets/journey-sun-sdo.jpg" alt="" width="4096" height="4096" loading="lazy" decoding="async"></i><small>SUN</small></span>
            <span class="solar-orbit orbit-one"></span><span class="solar-orbit orbit-two"></span><span class="solar-orbit orbit-three"></span>
            <span class="heliopause"><small>HELIOPAUSE</small></span>
            <svg class="voyager-outbound" viewBox="0 0 500 250" preserveAspectRatio="none" aria-hidden="true"><path d="M250 135 C315 119 349 89 392 61"/><path class="transfer-arrow" d="m378 58 16 2-7 15"/></svg>
            <button class="diagram-pin voyager-pin" data-map-exhibit="voyager" data-journey-stop="voyager" data-visual-stop="voyager" aria-label="Open Voyager training module"><i class="voyager-miniature" aria-hidden="true"><svg viewBox="0 0 96 90"><path d="m28 50-17 27M49 46l32 31M43 34l17-25M60 9l9-5M41 49l-4 25" fill="none" stroke="#c8d6df" stroke-width="3"/><path d="m25 44 17-8 14 11-17 9z" fill="#bd944a"/><ellipse cx="37" cy="31" rx="24" ry="13" transform="rotate(-24 37 31)" fill="#f1eee2" stroke="#8696a2" stroke-width="2"/><path d="m17 38 17-25 22 8" fill="none" stroke="#9caab3" stroke-width="2"/><circle cx="34" cy="23" r="3" fill="#526c7c"/></svg></i><span class="diagram-callout"><strong>Voyager 1</strong><small>INTERSTELLAR SPACE · TRAINING</small></span></button>
          </div>
          <p class="planet-credit"><a href="https://science.nasa.gov/photojournal/image-of-sun-from-nasas-solar-dynamics-observatory/" target="_blank" rel="noopener">Sun: NASA/GSFC/SDO · 171 Å, false color ↗</a></p>
        </article>
      </div>
      <p class="sr-only journey-progress-status" aria-live="polite"></p>
    </div>
    <p class="fine location-map-credit"><a href="https://nssdc.gsfc.nasa.gov/planetary/factsheet/" target="_blank" rel="noopener">Size scale: NASA Planetary Fact Sheet ↗</a><span>Earth, the Moon, and Mars share one size scale. The space between stops is compressed; the Webb orbit view changes scale.</span><span>Distances compressed. Landing sites are approximate. Spacecraft illustrations are enlarged.</span><a href="https://science.nasa.gov/mission/webb/webbs-first-images/" target="_blank" rel="noopener">Background: Webb's First Deep Field · NASA, ESA, CSA, STScI ↗</a></p>
  </section>`;
}

export function mountMoonPanel(root, options = {}) {
  root.innerHTML = moonPanelMarkup();
  const dialog = root.querySelector("#moon-panel");
  const closeButton = root.querySelector("#moon-panel-close");
  const routeNavigation = dialog.querySelector('.moon-route-modules');
  let routeId = null;
  const refreshRouteNavigation = () => {
    routeNavigation.querySelectorAll('[data-route-mission]').forEach((button) => {
      const selected = button.dataset.routeMission === routeId;
      button.toggleAttribute('aria-current', selected);
      if (selected) button.setAttribute('aria-current', 'page');
      button.querySelector('.current-marker').hidden = !selected;
      button.querySelector('.done').hidden = !options.isStamped?.(button.dataset.routeMission);
    });
  };
  const labs = mountMoonLabs(dialog, {
    ...options,
    onEarned(id) {
      options.onEarned?.(id);
      refreshRouteNavigation();
    },
  });
  let returnFocus = null;
  let routeExit = null;
  routeNavigation.addEventListener('click', (event) => {
    const button = event.target.closest('[data-route-mission]');
    if (button) options.onNavigate?.(button.dataset.routeMission);
  });
  const leaveRouteMode = () => {
    routeExit = null;
    routeId = null;
    dialog.classList.remove('is-route-page');
    routeNavigation.hidden = true;
    closeButton.textContent = 'Close';
    closeButton.setAttribute('aria-label', 'Close Moon training');
    dialog.querySelector('#moon-panel-title').textContent = 'Two machines still on the Moon';
    dialog.querySelector('#moon-route-summary').hidden = true;
  };
  const close = () => routeExit ? routeExit() : dialog.close();
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
  dialog.addEventListener('cancel', (event) => {
    if (!routeExit) return;
    event.preventDefault();
    routeExit();
  });
  dialog.addEventListener("close", () => {
    if (returnFocus?.isConnected) returnFocus.focus({ preventScroll: true });
    returnFocus = null;
  });
  return {
    dialog,
    play(id, trigger) {
      leaveRouteMode();
      returnFocus = trigger || document.activeElement;
      if (!dialog.open) dialog.showModal();
      labs.play(id);
      return true;
    },
    open(id, trigger) {
      if (!moonStories[id]) return false;
      leaveRouteMode();
      returnFocus = trigger || document.activeElement;
      labs.showArchive();
      if (!dialog.open) dialog.showModal();
      dialog.scrollTop = 0;
      labs.launcher(id)?.focus({ preventScroll: true });
      return true;
    },
    openRoute(id, onExit) {
      const story = moonStories[id];
      if (!story) return false;
      routeExit = onExit;
      routeId = id;
      returnFocus = null;
      dialog.classList.add('is-route-page');
      routeNavigation.hidden = false;
      refreshRouteNavigation();
      dialog.style.setProperty('--moon-photo', `url("${story.reveal.image}")`);
      closeButton.textContent = '← Back to academy';
      closeButton.setAttribute('aria-label', 'Back to academy');
      dialog.querySelector('#moon-panel-title').textContent = story.name;
      dialog.querySelector('#moon-route-year').textContent = story.year;
      // Same opening as the other four missions: "Built for", then "It did".
      dialog.querySelector('#moon-route-purpose').textContent = story.facts[1][1];
      dialog.querySelector('#moon-route-did').textContent = story.facts[2][1];
      const source = dialog.querySelector('#moon-route-source');
      source.href = story.sources[0][1];
      source.textContent = `${story.sources[0][0]} ↗`;
      dialog.querySelector('#moon-route-summary').hidden = false;
      const photo = dialog.querySelector('.moon-route-photo');
      photo.querySelector('img').src = story.reveal.image;
      photo.querySelector('img').alt = story.reveal.alt;
      // Credit holder only, kept verbatim like the other four mission openings
      // (translating "Image credit:" word by word produced mixed-language text).
      const credit = photo.querySelector('a');
      credit.dataset.i18nSkip = '';
      credit.textContent = `${story.reveal.credit.replace(/^Image credit:\s*/i, '')} ↗`;
      credit.href = story.reveal.source[1];
      if (!dialog.open) dialog.showModal();
      labs.play(id);
      dialog.scrollTop = 0;
      return true;
    },
  };
}

export function mountLocationMap(root, { onExhibit = () => {}, onMoon = () => {}, onCompare = () => {}, journeyProgress = 0, isStamped = () => false } = {}) {
  root.innerHTML = locationMapMarkup();
  for (const button of root.querySelectorAll('[data-map-exhibit], [data-map-moon]')) {
    const earned = isStamped(button.dataset.mapExhibit || button.dataset.mapMoon);
    const action = document.createElement('span');
    action.className = 'map-play-action';
    action.textContent = earned ? 'Play again →' : 'Play mission →';
    button.querySelector('.diagram-callout').append(action);
    if (earned) {
      const stamp = document.createElement('span');
      stamp.className = 'map-earned-stamp';
      stamp.textContent = 'Stamp earned ✓';
      button.querySelector('.diagram-callout').append(stamp);
    }
  }
  let activeProgress = clampJourneyProgress(journeyProgress);
  updateJourneyRoute(root, activeProgress);
  const scrollJourney = mountScrollJourney(root);
  const globes = mountJourneyGlobes(root);
  const updateLeaders = () => {
    root.querySelectorAll('.diagram-leaders').forEach((svg) => {
      const system = svg.parentElement;
      const bounds = system.getBoundingClientRect();
      svg.setAttribute('viewBox', `0 0 ${Math.max(1, bounds.width)} ${Math.max(1, bounds.height)}`);
      svg.querySelectorAll('[data-leader]').forEach((path) => {
        const pin = system.querySelector(`[data-visual-stop="${path.dataset.leader}"]`);
        if (!pin) return;
        const dot = pin.querySelector('i').getBoundingClientRect();
        const label = pin.querySelector('.diagram-callout').getBoundingClientRect();
        const x = dot.left + dot.width / 2 - bounds.left;
        const y = dot.top + dot.height / 2 - bounds.top;
        const endX = label.left - bounds.left - 10;
        const endY = label.top + label.height / 2 - bounds.top;
        const elbow = x + Math.max(15, (endX - x) * .42);
        path.setAttribute('d', `M${x} ${y} L${elbow} ${endY} H${endX}`);
      });
    });
  };
  const leaderObserver = new ResizeObserver(updateLeaders);
  root.querySelectorAll('.system-canvas, .diagram-callout').forEach(node => leaderObserver.observe(node));
  updateLeaders();
  const animateTo = async (stop) => {
    const target = root.querySelector(`[data-visual-stop="${stop}"]`)?.closest("[data-journey-scene]");
    if (!target) return false;
    target.scrollIntoView({ behavior: document.body.classList.contains("motion-reduced") ? "instant" : "smooth", block: "center" });
    if (!document.body.classList.contains("motion-reduced")) await new Promise((resolve) => window.setTimeout(resolve, 640));
    return true;
  };
  const click = (event) => {
    const comparison = event.target.closest('[data-compare-planets]');
    if (comparison) { onCompare(comparison); return; }
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
      globes.dispose();
      leaderObserver.disconnect();
    },
  };
}
