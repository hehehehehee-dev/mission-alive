const missions = Object.freeze({
  curiosity: [["🧱", "Build", "Tap command blocks."], ["▶", "Run", "Watch the rover move."], ["🔬", "Investigate", "Drill, then uplink."]],
  ingenuity: [["📍", "Choose", "Tap a patch on the ground."], ["☝", "Guide", "Hold on the ground and move your finger."], ["🚁", "Land", "Find clear, level ground."]],
  webb: [["↔", "Unfold", "Pull both gold wings out."], ["✦", "Focus", "Move three stars to center."], ["🌈", "Reveal", "Explore infrared light."]],
  voyager: [["▶", "Listen", "Play one Earth greeting."], ["💬", "Reply", "Write or record yours."], ["✓", "Save", "Your stamp unlocks."]],
  apollo17: [["🧰", "Build", "Add maps, tape, and clamps."], ["↕", "Shape", "Pull the white tip."], ["💨", "Test", "Keep dust off the gear."]],
  surveyor3: [["↓", "Press", "Try light and hard."], ["⛏", "Dig", "Reveal the hidden layer."], ["▰", "Test", "Find a level footprint."]],
});

export function quickStartMarkup(mission) {
  const steps = missions[mission];
  if (!steps) return "";
  return `<section class="quick-start" data-tutorial-mission="${mission}" aria-label="Quick start: three visual steps"><div class="quick-start-heading"><span aria-hidden="true">⚡</span><div><strong>QUICK START</strong><small>Follow 1 → 2 → 3. You can reopen this guide any time.</small></div></div><ol>${steps.map(([icon, title, text], index) => `<li><span class="quick-start-number" aria-hidden="true">${index + 1}</span><span class="quick-start-icon" aria-hidden="true">${icon}</span><span><strong>${title}</strong><small>${text}</small></span></li>`).join("")}</ol></section>`;
}

export function whyMarkup(content) {
  return `<details class="why-it-works"><summary><span aria-hidden="true">💡</span> Why this works</summary><div>${content}</div></details>`;
}

// Active steps already explain the next action. Keep the full overview and
// background together on demand, instead of repeating them above the tools.
export function mergeMissionHelp(host) {
  const overview = host?.querySelector('.quick-start');
  if (!overview || overview.closest('.mission-help')) return;
  const explanation = host.querySelector('.why-it-works');
  const mission = overview.dataset.tutorialMission;
  // Voyager has only three short human actions. They stay visible because the
  // listening collections sit below the 3D record and must be easy to find.
  if (mission === 'voyager') {
    overview.classList.add('is-always-visible');
    explanation?.remove();
    return;
  }
  const help = document.createElement('details');
  help.className = 'mission-help';
  const summary = document.createElement('summary');
  summary.textContent = 'How to play';
  overview.before(help);
  help.append(summary, overview);
  if (explanation) {
    help.append(explanation.querySelector('div'));
    explanation.remove();
  }
  const key = mission ? `mission-alive-tutorial-seen-${mission}-v1` : '';
  let seen = false;
  try { seen = Boolean(key && localStorage.getItem(key)); } catch {}
  if (!seen) {
    help.classList.add('is-first-tutorial');
    summary.textContent = 'First time? See 3 steps';
    const finishTutorial = event => {
      if (event.target.closest?.('.mission-help') || !event.target.closest?.('button, [role="button"], input, select, textarea, canvas, [tabindex]')) return;
      help.open = false;
      help.classList.remove('is-first-tutorial');
      summary.textContent = 'How to play';
      try { if (key) localStorage.setItem(key, '1'); } catch {}
      host.removeEventListener('pointerdown', finishTutorial, true);
      host.removeEventListener('keydown', finishTutorial, true);
    };
    host.addEventListener('pointerdown', finishTutorial, true);
    host.addEventListener('keydown', finishTutorial, true);
  }
}
