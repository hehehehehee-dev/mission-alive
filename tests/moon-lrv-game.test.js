import test from "node:test";
import assert from "node:assert/strict";
import {
  LRV_DEFAULT_CONFIGURATION,
  LRV_GAME_COPY,
  evaluateLrvRepair,
  lrvDustTrajectories,
  lrvGameMarkup,
  lrvPatchGeometry,
  lrvRepairHint,
  lrvNextChange,
  LRV_CONTROL_LIMITS,
  LRV_HINTS,
  mountLrvGame,
  normalizeLrvConfiguration,
} from "../src/moon-lrv-game.js";

const assembled = { maps: true, tape: true, attachment: "clamps" };
const goodDesign = { ...assembled, length: 60, angle: 0, clearance: 8 };
const testDesign = (design) => evaluateLrvRepair(design, { tested: true });

test("a repair needs an actual test, a safe wheel gap, useful dust coverage, and clamps", () => {
  const preview = evaluateLrvRepair(goodDesign);
  assert.equal(preview.tested, false);
  assert.equal(preview.dustSafe, true);
  assert.equal(preview.wheelSafe, true);
  assert.equal(preview.attachmentHolding, true);
  assert.equal(preview.passed, false);
  assert.equal(evaluateLrvRepair(goodDesign, { tested: "yes" }).passed, false);
  assert.equal(testDesign(goodDesign).passed, true);

  const highPatch = testDesign({ ...goodDesign, angle: 35, clearance: 20 });
  assert.equal(highPatch.wheelSafe, true);
  assert.equal(highPatch.attachmentHolding, true);
  assert.equal(highPatch.dustReaching, 12);
  assert.equal(highPatch.passed, false);

  const rubbingPatch = testDesign({ ...goodDesign, angle: -20, clearance: 2 });
  assert.equal(rubbingPatch.dustSafe, true);
  assert.equal(rubbingPatch.attachmentHolding, true);
  assert.ok(rubbingPatch.clearanceCm < 0);
  assert.equal(rubbingPatch.passed, false);

  const loosePatch = testDesign({ ...goodDesign, attachment: "tape" });
  assert.equal(loosePatch.wheelSafe, true);
  assert.equal(loosePatch.attachmentHolding, false);
  assert.equal(loosePatch.passed, false);
});

test("the workshop starts with an unfinished patch that is too short but clear of the wheel", () => {
  const initial = testDesign(LRV_DEFAULT_CONFIGURATION);
  assert.equal(initial.passed, false);
  assert.equal(initial.assembled, false);
  assert.equal(initial.attachmentHolding, false);
  assert.equal(initial.dustReaching, 12);
  const built = testDesign({ ...LRV_DEFAULT_CONFIGURATION, ...assembled });
  assert.equal(built.wheelSafe, true);
  assert.equal(built.dustSafe, false);
  assert.equal(built.passed, false);
  assert.equal(testDesign({ ...goodDesign, maps: false }).passed, false);
  assert.equal(testDesign({ ...goodDesign, tape: false }).passed, false);
  assert.equal(testDesign({ ...goodDesign, tape: false }).dustReaching, 12);
});

test("multiple lengths, angles, and clearance settings can protect the equipment", () => {
  const workingDesigns = [
    { ...assembled, length: 50, angle: 0, clearance: 8 },
    { ...assembled, length: 60, angle: -10, clearance: 12 },
    { ...assembled, length: 70, angle: -5, clearance: 10 },
    goodDesign,
  ];
  for (const design of workingDesigns) {
    const result = testDesign(design);
    assert.equal(result.passed, true, JSON.stringify(design));
    assert.ok(result.dustReaching <= 3);
    assert.ok(result.clearanceCm >= 3);
  }
  const shortPatch = testDesign({ ...goodDesign, length: 20 });
  assert.equal(shortPatch.wheelSafe, true);
  assert.equal(shortPatch.dustSafe, false);
  assert.equal(shortPatch.passed, false);
  const overlongPatch = testDesign({ ...goodDesign, length: 80 });
  assert.equal(overlongPatch.wheelSafe, true);
  assert.equal(overlongPatch.equipmentSafe, false);
  assert.equal(overlongPatch.passed, false);
  assert.match(lrvRepairHint(overlongPatch), /too long|Shorten/i);
});

test("illustrated dust paths change with the design, and caught paths drop before the gear", () => {
  const goodPaths = lrvDustTrajectories(goodDesign);
  const shortPaths = lrvDustTrajectories({ ...goodDesign, length: 20 });
  const loosePaths = lrvDustTrajectories({ ...goodDesign, attachment: "tape" });
  assert.equal(goodPaths.length, 12);
  assert.equal(shortPaths.length, 12);
  assert.equal(goodPaths.filter((path) => path.blocked).length, 12);
  assert.equal(shortPaths.filter((path) => path.hitEquipment).length, 12);
  assert.equal(loosePaths.filter((path) => path.blocked).length, 4);
  assert.equal(loosePaths.filter((path) => path.hitEquipment).length, 8);
  assert.notDeepEqual(goodPaths[0].points, shortPaths[0].points);
  for (const path of goodPaths) {
    assert.equal(path.hitEquipment, false);
    assert.ok(path.impact);
    assert.ok(path.points.at(-1).x < 85);
    assert.equal(path.points.at(-1).y, -24);
    assert.ok(path.points.every((point) => Number.isFinite(point.x) && Number.isFinite(point.y)));
  }
});

test("wheel clearance checks the entire tilted patch rather than just the mount setting", () => {
  const level = lrvPatchGeometry(goodDesign);
  const downward = lrvPatchGeometry({ ...goodDesign, angle: -25 });
  const upward = lrvPatchGeometry({ ...goodDesign, angle: 25 });
  assert.ok(downward.end.y < downward.start.y);
  assert.ok(upward.end.y > upward.start.y);
  assert.ok(downward.clearanceCm < level.clearanceCm);
  assert.ok(downward.clearanceCm < 3);
  assert.ok(level.clearanceCm >= 3);
});

test("untrusted configuration values stay within finite model limits", () => {
  const normalized = normalizeLrvConfiguration({ length: Infinity, angle: -100, clearance: 800, maps: "yes", tape: true, attachment: "staples" });
  assert.deepEqual(normalized, { length: 30, angle: -25, clearance: 20, maps: false, tape: false, attachment: "tape" });
  assert.deepEqual(normalizeLrvConfiguration(null), LRV_DEFAULT_CONFIGURATION);
  assert.deepEqual(normalizeLrvConfiguration({ length: "60", angle: "0", clearance: "8", ...assembled }), goodDesign);
  assert.equal(normalizeLrvConfiguration({ length: true }).length, 30);
  assert.equal(normalizeLrvConfiguration({ length: "" }).length, 30);
  assert.equal(normalizeLrvConfiguration({ length: "61" }).length, 62);
  for (const input of [null, {}, { length: NaN, angle: {}, clearance: [] }]) {
    const result = testDesign(input);
    assert.ok(Number.isFinite(result.clearanceCm));
    assert.equal(result.paths.length, 12);
    assert.equal(result.passed, false);
  }
});

test("markup provides native keyboard controls, a live result, history, and an honest source", () => {
  const markup = lrvGameMarkup();
  assert.equal((markup.match(/type="range"/g) || []).length, 3);
  assert.equal((markup.match(/data-lrv-step=/g) || []).length, 6);
  assert.equal((markup.match(/type="checkbox"/g) || []).length, 0);
  assert.equal((markup.match(/data-lrv-tool=/g) || []).length, 3);
  assert.ok(!markup.includes("data-lrv-apply"), "each tool applies with one tap");
  assert.ok(markup.includes('role="status" aria-live="polite" aria-atomic="true"'));
  assert.ok(markup.includes('data-lrv-result="untested"'));
  assert.ok(markup.includes("data-lrv-history"));
  assert.ok(markup.includes('data-lrv-design-check'));
  assert.match(markup, /class="lrv-history-scroll"[^>]*tabindex="0"[^>]*role="region"[^>]*aria-labelledby="lrv-workshop-\d+-history"/);
  assert.match(markup, /<table aria-labelledby="lrv-workshop-\d+-history">/);
  assert.ok(markup.includes("data-lrv-reset"));
  assert.ok(markup.includes("data-lrv-try hidden"));
  assert.ok(markup.includes("https://science.nasa.gov/image-article/apod-2004-april-17-lunar-dust-and-duct-tape/"));
  assert.ok(markup.includes(LRV_GAME_COPY.simulation));
  assert.ok(markup.includes(LRV_GAME_COPY.dimensions));
  assert.ok(markup.includes(LRV_GAME_COPY.modelExplanation));
  assert.ok(markup.includes("<svg"));
  assert.ok(!markup.includes("<img"));
  assert.ok(!markup.includes("data-stamp"));
  assert.ok(!markup.includes("data-exhibit"));
  for (const id of [...markup.matchAll(/<input id="([^"]+)"/g)].map((match) => match[1])) {
    assert.ok(markup.includes(`<label for="${id}">`));
  }
  const ids = (html) => [...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);
  const firstIds = ids(markup);
  const secondIds = ids(lrvGameMarkup());
  assert.equal(new Set(firstIds).size, firstIds.length);
  assert.ok(firstIds.every((id) => !secondIds.includes(id)));
  assert.doesNotThrow(() => mountLrvGame(null).dispose());
});

const allHints = Object.values(LRV_HINTS).flatMap((byDirection) => Object.values(byDirection).flatMap((bySize) => Object.values(bySize)));

// A child who follows the hint but presses too few or too many times.
function followHints(start, pressesFor = { small: 2, medium: 4, large: 6 }, limit = 12) {
  let configuration = { ...start };
  for (let tests = 1; tests <= limit; tests++) {
    const result = testDesign(configuration);
    if (result.passed) return tests;
    const change = lrvNextChange(result);
    const hint = lrvRepairHint(result);
    assert.ok(change, `no next step for ${JSON.stringify(configuration)}`);
    const size = /a little/.test(hint) ? "small" : /a lot/.test(hint) ? "large" : "medium";
    const { min, max, step } = LRV_CONTROL_LIMITS[change.key];
    const value = configuration[change.key] + (change.direction === "up" ? 1 : -1) * pressesFor[size] * step;
    configuration = { ...configuration, [change.key]: Math.max(min, Math.min(max, value)) };
  }
  return Infinity;
}

test("from the default shape, following one hint passes on the next test", () => {
  const start = { ...LRV_DEFAULT_CONFIGURATION, ...assembled };
  assert.match(lrvRepairHint(testDesign(start)), /^Length: make the patch a lot longer/);
  for (const presses of [6, 8, 12]) {
    assert.ok(followHints(start, { small: 2, medium: 4, large: presses }) <= 2, `${presses} presses`);
  }
  // Pressing too few times still shows progress and needs only one more hint.
  assert.ok(followHints(start, { small: 2, medium: 4, large: 4 }) <= 3);
});

test("every hint names one control, gives no winning number, and has translations", async () => {
  const { es, vi } = await import("../src/locales/nov14.js");
  for (const hint of allHints) {
    assert.equal((hint.match(/\b(Length|Angle|Clearance):/g) || []).length, 1, hint);
    assert.doesNotMatch(hint, /\d/);
    assert.ok(es[hint] && vi[hint], `missing translation: ${hint}`);
  }
  for (const line of [LRV_GAME_COPY.touching, LRV_GAME_COPY.toolsReady, LRV_GAME_COPY.instructions]) {
    assert.ok(es[line] && vi[line], `missing translation: ${line}`);
  }
});

test("hints never loop: a child following them from any shape reaches a pass", () => {
  for (let length = 20; length <= 80; length += 10) {
    for (let angle = -25; angle <= 35; angle += 5) {
      for (let clearance = 0; clearance <= 20; clearance += 5) {
        const start = { ...assembled, length, angle, clearance };
        assert.ok(followHints(start) <= 9, JSON.stringify(start));
      }
    }
  }
});

test("a negative model gap is shown to children as touching the wheel", () => {
  const rubbing = testDesign({ ...assembled, length: 40, angle: -20, clearance: 2 });
  assert.ok(rubbing.clearanceCm < 0);
  assert.equal(LRV_GAME_COPY.touching, "Touching the wheel");
});
