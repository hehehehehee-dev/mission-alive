import { collapseChallengeNotes } from './challenge-steps.js';
import { mergeMissionHelp } from './quick-start.js';

// These tools send the same native actions as the existing simulation controls.
// Pointer, touch and keyboard paths therefore share measurements and completion.
export const missionDirections = Object.freeze({
  // Apollo renders this guidance inside its spatial board rather than as duplicate cards.
  apolloBuild: ['Rebuild the dust shield', 'The fender broke, so every wheel turn throws dust at the crew and equipment.', 'Drag or tap the map panels into the glow. Tape the seams. Clamp the shield to the rover.', 'Build all seven repair pieces.'],
  apolloShape: ['Shape and test the shield', 'The repair is attached. Now make it catch the dust without hitting the rover.', 'Pull Shield reach, then run the dust test. Fine controls are optional.', 'Catch at least 9 of 12 paths and keep the repair clear.'],
  surveyorChoose: ['Pick a soil spot', 'I am already standing on the Moon. These marks are places to test, not landing zones.', 'Tap A, B, or C. Start with the spot you want to understand.', 'Choose one spot for your field log.'],
  surveyorDig: ['Press and dig', 'A hard push can sink farther. Digging shows what the surface is hiding.', 'Pull the probe twice with different strength, then sweep all three strips.', 'Record two pushes and reveal the hidden layer.'],
  surveyorLand: ['Try the landing feet', 'Small feet press hard. Wide feet spread the same load.', 'Choose a footprint, drop the test feet, and compare the two sides.', 'Find a footprint that stays level and does not sink too far.'],
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
    ingenuity: [], // The flight deck gives the active instruction beside the 3D model.
    webb: [['#webb-deploy-step', 'webbOpen'], ['#webb-focus-step', 'webbFocus'], ['#webb-infrared-step', 'webbInfrared']],
    // Voyager's objective, player caption and studio intro already give these
    // instructions. A second pair of instruction cards repeats the same task.
    voyager: [],
  };
  for (const [selector, key] of locations[id] || []) find(selector)?.insertAdjacentHTML('afterbegin', directionMarkup(key));
  mergeMissionHelp(find('#controls'));
  mergeMissionHelp(find('#module-reading'));
}

export function probeForceFromPull(distance, height) {
  return Math.max(1, Math.min(4, Math.round(1 + Math.max(0, distance) / Math.max(1, height) * 3)));
}

export function mountMoonTools(lrvRoot, surveyorRoot) {
  const lrv = lrvRoot.querySelector('[data-lrv-workshop]');
  const surveyor = surveyorRoot.querySelector('[data-surveyor-game]');
  const disposers = [];
  for (const root of [lrv, surveyor]) mergeMissionHelp(root);
  const listen = (node, event, handler) => { node.addEventListener(event, handler); disposers.push(() => node.removeEventListener(event, handler)); };
  surveyor.querySelectorAll('.mission-incident').forEach(node => node.remove());

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
