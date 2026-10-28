import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
  WEBB_STACK_HOLD_MS, WEBB_DEEP_FIELD_CAPTION, WEBB_IMAGE_CREDIT,
  webbAlignmentAssets, webbAlignmentStage, webbAlignmentMarkup, mountWebbAlignment,
} from "../src/webb-alignment-story.js";

function scene() {
  const images = ["scattered", "hexagonal", "stacking", "deep-field"].map((stage) => ({
    dataset: { alignmentImage: stage }, hidden: true,
    setAttribute(name, value) { this[name] = value; },
    addEventListener(name, callback) { this[name] = callback; },
    removeEventListener(name) { delete this[name]; },
  }));
  const caption = { hidden: true };
  const root = { dataset: {}, querySelectorAll: () => images, querySelector: () => caption };
  let pending = null;
  let timerCount = 0;
  const ui = mountWebbAlignment(root, {
    schedule(callback, delay) { assert.equal(delay, WEBB_STACK_HOLD_MS); pending = callback; return ++timerCount; },
    cancel() { pending = null; },
  });
  return { root, images, caption, ui, get pending() { return pending; }, get timerCount() { return timerCount; } };
}

test("real Webb images are shipped in their declared formats, with the exact requested caption and credit", () => {
  const markup = webbAlignmentMarkup();
  assert.ok(markup.includes(WEBB_DEEP_FIELD_CAPTION));
  assert.ok(markup.includes(WEBB_IMAGE_CREDIT));
  for (const file of Object.values(webbAlignmentAssets)) {
    const bytes = readFileSync(new URL(`../public${file}`, import.meta.url));
    assert.ok(bytes.length > 100_000);
    if (file.endsWith(".png")) assert.deepEqual(Array.from(bytes.subarray(0, 8)), [137, 80, 78, 71, 13, 10, 26, 10]);
    else assert.deepEqual(Array.from(bytes.subarray(0, 3)), [255, 216, 255]);
  }
  assert.equal((markup.match(/class="webb-alignment-dot"/g) || []).length, 18);
});

test("unavailable local images silently fall back to a matching schematic without a broken image or misleading field caption", () => {
  const view = scene();
  view.ui.updateProgress(0);
  view.images[0].error();
  assert.equal(view.root.dataset.imageFallback, "scattered");
  assert.equal(view.images[0].hidden, true);
  assert.equal(view.images[2].hidden, false);
  view.ui.updateProgress(1 / 3);
  view.images[1].error();
  assert.equal(view.root.dataset.imageFallback, "hexagonal");
  view.ui.updateProgress(1);
  view.pending();
  view.images[3].error();
  assert.equal(view.root.dataset.imageFallback, "deep-field");
  assert.equal(view.images[3].hidden, true);
  assert.equal(view.images[2].hidden, false);
  assert.equal(view.caption.hidden, true);
});

test("existing alignment progress yields scattered, hexagonal and converging dots, then holds one point before the deep field", () => {
  const view = scene();
  for (const [progress, expected] of [[0, "scattered"], [1 / 3, "hexagonal"], [2 / 3, "stacking"], [1, "stacked"]]) {
    assert.equal(webbAlignmentStage(progress), expected);
    view.ui.updateProgress(progress);
    assert.equal(view.root.dataset.stage, expected);
    assert.equal(view.caption.hidden, true);
    assert.equal(view.images.filter((image) => !image.hidden).length, 1);
  }
  assert.ok(view.pending);
  view.ui.updateProgress(1);
  assert.equal(view.timerCount, 1);
  view.pending();
  assert.equal(view.root.dataset.stage, "deep-field");
  assert.equal(view.images.find((image) => image.dataset.alignmentImage === "deep-field").hidden, false);
  assert.equal(view.caption.hidden, false);
  view.ui.updateProgress(1);
  assert.equal(view.root.dataset.stage, "deep-field");
});

test("reset and leaving Webb cancel pending reveals, including under reduced motion", () => {
  const view = scene();
  view.ui.updateProgress(1);
  const oldReveal = view.pending;
  view.ui.updateProgress(0);
  assert.equal(view.pending, null);
  oldReveal();
  assert.equal(view.root.dataset.stage, "scattered");
  view.ui.updateProgress(1);
  const disposedReveal = view.pending;
  view.ui.dispose();
  disposedReveal();
  assert.equal(view.root.dataset.stage, "stacked");
  assert.equal(view.pending, null);
  // Reduced motion changes only CSS transitions; the staged hold never depends on animation events.
  const css = readFileSync(new URL("../src/webb-alignment-story.css", import.meta.url), "utf8");
  assert.ok(css.includes("prefers-reduced-motion: reduce"));
  assert.ok(!css.includes("blur("));
  assert.equal(webbAlignmentStage(NaN), "scattered");
  assert.equal(webbAlignmentStage(-1), "scattered");
  assert.equal(webbAlignmentStage(2), "stacked");
  assert.doesNotThrow(() => mountWebbAlignment(null).dispose());
});
