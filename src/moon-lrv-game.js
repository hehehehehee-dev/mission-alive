// Original Mission Alive model. The dimensions, dust paths, and pass criteria below
// are teaching choices, not measurements or test results from Apollo hardware.
export const LRV_GAME_COPY = Object.freeze({
  eyebrow: "APOLLO 17 · REPAIR TRAINING",
  title: "Keep the dust off the gear",
  introduction: "A broken rover fender let wheel-thrown dust reach the astronauts and their equipment. Apollo 17's crew made a replacement using spare maps, duct tape, and clamps.",
  instructions: "Choose a tool and apply it to the wheel. Drag the patch tip to shape it, or use the buttons below. Run a dust test and compare your trials.",
  simulation: "Illustrated simulation · not NASA test data.",
  dimensions: "All dimensions below belong to this game model, not the real rover.",
  diagram: "Side-view model of a rover wheel, map fender patch, seat, and equipment. Orange dust paths reach the equipment; blue paths are caught by the patch.",
  diagramCaption: "The wheel throws dust toward the gear. A useful patch catches the dust before it gets there.",
  preview: "DESIGN PREVIEW · run a test to measure this setup",
  tested: "DUST TEST · twelve sample paths",
  wheel: "WHEEL",
  patch: "MAP PATCH",
  equipment: "EQUIPMENT",
  caughtDust: "Caught dust",
  reachingDust: "Dust reaching gear",
  materials: "1. Assemble the repair",
  maps: "Spare maps: patch material",
  tape: "Duct tape: join the maps",
  attachment: "Attach the patch to the rover",
  tapeOnly: "Tape only",
  clamps: "Clamps + tape",
  attachmentHelp: "Game rule: tape joins the maps. Clamps hold the taped patch on the rover during the test.",
  geometry: "2. Shape your fender",
  length: "Length",
  angle: "Angle",
  clearance: "Clearance setting",
  lengthHelp: "A longer patch can catch paths that pass a short patch.",
  angleHelp: "0° is level. A positive angle lifts the tip; a negative angle lowers it toward the wheel.",
  clearanceHelp: "This raises the patch mount above the top of the wheel. The test measures the smallest gap along the whole patch.",
  decreaseLength: "Decrease fender length",
  increaseLength: "Increase fender length",
  decreaseAngle: "Decrease fender angle",
  increaseAngle: "Increase fender angle",
  decreaseClearance: "Decrease fender clearance setting",
  increaseClearance: "Increase fender clearance setting",
  goals: "Pass this model test: at most 3 of 12 dust paths reach the equipment, the whole patch stays at least 3 cm from the wheel, and the attachment holds.",
  runTest: "Run dust test",
  tryAgain: "Try another design",
  reset: "Reset workshop",
  results: "3. Read the test",
  dustMeasure: "Dust reaching equipment",
  clearanceMeasure: "Smallest wheel gap",
  attachmentMeasure: "Attachment holding",
  dustGoal: "Goal: 3 or fewer of 12 paths",
  clearanceGoal: "Goal: at least 3 cm in this model",
  attachmentGoal: "Goal: a taped map patch held by clamps",
  notTested: "Not tested",
  holding: "Holding",
  slipped: "Slipped in the model",
  incomplete: "Patch incomplete",
  passed: "Passed",
  adjust: "Adjust and retest",
  readyStatus: "Workshop ready. Assemble a patch and run a dust test.",
  changedStatus: "Design changed. Run a new dust test to measure this setup.",
  passedStatus: "Test passed. Your patch catches enough dust, clears the wheel, and stays attached. Another shape may work too.",
  incompleteStatus: "Build the whole patch first: select spare maps and join them with duct tape, then test again.",
  wheelStatus: "The patch is too close to the wheel. Raise the clearance setting or lift the tip, then test again.",
  attachmentStatus: "The patch slipped. Try clamps with the taped maps, then test again.",
  dustStatus: "Too much dust reached the equipment. Try a longer patch or change its angle and clearance, then test again.",
  narrator: "A small repair can protect a big mission. The Apollo 17 crew solved their real dust problem with materials they had on hand.",
  history: "Your trial history",
  historyEmpty: "No trials yet. Test a design to start comparing.",
  historyLimit: "The most recent six trials stay here while this workshop is open.",
  trial: "Trial",
  design: "Design",
  dust: "Dust",
  wheelGap: "Wheel gap",
  result: "Result",
  noPatch: "No map patch",
  untaped: "Maps without tape",
  modelDetails: "How this model works",
  modelExplanation: "Twelve curved sample paths leave the wheel. A path is caught where it crosses the patch. Tape alone slips after the first four paths; clamps hold an assembled patch. The wheel-gap check uses the closest point on the patch. These simplified rules help compare designs; they do not predict real lunar dust.",
  source: "NASA · Lunar Dust and Duct Tape ↗",
});

export const LRV_DEFAULT_CONFIGURATION = Object.freeze({
  length: 22,
  angle: -20,
  clearance: 2,
  maps: false,
  tape: false,
  attachment: "tape",
});

export const LRV_CONTROL_LIMITS = Object.freeze({
  length: Object.freeze({ min: 20, max: 80, step: 2 }),
  angle: Object.freeze({ min: -25, max: 35, step: 5 }),
  clearance: Object.freeze({ min: 0, max: 20, step: 1 }),
});

const WHEEL_RADIUS = 24;
const DUST_PATHS = 12;
const EQUIPMENT = Object.freeze({ left: 85, right: 120, bottom: 30, top: 105 });
const SOURCE = "https://science.nasa.gov/image-article/apod-2004-april-17-lunar-dust-and-duct-tape/";
const copy = LRV_GAME_COPY;
let nextWorkshopId = 0;

function safeDimension(value, key) {
  const number = typeof value === "number" || typeof value === "string" && value.trim() !== "" ? Number(value) : NaN;
  const { min, max, step } = LRV_CONTROL_LIMITS[key];
  if (!Number.isFinite(number)) return LRV_DEFAULT_CONFIGURATION[key];
  return Math.max(min, Math.min(max, min + Math.round((number - min) / step) * step));
}

export function normalizeLrvConfiguration(input = {}) {
  const value = input && typeof input === "object" ? input : {};
  return {
    length: safeDimension(value.length, "length"),
    angle: safeDimension(value.angle, "angle"),
    clearance: safeDimension(value.clearance, "clearance"),
    maps: value.maps === true,
    tape: value.maps === true && value.tape === true,
    attachment: value.attachment === "clamps" ? "clamps" : "tape",
  };
}

/** Model geometry in centimeters; positive y is up and positive angle lifts the tip. */
export function lrvPatchGeometry(input) {
  const configuration = normalizeLrvConfiguration(input);
  const radians = configuration.angle * Math.PI / 180;
  const start = { x: -8, y: WHEEL_RADIUS + configuration.clearance };
  const end = {
    x: start.x + configuration.length * Math.cos(radians),
    y: start.y + configuration.length * Math.sin(radians),
  };
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const along = Math.max(0, Math.min(1, -(start.x * dx + start.y * dy) / (dx * dx + dy * dy)));
  const nearest = { x: start.x + along * dx, y: start.y + along * dy };
  // The patch has a model thickness of 2 cm, so check its inner edge, not just its centerline.
  const clearanceCm = Math.hypot(nearest.x, nearest.y) - WHEEL_RADIUS - 1;
  return { start, end, nearest, clearanceCm };
}

function crossing(first, second, start, end) {
  const dx = second.x - first.x;
  const dy = second.y - first.y;
  const px = end.x - start.x;
  const py = end.y - start.y;
  const denominator = dx * py - dy * px;
  if (Math.abs(denominator) < 1e-10) return null;
  const offsetX = start.x - first.x;
  const offsetY = start.y - first.y;
  const alongDust = (offsetX * py - offsetY * px) / denominator;
  const alongPatch = (offsetX * dy - offsetY * dx) / denominator;
  if (alongDust < 0 || alongDust > 1 || alongPatch < 0 || alongPatch > 1) return null;
  return { x: first.x + dx * alongDust, y: first.y + dy * alongDust };
}

function reachesEquipment(first, second) {
  if (first.x > EQUIPMENT.left || second.x < EQUIPMENT.left) return false;
  const along = (EQUIPMENT.left - first.x) / (second.x - first.x);
  const y = first.y + (second.y - first.y) * along;
  return y >= EQUIPMENT.bottom && y <= EQUIPMENT.top;
}

/** Trace the same twelve paths for every design so trials can be compared fairly. */
export function lrvDustTrajectories(input) {
  const configuration = normalizeLrvConfiguration(input);
  const patch = lrvPatchGeometry(configuration);
  const assembled = configuration.maps && configuration.tape;
  return Array.from({ length: DUST_PATHS }, (_, index) => {
    const points = [];
    let impact = null;
    let hitEquipment = false;
    // Model tape-only attachment slips after path four. This is a declared game rule.
    const patchPresent = assembled && (configuration.attachment === "clamps" || index < 4);
    for (let x = 18; x <= 126; x += 1.5) {
      const travel = x - 18;
      const point = { x, y: 16 + (0.7 + index * 0.075) * travel - 0.005 * travel * travel };
      const previous = points.at(-1);
      if (previous && patchPresent) impact = crossing(previous, point, patch.start, patch.end);
      if (impact) {
        points.push(impact);
        break;
      }
      if (previous && reachesEquipment(previous, point)) hitEquipment = true;
      points.push(point);
      if (point.y < -WHEEL_RADIUS) break;
    }
    if (impact) {
      // Illustrate captured dust dropping beside the wheel, before the equipment.
      for (let step = 1; step <= 8; step++) {
        const fraction = step / 8;
        points.push({ x: impact.x + 8 * fraction, y: impact.y - (impact.y + WHEEL_RADIUS) * fraction * fraction });
      }
    }
    return { index, points, blocked: Boolean(impact), hitEquipment, impact };
  });
}

/** A promising preview cannot pass until an actual test action supplies tested: true. */
export function evaluateLrvRepair(input, { tested = false } = {}) {
  const configuration = normalizeLrvConfiguration(input);
  const geometry = lrvPatchGeometry(configuration);
  const paths = lrvDustTrajectories(configuration);
  const dustReaching = paths.filter((path) => path.hitEquipment).length;
  const assembled = configuration.maps && configuration.tape;
  const dustSafe = dustReaching <= 3;
  const wheelSafe = geometry.clearanceCm >= 3;
  const attachmentHolding = assembled && configuration.attachment === "clamps";
  return {
    configuration, geometry, paths, tested: tested === true,
    dustReaching, dustTotal: DUST_PATHS, dustSafe,
    clearanceCm: geometry.clearanceCm, wheelSafe, assembled, attachmentHolding,
    passed: tested === true && dustSafe && wheelSafe && attachmentHolding,
  };
}

const escape = (text) => String(text).replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character]);
const pointOnScreen = ({ x, y }) => ({ x: 210 + x * 2.4, y: 330 - y * 2.4 });
const coordinate = (number) => Number(number.toFixed(2));
const svgPoint = (point) => { const screen = pointOnScreen(point); return `${coordinate(screen.x)},${coordinate(screen.y)}`; };

function patchMarkup(configuration) {
  if (!configuration.maps) return "";
  const { start, end } = lrvPatchGeometry(configuration);
  const angle = configuration.angle * Math.PI / 180;
  const normal = { x: -Math.sin(angle), y: Math.cos(angle) };
  const edge = (point, side) => ({ x: point.x + normal.x * side, y: point.y + normal.y * side });
  const polygon = [edge(start, 1), edge(end, 1), edge(end, -1), edge(start, -1)].map(svgPoint).join(" ");
  const seams = [0.3, 0.63].map((fraction) => {
    const middle = { x: start.x + (end.x - start.x) * fraction, y: start.y + (end.y - start.y) * fraction };
    const from = edge(middle, 1.8);
    const to = edge(middle, -1.8);
    return `<path d="M${svgPoint(from)}L${svgPoint(to)}" stroke="${configuration.tape ? "#e9ece5" : "#6d8778"}" stroke-width="${configuration.tape ? 8 : 2}"/>`;
  }).join("");
  const clamps = configuration.attachment === "clamps" && configuration.tape ? [0.08, 0.2].map((fraction) => {
    const middle = pointOnScreen({ x: start.x + (end.x - start.x) * fraction, y: start.y + (end.y - start.y) * fraction });
    return `<rect x="${coordinate(middle.x - 3)}" y="${coordinate(middle.y - 8)}" width="6" height="16" rx="2" fill="#efaf6b" stroke="#533923" stroke-width="1.5"/>`;
  }).join("") : "";
  return `<g class="lrv-map-patch"><path d="M${svgPoint({ x: -8, y: WHEEL_RADIUS })}L${svgPoint(start)}" stroke="#b9c6cb" stroke-width="5"/><polygon points="${polygon}" fill="#92b6a0" stroke="#e4efda" stroke-width="2"/>${seams}${clamps}</g>`;
}

function dustMarkup(result) {
  return result.paths.map((path) => `<path class="lrv-dust-path ${path.blocked ? "is-caught" : path.hitEquipment ? "is-reaching" : "is-missed"}" data-lrv-dust="${path.blocked ? "caught" : "reaching"}" d="${path.points.map((point, index) => `${index ? "L" : "M"}${svgPoint(point)}`).join("")}" fill="none" stroke="${path.blocked ? "#6ce0df" : "#ffb267"}" stroke-width="${path.blocked ? 2 : 2.5}" stroke-dasharray="${path.blocked ? "5 5" : "3 7"}" opacity=".8"/>`).join("");
}

function svgMarkup(result) {
  return `<svg class="lrv-workshop-svg" viewBox="0 0 720 430" width="720" height="430" role="img" aria-label="${escape(copy.diagram)}" focusable="false">
    <rect width="720" height="430" rx="20" fill="#111d2c"/>
    <path d="M0 390Q100 382 186 389T366 387T552 391T720 387V430H0Z" fill="#343945"/>
    <path d="M24 407h36m60-12h21m198 15h40m143-12h22m83 16h22" stroke="#69717b" stroke-width="2"/>
    <g class="lrv-seat-equipment">
      <path d="M291 300H549M307 298l31-55h179l27 55M339 244l-12-66h61l20 66" fill="none" stroke="#a4b1b7" stroke-width="9" stroke-linejoin="round"/>
      <path d="M333 179h52v49h-42z" fill="#81959b" stroke="#d9e1df" stroke-width="3"/>
      <path d="M405 124h39v118h-39zM450 95h48v147h-48zM505 154h42v88h-42z" fill="#c0c6bb" stroke="#e9ede4" stroke-width="3"/>
      <path d="M416 142h18v19h-18zM461 115h26v29h-26zM514 169h23v20h-23z" fill="#294c57" stroke="#6bd3d0" stroke-width="2"/>
      <path d="M416 178h18m27-15h26m27 43h23" stroke="#677b80" stroke-width="4"/>
      <path d="M499 302l50 53M302 302l-38 27" stroke="#a4b1b7" stroke-width="7"/>
      <circle cx="550" cy="353" r="34" fill="#24323c" stroke="#82929b" stroke-width="5"/>
      <circle cx="550" cy="353" r="10" fill="#a4b1b7"/>
    </g>
    <g class="lrv-wheel"><circle cx="210" cy="330" r="57.6" fill="#202e39" stroke="#91a2a9" stroke-width="5"/><circle cx="210" cy="330" r="44" fill="none" stroke="#657b86" stroke-width="2"/>
      ${Array.from({ length: 12 }, (_, index) => { const angle = index * Math.PI / 6; return `<path d="M${coordinate(210 + Math.cos(angle) * 13)},${coordinate(330 + Math.sin(angle) * 13)}L${coordinate(210 + Math.cos(angle) * 54)},${coordinate(330 + Math.sin(angle) * 54)}" stroke="#7d949e" stroke-width="2"/>`; }).join("")}
      <circle cx="210" cy="330" r="14" fill="#b6c4c8" stroke="#526a77" stroke-width="3"/>
    </g>
    <path class="lrv-fender-stub" d="M139 310Q148 262 191 265" fill="none" stroke="#c7c7b6" stroke-width="9"/>
    <g data-lrv-dust-paths>${dustMarkup(result)}</g>
    <g data-lrv-patch>${patchMarkup(result.configuration)}</g>
    <g class="lrv-svg-labels" fill="#dce7e9" font-family="system-ui, sans-serif" font-size="13" font-weight="700" letter-spacing="1.5"><text x="160" y="421">${copy.wheel}</text><text x="279" y="65">${copy.patch}</text><text x="444" y="65">${copy.equipment}</text></g>
  </svg>`;
}

function controlMarkup(id, key, label, help, decrease, increase) {
  const { min, max, step } = LRV_CONTROL_LIMITS[key];
  const value = LRV_DEFAULT_CONFIGURATION[key];
  return `<div class="lrv-control"><div class="lrv-control-heading"><label for="${id}-${key}">${label} <span>${key === "angle" ? "(°)" : "(cm)"}</span></label><output data-lrv-value="${key}" for="${id}-${key}">${value}${key === "angle" ? "°" : " cm"}</output></div><div class="lrv-range-row"><button type="button" class="lrv-step" data-lrv-step="${key}" data-lrv-delta="-${step}" aria-label="${decrease}">−</button><input id="${id}-${key}" data-lrv-control="${key}" type="range" min="${min}" max="${max}" step="${step}" value="${value}" aria-describedby="${id}-${key}-help"><button type="button" class="lrv-step" data-lrv-step="${key}" data-lrv-delta="${step}" aria-label="${increase}">+</button></div><p class="lrv-control-help" id="${id}-${key}-help">${help}</p></div>`;
}

export function lrvGameMarkup() {
  const id = `lrv-workshop-${++nextWorkshopId}`;
  const initial = evaluateLrvRepair(LRV_DEFAULT_CONFIGURATION);
  return `<section class="moon-game lrv-game" data-lrv-workshop data-lrv-result="untested" aria-labelledby="${id}-title">
    <header class="lrv-heading"><p class="eyebrow">${copy.eyebrow}</p><h3 id="${id}-title">${copy.title}</h3><p>${copy.introduction}</p><p>${copy.instructions}</p></header>
    <div class="lrv-workshop-grid"><figure class="lrv-illustration"><p class="lrv-preview-label" data-lrv-preview-label>${copy.preview}</p>${svgMarkup(initial)}<figcaption>${copy.diagramCaption}</figcaption><div class="lrv-dust-legend"><span class="lrv-dust-key lrv-dust-caught">${copy.caughtDust}</span><span class="lrv-dust-key lrv-dust-reaching">${copy.reachingDust}</span></div><p class="lrv-simulation-label">${copy.simulation}</p></figure>
    <div class="lrv-controls"><fieldset class="lrv-materials"><legend>${copy.materials}</legend><div class="lrv-tool-tray" role="group" aria-label="Repair tools"><button type="button" data-lrv-tool="maps" aria-pressed="true">${copy.maps}</button><button type="button" data-lrv-tool="tape" aria-pressed="false">${copy.tape}</button><button type="button" data-lrv-tool="clamps" aria-pressed="false">${copy.clamps}</button></div><p data-lrv-tool-status role="status">Choose a tool, then apply it to the repair.</p><button type="button" data-lrv-apply>Apply selected tool to the wheel</button><p class="lrv-control-help">${copy.attachmentHelp}</p></fieldset>
    <fieldset class="lrv-geometry"><legend>${copy.geometry}</legend><p class="lrv-model-dimensions">${copy.dimensions}</p>
    ${controlMarkup(id, "length", copy.length, copy.lengthHelp, copy.decreaseLength, copy.increaseLength)}
    ${controlMarkup(id, "angle", copy.angle, copy.angleHelp, copy.decreaseAngle, copy.increaseAngle)}
    ${controlMarkup(id, "clearance", copy.clearance, copy.clearanceHelp, copy.decreaseClearance, copy.increaseClearance)}</fieldset>
    <p class="lrv-goals">${copy.goals}</p><div class="lrv-actions"><button type="button" class="primary lrv-test-button" data-lrv-test>${copy.runTest}</button><button type="button" data-lrv-try hidden>${copy.tryAgain}</button><button type="button" data-lrv-reset>${copy.reset}</button></div></div></div>
    <section class="lrv-results" aria-labelledby="${id}-results"><h4 id="${id}-results">${copy.results}</h4><dl class="lrv-measures"><div data-lrv-measure="dust"><dt>${copy.dustMeasure}</dt><dd><strong data-lrv-verdict hidden></strong> <span data-lrv-dust-result>${copy.notTested}</span><small>${copy.dustGoal}</small></dd></div><div data-lrv-measure="clearance"><dt>${copy.clearanceMeasure}</dt><dd><strong data-lrv-verdict hidden></strong> <span data-lrv-clearance-result>${copy.notTested}</span><small>${copy.clearanceGoal}</small></dd></div><div data-lrv-measure="attachment"><dt>${copy.attachmentMeasure}</dt><dd><strong data-lrv-verdict hidden></strong> <span data-lrv-attachment-result>${copy.notTested}</span><small>${copy.attachmentGoal}</small></dd></div></dl><p class="lrv-result-status" data-lrv-status role="status" aria-live="polite" aria-atomic="true">${copy.readyStatus}</p><p class="lrv-narrator" data-lrv-narrator hidden>${copy.narrator}</p></section>
    <section class="lrv-history" aria-labelledby="${id}-history"><h4 id="${id}-history">${copy.history}</h4><p data-lrv-history-empty>${copy.historyEmpty}</p><div class="lrv-history-scroll" data-lrv-history-wrap tabindex="0" role="region" aria-labelledby="${id}-history" hidden><table aria-labelledby="${id}-history"><thead><tr><th scope="col">${copy.trial}</th><th scope="col">${copy.design}</th><th scope="col">${copy.dust}</th><th scope="col">${copy.wheelGap}</th><th scope="col">${copy.attachment}</th><th scope="col">${copy.result}</th></tr></thead><tbody data-lrv-history></tbody></table></div><p class="lrv-history-help">${copy.historyLimit}</p></section>
    <details class="lrv-model-details"><summary>${copy.modelDetails}</summary><p>${copy.modelExplanation}</p></details><a class="lrv-source" href="${SOURCE}" target="_blank" rel="noopener">${copy.source}</a>
  </section>`;
}

export function lrvRepairHint(result) {
  if (result.passed) return copy.passedStatus;
  if (!result.assembled) return copy.incompleteStatus;
  if (!result.wheelSafe) return result.configuration.angle < 0
    ? 'Angle: lift the patch tip. Clearance: raise the mount so the whole patch stays away from the wheel, then retest.'
    : 'Clearance: raise the patch mount to give the wheel more room, then retest.';
  if (!result.attachmentHolding) return copy.attachmentStatus;
  const c = result.configuration;
  const alternatives = [
    [{length:c.length + 20}, 'Length: extend the patch farther into the flying dust, then compare another test.'],
    [{angle:c.angle - 10}, 'Angle: lower the patch tip toward the dust paths, keeping it clear of the wheel.'],
    [{clearance:c.clearance - 4}, 'Clearance: lower the mount toward the dust paths, keeping space above the wheel.'],
    [{angle:c.angle + 10}, 'Angle: lift the patch tip to meet the dust paths farther from the wheel.'],
  ].map(([change, hint]) => ({ prediction:evaluateLrvRepair({...c,...change}, {tested:true}), hint }))
    .filter(({prediction}) => prediction.wheelSafe && prediction.dustReaching < result.dustReaching)
    .sort((a,b) => a.prediction.dustReaching - b.prediction.dustReaching);
  return alternatives[0]?.hint || 'Angle: lower the tip toward the dust. Length: extend the patch if paths still escape, then retest.';
}

function attachmentText(result) {
  if (!result.assembled) return copy.incomplete;
  return result.attachmentHolding ? copy.holding : copy.slipped;
}

function trialMarkup(trial) {
  const { result, number } = trial;
  const design = result.configuration;
  const material = !design.maps ? copy.noPatch : !design.tape ? copy.untaped : design.attachment === "clamps" ? copy.clamps : copy.tapeOnly;
  return `<tr class="${result.passed ? "is-passed" : "is-adjust"}"><th scope="row">${number}</th><td><span class="lrv-trial-setting"><span>${copy.length}</span> ${design.length} cm</span><span class="lrv-trial-setting"><span>${copy.angle}</span> ${design.angle}°</span><span class="lrv-trial-setting"><span>${copy.clearance}</span> ${design.clearance} cm</span><span class="lrv-trial-material">${material}</span></td><td>${result.dustReaching} / ${result.dustTotal}</td><td>${result.clearanceCm.toFixed(1)} cm</td><td>${attachmentText(result)}</td><td>${result.passed ? copy.passed : copy.adjust}</td></tr>`;
}

/** Mount inside the host supplied by the Moon dialog. No mission or storage changes. */
export function mountLrvGame(root) {
  const workshop = root?.matches?.("[data-lrv-workshop]") ? root : root?.querySelector?.("[data-lrv-workshop]");
  if (!workshop) return { dispose() {} };
  const find = (selector) => workshop.querySelector(selector);
  let configuration = { ...LRV_DEFAULT_CONFIGURATION };
  let trials = [];
  let trialNumber = 0;
  let disposed = false;
  const controls = Object.fromEntries(Object.keys(LRV_CONTROL_LIMITS).map((key) => [key, find(`[data-lrv-control="${key}"]`)]));
  let selectedTool = 'maps';
  let dragging = false;
  const svg = find('.lrv-workshop-svg');
  svg.insertAdjacentHTML('beforeend', '<circle data-lrv-drag-tip r="13" fill="#eaf8ff" stroke="#329cad" stroke-width="4" aria-hidden="true"/>');
  const dustResult = find("[data-lrv-dust-result]");
  const clearanceResult = find("[data-lrv-clearance-result]");
  const attachmentResult = find("[data-lrv-attachment-result]");
  const status = find("[data-lrv-status]");
  const measures = ["dust", "clearance", "attachment"].map((key) => find(`[data-lrv-measure="${key}"]`));

  const draw = (result = evaluateLrvRepair(configuration), statusText = copy.changedStatus) => {
    if (disposed) return;
    for (const [key, control] of Object.entries(controls)) {
      control.value = String(configuration[key]);
      find(`[data-lrv-value="${key}"]`).textContent = `${configuration[key]}${key === "angle" ? "°" : " cm"}`;
      workshop.querySelectorAll(`[data-lrv-step="${key}"]`).forEach((button) => {
        const next = configuration[key] + Number(button.dataset.lrvDelta);
        button.disabled = next < LRV_CONTROL_LIMITS[key].min || next > LRV_CONTROL_LIMITS[key].max;
      });
    }
    workshop.querySelectorAll('[data-lrv-tool]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.lrvTool === selectedTool)));
    find("[data-lrv-dust-paths]").innerHTML = dustMarkup(result);
    find("[data-lrv-patch]").innerHTML = patchMarkup(configuration);
    const tip = pointOnScreen(lrvPatchGeometry(configuration).end);
    const handle = find('[data-lrv-drag-tip]');
    handle.setAttribute('cx', tip.x); handle.setAttribute('cy', tip.y);
    handle.style.display = configuration.maps ? '' : 'none';
    find("[data-lrv-preview-label]").textContent = result.tested ? copy.tested : copy.preview;
    workshop.dataset.lrvResult = result.tested ? result.passed ? "passed" : "adjust" : "untested";
    find("[data-lrv-try]").hidden = !result.tested;
    find("[data-lrv-narrator]").hidden = !result.passed;
    dustResult.textContent = result.tested ? `${result.dustReaching} / ${result.dustTotal}` : copy.notTested;
    clearanceResult.textContent = result.tested ? `${result.clearanceCm.toFixed(1)} cm` : copy.notTested;
    attachmentResult.textContent = result.tested ? attachmentText(result) : copy.notTested;
    [result.dustSafe, result.wheelSafe, result.attachmentHolding].forEach((passed, index) => {
      measures[index].dataset.result = result.tested ? passed ? "pass" : "adjust" : "untested";
      const verdict = measures[index].querySelector('[data-lrv-verdict]');
      verdict.hidden = !result.tested;
      verdict.textContent = result.tested ? passed ? 'Pass' : 'Fail' : '';
    });
    status.textContent = statusText;
  };
  const edit = (changes) => {
    configuration = normalizeLrvConfiguration({ ...configuration, ...changes });
    draw();
  };
  const onInput = (event) => {
    const key = event.target?.dataset?.lrvControl;
    if (Object.hasOwn(LRV_CONTROL_LIMITS, key)) edit({ [key]: event.target.value });
  };
  const onChange = (event) => {
    const target = event.target;
    if (target.dataset?.lrvPart === "maps") edit({ maps: target.checked, tape: target.checked && configuration.tape });
    else if (target.dataset?.lrvPart === "tape") edit({ tape: target.checked });
    else if (target.matches?.("[data-lrv-attachment]") && target.checked) edit({ attachment: target.value });
  };
  const onClick = (event) => {
    const button = event.target?.closest?.("button");
    if (!button || !workshop.contains(button) || button.disabled) return;
    if (button.dataset.lrvTool) {
      selectedTool = button.dataset.lrvTool;
      workshop.querySelectorAll('[data-lrv-tool]').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    } else if (button.hasAttribute('data-lrv-apply')) {
      const message = find('[data-lrv-tool-status]');
      if (selectedTool === 'maps') { edit({ maps: true }); message.textContent = 'Maps fitted. Join the seams with tape.'; }
      else if (selectedTool === 'tape' && configuration.maps) { edit({ tape: true }); message.textContent = 'Seams taped. Fit clamps to secure the repair.'; }
      else if (selectedTool === 'clamps' && configuration.tape) { edit({ attachment: 'clamps' }); message.textContent = 'Repair secured. Shape the patch, then test it.'; }
      else message.textContent = 'Fit the maps first, tape the seams, then add clamps.';
    } else if (button.hasAttribute("data-lrv-step")) {
      const key = button.dataset.lrvStep;
      if (Object.hasOwn(LRV_CONTROL_LIMITS, key)) edit({ [key]: configuration[key] + Number(button.dataset.lrvDelta) });
    } else if (button.hasAttribute("data-lrv-test")) {
      const result = evaluateLrvRepair(configuration, { tested: true });
      trials.unshift({ number: ++trialNumber, result });
      trials = trials.slice(0, 6);
      find("[data-lrv-history]").innerHTML = trials.map(trialMarkup).join("");
      find("[data-lrv-history-empty]").hidden = true;
      find("[data-lrv-history-wrap]").hidden = false;
      draw(result, lrvRepairHint(result));
      workshop.classList.remove('lrv-testing');
      void workshop.offsetWidth;
      workshop.classList.add('lrv-testing');
      if (result.passed) {
        const Event = workshop.ownerDocument?.defaultView?.CustomEvent || globalThis.CustomEvent;
        if (Event) workshop.dispatchEvent(new Event("lrv-repair-success", { bubbles: true, detail: { configuration: { ...configuration }, result } }));
      }
    } else if (button.hasAttribute("data-lrv-try")) {
      draw();
      controls.length.focus();
    } else if (button.hasAttribute("data-lrv-reset")) {
      configuration = { ...LRV_DEFAULT_CONFIGURATION };
      selectedTool = 'maps';
      find('[data-lrv-tool-status]').textContent = 'Choose a tool, then apply it to the repair.';
      trials = [];
      trialNumber = 0;
      find("[data-lrv-history]").innerHTML = "";
      find("[data-lrv-history-empty]").hidden = false;
      find("[data-lrv-history-wrap]").hidden = true;
      draw(evaluateLrvRepair(configuration), copy.readyStatus);
    }
  };
  workshop.addEventListener("input", onInput);
  workshop.addEventListener("change", onChange);
  workshop.addEventListener("click", onClick);
  const pointerDown = event => {
    if (!event.target.closest('[data-lrv-drag-tip]')) return;
    event.preventDefault(); dragging = true; svg.setPointerCapture(event.pointerId);
  };
  const pointerMove = event => {
    if (!dragging) return;
    const point = new DOMPoint(event.clientX, event.clientY).matrixTransform(svg.getScreenCTM().inverse());
    const world = { x: (point.x - 210) / 2.4, y: (330 - point.y) / 2.4 };
    const start = lrvPatchGeometry(configuration).start;
    edit({ length: Math.hypot(world.x - start.x, world.y - start.y), angle: Math.atan2(world.y - start.y, world.x - start.x) * 180 / Math.PI });
  };
  const pointerUp = () => { dragging = false; };
  svg.addEventListener('pointerdown', pointerDown); svg.addEventListener('pointermove', pointerMove);
  svg.addEventListener('pointerup', pointerUp); svg.addEventListener('pointercancel', pointerUp);
  draw(evaluateLrvRepair(configuration), copy.readyStatus);
  return {
    dispose() {
      disposed = true;
      workshop.removeEventListener("input", onInput);
      workshop.removeEventListener("change", onChange);
      workshop.removeEventListener("click", onClick);
      svg.removeEventListener('pointerdown', pointerDown); svg.removeEventListener('pointermove', pointerMove);
      svg.removeEventListener('pointerup', pointerUp); svg.removeEventListener('pointercancel', pointerUp);
    },
  };
}
