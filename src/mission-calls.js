export const missionCalls = Object.freeze({
  apollo17: Object.freeze({
    machine: 'Apollo 17 LRV',
    request: 'Help me stop the dust.',
    problem: "My broken fender lets lunar dust reach the rover's equipment.",
    move: 'Build a replacement, shape it, then run a dust test.',
    reward: 'Resourcefulness stamp',
  }),
  surveyor3: Object.freeze({
    machine: 'Surveyor 3',
    request: 'Help me read the ground.',
    problem: 'The lunar surface hides layers that a lander cannot see.',
    move: 'Probe, excavate, and use evidence to test a safe footprint.',
    reward: 'Evidence stamp',
  }),
  curiosity: Object.freeze({
    machine: 'Curiosity',
    request: 'Help me plan a safe route.',
    problem: 'Earth cannot steer every turn before danger reaches me.',
    move: 'Program a route, analyze the rock, and uplink the evidence.',
    reward: 'Patience stamp',
  }),
  ingenuity: Object.freeze({
    machine: 'Ingenuity',
    request: 'Help me land through the wind.',
    problem: "Mars's thin air and gusts can push me past a safe landing.",
    move: 'Choose a landing zone and guide me through the wind.',
    reward: 'Daring stamp',
  }),
  webb: Object.freeze({
    machine: 'Webb',
    request: 'Help me focus the stars.',
    problem: 'My folded mirror sees one star as many blurry images.',
    move: 'Open the mirror, align the images, and reveal infrared.',
    reward: 'Precision stamp',
  }),
  voyager: Object.freeze({
    machine: 'Voyager 1',
    request: "Help me carry Earth's voice.",
    problem: "Earth's voices can travel only if someone chooses to send them.",
    move: 'Hear one greeting, then add a greeting of your own.',
    reward: 'Endurance stamp',
  }),
});

export function signalIconMarkup(className = 'training-signal-icon') {
  return `<svg class="${className}" viewBox="0 0 32 32" aria-hidden="true"><circle cx="16" cy="16" r="3"/><path fill="none" d="M10.5 10.5a7.8 7.8 0 0 0 0 11M21.5 10.5a7.8 7.8 0 0 1 0 11M6 6a14.2 14.2 0 0 0 0 20M26 6a14.2 14.2 0 0 1 0 20"/></svg>`;
}

export function missionCallMarkup(id, { elementId = 'module-mission-objective' } = {}) {
  const call = missionCalls[id];
  if (!call) return '';
  return `<section class="mission-call" id="${elementId}" aria-labelledby="${elementId}-title">
    <div class="mission-call-signal">${signalIconMarkup()}<strong id="${elementId}-title">TRAINING SIGNAL · ${call.machine} NEEDS YOUR HELP</strong></div>
    <div class="mission-call-grid">
      <p><strong>PROBLEM</strong><span>${call.problem}</span></p>
      <p><strong>YOUR MOVE</strong><span>${call.move}</span></p>
      <p class="mission-call-reward"><strong>REWARD</strong><span>${call.reward}</span></p>
    </div>
    <small>Academy simulation based on a real mission problem.</small>
  </section>`;
}

export function mapHelpCalloutMarkup(id, location) {
  const call = missionCalls[id];
  if (!call) return '';
  return `<span class="diagram-callout"><span class="map-help-signal"><i aria-hidden="true"></i><span>HELP REQUEST</span></span><strong>${call.machine}</strong><span class="map-help-request">${call.request}</span><small>${location} · TRAINING</small></span>`;
}
