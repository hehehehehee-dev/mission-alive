import { lrvGameMarkup, mountLrvGame } from './moon-lrv-game.js';
import { surveyorGameMarkup, mountSurveyorGame, surveyorCopy } from './moon-surveyor-game.js';

export function moonLabMarkup() {
  return `<p class="moon-lab-intro">Try a Moon lab. These optional experiments do not add stamps.</p>
    <div class="moon-lab-launches" role="group" aria-label="Optional Moon labs">
      <button type="button" data-moon-play="apollo17" aria-controls="moon-lrv-lab" aria-pressed="false"><span>Apollo 17 LRV</span><strong>Repair my dust shield</strong><small>Build · test · revise</small><span aria-hidden="true">↗</span></button>
      <button type="button" data-moon-play="surveyor3" aria-controls="moon-surveyor-lab" aria-pressed="false"><span>Surveyor 3</span><strong>Can this ground hold?</strong><small>Probe · compare · land</small><span aria-hidden="true">↗</span></button>
    </div>
    <section class="moon-lab-workspace" id="moon-lab-workspace" hidden>
      <div class="moon-lab-toolbar"><button type="button" data-moon-back>← Back to Moon stories</button><p class="eyebrow">OPTIONAL MOON LAB · NO STAMP</p></div>
      <div id="moon-lrv-lab" hidden>${lrvGameMarkup()}
        <figure class="moon-real-history" id="moon-real-repair" hidden><img src="/assets/moon-apollo17-fender-repair.jpg" width="900" height="898" alt="Apollo 17 rover wheel with a replacement dust fender made from spare maps, clamps and duct tape." loading="lazy"><figcaption><h4>The real repair</h4><p>Apollo 17 astronauts made a replacement fender from spare maps, tape and clamps.</p><a href="https://science.nasa.gov/image-article/apod-2004-april-17-lunar-dust-and-duct-tape/" target="_blank" rel="noopener">Photograph: Apollo 17, NASA ↗</a></figcaption></figure>
      </div>
      <div id="moon-surveyor-lab" hidden>${surveyorGameMarkup()}<figure class="moon-real-history" id="moon-real-surveyor" hidden><img src="/assets/moon-surveyor3-apollo12.jpg" alt="Surveyor 3 resting inside its lunar crater, photographed by Apollo 12 astronauts in 1969." width="1800" height="1200" loading="lazy"><figcaption><h4>The real mission</h4><p>${surveyorCopy.home}</p><a href="https://science.nasa.gov/resource/view-of-surveyor-iii-in-its-crater/" target="_blank" rel="noopener">Image credit: NASA/JSC ↗</a></figcaption></figure></div>
      <p class="moon-lab-disclaimer">Optional Moon labs use simplified, fictional test conditions. They are not NASA measurements.</p>
    </section>`;
}

export function mountMoonLabs(dialog) {
  const workspace = dialog.querySelector('#moon-lab-workspace');
  const archive = dialog.querySelector('.moon-story-grid');
  const lrvRoot = dialog.querySelector('#moon-lrv-lab');
  const surveyorRoot = dialog.querySelector('#moon-surveyor-lab');
  const games = [mountLrvGame(lrvRoot), mountSurveyorGame(surveyorRoot)];
  const launches = [...dialog.querySelectorAll('[data-moon-play]')];
  let selected = 'apollo17';
  const showArchive = () => {
    workspace.hidden = true;
    archive.hidden = false;
    launches.forEach(button => button.setAttribute('aria-pressed', 'false'));
  };
  launches.forEach(button => { button.onclick = () => {
    selected = button.dataset.moonPlay;
    workspace.hidden = false;
    archive.hidden = true;
    lrvRoot.hidden = selected !== 'apollo17';
    surveyorRoot.hidden = selected !== 'surveyor3';
    launches.forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    const heading = (selected === 'apollo17' ? lrvRoot : surveyorRoot).querySelector('h3');
    if (heading) { heading.tabIndex = -1; heading.focus({ preventScroll: true }); }
    workspace.scrollIntoView({ block: 'start', behavior: 'instant' });
  }; });
  dialog.querySelector('[data-moon-back]').onclick = () => {
    showArchive();
    dialog.querySelector(`[data-moon-play="${selected}"]`).focus({ preventScroll: true });
    dialog.scrollTop = 0;
  };
  const revealRepair = () => { dialog.querySelector('#moon-real-repair').hidden = false; };
  const revealSurveyor = () => { dialog.querySelector('#moon-real-surveyor').hidden = false; };
  lrvRoot.addEventListener('lrv-repair-success', revealRepair);
  surveyorRoot.addEventListener('surveyor-soil-success', revealSurveyor);
  return {
    showArchive,
    launcher(id) { return dialog.querySelector(`[data-moon-play="${id}"]`); },
    dispose() { games.forEach(game => game.dispose()); lrvRoot.removeEventListener('lrv-repair-success', revealRepair); surveyorRoot.removeEventListener('surveyor-soil-success', revealSurveyor); },
  };
}
