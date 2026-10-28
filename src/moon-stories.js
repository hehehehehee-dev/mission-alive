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
  }),
});

const storyCard = (id, story) => `<article class="module-story-card moon-story-card" data-moon-story="${id}" aria-labelledby="moon-${id}-title">
  <p class="eyebrow">${story.year}</p>
  <h3 id="moon-${id}-title" tabindex="-1">${story.name}</h3>
  <div class="moon-story-facts">${story.facts.map(([label, copy]) => `<p><strong>${label}</strong><span>${copy}</span></p>`).join("")}</div>
  <p class="moon-story-sources"><strong>OFFICIAL SOURCES</strong>${story.sources.map(([label, href]) => `<a href="${href}" target="_blank" rel="noopener">${label} ↗</a>`).join("")}</p>
</article>`;

export function moonPanelMarkup() {
  return `<dialog class="moon-panel" id="moon-panel" aria-labelledby="moon-panel-title">
    <div class="dialog-top"><p class="eyebrow">MOON STORY ARCHIVE · NO STAMP</p><button type="button" id="moon-panel-close" aria-label="Close Moon stories">Close</button></div>
    <h2 id="moon-panel-title">Two machines still on the Moon</h2>
    <p class="moon-panel-intro">These are short stories, not training modules. Your crew certification still has exactly four stamps.</p>
    <div class="moon-story-grid">${Object.entries(moonStories).map(([id, story]) => storyCard(id, story)).join("")}</div>
  </dialog>`;
}

export function locationMapMarkup() {
  return `<section class="location-map" aria-labelledby="location-map-title">
    <div class="location-map-heading"><div><p class="eyebrow">WHERE THEY ARE</p><h2 id="location-map-title">Six machines, three frontiers</h2></div><p>The four training machines remain the path to certification. Open two extra Moon stories without adding a stamp.</p></div>
    <div class="location-map-field" role="group" aria-label="Schematic locations of the six machines">
      <img src="/assets/mission-location-map.svg" alt="Clean schematic showing the Moon, Mars, and deep space; not to scale." width="1200" height="420">
      <button class="location-dot is-moon" style="--map-x:12%;--map-y:38%" data-map-moon="apollo17" aria-label="Open Apollo 17 Lunar Roving Vehicle Moon story"><i aria-hidden="true"></i><span>Apollo 17 LRV<small>MOON STORY</small></span></button>
      <button class="location-dot is-moon" style="--map-x:23%;--map-y:65%" data-map-moon="surveyor3" aria-label="Open Surveyor 3 Moon story"><i aria-hidden="true"></i><span>Surveyor 3<small>MOON STORY</small></span></button>
      <button class="location-dot is-mars" style="--map-x:44%;--map-y:35%" data-map-exhibit="curiosity" aria-label="Open Curiosity training module"><i aria-hidden="true"></i><span>Curiosity<small>MARS · TRAINING</small></span></button>
      <button class="location-dot is-mars" style="--map-x:55%;--map-y:68%" data-map-exhibit="ingenuity" aria-label="Open Ingenuity training module"><i aria-hidden="true"></i><span>Ingenuity<small>MARS · TRAINING</small></span></button>
      <button class="location-dot is-deep" style="--map-x:73%;--map-y:38%" data-map-exhibit="webb" aria-label="Open Webb training module"><i aria-hidden="true"></i><span>Webb<small>DEEP SPACE · TRAINING</small></span></button>
      <button class="location-dot is-deep" style="--map-x:89%;--map-y:67%" data-map-exhibit="voyager" aria-label="Open Voyager training module"><i aria-hidden="true"></i><span>Voyager 1<small>INTERSTELLAR · TRAINING</small></span></button>
    </div>
    <p class="fine location-map-credit">Schematic: Mission Alive · not to scale.</p>
  </section>`;
}

export function mountMoonPanel(root) {
  root.innerHTML = moonPanelMarkup();
  const dialog = root.querySelector("#moon-panel");
  const closeButton = root.querySelector("#moon-panel-close");
  let returnFocus = null;
  const close = () => dialog.close();
  closeButton.addEventListener("click", close);
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

export function mountLocationMap(root, { onExhibit = () => {}, onMoon = () => {} } = {}) {
  root.innerHTML = locationMapMarkup();
  const click = (event) => {
    const exhibit = event.target.closest("[data-map-exhibit]");
    if (exhibit) return onExhibit(exhibit.dataset.mapExhibit, exhibit);
    const moon = event.target.closest("[data-map-moon]");
    if (moon) onMoon(moon.dataset.mapMoon, moon);
  };
  root.addEventListener("click", click);
  return { dispose() { root.removeEventListener("click", click); } };
}
