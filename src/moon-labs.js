import { lrvGameMarkup, mountLrvGame } from './moon-lrv-game.js';
import { surveyorGameMarkup, mountSurveyorGame, surveyorCopy } from './moon-surveyor-game.js';
import { mountStampCeremony } from './stamp-ceremony.js';
import { trainingMissions } from './certification.js';

export const moonTransmissions = {
  apollo17: 'I am still parked on the Moon, where Apollo 17 left me. My crew brought maps to find their way. When my fender broke, those maps became a repair. You leave me with this: a good engineer can give an ordinary thing a new job.',
  surveyor3: 'Most of me is still on the Moon. Apollo 12 came to visit me and brought my camera home. You pressed, measured, and looked beneath the surface before trusting the ground. Take that habit with you: look for evidence before you decide.',
};

export function moonLabMarkup() {
  return `<p class="moon-lab-intro">Two Moon missions. Build, investigate, and earn a stamp for each.</p>
    <div class="moon-lab-launches" role="group" aria-label="Moon training missions">
      <button type="button" data-moon-play="apollo17" aria-controls="moon-lrv-lab" aria-pressed="false"><span>Apollo 17 LRV</span><strong>Repair my dust shield</strong><small>Build · test · revise</small><span aria-hidden="true">↗</span></button>
      <button type="button" data-moon-play="surveyor3" aria-controls="moon-surveyor-lab" aria-pressed="false"><span>Surveyor 3</span><strong>Can this ground hold?</strong><small>Probe · compare · land</small><span aria-hidden="true">↗</span></button>
    </div>
    <section class="moon-lab-workspace" id="moon-lab-workspace" hidden>
      <div class="moon-lab-toolbar"><button type="button" data-moon-back>← Back to Moon stories</button><p class="eyebrow">MOON TRAINING · EARN YOUR STAMP</p></div>
      <div id="moon-lrv-lab" hidden>${lrvGameMarkup()}
        <figure class="moon-real-history" id="moon-real-repair" hidden><img src="/assets/moon-apollo17-fender-repair.jpg" width="900" height="898" alt="Apollo 17 rover wheel with a replacement dust fender made from spare maps, clamps and duct tape." loading="lazy"><figcaption><h4>The real repair</h4><p>Apollo 17 astronauts made a replacement fender from spare maps, tape and clamps.</p><a href="https://science.nasa.gov/image-article/apod-2004-april-17-lunar-dust-and-duct-tape/" target="_blank" rel="noopener">Photograph: Apollo 17, NASA ↗</a></figcaption></figure>
      </div>
      <div id="moon-surveyor-lab" hidden>${surveyorGameMarkup()}<figure class="moon-real-history" id="moon-real-surveyor" hidden><img src="/assets/moon-surveyor3-apollo12.jpg" alt="Surveyor 3 resting inside its lunar crater, photographed by Apollo 12 astronauts in 1969." width="1800" height="1200" loading="lazy"><figcaption><h4>The real mission</h4><p>${surveyorCopy.home}</p><a href="https://science.nasa.gov/resource/view-of-surveyor-iii-in-its-crater/" target="_blank" rel="noopener">Image credit: NASA/JSC ↗</a></figcaption></figure></div>
      <section data-moon-stamp="apollo17" hidden></section><section data-moon-stamp="surveyor3" hidden></section>
      <p class="moon-lab-disclaimer">Moon training uses simplified, fictional test conditions. They are not NASA measurements.</p>
    </section>`;
}

export function mountMoonLabs(dialog, { isStamped = () => false, onEarned = () => {}, onContinue = () => {}, isComplete = () => false } = {}) {
  const workspace = dialog.querySelector('#moon-lab-workspace');
  const archive = dialog.querySelector('.moon-story-grid');
  const lrvRoot = dialog.querySelector('#moon-lrv-lab');
  const surveyorRoot = dialog.querySelector('#moon-surveyor-lab');
  const games = [mountLrvGame(lrvRoot), mountSurveyorGame(surveyorRoot)];
  const launches = [...dialog.querySelectorAll('[data-moon-play]')];
  let selected = 'apollo17';
  let ceremony = null;
  let finaleTimer = null;
  const slots = [...dialog.querySelectorAll('[data-moon-stamp]')];
  const cancel = () => { ceremony?.dispose(); ceremony = null; clearTimeout(finaleTimer); };
  const ready = id => id === 'apollo17'
    ? lrvRoot.querySelector('[data-lrv-workshop]').dataset.lrvResult === 'passed'
    : surveyorRoot.querySelector('[data-surveyor-game]').dataset.surveyorOutcome === 'accepted';
  const finish = (id, fresh = false) => {
    const slot = dialog.querySelector(`[data-moon-stamp="${id}"]`);
    slot.hidden = false;
    slot.innerHTML = `<div class="moon-transmission"><p class="eyebrow">MISSION STAMP EARNED · FINAL TRANSMISSION</p><h3>${trainingMissions[id].name}</h3><blockquote>${moonTransmissions[id]}</blockquote><p class="fine">Original Mission Alive narration, based on the NASA sources below.</p><button type="button" data-moon-continue>Continue training →</button></div>`;
    slot.querySelector('[data-moon-continue]').onclick = () => { cancel(); onContinue(); };
    const heading = slot.querySelector('h3');
    heading.tabIndex = -1;
    heading.focus({ preventScroll: true });
    slot.scrollIntoView({ block: 'nearest', behavior: 'instant' });
    if (fresh && isComplete()) finaleTimer = setTimeout(() => { if (dialog.open && isComplete()) onContinue(); }, 18000);
  };
  const offerStamp = id => {
    if (!dialog.open || selected !== id || !ready(id)) return;
    cancel();
    if (isStamped(id)) { finish(id); return; }
    const slot = dialog.querySelector(`[data-moon-stamp="${id}"]`);
    slot.hidden = false;
    ceremony = mountStampCeremony(slot, {
      name: trainingMissions[id].name, verb: trainingMissions[id].verb, idPrefix: `moon-${id}-stamp`,
      reducedMotion: document.body.classList.contains('motion-reduced'),
      onSettled() {
        if (!dialog.open || selected !== id || !ready(id)) return;
        onEarned(id);
        finish(id, true);
      },
    });
  };
  const observer = new MutationObserver(() => {
    if (ceremony && ceremony.phase !== 'settled' && !ready(selected)) { cancel(); slots.forEach(slot => { if (!isStamped(slot.dataset.moonStamp)) slot.hidden = true; }); }
  });
  observer.observe(lrvRoot, { subtree: true, attributes: true, attributeFilter: ['data-lrv-result'] });
  observer.observe(surveyorRoot, { subtree: true, attributes: true, attributeFilter: ['data-surveyor-outcome'] });
  dialog.addEventListener('close', cancel);
  const showArchive = () => {
    cancel();
    slots.forEach(slot => { slot.hidden = true; });
    workspace.hidden = true;
    archive.hidden = false;
    launches.forEach(button => button.setAttribute('aria-pressed', 'false'));
  };
  launches.forEach(button => { button.onclick = () => {
    cancel();
    selected = button.dataset.moonPlay;
    workspace.hidden = false;
    archive.hidden = true;
    lrvRoot.hidden = selected !== 'apollo17';
    surveyorRoot.hidden = selected !== 'surveyor3';
    slots.forEach(slot => { slot.hidden = true; });
    launches.forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    const heading = (selected === 'apollo17' ? lrvRoot : surveyorRoot).querySelector('h3');
    if (heading) { heading.tabIndex = -1; heading.focus({ preventScroll: true }); }
    workspace.scrollIntoView({ block: 'start', behavior: 'instant' });
    if (isStamped(selected)) finish(selected);
    else if (ready(selected)) offerStamp(selected);
  }; });
  dialog.querySelector('[data-moon-back]').onclick = () => {
    showArchive();
    dialog.querySelector(`[data-moon-play="${selected}"]`).focus({ preventScroll: true });
    dialog.scrollTop = 0;
  };
  const revealRepair = () => { dialog.querySelector('#moon-real-repair').hidden = false; offerStamp('apollo17'); };
  const revealSurveyor = () => { dialog.querySelector('#moon-real-surveyor').hidden = false; offerStamp('surveyor3'); };
  lrvRoot.addEventListener('lrv-repair-success', revealRepair);
  surveyorRoot.addEventListener('surveyor-soil-success', revealSurveyor);
  return {
    showArchive,
    play(id) { dialog.querySelector(`[data-moon-play="${id}"]`)?.click(); },
    launcher(id) { return dialog.querySelector(`[data-moon-play="${id}"]`); },
    dispose() {
      cancel(); observer.disconnect(); dialog.removeEventListener('close', cancel);
      games.forEach(game => game.dispose());
      lrvRoot.removeEventListener('lrv-repair-success', revealRepair);
      surveyorRoot.removeEventListener('surveyor-soil-success', revealSurveyor);
    },
  };
}
