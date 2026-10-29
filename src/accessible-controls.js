const headings = ['north', 'east', 'south', 'west'];

// Both the visual map and the text table read the same simulation state.
export function roverMapCells(mission, state) {
  return Array.from({ length: mission.size }, (_, y) => Array.from({ length: mission.size }, (_, x) => {
    const labels = [];
    if (mission.obstacles.has(`${x},${y}`)) labels.push('Rock');
    if (x === mission.start.x && y === mission.start.y) labels.push('Start');
    if (x === mission.sample.x && y === mission.sample.y) labels.push(state.sampleAnalyzed ? 'Analyzed outcrop' : 'Drill outcrop');
    if (x === mission.goal.x && y === mission.goal.y) labels.push('Uplink');
    if (x === state.roverX && y === state.roverY) labels.push('Rover');
    return labels.length ? labels : ['Clear tile'];
  }));
}

export function roverPosition(state) {
  return `Rover: row ${state.roverY + 1}, column ${state.roverX + 1}. Facing ${headings[state.roverDir]}.`;
}

export function mountRoverTextMap(root, mission, getState, onRead) {
  const details = document.createElement('details');
  details.className = 'rover-text-map';
  details.innerHTML = `<summary>Read the mission map</summary><p>Rows run from top to bottom. Columns run from left to right. North is toward row 1.</p><p id="rover-position"></p><button type="button" id="read-rover-position">Read current position</button><div class="rover-table-scroll"><table><caption>Science route · the same map in text</caption><thead><tr><td></td>${Array.from({ length: mission.size }, (_, i) => `<th scope="col"><span>Column</span> ${i + 1}</th>`).join('')}</tr></thead><tbody>${Array.from({ length: mission.size }, (_, y) => `<tr><th scope="row"><span>Row</span> ${y + 1}</th>${Array.from({ length: mission.size }, () => '<td></td>').join('')}</tr>`).join('')}</tbody></table></div>`;
  details.querySelector('.rover-table-scroll').tabIndex = 0;
  details.querySelector('.rover-table-scroll').setAttribute('role', 'region');
  details.querySelector('.rover-table-scroll').setAttribute('aria-label', 'Scrollable text map');
  root.querySelector('#rover-grid').after(details);
  const cells = [...details.querySelectorAll('tbody td')];
  const position = details.querySelector('#rover-position');
  details.querySelector('#read-rover-position').onclick = () => onRead(roverPosition(getState()));
  return {
    update() {
      const state = getState();
      const description = roverPosition(state);
      if (position.dataset.source !== description) { position.dataset.source = description; position.textContent = description; }
      roverMapCells(mission, state).flat().forEach((labels, index) => {
        const cell = cells[index];
        const key = labels.join('|');
        if (cell.dataset.labels === key) return;
        cell.dataset.labels = key;
        cell.classList.toggle('has-rover', labels.includes('Rover'));
        cell.replaceChildren(...labels.map(label => { const span = document.createElement('span'); span.textContent = label; return span; }));
      });
    },
  };
}

export function describeStar(spot) {
  return spot.locked ? 'Focused' : `Horizontal ${Math.round(spot.x * 100)}%, vertical ${Math.round(spot.y * 100)}%. Target: 50%, 50%.`;
}

export const flightCheckpoints = Object.freeze([0.9, 2.4, 4.4, 6, 7.9]);
export function nextFlightCheckpoint(seconds) {
  return flightCheckpoints.find(point => point > seconds + .001) ?? flightCheckpoints.at(-1);
}

export function mountRangeButtons(input, { label, step = 5 }) {
  const group = document.createElement('div');
  group.className = 'range-stepper';
  group.innerHTML = `<button type="button" aria-label="Decrease ${label}">−${step}</button><output aria-live="off"></output><button type="button" aria-label="Increase ${label}">+${step}</button>`;
  const track = input.closest('.trim-control');
  if (track) track.after(group);
  else input.after(group);
  const buttons = [...group.querySelectorAll('button')];
  const refresh = () => {
    group.querySelector('output').textContent = `${input.value}%`;
    buttons.forEach((button, index) => { button.disabled = input.disabled || (index === 0 ? +input.value <= +input.min : +input.value >= +input.max); });
  };
  buttons.forEach((button, index) => { button.onclick = () => {
    if (input.disabled) return;
    input.value = String(Math.min(+input.max, Math.max(+input.min, +input.value + (index ? step : -step))));
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.dispatchEvent(new Event('change', { bubbles: true }));
  }; });
  input.addEventListener('input', refresh);
  const observer = new MutationObserver(refresh);
  observer.observe(input, { attributes: true, attributeFilter: ['disabled'] });
  refresh();
  return { dispose() { observer.disconnect(); input.removeEventListener('input', refresh); group.remove(); } };
}
