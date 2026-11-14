import { mountJourneyGlobes } from './journey-globes.js';

const prefersReducedJourney = () => document.body.classList.contains('motion-reduced') || (!document.body.classList.contains('motion-allowed') && matchMedia('(prefers-reduced-motion: reduce)').matches);

export const missionViews = {
  curiosity: { image: '/assets/curiosity-gale-panorama.jpg', caption: 'Gale Crater · panorama from Curiosity', kind: 'NASA panorama', credit: "NASA's Jet Propulsion Laboratory", source: 'https://svs.gsfc.nasa.gov/31140/', voice: 'I read a world of rock. Help me choose the next clue.', alt: 'A real Curiosity panorama of the rocky landscape inside Gale Crater on Mars.' },
  ingenuity: { image: '/assets/ingenuity-aerial.jpg', caption: 'Above Mars · Ingenuity’s first aerial color photograph', kind: 'NASA aerial photograph', credit: 'NASA/JPL-Caltech', source: 'https://science.nasa.gov/resource/first-aerial-color-image-of-mars/', voice: 'I found a new way to see Mars. Now help me fly safely.', alt: 'Ingenuity’s first aerial color photograph showing the Martian ground and rover tracks from above.' },
  webb: { image: '/assets/webb-first-deep-field-smacs0723.png', caption: 'SMACS 0723 · Webb’s First Deep Field', kind: 'Infrared composite · colors represent invisible light', credit: 'NASA, ESA, CSA, STScI', source: 'https://science.nasa.gov/asset/webb/webbs-first-deep-field-nircam-image/', voice: 'I gather ancient light. Help my mirrors bring it into focus.', alt: 'Webb’s First Deep Field, filled with distant galaxies, bright stars, and arcs of stretched light.' },
  voyager: { image: '/assets/voyager-pale-blue-dot.jpg', caption: 'Earth · photographed by Voyager 1 in 1990, reprocessed in 2020', kind: 'NASA photograph · Pale Blue Dot Revisited', credit: 'NASA/JPL-Caltech', source: 'https://science.nasa.gov/photojournal/pale-blue-dot-revisited/', voice: 'I looked back and found a tiny point of light. I still carry the voices of home.', alt: 'Earth as a tiny pale dot in a sunbeam in Voyager 1’s 1990 photograph, reprocessed by NASA in 2020.' },
};

export function showMissionView(dialog, id) {
  const view = missionViews[id];
  if (!view) return;
  const image = dialog.querySelector('#mission-view-image');
  image.src = view.image;
  image.alt = view.alt;
  dialog.dataset.machineView = id;
  dialog.querySelector('#mission-view-caption').textContent = view.caption;
  dialog.querySelector('#mission-view-kind').textContent = view.kind;
  dialog.querySelector('#mission-view-voice').textContent = view.voice;
  const source = dialog.querySelector('#mission-view-source');
  source.href = view.source;
  source.textContent = `${view.credit} ↗`;
  source.dataset.i18nSkip = '';
  dialog.scrollTop = 0;
}

export function mountPlanetComparison(dialog) {
  dialog.innerHTML = `<div class="comparison-heading"><div><p class="eyebrow">ONE SIZE SCALE</p><h2 id="comparison-title">One scale. Three worlds.</h2></div><button type="button" class="comparison-close" aria-label="Close planet comparison">×</button></div>
    <p class="comparison-intro">If Earth is this big, how big are the Moon and Mars? Their diameters stay in the same proportions here.</p>
    <div class="comparison-worlds"><figure data-compare-world="earth"><div class="comparison-globe comparison-earth earth-globe"><img src="/assets/journey-earth-nasa.jpg" width="800" height="800" alt="Earth · Blue Marble composite"></div><figcaption><strong>EARTH</strong><span>12,756 km</span><small>100%</small></figcaption></figure><figure data-compare-world="moon"><div class="comparison-globe comparison-moon"><canvas data-globe="moon" role="img" aria-label="Moon rendered from NASA LRO imagery"></canvas></div><figcaption><strong>MOON</strong><span>3,475 km</span><small>≈ 27%</small></figcaption></figure><figure data-compare-world="mars"><div class="comparison-globe comparison-mars"><canvas data-globe="mars" role="img" aria-label="Mars rendered from NASA Viking imagery"></canvas></div><figcaption><strong>MARS</strong><span>6,792 km</span><small>≈ 53%</small></figcaption></figure></div>
    <p class="comparison-explanation">Mars is about half Earth’s diameter. The Moon is a little over a quarter. These are sizes, not distances.</p>
    <p class="comparison-source"><a href="https://nssdc.gsfc.nasa.gov/planetary/factsheet/" target="_blank" rel="noopener">Diameter data: NASA Planetary Fact Sheet ↗</a><span>Images and surface maps: NASA Earth Observatory · NASA SVS/LRO · NASA/JPL/USGS</span></p><button type="button" class="primary comparison-return">Back to the journey</button>`;
  const globes = mountJourneyGlobes(dialog);
  let returnFocus;
  let animations = [];
  const close = () => dialog.close();
  dialog.querySelector('.comparison-close').onclick = close;
  dialog.querySelector('.comparison-return').onclick = close;
  dialog.addEventListener('close', () => {
    animations.forEach(animation => animation.cancel());
    animations = [];
    returnFocus?.focus({ preventScroll: true });
  });
  return {
    open(mapRoot, trigger) {
      returnFocus = trigger || document.activeElement;
      const starts = Object.fromEntries(['earth', 'moon', 'mars'].map(id => [id, mapRoot?.querySelector(`.${id}-globe`)?.getBoundingClientRect()]));
      dialog.showModal();
      dialog.scrollTop = 0;
      dialog.querySelector('.comparison-close').focus({ preventScroll: true });
      if (prefersReducedJourney()) return;
      requestAnimationFrame(() => {
        if (!dialog.open) return;
        for (const id of ['earth', 'moon', 'mars']) {
          const globe = dialog.querySelector(`.comparison-${id}`);
          const end = globe.getBoundingClientRect();
          const start = starts[id];
          const visible = start && start.bottom > 0 && start.top < innerHeight;
          const x = visible ? start.left + start.width / 2 - end.left - end.width / 2 : 0;
          const y = visible ? start.top + start.height / 2 - end.top - end.height / 2 : 70;
          const scale = visible ? start.width / end.width : .85;
          animations.push(globe.animate([{ transform: `translate(${x}px, ${y}px) scale(${scale})`, opacity: visible ? 1 : 0 }, { transform: 'none', opacity: 1 }], { duration: 750, easing: 'cubic-bezier(.18,.72,.22,1)', fill: 'none' }));
        }
      });
    },
    dispose() { animations.forEach(animation => animation.cancel()); globes.dispose(); },
  };
}

// The presentation never changes stamps, progress, or the existing finale trigger.
export function createHomecomingTimeline({ onPhase = () => {}, onComplete = () => {}, schedule = setTimeout, cancel = clearTimeout } = {}) {
  let generation = 0;
  let timers = [];
  let active = false;
  const stop = () => { generation++; timers.forEach(cancel); timers = []; active = false; };
  const finish = () => { if (!active) return; stop(); onPhase('complete'); onComplete(); };
  return {
    start({ reducedMotion = false } = {}) {
      stop();
      active = true;
      if (reducedMotion) { finish(); return; }
      const owner = generation;
      onPhase('flight');
      timers.push(schedule(() => { if (active && owner === generation) onPhase('photo'); }, 2400));
      timers.push(schedule(() => { if (active && owner === generation) finish(); }, 7200));
    },
    finish,
    stop,
  };
}

export function mountHomecoming(finale) {
  const panel = finale.querySelector('.finale-homecoming');
  const card = finale.querySelector('.finale-card');
  let seen = false;
  const timeline = createHomecomingTimeline({
    onPhase(phase) {
      finale.dataset.homecomingPhase = phase;
      panel.hidden = phase === 'complete';
      card.inert = phase !== 'complete';
      card.setAttribute('aria-hidden', String(phase !== 'complete'));
      if (phase === 'flight') {
        panel.querySelector('animateMotion')?.beginElement?.();
      }
      if (phase === 'complete') {
        panel.querySelector('animateMotion')?.endElement?.();
        // Keep the existing close control as the initial finale focus target.
        if (panel.contains(document.activeElement)) finale.querySelector('#finale-close').focus({ preventScroll: true });
      }
    },
  });
  panel.querySelector('[data-homecoming-skip]').onclick = () => timeline.finish();
  finale.querySelector('[data-replay-homecoming]').onclick = () => {
    timeline.start({ reducedMotion: prefersReducedJourney() });
    if (!panel.hidden) panel.querySelector('[data-homecoming-skip]').focus({ preventScroll: true });
    finale.scrollTop = 0;
  };
  return {
    start({ reducedMotion = false, requested = true } = {}) {
      timeline.start({ reducedMotion: reducedMotion || !requested || seen });
      if (requested) seen = true;
    },
    stop() { timeline.stop(); panel.querySelector('animateMotion')?.endElement?.(); panel.hidden = true; card.inert = false; card.setAttribute('aria-hidden', 'false'); finale.dataset.homecomingPhase = 'complete'; },
  };
}
