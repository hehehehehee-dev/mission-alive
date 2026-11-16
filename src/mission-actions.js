import { mergeMissionHelp } from './quick-start.js';
import { t } from './i18n.js';

// These tools send the same native actions as the existing simulation controls.
// Pointer, touch and keyboard paths therefore share measurements and completion.
export const missionDirections = Object.freeze({
  // Apollo renders this guidance inside its spatial board rather than as duplicate cards.
  apolloBuild: ['Rebuild the dust shield', 'The fender broke, so every wheel turn throws dust at the crew and equipment.', 'Drag or tap the map panels into the glow. Tape the seams. Clamp the shield to the rover.', 'Build all seven repair pieces.'],
  apolloShape: ['Shape and test the shield', 'The repair is attached. Now make it catch the dust without hitting the rover.', 'Pull Shield reach, then run the dust test. Fine controls are optional.', 'Catch at least 9 of 12 paths and keep the repair clear.'],
  surveyorChoose: ['Game 1 · Find firm ground', 'I am already standing on the Moon. These marks are places to test, not landing zones.', 'Pick A, B, or C. Then run a light and hard test.', 'Choose the spot that holds up best.'],
  surveyorDig: ['Press and dig', 'A hard push can sink farther. Digging shows what the surface is hiding.', 'Push twice. Reveal the layer.', 'Collect two pushes and one dig.'],
  surveyorLand: ['Game 2 · Make a safe landing', 'Small feet press hard. Wide feet spread the same load.', 'Choose small or wide feet, then test.', 'Keep both feet level.'],
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
  if (key.startsWith('surveyor')) {
    return `<aside class="mission-direction mission-direction-compact"><h4>${title}</h4><p>${action}</p></aside>`;
  }
  return `<aside class="mission-direction"><h4>${title}</h4><p class="direction-voice">${story}</p><p><strong>Do this</strong> <span>${action}</span></p><p class="direction-goal"><strong>Goal</strong> <span>${goal}</span></p></aside>`;
}

export function mountMissionDirections(id) {
  const find = selector => document.querySelector(selector);
  find('#controls')?.querySelectorAll('.mission-incident').forEach(node => node.remove());
  const locations = {
    // Curiosity and Webb already show their active action beside the game.
    // Adding another direction card here repeats the same instruction.
    curiosity: [],
    ingenuity: [], // The flight deck gives the active instruction beside the 3D model.
    webb: [],
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
  ['surveyorChoose', 'surveyorLand'].forEach((key, i) => surveyorPanels[i].insertAdjacentHTML('afterbegin', directionMarkup(key)));
  const investigation = surveyorPanels[0].querySelector('.surveyor-controls:not(.surveyor-site-controls)');
  const fieldTools = document.createElement('div');
  fieldTools.className = 'soil-field-tools surveyor-simple-tools';
  fieldTools.innerHTML = `<p class="soil-tool-title">${t('Game 1 · Find firm ground')}</p><p class="soil-tool-help">${t('Test the spot you picked. A light push and a hard push show how soft it is.')}</p><div class="surveyor-simple-actions" role="group" aria-label="${t('Soil tests')}"><button type="button" data-soil-tool="light">${t('Light test')}</button><button type="button" data-soil-tool="hard">${t('Hard test')}</button><button type="button" data-soil-tool="reveal">${t('Reveal layer')}</button></div><p class="soil-measurement" role="status"></p>`;
  investigation.querySelector('legend').after(fieldTools);
  const runProbe = force => {
    surveyor.querySelector(`[data-surveyor-force="${force}"]`).click();
    surveyor.querySelector('[data-surveyor-action="probe"]').click();
  };
  const revealLayer = () => {
    for (let i = 0; i < 3; i += 1) surveyor.querySelector('[data-surveyor-action="trench"]').click();
  };
  listen(fieldTools, 'click', event => {
    const tool = event.target.closest?.('[data-soil-tool]')?.dataset.soilTool;
    if (tool === 'light') runProbe(1);
    if (tool === 'hard') runProbe(4);
    if (tool === 'reveal') revealLayer();
  });
  const syncSoil = () => {
    fieldTools.dataset.patch = surveyor.dataset.surveyorSelectedPatch || 'a';
    const probe = surveyor.querySelector('[data-surveyor-probe-readout]');
    const trench = surveyor.querySelector('[data-surveyor-trench-readout]');
    const output = fieldTools.querySelector('.soil-measurement');
    const next = [probe?.textContent, trench?.textContent].filter(Boolean).join(' ');
    if (next && output.textContent !== next) output.textContent = next;
  };
  const soilObserver = new MutationObserver(syncSoil);
  soilObserver.observe(surveyor, { attributes: true, attributeFilter: ['data-surveyor-selected-patch', 'data-surveyor-selected-force', 'data-surveyor-digs'] });
  soilObserver.observe(surveyor.querySelector('[data-surveyor-probe-readout]'), { childList: true, characterData: true, subtree: true });
  soilObserver.observe(surveyor.querySelector('[data-surveyor-trench-readout]'), { childList: true, characterData: true, subtree: true });
  disposers.push(() => soilObserver.disconnect());
  syncSoil();
  return { dispose() { disposers.forEach(dispose => dispose()); } };
}
