// Original Mission Alive model. The dimensions, dust paths, and pass criteria below
// are teaching choices, not measurements or test results from Apollo hardware.
export const LRV_GAME_COPY = Object.freeze({
  eyebrow: "APOLLO 17 · REPAIR TRAINING",
  missionLabel: "MISSION · APOLLO 17 LRV",
  incidentTitle: "THE PROBLEM",
  incident: "The fender broke. Every wheel turn now throws Moon dust onto the crew and equipment.",
  title: "Build a dust shield",
  introduction: "Repair the rover with the same kind of materials the Apollo 17 crew had: spare maps, duct tape, and clamps.",
  instructions: "Build the shield, pull it across the dust stream, then test your repair.",
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
  materials: "1. Build the shield",
  maps: "Map panel",
  tape: "Tape strip",
  attachment: "Attach the patch to the rover",
  tapeOnly: "Tape only",
  clamps: "Clamp",
  attachmentHelp: "The crew had no spare fender. Stiff laminated maps formed a shield, tape joined its panels, and clamps fixed it to the rover.",
  buildHow: "Drag or tap each part into the glowing spot.",
  mapsGoal: "Make the shield",
  tapeGoal: "Join the seams",
  clampsGoal: "Fix it to the rover",
  mapsProgress: "Map panels",
  tapeProgress: "Seams taped",
  clampsProgress: "Clamps fitted",
  buildComplete: "Shield built. Now pull it across the dust stream.",
  wrongDrop: "That part does not fit there. Follow the glow.",
  whyMaterials: "Why maps, tape, and clamps?",
  geometry: "2. Pull the shield into place",
  shapeHow: "Pull the gold handle. Make the shield long enough to catch dust, but keep it clear of the rover.",
  shieldReach: "Shield reach",
  shortReach: "Short",
  longReach: "Long",
  fineControls: "Fine controls",
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
  goals: "Goal: catch the dust without touching the wheel or equipment.",
  runTest: "Run dust test",
  tryAgain: "Try another design",
  reset: "Reset workshop",
  results: "3. Read the test",
  dustMeasure: "Dust reaching equipment",
  clearanceMeasure: "Repair clearance",
  attachmentMeasure: "Attachment holding",
  dustGoal: "Goal: 3 or fewer of 12 paths",
  clearanceGoal: "Goal: clear the wheel and stop before the equipment",
  attachmentGoal: "Goal: a taped map patch held by clamps",
  notTested: "Not tested",
  holding: "Holding",
  touching: "Touching the wheel",
  hittingEquipment: "Hitting the equipment",
  toolsReady: "Start with the three map panels.",
  slipped: "Slipped in the model",
  incomplete: "Patch incomplete",
  passed: "Passed",
  adjust: "Adjust and retest",
  readyStatus: "Build the shield first.",
  changedStatus: "Design changed. Run a new dust test to measure this setup.",
  designBuild: "BUILD FIRST · add the map patch",
  designReady: "READY TO TEST · the repair clears the rover",
  designWheelFail: "FAIL · the patch touches the wheel",
  designEquipmentFail: "FAIL · the patch reaches the equipment",
  passedStatus: "Test passed. Your patch catches enough dust, clears the wheel, and stays attached. Another shape may work too.",
  incompleteStatus: "Finish the glowing repair spots before testing.",
  wheelStatus: "The patch is too close to the wheel. Raise the clearance setting or lift the tip, then test again.",
  equipmentStatus: "The patch is too long and reaches the rover equipment. Shorten it, then test again.",
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
  modelExplanation: "Twelve curved sample paths leave the wheel. A path is caught where it crosses the patch. Tape alone slips after the first four paths; clamps hold an assembled patch. A design fails immediately if it touches the wheel or reaches the equipment zone. These simplified rules help compare designs; they do not predict real lunar dust.",
  source: "NASA · Lunar Dust and Duct Tape ↗",
});

// Start level and clear of the wheel, but too short to catch dust. One informed
// change (length) after assembling the patch is enough to pass.
export const LRV_DEFAULT_CONFIGURATION = Object.freeze({
  length: 30,
  angle: 0,
  clearance: 4,
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
const PATCH_EQUIPMENT_LIMIT = 68;
const SOURCE = "https://science.nasa.gov/image-article/apod-2004-april-17-lunar-dust-and-duct-tape/";
const copy = LRV_GAME_COPY;
let nextWorkshopId = 0;

export const LRV_ASSEMBLY_PIECES = Object.freeze([
  Object.freeze({ id: "map-left", type: "maps", label: "Left map panel" }),
  Object.freeze({ id: "map-center", type: "maps", label: "Center map panel" }),
  Object.freeze({ id: "map-right", type: "maps", label: "Right map panel" }),
  Object.freeze({ id: "tape-left", type: "tape", label: "Left tape strip" }),
  Object.freeze({ id: "tape-right", type: "tape", label: "Right tape strip" }),
  Object.freeze({ id: "clamp-left", type: "clamps", label: "Left clamp" }),
  Object.freeze({ id: "clamp-right", type: "clamps", label: "Right clamp" }),
]);

const ASSEMBLY_TOTALS = Object.freeze({ maps: 3, tape: 2, clamps: 2 });

export function lrvAssemblyConfiguration(placed = [], base = LRV_DEFAULT_CONFIGURATION) {
  const ids = new Set(placed);
  const count = (type) => LRV_ASSEMBLY_PIECES.filter((piece) => piece.type === type && ids.has(piece.id)).length;
  const maps = count("maps") === ASSEMBLY_TOTALS.maps;
  const tape = maps && count("tape") === ASSEMBLY_TOTALS.tape;
  const clamps = tape && count("clamps") === ASSEMBLY_TOTALS.clamps;
  return normalizeLrvConfiguration({ ...base, maps, tape, attachment: clamps ? "clamps" : "tape" });
}

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
  const equipmentSafe = geometry.end.x <= PATCH_EQUIPMENT_LIMIT;
  const attachmentHolding = assembled && configuration.attachment === "clamps";
  return {
    configuration, geometry, paths, tested: tested === true,
    dustReaching, dustTotal: DUST_PATHS, dustSafe,
    clearanceCm: geometry.clearanceCm, wheelSafe, equipmentSafe, assembled, attachmentHolding,
    passed: tested === true && dustSafe && wheelSafe && equipmentSafe && attachmentHolding,
  };
}

const escape = (text) => String(text).replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character]);
const pointOnScreen = ({ x, y }) => ({ x: 210 + x * 2.4, y: 330 - y * 2.4 });
const coordinate = (number) => Number(number.toFixed(2));
const svgPoint = (point) => { const screen = pointOnScreen(point); return `${coordinate(screen.x)},${coordinate(screen.y)}`; };

function patchMarkup(configuration, result = evaluateLrvRepair(configuration)) {
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
  const invalid = !result.wheelSafe || !result.equipmentSafe;
  return `<g class="lrv-map-patch${invalid ? ' is-invalid' : ''}"><path d="M${svgPoint({ x: -8, y: WHEEL_RADIUS })}L${svgPoint(start)}" stroke="${invalid ? '#ff766e' : '#b9c6cb'}" stroke-width="5"/><polygon points="${polygon}" fill="${invalid ? '#a9383a' : '#567f67'}" stroke="${invalid ? '#ff9f98' : '#e4efda'}" stroke-width="3"/>${seams}${clamps}</g>`;
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
      <path d="M270 298H602M287 296l38-51h230l43 51M329 246H560" fill="none" stroke="#a4b1b7" stroke-width="9" stroke-linejoin="round"/>
      <path d="M335 226h92v58h-92z" fill="#9b6b2e" stroke="#d2a65c" stroke-width="3"/>
      <path d="M433 238h75v46h-75z" fill="#252f36" stroke="#718088" stroke-width="3"/>
      <path d="M445 171h42v67h-42zM493 156h42v82h-42z" fill="#dce2df" stroke="#ffffff" stroke-width="3" transform="skewX(-7)"/>
      <path d="M354 226v-71m0 0h35m-35 0l-22-33m22 33l25-28" fill="none" stroke="#b9c6cb" stroke-width="6" stroke-linejoin="round"/>
      <circle cx="333" cy="120" r="7" fill="#202e39" stroke="#dce7e9" stroke-width="3"/>
      <path d="M539 246l51-34M282 298l-34 37M580 298l37 37" stroke="#a4b1b7" stroke-width="7"/>
      <g transform="translate(550 330)"><circle r="57.6" fill="#202e39" stroke="#91a2a9" stroke-width="5"/><circle r="44" fill="none" stroke="#657b86" stroke-width="2"/>${Array.from({ length: 12 }, (_, index) => { const angle = index * Math.PI / 6; return `<path d="M${coordinate(Math.cos(angle) * 13)},${coordinate(Math.sin(angle) * 13)}L${coordinate(Math.cos(angle) * 54)},${coordinate(Math.sin(angle) * 54)}" stroke="#7d949e" stroke-width="2"/>`; }).join("")}<circle r="14" fill="#b67a24" stroke="#6f4b1d" stroke-width="3"/></g>
    </g>
    <g class="lrv-wheel"><circle cx="210" cy="330" r="57.6" fill="#202e39" stroke="#91a2a9" stroke-width="5"/><circle cx="210" cy="330" r="44" fill="none" stroke="#657b86" stroke-width="2"/>
      ${Array.from({ length: 12 }, (_, index) => { const angle = index * Math.PI / 6; return `<path d="M${coordinate(210 + Math.cos(angle) * 13)},${coordinate(330 + Math.sin(angle) * 13)}L${coordinate(210 + Math.cos(angle) * 54)},${coordinate(330 + Math.sin(angle) * 54)}" stroke="#7d949e" stroke-width="2"/>`; }).join("")}
      <circle cx="210" cy="330" r="14" fill="#b6c4c8" stroke="#526a77" stroke-width="3"/>
    </g>
    <path class="lrv-fender-stub" d="M139 310Q148 262 191 265" fill="none" stroke="#c7c7b6" stroke-width="9"/>
    <g data-lrv-dust-paths>${dustMarkup(result)}</g>
    <g data-lrv-patch>${patchMarkup(result.configuration, result)}</g>
    <g class="lrv-svg-labels" fill="#dce7e9" font-family="system-ui, sans-serif" font-size="13" font-weight="700" letter-spacing="1.5"><text x="160" y="421">${copy.wheel}</text><text x="279" y="65">${copy.patch}</text><text x="444" y="65">${copy.equipment}</text></g>
  </svg>`;
}

function controlMarkup(id, key, label, help, decrease, increase) {
  const { min, max, step } = LRV_CONTROL_LIMITS[key];
  const value = LRV_DEFAULT_CONFIGURATION[key];
  return `<div class="lrv-control"><div class="lrv-control-heading"><label for="${id}-${key}">${label} <span>${key === "angle" ? "(°)" : "(cm)"}</span></label><output data-lrv-value="${key}" for="${id}-${key}">${value}${key === "angle" ? "°" : " cm"}</output></div><div class="lrv-range-row"><button type="button" class="lrv-step" data-lrv-step="${key}" data-lrv-delta="-${step}" aria-label="${decrease}">−</button><input id="${id}-${key}" data-lrv-control="${key}" type="range" min="${min}" max="${max}" step="${step}" value="${value}" aria-describedby="${id}-${key}-help"><button type="button" class="lrv-step" data-lrv-step="${key}" data-lrv-delta="${step}" aria-label="${increase}">+</button></div><p class="lrv-control-help" id="${id}-${key}-help">${help}</p></div>`;
}

function pieceIcon(type) {
  if (type === "maps") return '<svg viewBox="0 0 64 44" aria-hidden="true"><path d="M5 8l17-5 20 7 17-5v31l-17 5-20-7-17 5z"/><path d="M22 3v31M42 10v31"/></svg>';
  if (type === "tape") return '<svg viewBox="0 0 64 44" aria-hidden="true"><ellipse cx="28" cy="22" rx="20" ry="14"/><ellipse cx="28" cy="22" rx="9" ry="6"/><path d="M45 17l14 18H40"/></svg>';
  return '<svg viewBox="0 0 64 44" aria-hidden="true"><path d="M18 7v25c0 7 28 7 28 0V7M12 7h40M12 33h40"/></svg>';
}

function assemblyPieceMarkup(piece) {
  const shortLabel = piece.type === "maps" ? copy.maps : piece.type === "tape" ? copy.tape : copy.clamps;
  return `<button type="button" class="lrv-build-piece" data-lrv-piece="${piece.id}" data-lrv-piece-type="${piece.type}" aria-pressed="false" aria-label="${piece.label}"${piece.type === "maps" ? "" : " hidden"}>${pieceIcon(piece.type)}<span>${shortLabel}</span></button>`;
}

function assemblyBoardMarkup() {
  return `<div class="lrv-build-board" data-lrv-build-board aria-label="Rover wheel with glowing repair spots">
    <div class="lrv-build-equipment" aria-hidden="true"><span></span><span></span><span></span></div>
    <div class="lrv-build-wheel" aria-hidden="true"><span></span></div>
    <div class="lrv-build-stub" aria-hidden="true"></div>
    ${LRV_ASSEMBLY_PIECES.map((piece) => `<span class="lrv-build-slot lrv-build-slot-${piece.id}" data-lrv-slot="${piece.id}" data-lrv-slot-type="${piece.type}" data-filled="false" aria-hidden="true">${pieceIcon(piece.type)}</span>`).join("")}
    <span class="lrv-build-dust" aria-hidden="true">•••••</span>
  </div>`;
}

function reachControlMarkup(id) {
  const { min, max, step } = LRV_CONTROL_LIMITS.length;
  return `<div class="lrv-reach-control"><div class="lrv-control-heading"><label for="${id}-length">${copy.shieldReach}</label><output data-lrv-value="length" for="${id}-length">${LRV_DEFAULT_CONFIGURATION.length} cm</output></div><div class="lrv-reach-track"><span aria-hidden="true"></span><input id="${id}-length" data-lrv-control="length" type="range" min="${min}" max="${max}" step="${step}" value="${LRV_DEFAULT_CONFIGURATION.length}" aria-describedby="${id}-shape-help"></div><div class="lrv-reach-labels" aria-hidden="true"><span>${copy.shortReach}</span><span>${copy.longReach}</span></div></div>`;
}

export function lrvGameMarkup() {
  const id = `lrv-workshop-${++nextWorkshopId}`;
  const initial = evaluateLrvRepair(LRV_DEFAULT_CONFIGURATION);
  return `<section class="moon-game lrv-game" data-lrv-workshop data-lrv-result="untested" aria-labelledby="${id}-title">
    <header class="lrv-heading"><p class="eyebrow">${copy.eyebrow}</p><h3 id="${id}-title">${copy.title}</h3><p>${copy.introduction}</p></header>
    <p class="moon-challenge-identity">${copy.missionLabel}</p><aside class="mission-incident lrv-incident" aria-label="Mission problem"><p class="eyebrow">${copy.incidentTitle}</p><p>${copy.incident}</p><p><strong>Your job:</strong> ${copy.instructions}</p></aside>
    <div class="lrv-workshop-grid"><figure class="lrv-illustration"><p class="lrv-preview-label" data-lrv-preview-label>${copy.preview}</p><p class="lrv-design-check" data-lrv-design-check data-state="building" role="status">${copy.designBuild}</p><div class="moon-challenge-canvas" data-lrv-challenge-3d></div><div class="moon-challenge-2d">${svgMarkup(initial)}</div><figcaption><span class="moon-challenge-3d-caption">Interactive 3D training simulation. Use the controls on this page; every result is also explained in text.</span><span class="moon-challenge-2d-caption">${copy.diagramCaption}</span></figcaption><div class="lrv-dust-legend"><span class="lrv-dust-key lrv-dust-caught">${copy.caughtDust}</span><span class="lrv-dust-key lrv-dust-reaching">${copy.reachingDust}</span></div><p class="lrv-simulation-label">${copy.simulation}</p></figure>
    <div class="lrv-controls"><fieldset class="lrv-materials"><legend>${copy.materials}</legend><p class="lrv-build-how">${copy.buildHow}</p><div class="lrv-build-game" data-lrv-build-game data-phase="maps">${assemblyBoardMarkup()}<div class="lrv-build-tray" role="group" aria-label="Repair parts">${LRV_ASSEMBLY_PIECES.map(assemblyPieceMarkup).join("")}</div></div><div class="lrv-build-progress" aria-label="Repair progress"><span data-lrv-progress="maps">${copy.mapsProgress} <b>0 / 3</b></span><span data-lrv-progress="tape">${copy.tapeProgress} <b>0 / 2</b></span><span data-lrv-progress="clamps">${copy.clampsProgress} <b>0 / 2</b></span></div><p class="lrv-build-status" data-lrv-tool-status role="status" aria-live="polite">${copy.toolsReady}</p><details class="lrv-material-story"><summary>${copy.whyMaterials}</summary><p>${copy.attachmentHelp}</p></details></fieldset>
    <fieldset class="lrv-geometry" data-lrv-shape hidden><legend>${copy.geometry}</legend><p class="lrv-shape-how" id="${id}-shape-help">${copy.shapeHow}</p>${reachControlMarkup(id)}<details class="lrv-fine-controls"><summary>${copy.fineControls}</summary><p class="lrv-model-dimensions">${copy.dimensions}</p>
    ${controlMarkup(id, "angle", copy.angle, copy.angleHelp, copy.decreaseAngle, copy.increaseAngle)}
    ${controlMarkup(id, "clearance", copy.clearance, copy.clearanceHelp, copy.decreaseClearance, copy.increaseClearance)}</details></fieldset>
    <p class="lrv-goals">${copy.goals}</p><div class="lrv-actions"><button type="button" class="primary lrv-test-button" data-lrv-test>${copy.runTest}</button><button type="button" data-lrv-try hidden>${copy.tryAgain}</button><button type="button" data-lrv-reset>${copy.reset}</button></div></div></div>
    <section class="lrv-results" aria-labelledby="${id}-results" hidden><h4 id="${id}-results">${copy.results}</h4><dl class="lrv-measures"><div data-lrv-measure="dust"><dt>${copy.dustMeasure}</dt><dd><strong data-lrv-verdict hidden></strong> <span data-lrv-dust-result>${copy.notTested}</span><small>${copy.dustGoal}</small></dd></div><div data-lrv-measure="clearance"><dt>${copy.clearanceMeasure}</dt><dd><strong data-lrv-verdict hidden></strong> <span data-lrv-clearance-result>${copy.notTested}</span><small>${copy.clearanceGoal}</small></dd></div><div data-lrv-measure="attachment"><dt>${copy.attachmentMeasure}</dt><dd><strong data-lrv-verdict hidden></strong> <span data-lrv-attachment-result>${copy.notTested}</span><small>${copy.attachmentGoal}</small></dd></div></dl><p class="lrv-result-status" data-lrv-status role="status" aria-live="polite" aria-atomic="true">${copy.readyStatus}</p><p class="lrv-narrator" data-lrv-narrator hidden>${copy.narrator}</p></section>
    <details class="lrv-history"><summary id="${id}-history">${copy.history}</summary><p data-lrv-history-empty>${copy.historyEmpty}</p><div class="lrv-history-scroll" data-lrv-history-wrap tabindex="0" role="region" aria-labelledby="${id}-history" hidden><table aria-labelledby="${id}-history"><thead><tr><th scope="col">${copy.trial}</th><th scope="col">${copy.design}</th><th scope="col">${copy.dust}</th><th scope="col">${copy.wheelGap}</th><th scope="col">${copy.attachment}</th><th scope="col">${copy.result}</th></tr></thead><tbody data-lrv-history></tbody></table></div><p class="lrv-history-help">${copy.historyLimit}</p></details>
    <details class="lrv-model-details"><summary>${copy.modelDetails}</summary><p>${copy.modelExplanation}</p></details><a class="lrv-source" href="${SOURCE}" target="_blank" rel="noopener">${copy.source}</a>
  </section>`;
}

// One change per hint. The amount is a word ("a little", "more", "a lot"), never
// a winning number, so the learner still has to test and read the result.
export const LRV_HINTS = Object.freeze({
  length: Object.freeze({
    up: Object.freeze({ small: "Length: make the patch a little longer, then test again.", medium: "Length: make the patch longer, then test again.", large: "Length: make the patch a lot longer — keep pressing +, then test again." }),
    down: Object.freeze({ small: "Length: make the patch a little shorter, then test again.", medium: "Length: make the patch shorter, then test again.", large: "Length: make the patch a lot shorter, then test again." }),
  }),
  angle: Object.freeze({
    up: Object.freeze({ small: "Angle: lift the patch tip a little, then test again.", medium: "Angle: lift the patch tip, then test again.", large: "Angle: lift the patch tip a lot, then test again." }),
    down: Object.freeze({ small: "Angle: lower the patch tip a little, then test again.", medium: "Angle: lower the patch tip, then test again.", large: "Angle: lower the patch tip a lot, then test again." }),
  }),
  clearance: Object.freeze({
    up: Object.freeze({ small: "Clearance: raise the mount a little, then test again.", medium: "Clearance: raise the mount, then test again.", large: "Clearance: raise the mount a lot, then test again." }),
    down: Object.freeze({ small: "Clearance: lower the mount a little, then test again.", medium: "Clearance: lower the mount, then test again.", large: "Clearance: lower the mount a lot, then test again." }),
  }),
});

const hintSize = (steps) => steps <= 2 ? "small" : steps <= 5 ? "medium" : "large";

/** Find the smallest single-control change that makes real progress, and name only that. */
export function lrvNextChange(result) {
  const c = result.configuration;
  // Fix the visible problem first: a patch touching the wheel must be moved clear,
  // even if that lets some dust through for one test.
  const better = (prediction) => !result.wheelSafe
    ? prediction.wheelSafe
    : !result.equipmentSafe
      ? prediction.wheelSafe && prediction.equipmentSafe
      : prediction.wheelSafe && prediction.equipmentSafe && prediction.dustReaching < result.dustReaching;
  let best = null;
  const consider = (key, direction, steps, passes, penalty = 0) => {
    // Prefer a change that passes, then a forgiving one, then the fewest presses.
    const score = (passes ? 0 : 1000) + penalty + steps;
    if (!best || score < best.score) best = { key, direction: direction > 0 ? "up" : "down", steps, score };
  };
  for (const [key, { min, max, step }] of Object.entries(LRV_CONTROL_LIMITS)) {
    for (const direction of [1, -1]) {
      let improved = false;
      for (let steps = 1; ; steps++) {
        const value = c[key] + direction * steps * step;
        if (value < min || value > max) break;
        const prediction = evaluateLrvRepair({ ...c, [key]: value }, { tested: true });
        if (!better(prediction)) continue;
        if (prediction.dustSafe && prediction.wheelSafe) {
          // Children overshoot. Prefer a change that still passes one or two presses past it.
          const overshoot = [1, 2].every((extra) => {
            const next = value + direction * extra * step;
            if (next < min || next > max) return true;
            const check = evaluateLrvRepair({ ...c, [key]: next }, { tested: true });
            return check.dustSafe && check.wheelSafe;
          });
          consider(key, direction, steps, true, overshoot ? 0 : 50);
          break;
        }
        if (!improved) {
          // An improvement that one extra press would undo invites a back-and-forth loop.
          const next = value + direction * step;
          const after = next < min || next > max ? prediction : evaluateLrvRepair({ ...c, [key]: next }, { tested: true });
          const steady = better(after) && after.dustReaching <= prediction.dustReaching;
          consider(key, direction, steps, false, steady ? 0 : 50);
          improved = true;
        }
      }
    }
  }
  if (best) return best;
  // No single control helps on its own (for example, everything pushed to a limit).
  // Head back toward a known working shape, one control at a time.
  const steps = Object.entries(LRV_REFERENCE_DESIGN).map(([key, target]) => ({
    key, delta: (target - c[key]) / LRV_CONTROL_LIMITS[key].step,
  })).sort((a, b) => Math.abs(b.delta) - Math.abs(a.delta))[0];
  return steps && steps.delta !== 0
    ? { key: steps.key, direction: steps.delta > 0 ? "up" : "down", steps: Math.abs(steps.delta), score: 2000 }
    : null;
}

// A passing shape used only to point a stuck learner in a useful direction; it is never shown.
const LRV_REFERENCE_DESIGN = Object.freeze({ length: 50, angle: 0, clearance: 6 });

export function lrvRepairHint(result) {
  if (result.passed) return copy.passedStatus;
  if (!result.assembled) return copy.incompleteStatus;
  if (!result.attachmentHolding) return copy.attachmentStatus;
  if (!result.equipmentSafe) return copy.equipmentStatus;
  const change = lrvNextChange(result);
  if (change) return LRV_HINTS[change.key][change.direction][hintSize(change.steps)];
  return result.wheelSafe ? copy.dustStatus : copy.wheelStatus;
}

function gapText(result) {
  if (!result.wheelSafe) return copy.touching;
  if (!result.equipmentSafe) return copy.hittingEquipment;
  return `${result.clearanceCm.toFixed(1)} cm`;
}

function attachmentText(result) {
  if (!result.assembled) return copy.incomplete;
  return result.attachmentHolding ? copy.holding : copy.slipped;
}

function trialMarkup(trial) {
  const { result, number } = trial;
  const design = result.configuration;
  const material = !design.maps ? copy.noPatch : !design.tape ? copy.untaped : design.attachment === "clamps" ? copy.clamps : copy.tapeOnly;
  return `<tr class="${result.passed ? "is-passed" : "is-adjust"}"><th scope="row">${number}</th><td><span class="lrv-trial-setting"><span>${copy.length}</span> ${design.length} cm</span><span class="lrv-trial-setting"><span>${copy.angle}</span> ${design.angle}°</span><span class="lrv-trial-setting"><span>${copy.clearance}</span> ${design.clearance} cm</span><span class="lrv-trial-material">${material}</span></td><td>${result.dustReaching} / ${result.dustTotal}</td><td>${gapText(result)}</td><td>${attachmentText(result)}</td><td>${result.passed ? copy.passed : copy.adjust}</td></tr>`;
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
  let challengeScene = null;
  let placedPieces = new Set();
  let pieceDrag = null;
  let suppressPieceClick = false;
  const controls = Object.fromEntries(Object.keys(LRV_CONTROL_LIMITS).map((key) => [key, find(`[data-lrv-control="${key}"]`)]));
  let dragging = false;
  const svg = find('.lrv-workshop-svg');
  svg.setAttribute('role', 'group');
  svg.insertAdjacentHTML('beforeend', '<circle data-lrv-drag-tip r="56" fill="transparent" tabindex="0" role="slider" aria-label="Patch tip. Left and right change length. Up and down change angle." aria-valuemin="20" aria-valuemax="80" aria-valuenow="30"/><circle data-lrv-tip-visual r="15" fill="#eaf8ff" stroke="#329cad" stroke-width="4" pointer-events="none" aria-hidden="true"/>');
  const dustResult = find("[data-lrv-dust-result]");
  const clearanceResult = find("[data-lrv-clearance-result]");
  const attachmentResult = find("[data-lrv-attachment-result]");
  const status = find("[data-lrv-status]");
  const measures = ["dust", "clearance", "attachment"].map((key) => find(`[data-lrv-measure="${key}"]`));
  void import('./moon-challenge-scenes.js').then(({ mountLrvChallengeScene }) => {
    if (disposed) return;
    challengeScene = mountLrvChallengeScene(find('[data-lrv-challenge-3d]'));
    if (challengeScene) { workshop.classList.add('has-3d-challenge'); challengeScene.update({ configuration, result: evaluateLrvRepair(configuration) }); }
  }).catch(() => {});

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
    const counts = Object.fromEntries(Object.keys(ASSEMBLY_TOTALS).map((type) => [type, LRV_ASSEMBLY_PIECES.filter((piece) => piece.type === type && placedPieces.has(piece.id)).length]));
    const phase = counts.maps < ASSEMBLY_TOTALS.maps ? 'maps' : counts.tape < ASSEMBLY_TOTALS.tape ? 'tape' : counts.clamps < ASSEMBLY_TOTALS.clamps ? 'clamps' : 'complete';
    const assembled = phase === 'complete';
    workshop.dataset.lrvAssembly = assembled ? 'complete' : 'building';
    find('[data-lrv-build-game]').dataset.phase = phase;
    workshop.querySelectorAll('[data-lrv-piece]').forEach((button) => {
      const piece = LRV_ASSEMBLY_PIECES.find((item) => item.id === button.dataset.lrvPiece);
      const placed = placedPieces.has(piece.id);
      button.setAttribute('aria-pressed', String(placed));
      button.hidden = placed || piece.type !== phase;
    });
    workshop.querySelectorAll('[data-lrv-slot]').forEach((slot) => {
      const placed = placedPieces.has(slot.dataset.lrvSlot);
      slot.dataset.filled = String(placed);
      slot.dataset.active = String(!placed && slot.dataset.lrvSlotType === phase);
    });
    for (const type of Object.keys(ASSEMBLY_TOTALS)) {
      const progress = find(`[data-lrv-progress="${type}"]`);
      progress.dataset.complete = String(counts[type] === ASSEMBLY_TOTALS[type]);
      progress.querySelector('b').textContent = `${counts[type]} / ${ASSEMBLY_TOTALS[type]}`;
    }
    find('[data-lrv-shape]').hidden = !assembled;
    find('[data-lrv-test]').disabled = !assembled;
    find("[data-lrv-dust-paths]").innerHTML = dustMarkup(result);
    find("[data-lrv-patch]").innerHTML = patchMarkup(configuration, result);
    const tip = pointOnScreen(lrvPatchGeometry(configuration).end);
    const handle = find('[data-lrv-drag-tip]');
    handle.setAttribute('cx', tip.x); handle.setAttribute('cy', tip.y);
    const visual = find('[data-lrv-tip-visual]');
    visual.setAttribute('cx', tip.x); visual.setAttribute('cy', tip.y);
    visual.style.display = configuration.maps ? '' : 'none';
    handle.setAttribute('aria-valuenow', String(configuration.length));
    handle.setAttribute('aria-valuetext', `${configuration.length} cm, ${configuration.angle}°`);
    handle.style.display = configuration.maps ? '' : 'none';
    find("[data-lrv-preview-label]").textContent = result.tested ? copy.tested : copy.preview;
    const designCheck = find('[data-lrv-design-check]');
    const geometryFailure = !result.wheelSafe || !result.equipmentSafe;
    designCheck.dataset.state = !configuration.maps ? 'building' : geometryFailure ? 'fail' : 'ready';
    designCheck.textContent = !configuration.maps ? copy.designBuild : !result.wheelSafe ? copy.designWheelFail : !result.equipmentSafe ? copy.designEquipmentFail : copy.designReady;
    workshop.dataset.lrvResult = result.tested ? result.passed ? "passed" : "adjust" : "untested";
    find('.lrv-results').hidden = !result.tested;
    find("[data-lrv-try]").hidden = !result.tested;
    find("[data-lrv-narrator]").hidden = !result.passed;
    dustResult.textContent = result.tested ? `${result.dustReaching} / ${result.dustTotal}` : copy.notTested;
    clearanceResult.textContent = result.tested ? gapText(result) : copy.notTested;
    attachmentResult.textContent = result.tested ? attachmentText(result) : copy.notTested;
    [result.dustSafe, result.wheelSafe && result.equipmentSafe, result.attachmentHolding].forEach((passed, index) => {
      measures[index].dataset.result = result.tested ? passed ? "pass" : "adjust" : "untested";
      const verdict = measures[index].querySelector('[data-lrv-verdict]');
      verdict.hidden = !result.tested;
      verdict.textContent = result.tested ? passed ? 'Pass' : 'Fail' : '';
    });
    status.textContent = statusText;
    challengeScene?.update({ configuration, result });
  };
  const edit = (changes) => {
    configuration = normalizeLrvConfiguration({ ...configuration, ...changes });
    draw();
  };
  const assemblyPhase = () => {
    const count = (type) => LRV_ASSEMBLY_PIECES.filter((piece) => piece.type === type && placedPieces.has(piece.id)).length;
    return count('maps') < ASSEMBLY_TOTALS.maps ? 'maps' : count('tape') < ASSEMBLY_TOTALS.tape ? 'tape' : count('clamps') < ASSEMBLY_TOTALS.clamps ? 'clamps' : 'complete';
  };
  const placePiece = (id) => {
    const piece = LRV_ASSEMBLY_PIECES.find((item) => item.id === id);
    if (!piece || placedPieces.has(id) || piece.type !== assemblyPhase()) return false;
    placedPieces.add(id);
    configuration = lrvAssemblyConfiguration(placedPieces, configuration);
    const next = assemblyPhase();
    find('[data-lrv-tool-status]').textContent = next === 'maps' ? copy.mapsGoal : next === 'tape' ? copy.tapeGoal : next === 'clamps' ? copy.clampsGoal : copy.buildComplete;
    draw(evaluateLrvRepair(configuration), next === 'complete' ? copy.changedStatus : copy.readyStatus);
    return true;
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
    if (button.dataset.lrvPiece) {
      if (suppressPieceClick) { suppressPieceClick = false; return; }
      placePiece(button.dataset.lrvPiece);
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
      challengeScene?.test(result);
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
      placedPieces = new Set();
      find('[data-lrv-tool-status]').textContent = copy.toolsReady;
      trials = [];
      trialNumber = 0;
      find("[data-lrv-history]").innerHTML = "";
      find("[data-lrv-history-empty]").hidden = false;
      find("[data-lrv-history-wrap]").hidden = true;
      draw(evaluateLrvRepair(configuration), copy.readyStatus);
    }
  };
  const resetPieceDrag = () => {
    if (!pieceDrag) return;
    pieceDrag.button.classList.remove('is-dragging');
    pieceDrag.button.style.removeProperty('--lrv-drag-x');
    pieceDrag.button.style.removeProperty('--lrv-drag-y');
    pieceDrag = null;
  };
  const piecePointerDown = (event) => {
    const button = event.target?.closest?.('[data-lrv-piece]');
    if (!button || button.hidden || event.button !== 0) return;
    pieceDrag = { button, pointerId: event.pointerId, startX: event.clientX, startY: event.clientY, moved: false };
    button.setPointerCapture?.(event.pointerId);
  };
  const piecePointerMove = (event) => {
    if (!pieceDrag || event.pointerId !== pieceDrag.pointerId) return;
    const dx = event.clientX - pieceDrag.startX;
    const dy = event.clientY - pieceDrag.startY;
    if (!pieceDrag.moved && Math.hypot(dx, dy) > 6) pieceDrag.moved = true;
    if (!pieceDrag.moved) return;
    event.preventDefault();
    pieceDrag.button.classList.add('is-dragging');
    pieceDrag.button.style.setProperty('--lrv-drag-x', `${dx}px`);
    pieceDrag.button.style.setProperty('--lrv-drag-y', `${dy}px`);
  };
  const piecePointerUp = (event) => {
    if (!pieceDrag || event.pointerId !== pieceDrag.pointerId) return;
    const { button, moved } = pieceDrag;
    const board = find('[data-lrv-build-board]');
    const bounds = board.getBoundingClientRect();
    const overBoard = event.clientX >= bounds.left && event.clientX <= bounds.right && event.clientY >= bounds.top && event.clientY <= bounds.bottom;
    resetPieceDrag();
    if (!moved) return;
    event.preventDefault();
    suppressPieceClick = true;
    if (overBoard) placePiece(button.dataset.lrvPiece);
    else find('[data-lrv-tool-status]').textContent = copy.wrongDrop;
    setTimeout(() => { suppressPieceClick = false; }, 80);
  };
  const piecePointerCancel = () => resetPieceDrag();
  workshop.addEventListener("input", onInput);
  workshop.addEventListener("change", onChange);
  workshop.addEventListener("click", onClick);
  workshop.addEventListener('pointerdown', piecePointerDown);
  workshop.addEventListener('pointermove', piecePointerMove);
  workshop.addEventListener('pointerup', piecePointerUp);
  workshop.addEventListener('pointercancel', piecePointerCancel);
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
  const tipKeyDown = event => {
    if (!event.target.matches('[data-lrv-drag-tip]') || !['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key)) return;
    event.preventDefault();
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') edit({ length: configuration.length + (event.key === 'ArrowRight' ? 2 : -2) });
    else edit({ angle: configuration.angle + (event.key === 'ArrowUp' ? 5 : -5) });
  };
  svg.addEventListener('pointerdown', pointerDown); svg.addEventListener('pointermove', pointerMove);
  svg.addEventListener('pointerup', pointerUp); svg.addEventListener('pointercancel', pointerUp);
  svg.addEventListener('lostpointercapture', pointerUp); svg.addEventListener('keydown', tipKeyDown);
  draw(evaluateLrvRepair(configuration), copy.readyStatus);
  return {
    dispose() {
      disposed = true;
      challengeScene?.dispose();
      workshop.removeEventListener("input", onInput);
      workshop.removeEventListener("change", onChange);
      workshop.removeEventListener("click", onClick);
      workshop.removeEventListener('pointerdown', piecePointerDown);
      workshop.removeEventListener('pointermove', piecePointerMove);
      workshop.removeEventListener('pointerup', piecePointerUp);
      workshop.removeEventListener('pointercancel', piecePointerCancel);
      svg.removeEventListener('pointerdown', pointerDown); svg.removeEventListener('pointermove', pointerMove);
      svg.removeEventListener('pointerup', pointerUp); svg.removeEventListener('pointercancel', pointerUp);
      svg.removeEventListener('lostpointercapture', pointerUp); svg.removeEventListener('keydown', tipKeyDown);
    },
  };
}
