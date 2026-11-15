import { quickStartMarkup, whyMarkup } from './quick-start.js';

// Original, dimensionless teaching model. These constants are invented for play;
// they are neither Surveyor measurements nor a map of actual lunar soil.
export const surveyorSoils = Object.freeze([
  Object.freeze({ id: 'a', name: 'Patch A', topDepths: Object.freeze([.45, .45]), surfaceResistance: 1.5, lowerResistance: 6 }),
  Object.freeze({ id: 'b', name: 'Patch B', topDepths: Object.freeze([1, 1]), surfaceResistance: .8, lowerResistance: 3.2 }),
  Object.freeze({ id: 'c', name: 'Patch C', topDepths: Object.freeze([.3, 1.2]), surfaceResistance: 1.2, lowerResistance: 5.5 }),
]);

export const surveyorModel = Object.freeze({ forces: Object.freeze([1, 2, 3, 4]), loadPerPad: 12, minWidth: 1, maxWidth: 4, widthStep: .5, maxSink: 1.4, maxUnevenSink: .5 });

// Kept together so the parent app can provide its normal text-node localization.
export const surveyorCopy = Object.freeze({
  eyebrow: 'MOON TRAINING · ABOUT 3 MINUTES',
  missionLabel: 'MISSION · SURVEYOR 3',
  incidentTitle: 'MISSION MOMENT · THE GROUND SURPRISES YOU',
  incident: 'The first probe sinks farther than expected. Stop before landing, compare the layers, and decide whether the ground can hold.',
  title: 'Surveyor 3: test before touchdown',
  intro: 'Can your evidence support a landing recommendation? Press a probe at two different forces, inspect a trench, then test a separate fictional lander.',
  disclaimer: 'Illustrated simulation · not NASA test data.',
  units: 'All forces, areas, pressures, and depths below use dimensionless simulation units. The three patches and their layers are invented; they do not describe actual variations in Moon soil.',
  history: 'In 1967, Surveyor 3 used its surface sampler to dig trenches, press on the soil in bearing tests, and perform impact tests. Its findings helped scientists assess support for Apollo landings.',
  historySource: 'NASA · Surveyor 3 surface experiments',
  select: '1. Choose a fictional test patch',
  patchA: 'Patch A',
  patchB: 'Patch B',
  patchC: 'Patch C',
  patchADetail: 'Even, shallow cover',
  patchBDetail: 'Even, deep cover',
  patchCDetail: 'Uneven cover · tilt risk',
  cutawayCaption: 'Illustrated cutaway: the probe measures sinking. The scoop exposes layers only after you inspect a trench. Measurements also appear in the log.',
  investigate: '2. Gather evidence',
  force: 'Probe force',
  probeArea: 'The probe has contact area 1. Its pressure equals force ÷ 1.',
  press: 'Press probe and measure',
  trench: 'Dig one scoop',
  probePrompt: 'Press at one force, then change force and press again. Compare how much the probe sinks.',
  trenchPrompt: 'No trench inspected here yet. The surface alone does not reveal the layer below.',
  trenchA: 'Trench: a thin softer cover, 0.45 units deep, sits over a firmer layer. Its thickness is even across the two test points.',
  trenchB: 'Trench: a deeper softer cover, 1 unit deep, sits over a firmer layer. Its thickness is even across the two test points.',
  trenchC: 'Trench: the softer cover is 0.3 units deep on one side and 1.2 on the other, above a firmer layer. Unequal sinking could tilt a lander.',
  landing: '3. Test a separate fictional lander',
  separation: 'This adjustable-footpad experiment is fictional. You are not changing Surveyor 3 or the Apollo lunar module.',
  width: 'Square footpad width',
  narrower: 'Narrower pad',
  wider: 'Wider pad',
  load: 'Each pad carries a fixed simulated load of 12 units. Pad area = width × width. Pressure = load ÷ area.',
  limits: 'Simulation safety limits: sinking at each pad ≤ 1.4 units; difference between pads ≤ 0.5 units.',
  touchdown: 'Test touchdown',
  landingPrompt: 'Every touchdown is available to try. A recommendation needs two different probe forces and a trench inspection on this patch.',
  incomplete: 'Trial only: gather the missing evidence on this patch and test again. A stable-looking result alone is not a recommendation.',
  stable: 'Stable in this model.',
  sinking: 'Too much sinking in this model. Spread the same load over more area, or investigate another patch, then retry.',
  tilting: 'The pads sink unequally, so this model lander tilts too far. Compare the trench layers and try a lower pressure.',
  accepted: 'Landing recommendation supported! Your force comparisons and trench inspection support this stable footprint. Other footprints can work too; keep experimenting.',
  logTitle: 'Measurement log',
  emptyLog: 'No measurements yet. Your observations will stay here while you try different patches.',
  endingLabel: 'SURVEYOR 3 · AN IMAGINED VOICE',
  ending: 'I am still here. But part of me made it home.',
  home: 'In 1969, Apollo 12 astronauts returned Surveyor 3’s television camera and soil scoop to Earth for study. Most of the lander remains on the Moon.',
  homeSource: 'NASA JPL · Surveyor 3 camera returned from the Moon',
  restart: 'Start a fresh investigation',
  reset: 'Fresh investigation. Choose a patch and gather new evidence.',
});

export const surveyorTextTemplates = Object.freeze([
  '{patch} selected. Evidence stays with the patch where you collected it.',
  'Force {force} simulation units',
  'Width {width} · area {area} · pressure {pressure} simulation units',
  'Probe at force {force}: sinking {depth} simulation units.',
  '{patch}: {count} of 2 different probe forces recorded; trench {trench}.',
  'inspected',
  'not inspected',
  '{patch} · probe force {force} · pressure {pressure} · sinking {depth} simulation units',
  '{patch} · trench inspected',
  'Touchdown: left pad sinking {left}; right pad sinking {right}; difference {difference} simulation units.',
  '{patch} · pad width {width} · area {area} · pressure {pressure} · left sinking {left} · right sinking {right} simulation units · {outcome}',
]);

const format = (template, values) => template.replace(/\{(\w+)\}/g, (_, key) => String(values[key] ?? ''));
const number = (value) => String(Number(value.toFixed(2)));
const soilFor = (id) => {
  const soil = surveyorSoils.find((item) => item.id === id);
  if (!soil) throw new RangeError('Unknown simulation patch.');
  return soil;
};

// A soft cover compresses first; once crossed, the firmer lower layer resists
// further sinking. Both probe and pad tests use the same pressure/depth rule.
function sinkingAtPressure(soil, pressure, side = 0) {
  const top = soil.topDepths[side];
  const topPressure = top * soil.surfaceResistance;
  return pressure <= topPressure ? pressure / soil.surfaceResistance : top + (pressure - topPressure) / soil.lowerResistance;
}

export function evaluateSurveyorProbe(patchId, force) {
  const soil = soilFor(patchId);
  if (!surveyorModel.forces.includes(force)) throw new RangeError('Probe force must be 1, 2, 3, or 4 simulation units.');
  return Object.freeze({ type: 'probe', patchId, force, pressure: force, depth: sinkingAtPressure(soil, force) });
}

export function evaluateSurveyorEvidence(patchId, log = []) {
  soilFor(patchId);
  const rows = Array.isArray(log) ? log : [];
  const forces = [...new Set(rows.filter((entry) => entry?.type === 'probe' && entry.patchId === patchId && surveyorModel.forces.includes(entry.force)).map((entry) => entry.force))].sort();
  const trench = rows.some((entry) => entry?.type === 'trench' && entry.patchId === patchId);
  return Object.freeze({ forces: Object.freeze(forces), trench, ready: forces.length >= 2 && trench });
}

export function evaluateSurveyorTouchdown({ patchId, padWidth, log = [] } = {}) {
  const soil = soilFor(patchId);
  if (typeof padWidth !== 'number' || !Number.isFinite(padWidth) || padWidth < surveyorModel.minWidth || padWidth > surveyorModel.maxWidth) throw new RangeError('Pad width must be between 1 and 4 simulation units.');
  const area = padWidth ** 2;
  const pressure = surveyorModel.loadPerPad / area;
  const leftSink = sinkingAtPressure(soil, pressure, 0);
  const rightSink = sinkingAtPressure(soil, pressure, 1);
  const difference = Math.abs(leftSink - rightSink);
  const evidence = evaluateSurveyorEvidence(patchId, log);
  const stable = Math.max(leftSink, rightSink) <= surveyorModel.maxSink && difference <= surveyorModel.maxUnevenSink;
  const accepted = stable && evidence.ready;
  const reason = Math.max(leftSink, rightSink) > surveyorModel.maxSink ? 'sinking' : difference > surveyorModel.maxUnevenSink ? 'tilting' : !evidence.ready ? 'evidence' : 'accepted';
  return Object.freeze({ type: 'touchdown', patchId, padWidth, area, pressure, leftSink, rightSink, difference, stable, accepted, reason, evidence });
}

let surveyorInstance = 0;
const trenchCopy = { a: 'trenchA', b: 'trenchB', c: 'trenchC' };
const patchCopy = { a: 'patchA', b: 'patchB', c: 'patchC' };

function soilIllustration(prefix) {
  return `<svg class="surveyor-cutaway" viewBox="0 0 840 340" aria-hidden="true" focusable="false">
    <defs><pattern id="${prefix}-grains" width="19" height="17" patternUnits="userSpaceOnUse"><circle cx="4" cy="5" r="1.5" fill="#d7c9ad"/><circle cx="13" cy="13" r="1" fill="#655e59"/></pattern></defs>
    <path d="M0 154Q100 140 210 154T420 154T630 154T840 154V340H0Z" fill="#645f5c"/>
    ${surveyorSoils.map((soil, index) => {
      const x = 20 + index * 280;
      const left = 173 + soil.topDepths[0] * 36;
      const right = 173 + soil.topDepths[1] * 36;
      return `<g data-surveyor-soil="${soil.id}"><rect x="${x}" y="156" width="240" height="165" rx="12" fill="#938a7d" stroke="#d9e8ed" stroke-width="2" data-soil-outline/>
        <rect x="${x + 8}" y="166" width="224" height="145" rx="7" fill="url(#${prefix}-grains)"/>
        <g data-surveyor-trench="${soil.id}" visibility="hidden"><rect x="${x + 24}" y="173" width="192" height="128" rx="5" fill="#5d656c"/><path d="M${x + 24} 173H${x + 216}V${right}L${x + 24} ${left}Z" fill="#d5bc8d"/><path d="M${x + 24} ${left}L${x + 216} ${right}" stroke="#fff1c5" stroke-width="3"/><path d="M${x + 25} 280h190M${x + 25} 260h190" stroke="#a1adb3" stroke-width="2" stroke-dasharray="6 9"/></g>
        <text x="${x + 120}" y="310" text-anchor="middle" fill="#fff" font-size="21" font-family="sans-serif">${soil.id.toUpperCase()}</text></g>`;
    }).join('')}
    <g fill="none" stroke="#b7c5ce" stroke-width="8" stroke-linecap="round"><path d="M62 147 94 92 138 147M94 92V42M81 66h27"/><path d="M100 100 162 69 202 108"/></g>
    <path d="M74 81h44l14 29H62Z" fill="#e8ddac" stroke="#e6f0ef" stroke-width="3"/><path d="M97 43 133 26 148 54 113 70Z" fill="#637889" stroke="#e6f0ef" stroke-width="3"/>
    <g data-surveyor-scoop transform="translate(420 0)"><path d="M-60 76 -20 98 0 141" fill="none" stroke="#c8d4da" stroke-width="6"/><path d="M-14 136h36l-9 15h-22Z" fill="#e6cb86" stroke="#f5e7bd" stroke-width="2"/></g>
    <g data-surveyor-probe transform="translate(140 0)"><path data-probe-shaft d="M0 93V157" stroke="#8ae4ef" stroke-width="7"/><path data-probe-tip d="M-12 157h24" stroke="#fff1c5" stroke-width="6"/><path d="M-15 94h30l-7-19H-8Z" fill="#8ae4ef"/></g>
  </svg>`;
}

function landerIllustration() {
  return `<svg class="surveyor-lander" viewBox="0 0 360 240" aria-hidden="true" focusable="false">
    <path d="M0 174H360V240H0Z" fill="#6b6560"/><path d="M0 174H360" stroke="#d3bf96" stroke-width="3"/>
    <g data-surveyor-lander-body><path d="M120 103 95 168M240 103l25 65M180 86V38M157 38h46" stroke="#cfdae0" stroke-width="7" fill="none"/><path d="M140 68h80l25 57H115Z" fill="#e5c77b" stroke="#fff1c5" stroke-width="3"/><rect x="154" y="78" width="52" height="26" rx="4" fill="#4c7d91"/><path d="m173 125-9 20h32l-9-20" fill="#a8b8c2"/></g>
    <rect data-surveyor-left-pad x="76" y="168" width="38" height="8" rx="3" fill="#f7e7b7"/>
    <rect data-surveyor-right-pad x="246" y="168" width="38" height="8" rx="3" fill="#f7e7b7"/>
  </svg>`;
}

export function surveyorGameMarkup() {
  const id = `surveyor-game-${++surveyorInstance}`;
  const c = surveyorCopy;
  return `<section class="moon-game surveyor-game" aria-labelledby="${id}-title" data-surveyor-game>
    <p class="eyebrow">${c.eyebrow}</p><h3 id="${id}-title">${c.title}</h3><p class="moon-challenge-identity">${c.missionLabel}</p><aside class="mission-incident" aria-label="Mission moment"><p class="eyebrow">${c.incidentTitle}</p><p>${c.incident}</p><p class="fine">Probe twice, dig three scoops, then test the fictional lander.</p></aside>
    ${quickStartMarkup('surveyor3')}
    ${whyMarkup(`<p>${c.intro}</p><p class="surveyor-disclaimer">${c.disclaimer}</p><p class="surveyor-model-label">${c.units}</p><p>${c.history} <a href="https://science.nasa.gov/mission/surveyor-3/" target="_blank" rel="noopener noreferrer">${c.historySource} ↗</a></p>`)}
    <div class="surveyor-study-layout"><fieldset class="surveyor-controls surveyor-site-controls"><legend class="surveyor-model-label">${c.select}</legend><div class="surveyor-patches">${surveyorSoils.map((soil) => `<button type="button" data-surveyor-patch="${soil.id}" aria-pressed="${soil.id === 'a'}"><strong>${c[patchCopy[soil.id]]}</strong><small>${c[`${patchCopy[soil.id]}Detail`]}</small></button>`).join('')}</div></fieldset>
    <figure class="surveyor-figure"><div class="moon-challenge-canvas" data-surveyor-challenge-3d></div><div class="moon-challenge-2d">${soilIllustration(id)}</div><figcaption class="surveyor-model-label"><span class="moon-challenge-3d-caption">Interactive 3D training simulation. Use the controls on this page; every result is also explained in text.</span><span class="moon-challenge-2d-caption">${c.cutawayCaption}</span></figcaption></figure>
    <div class="surveyor-investigation-grid"><fieldset class="surveyor-controls"><legend class="surveyor-model-label">${c.investigate}</legend>
      <p class="surveyor-model-label">${c.force}</p><div class="surveyor-force-buttons" role="group" aria-label="${c.force}">${surveyorModel.forces.map((force) => `<button type="button" data-surveyor-force="${force}" aria-pressed="${force === 1}">${format(surveyorTextTemplates[1], { force })}</button>`).join('')}</div>
      <p class="surveyor-model-label">${c.probeArea}</p><button type="button" data-surveyor-action="probe">${c.press}</button><button type="button" data-surveyor-action="trench">${c.trench}</button>
      <p class="surveyor-readout" data-surveyor-probe-readout>${c.probePrompt}</p><p class="surveyor-readout" data-surveyor-trench-readout>${c.trenchPrompt}</p><p class="surveyor-readout" data-surveyor-evidence></p>
    </fieldset><fieldset class="surveyor-controls"><legend class="surveyor-model-label">${c.landing}</legend><p>${c.separation}</p>
      ${landerIllustration()}<p class="surveyor-model-label">${c.width}</p><div class="surveyor-pad-stepper"><button type="button" data-surveyor-action="narrower">${c.narrower}</button><button type="button" data-surveyor-action="wider">${c.wider}</button></div>
      <p class="surveyor-readout" data-surveyor-pad-readout></p><p class="surveyor-model-label">${c.load}</p><p class="surveyor-model-label">${c.limits}</p><button type="button" data-surveyor-action="touchdown">${c.touchdown}</button>
    </fieldset></div></div>
    <div class="surveyor-result" role="status" aria-live="polite" aria-atomic="true" data-surveyor-result>${c.landingPrompt}</div>
    <section class="surveyor-log" aria-labelledby="${id}-log" tabindex="0"><h4 id="${id}-log">${c.logTitle}</h4><p data-surveyor-empty-log>${c.emptyLog}</p><ol data-surveyor-log></ol></section>
    <aside class="surveyor-ending" data-surveyor-ending hidden><p class="eyebrow">${c.endingLabel}</p><blockquote>${c.ending}</blockquote><p>${c.home}</p><a href="https://www.jpl.nasa.gov/blog/2012/1/surveyor-3-camera-returned-from-the-moon" target="_blank" rel="noopener noreferrer">${c.homeSource} ↗</a></aside>
    <button type="button" data-surveyor-action="restart">${c.restart}</button>
  </section>`;
}

export function mountSurveyorGame(root) {
  if (!root) return { dispose() {} };
  if (!root.querySelector('[data-surveyor-game]')) root.innerHTML = surveyorGameMarkup();
  const game = root.querySelector('[data-surveyor-game]');
  if (!game) return { dispose() {} };
  const find = (selector) => game.querySelector(selector);
  let patchId = 'a';
  let force = 1;
  let padWidth = 1;
  let log = [];
  let digs = { a: 0, b: 0, c: 0 };
  let disposed = false;
  let challengeScene = null;
  void import('./moon-challenge-scenes.js').then(({ mountSurveyorChallengeScene }) => {
    if (disposed) return;
    challengeScene = mountSurveyorChallengeScene(find('[data-surveyor-challenge-3d]'));
    if (challengeScene) { game.classList.add('has-3d-challenge'); challengeScene.update({ patchId, padWidth, digs }); }
  }).catch(() => {});

  const announce = (text) => { find('[data-surveyor-result]').textContent = text; };
  const announceLines = (lines) => {
    const paragraphs = lines.map((line) => {
      const paragraph = game.ownerDocument.createElement('p');
      paragraph.textContent = line;
      return paragraph;
    });
    find('[data-surveyor-result]').replaceChildren(...paragraphs);
  };
  const renderControls = () => {
    game.querySelectorAll('[data-surveyor-patch]').forEach((button) => button.setAttribute('aria-pressed', String(button.dataset.surveyorPatch === patchId)));
    game.querySelectorAll('[data-surveyor-force]').forEach((button) => button.setAttribute('aria-pressed', String(Number(button.dataset.surveyorForce) === force)));
    const soil = soilFor(patchId);
    const evidence = evaluateSurveyorEvidence(patchId, log);
    game.dataset.surveyorSelectedPatch = patchId;
    game.dataset.surveyorDigs = String(digs[patchId]);
    game.dataset.surveyorEvidence = evidence.ready ? 'complete' : 'gathering';
    const latestProbe = log.findLast((entry) => entry.type === 'probe' && entry.patchId === patchId);
    find('[data-surveyor-probe-readout]').textContent = latestProbe ? format(surveyorTextTemplates[3], { force: latestProbe.force, depth: number(latestProbe.depth) }) : surveyorCopy.probePrompt;
    find('[data-surveyor-trench-readout]').textContent = evidence.trench ? surveyorCopy[trenchCopy[patchId]] : surveyorCopy.trenchPrompt;
    find('[data-surveyor-evidence]').textContent = format(surveyorTextTemplates[4], { patch: surveyorCopy[patchCopy[patchId]], count: Math.min(2, evidence.forces.length), trench: evidence.trench ? surveyorTextTemplates[5] : surveyorTextTemplates[6] });
    find('[data-surveyor-pad-readout]').textContent = format(surveyorTextTemplates[2], { width: number(padWidth), area: number(padWidth ** 2), pressure: number(surveyorModel.loadPerPad / padWidth ** 2) });
    const x = 140 + surveyorSoils.indexOf(soil) * 280;
    find('[data-surveyor-probe]').setAttribute('transform', `translate(${x} 0)`);
    find('[data-surveyor-scoop]').setAttribute('transform', `translate(${x + 24} 0)`);
    const probeY = 157 + Math.min(100, (latestProbe?.depth || 0) * 24);
    find('[data-probe-shaft]').setAttribute('d', `M0 93V${probeY}`);
    find('[data-probe-tip]').setAttribute('d', `M-12 ${probeY}h24`);
    game.querySelectorAll('[data-surveyor-soil]').forEach((panel) => panel.querySelector('[data-soil-outline]').setAttribute('stroke-width', panel.dataset.surveyorSoil === patchId ? '6' : '2'));
    game.querySelectorAll('[data-surveyor-trench]').forEach((trench) => trench.setAttribute('visibility', digs[trench.dataset.surveyorTrench] ? 'visible' : 'hidden'));
    challengeScene?.update({ patchId, padWidth, digs });
  };
  const drawLanding = (result = null) => {
    const left = Math.min(55, (result?.leftSink || 0) * 20);
    const right = Math.min(55, (result?.rightSink || 0) * 20);
    const width = 20 + padWidth * 16;
    const leftPad = find('[data-surveyor-left-pad]');
    const rightPad = find('[data-surveyor-right-pad]');
    leftPad.setAttribute('x', String(95 - width / 2));
    rightPad.setAttribute('x', String(265 - width / 2));
    for (const [pad, sink] of [[leftPad, left], [rightPad, right]]) {
      pad.setAttribute('width', String(width));
      pad.setAttribute('y', String(168 + sink));
    }
    const angle = Math.atan2(right - left, 170) * 180 / Math.PI;
    find('[data-surveyor-lander-body]').setAttribute('transform', `translate(0 ${(left + right) / 2}) rotate(${angle} 180 168)`);
    game.dataset.surveyorOutcome = result?.reason || 'ready';
  };
  const record = (entry, text) => {
    log.push(entry);
    const item = game.ownerDocument.createElement('li');
    item.className = 'surveyor-model-label';
    item.textContent = text;
    find('[data-surveyor-log]').append(item);
    find('[data-surveyor-empty-log]').hidden = true;
  };
  const onClick = (event) => {
    const button = event.target.closest?.('button');
    if (disposed || !button || !game.contains(button)) return;
    if (button.dataset.surveyorPatch) {
      patchId = button.dataset.surveyorPatch;
      renderControls(); drawLanding();
      announce(format(surveyorTextTemplates[0], { patch: surveyorCopy[patchCopy[patchId]] }));
      return;
    }
    if (button.dataset.surveyorForce) {
      force = Number(button.dataset.surveyorForce);
      renderControls();
      return;
    }
    const action = button.dataset.surveyorAction;
    if (action && action !== 'touchdown') game.dataset.surveyorOutcome = 'ready';
    if (action === 'probe') {
      const result = evaluateSurveyorProbe(patchId, force);
      record(result, format(surveyorTextTemplates[7], { patch: surveyorCopy[patchCopy[patchId]], force, pressure: force, depth: number(result.depth) }));
      renderControls();
      challengeScene?.probe(result);
      announce(format(surveyorTextTemplates[3], { force, depth: number(result.depth) }));
    } else if (action === 'trench') {
      digs[patchId] = Math.min(3, digs[patchId] + 1);
      game.dataset.surveyorDigs = String(digs[patchId]);
      const trench = find(`[data-surveyor-trench="${patchId}"]`);
      trench.setAttribute('visibility', 'visible');
      trench.style.clipPath = `inset(0 ${100 - digs[patchId] * 100 / 3}% 0 0)`;
      challengeScene?.trench(patchId, digs[patchId]);
      if (digs[patchId] < 3) { announce('Keep digging: three scoops reveal the layers.'); return; }
      record({ type: 'trench', patchId }, format(surveyorTextTemplates[8], { patch: surveyorCopy[patchCopy[patchId]] }));
      renderControls();
      announce(surveyorCopy[trenchCopy[patchId]]);
    } else if (action === 'narrower' || action === 'wider') {
      padWidth = Math.max(surveyorModel.minWidth, Math.min(surveyorModel.maxWidth, padWidth + (action === 'wider' ? .5 : -.5)));
      renderControls(); drawLanding();
      announce(format(surveyorTextTemplates[2], { width: number(padWidth), area: number(padWidth ** 2), pressure: number(surveyorModel.loadPerPad / padWidth ** 2) }));
    } else if (action === 'touchdown') {
      const result = evaluateSurveyorTouchdown({ patchId, padWidth, log });
      const outcome = surveyorCopy[result.reason === 'evidence' ? 'stable' : result.reason];
      record(result, format(surveyorTextTemplates[10], { patch: surveyorCopy[patchCopy[patchId]], width: number(padWidth), area: number(result.area), pressure: number(result.pressure), left: number(result.leftSink), right: number(result.rightSink), outcome }));
      drawLanding(result);
      challengeScene?.touchdown(result);
      game.classList.remove('surveyor-touchdown'); void game.offsetWidth; game.classList.add('surveyor-touchdown');
      announceLines([format(surveyorTextTemplates[9], { left: number(result.leftSink), right: number(result.rightSink), difference: number(result.difference) }), outcome, ...(!result.evidence.ready ? [surveyorCopy.incomplete] : [])]);
      // Re-offer completion after any successful retest. The host owns the
      // persistent credential and prevents awarding it twice.
      if (result.accepted) {
        find('[data-surveyor-ending]').hidden = false;
        const EventClass = game.ownerDocument.defaultView?.CustomEvent || globalThis.CustomEvent;
        if (EventClass) root.dispatchEvent(new EventClass('surveyor-soil-success', { bubbles: true }));
      }
    } else if (action === 'restart') {
      patchId = 'a'; force = 1; padWidth = 1; log = [];
      digs = { a: 0, b: 0, c: 0 };
      find('[data-surveyor-log]').replaceChildren();
      find('[data-surveyor-empty-log]').hidden = false;
      find('[data-surveyor-ending]').hidden = true;
      renderControls(); drawLanding(); announce(surveyorCopy.reset);
      challengeScene?.reset();
    }
  };
  game.addEventListener('click', onClick);
  renderControls(); drawLanding();
  return { dispose() { disposed = true; challengeScene?.dispose(); game.removeEventListener('click', onClick); } };
}
