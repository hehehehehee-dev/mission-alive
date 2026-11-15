import { collapseChallengeNotes } from './challenge-steps.js';

// These tools send the same native actions as the existing simulation controls.
// Pointer, touch and keyboard paths therefore share measurements and completion.
export const missionDirections = Object.freeze({
  apolloBuild: ['Repair the broken dust shield', 'My broken fender lets dust reach the gear. Build a replacement so I can keep exploring.', 'Choose maps, tape, then clamps. Place each on the wheel.', 'Fit all three repair parts.'],
  apolloShape: ['Shape it. Test it. Improve it.', 'The maps are attached. Will your repair stop the flying dust?', 'Pull the white patch tip to change its length and angle. Run a dust test.', 'Catch at least 9 of 12 dust paths and keep a 3 cm wheel gap.'],
  surveyorChoose: ['Find ground that can hold a lander', 'The surface hides softer layers. Help me investigate before we trust it.', 'Choose a test patch. Each has different layers in this simulation.', 'Gather evidence and support a stable landing.'],
  surveyorDig: ['Read the ground with your tools', 'A stronger push may sink farther. What is hiding below?', 'Pull the probe down and release at two different forces. Sweep all three soil strips.', 'Two force readings and three excavated strips on this patch.'],
  surveyorLand: ['Use your evidence to design the landing', 'Small feet press hard. Wider feet spread the same load.', 'Change the footpad width, test touchdown, and compare the two sinking depths.', 'Both pads sink 1.4 units or less; their difference is 0.5 or less.'],
  curiosity: ['Send a plan, then debug it', 'I cannot wait for Earth to steer every turn. Your commands must guide me.', 'Build MOVE and TURN blocks. ANALYZE at the outcrop, then reach UPLINK. Use Step to debug.', 'Analyze the rock, upload the data, and choose the claim the evidence supports.'],
  ingenuityPlan: ['Plan a safe return to the ground', 'Flying is only half the job. A slope or boulder can end the flight.', 'Choose terrain and the onboard controller, then test the link.', 'Prepare a flight that can land safely.'],
  ingenuityPower: ['Make lift in thin air', 'My blades need speed before I can leave the ground.', 'Power the rotors, then move on to flight control.', 'Reach the marked safe rotor band.'],
  ingenuityFly: ['Keep the helicopter balanced', 'A gust pushes me sideways. Help my flight computer correct it.', 'Keep the trim inside the striped wind band. In paused mode, set it before each flight stage.', 'Finish the flight with stability and a safe touchdown.'],
  webbOpen: ['Unpack the telescope', 'My wide mirror had to fold for launch. Help me open both wings.', 'Pull LEFT leftward and RIGHT rightward until each wing locks.', 'Both mirror wings open.'],
  webbFocus: ['Turn three star images into one', 'My mirror is open, but the images do not meet yet.', 'Move A, B and C into the gold center circle. Use arrow keys for each image if you prefer.', 'Three images snap into one focused point.'],
  webbInfrared: ['Find the light behind the dust', 'Visible light leaves part of this scene hidden.', 'Move toward infrared and watch the illustrated cloud change.', 'Reveal the hidden glow.'],
  voyagerListen: ['Choose one voice to carry with you', 'My record carries greetings from Earth. Which voice will you answer?', 'Play or read one original greeting, then create your own below.', 'Explore one greeting and save your reply.'],
  voyagerReply: ['Make your own message for space', 'What would you tell someone who has never seen Earth?', 'Write or record a greeting in your language. Save it to your record.', 'A saved text or recording completes your reply.'],
});

export function directionMarkup(key) {
  const [title, story, action, goal] = missionDirections[key];
  return `<aside class="mission-direction"><h4>${title}</h4><p class="direction-voice">${story}</p><p><strong>Do this</strong> <span>${action}</span></p><p class="direction-goal"><strong>Goal</strong> <span>${goal}</span></p></aside>`;
}

export function mountMissionDirections(id) {
  const find = selector => document.querySelector(selector);
  find('#controls')?.querySelectorAll('.mission-incident').forEach(node => node.remove());
  const locations = {
    curiosity: [['#program-workspace', 'curiosity']],
    ingenuity: [['[data-ingenuity-step="plan"]', 'ingenuityPlan'], ['[data-ingenuity-step="power"]', 'ingenuityPower'], ['[data-ingenuity-step="fly"]', 'ingenuityFly']],
    webb: [['#webb-deploy-step', 'webbOpen'], ['#webb-focus-step', 'webbFocus'], ['#webb-infrared-step', 'webbInfrared']],
    voyager: [['.greeting-library', 'voyagerListen'], ['.personal-record-studio', 'voyagerReply']],
  };
  for (const [selector, key] of locations[id] || []) find(selector)?.insertAdjacentHTML('afterbegin', directionMarkup(key));
  if (id === 'voyager') {
    const cover = document.createElement('section');
    cover.className = 'record-cover-editor';
    cover.innerHTML = '<h4>Draw your record cover</h4><p>Paint a symbol for Earth. Your drawing stays in this browser.</p><div class="record-pixels" role="group" aria-label="Draw your record cover"></div>';
    const grid = cover.querySelector('.record-pixels');
    let cells = Array(36).fill(false), painting = false, ink = true;
    try { const saved = JSON.parse(localStorage.getItem('mission-alive-record-cover') || 'null'); if (Array.isArray(saved) && saved.length === 36) cells = saved.map(value => value === true); } catch {}
    const paint = (button, value) => {
      cells[Number(button.dataset.pixel)] = value;
      button.setAttribute('aria-pressed', String(value));
      try { localStorage.setItem('mission-alive-record-cover', JSON.stringify(cells)); } catch {}
    };
    cells.forEach((value, index) => {
      const button = document.createElement('button');
      button.type = 'button'; button.dataset.pixel = index;
      button.setAttribute('aria-label', `${Math.floor(index / 6) + 1}, ${index % 6 + 1}`);
      button.setAttribute('aria-pressed', String(value));
      button.onpointerdown = event => { event.preventDefault(); painting = true; ink = !cells[index]; paint(button, ink); };
      button.onpointerenter = () => { if (painting) paint(button, ink); };
      button.onclick = event => { if (event.detail === 0) paint(button, !cells[index]); };
      grid.append(button);
    });
    grid.onpointerup = grid.onpointercancel = grid.onpointerleave = () => { painting = false; };
    find('.personal-record-studio .mission-direction')?.after(cover);
  }
}

export function probeForceFromPull(distance, height) {
  return Math.max(1, Math.min(4, Math.round(1 + Math.max(0, distance) / Math.max(1, height) * 3)));
}

export function mountMoonTools(lrvRoot, surveyorRoot) {
  const lrv = lrvRoot.querySelector('[data-lrv-workshop]');
  const surveyor = surveyorRoot.querySelector('[data-surveyor-game]');
  const disposers = [];
  const listen = (node, event, handler) => { node.addEventListener(event, handler); disposers.push(() => node.removeEventListener(event, handler)); };
  for (const root of [lrv, surveyor]) root.querySelectorAll('.mission-incident').forEach(node => node.remove());
  const lrvPanels = lrv.querySelectorAll('.challenge-step');
  lrvPanels[0].insertAdjacentHTML('afterbegin', directionMarkup('apolloBuild'));
  lrvPanels[1].insertAdjacentHTML('afterbegin', directionMarkup('apolloShape'));

  // Keep the actual editable geometry visible even while the 3D preview runs.
  const geometry = lrv.querySelector('.lrv-geometry');
  const drawing = lrv.querySelector('.moon-challenge-2d');
  drawing.classList.add('repair-drawing');
  geometry.querySelector('legend').after(drawing);
  const sliders = document.createElement('div');
  sliders.append(...geometry.querySelectorAll(':scope > .lrv-control, :scope > .challenge-notes'));
  geometry.append(sliders);
  collapseChallengeNotes(sliders, 'Number controls');
  lrv.querySelector('.lrv-goals').hidden = true; // The active step's goal above states it in plain language.
  const materials = lrv.querySelector('.lrv-materials');
  const assembly = document.createElement('div');
  assembly.className = 'repair-assembly';
  assembly.innerHTML = `<div class="repair-toolbox" role="group" aria-label="Repair tools">${['maps', 'tape', 'clamps'].map((tool, i) => `<button type="button" data-repair-tool="${tool}" aria-pressed="${i === 0}"><svg viewBox="0 0 60 44" aria-hidden="true">${tool === 'maps' ? '<path d="m4 8 16-4 18 6 17-5v31l-17 5-18-6-16 4zM20 4v31M38 10v31"/>' : tool === 'tape' ? '<ellipse cx="29" cy="21" rx="20" ry="15"/><ellipse cx="29" cy="21" rx="8" ry="6"/><path d="m46 12 10 22H43"/>' : '<path d="M40 7H17v29h23M25 12v20M8 32h25M33 26v12"/>'}</svg><span>${['Maps', 'Tape', 'Clamps'][i]}</span></button>`).join('')}</div><button type="button" class="repair-drop" aria-label="Apply selected tool to the wheel"><svg viewBox="0 0 240 130" aria-hidden="true"><circle cx="110" cy="88" r="32"/><circle cx="110" cy="88" r="11"/><path d="M65 83Q70 40 110 43"/><path class="assembly-map" d="m108 43 95-12 5 13-100 12z"/><path class="assembly-tape" d="m139 39 3 13m30-17 3 13"/><path class="assembly-clamps" d="m113 38v20m12-23v20"/></svg><span>Place on the wheel</span></button><p class="repair-assembly-status" role="status">Choose a tool, then apply it to the repair.</p>`;
  materials.querySelector('legend').after(assembly);
  const oldTools = lrv.querySelector('.lrv-tool-tray');
  const materialAlternatives = collapseChallengeNotes(oldTools, 'Button controls');
  materialAlternatives.append(materials.querySelector('.lrv-control-help'));
  lrv.querySelector('[data-lrv-tool-status]').hidden = true;
  const drop = assembly.querySelector('.repair-drop');
  let selectedTool = 'maps', drag = null;
  const choose = tool => { selectedTool = tool; assembly.querySelectorAll('[data-repair-tool]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.repairTool === tool))); };
  const apply = () => lrv.querySelector(`[data-lrv-tool="${selectedTool}"]`).click();
  listen(drop, 'click', apply);
  for (const button of assembly.querySelectorAll('[data-repair-tool]')) {
    listen(button, 'click', () => choose(button.dataset.repairTool));
    listen(button, 'pointerdown', event => { choose(button.dataset.repairTool); drag = { x: event.clientX, y: event.clientY }; button.setPointerCapture(event.pointerId); });
    listen(button, 'pointerup', event => {
      if (!drag) return;
      const bounds = drop.getBoundingClientRect();
      if (event.clientX >= bounds.left && event.clientX <= bounds.right && event.clientY >= bounds.top && event.clientY <= bounds.bottom) apply();
      drag = null;
    });
    listen(button, 'pointercancel', () => { drag = null; });
  }
  const syncAssembly = () => {
    for (const tool of ['maps', 'tape', 'clamps']) assembly.classList.toggle(`has-${tool}`, lrv.querySelector(`[data-lrv-tool="${tool}"]`).getAttribute('aria-pressed') === 'true');
    const status = assembly.querySelector('.repair-assembly-status');
    const original = lrv.querySelector('[data-lrv-tool-status]');
    if (status.textContent !== original.textContent) status.textContent = original.textContent;
  };
  const assemblyObserver = new MutationObserver(syncAssembly);
  assemblyObserver.observe(oldTools, { subtree: true, attributes: true, attributeFilter: ['aria-pressed'] });
  assemblyObserver.observe(lrv.querySelector('[data-lrv-tool-status]'), { childList: true, characterData: true, subtree: true });
  disposers.push(() => assemblyObserver.disconnect());
  syncAssembly();

  const surveyorPanels = surveyor.querySelectorAll('.challenge-step');
  ['surveyorChoose', 'surveyorDig', 'surveyorLand'].forEach((key, i) => surveyorPanels[i].insertAdjacentHTML('afterbegin', directionMarkup(key)));
  const investigation = surveyorPanels[1].querySelector('fieldset');
  const fieldTools = document.createElement('div');
  fieldTools.className = 'soil-field-tools';
  fieldTools.innerHTML = `<div class="probe-station"><button type="button" class="probe-pull" aria-label="Pull the probe. Arrow keys choose force; Enter measures."><svg viewBox="0 0 70 120" aria-hidden="true"><path d="M20 8h30v16H20zM35 24v82M22 106h26"/></svg><span>Pull down, then release</span><output data-probe-force>1</output></button><div class="probe-scale" aria-hidden="true"><span>1</span><span>2</span><span>3</span><span>4</span></div></div><div class="soil-sweep" role="group" aria-label="Excavate three soil strips">${[0, 1, 2].map(i => `<button type="button" data-soil-strip="${i}" aria-label="Excavate strip ${i + 1}"><span>${i + 1}</span></button>`).join('')}</div><p class="soil-tool-help">Sweep a strip sideways to dig. You can also tap each strip.</p><p class="soil-measurement" role="status"></p>`;
  investigation.querySelector('legend').after(fieldTools);
  const numericControls = document.createElement('div');
  for (const node of [...investigation.children]) {
    if (node === fieldTools || node.tagName === 'LEGEND' || node.matches('[data-surveyor-probe-readout], [data-surveyor-trench-readout], [data-surveyor-evidence]')) continue;
    numericControls.append(node);
  }
  investigation.append(numericControls);
  collapseChallengeNotes(numericControls, 'Button controls');
  const probe = fieldTools.querySelector('.probe-pull');
  surveyor.querySelector('[data-surveyor-probe-readout]').hidden = true;
  let force = 1, pull = null, stripDrag = null;
  const setForce = value => {
    force = value;
    probe.style.setProperty('--probe-pull', `${(force - 1) * 17}px`);
    fieldTools.querySelector('[data-probe-force]').textContent = String(force);
    surveyor.querySelector(`[data-surveyor-force="${force}"]`).click();
  };
  const measure = () => surveyor.querySelector('[data-surveyor-action="probe"]').click();
  listen(probe, 'pointerdown', event => { event.preventDefault(); pull = { start: event.clientY, moved: false }; probe.setPointerCapture(event.pointerId); });
  listen(probe, 'pointermove', event => { if (!pull) return; const dy = event.clientY - pull.start; pull.moved ||= Math.abs(dy) > 5; setForce(probeForceFromPull(dy, 100)); });
  listen(probe, 'pointerup', () => { if (pull) measure(); pull = null; });
  listen(probe, 'pointercancel', () => { pull = null; });
  listen(probe, 'keydown', event => {
    if (['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) {
      event.preventDefault(); setForce(event.key === 'Home' ? 1 : event.key === 'End' ? 4 : Math.max(1, Math.min(4, force + (event.key === 'ArrowDown' ? 1 : -1))));
    }
  });
  listen(probe, 'click', event => { if (event.detail === 0) measure(); });
  let patch = 'a', excavated = 0, suppressStripClick = false;
  const dig = () => { if (excavated < 3) surveyor.querySelector('[data-surveyor-action="trench"]').click(); };
  for (const strip of fieldTools.querySelectorAll('[data-soil-strip]')) {
    listen(strip, 'click', () => { if (suppressStripClick) { suppressStripClick = false; return; } if (!strip.disabled) dig(); });
    listen(strip, 'pointerdown', event => { stripDrag = event.clientX; strip.setPointerCapture(event.pointerId); });
    listen(strip, 'pointerup', event => { if (stripDrag !== null && Math.abs(event.clientX - stripDrag) > 24 && !strip.disabled) { suppressStripClick = true; dig(); event.preventDefault(); setTimeout(() => { suppressStripClick = false; }, 0); } stripDrag = null; });
    listen(strip, 'pointercancel', () => { stripDrag = null; });
  }
  const syncSoil = () => {
    patch = surveyor.dataset.surveyorSelectedPatch || 'a';
    force = Number(surveyor.dataset.surveyorSelectedForce || 1);
    probe.style.setProperty('--probe-pull', `${(force - 1) * 17}px`);
    fieldTools.querySelector('[data-probe-force]').textContent = String(force);
    excavated = Number(surveyor.dataset.surveyorDigs || 0);
    fieldTools.dataset.patch = patch;
    fieldTools.querySelectorAll('[data-soil-strip]').forEach((button, i) => { button.disabled = i < excavated; button.classList.toggle('is-excavated', i < excavated); });
    const source = surveyor.querySelector('[data-surveyor-probe-readout]');
    const output = fieldTools.querySelector('.soil-measurement');
    if (output.textContent !== source.textContent) output.textContent = source.textContent;
  };
  const soilObserver = new MutationObserver(syncSoil);
  soilObserver.observe(surveyor, { attributes: true, attributeFilter: ['data-surveyor-selected-patch', 'data-surveyor-selected-force', 'data-surveyor-digs'] });
  soilObserver.observe(surveyor.querySelector('[data-surveyor-probe-readout]'), { childList: true, characterData: true, subtree: true });
  disposers.push(() => soilObserver.disconnect());
  syncSoil();
  return { dispose() { disposers.forEach(dispose => dispose()); } };
}
