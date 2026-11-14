const missions = Object.freeze({
  curiosity: [["🧱", "Build", "Tap command blocks."], ["▶", "Run", "Watch the rover move."], ["🔬", "Investigate", "Drill, then uplink."]],
  ingenuity: [["📍", "Choose", "Pick a landing zone."], ["📡", "Prepare", "Link and power up."], ["🚁", "Fly", "Hold the wind band."]],
  webb: [["↔", "Unfold", "Pull both gold wings out."], ["✦", "Focus", "Move three stars to center."], ["🌈", "Reveal", "Explore infrared light."]],
  voyager: [["▶", "Listen", "Play one Earth greeting."], ["💬", "Reply", "Write or record yours."], ["✓", "Save", "Your stamp unlocks."]],
  apollo17: [["🧰", "Build", "Add maps, tape, and clamps."], ["↕", "Shape", "Move the blue patch."], ["💨", "Test", "Keep dust off the gear."]],
  surveyor3: [["↓", "Probe", "Press twice with new force."], ["⛏", "Dig", "Reveal the hidden layer."], ["🛬", "Test", "Make the landing stable."]],
});

export function quickStartMarkup(mission) {
  const steps = missions[mission];
  if (!steps) return "";
  return `<section class="quick-start" aria-label="Quick start: three visual steps"><div class="quick-start-heading"><span aria-hidden="true">⚡</span><div><strong>QUICK START</strong><small>See it. Try it. Fix it.</small></div></div><ol>${steps.map(([icon, title, text], index) => `<li><span class="quick-start-number" aria-hidden="true">${index + 1}</span><span class="quick-start-icon" aria-hidden="true">${icon}</span><span><strong>${title}</strong><small>${text}</small></span></li>`).join("")}</ol></section>`;
}

export function whyMarkup(content) {
  return `<details class="why-it-works"><summary><span aria-hidden="true">💡</span> Why this works</summary><div>${content}</div></details>`;
}
