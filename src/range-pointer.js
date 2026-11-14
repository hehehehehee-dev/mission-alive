// Keep the native range input and keyboard behavior. Pointer capture prevents a
// slight vertical thumb movement from turning a touch drag into page scrolling.
export function enhanceRangePointer(input, { thumbSize = 26 } = {}) {
  let pointerId = null;
  let grabOffset = 0;
  let changed = false;

  function limits() {
    return { min: Number(input.min || 0), max: Number(input.max || 100), step: input.step === "any" ? 0 : Number(input.step || 1) };
  }
  function update(event) {
    const bounds = input.getBoundingClientRect();
    const { min, max, step } = limits();
    const ratio = Math.max(0, Math.min(1, (event.clientX - bounds.left - thumbSize / 2 - grabOffset) / Math.max(1, bounds.width - thumbSize)));
    const raw = min + ratio * (max - min);
    const value = Math.max(min, Math.min(max, step ? min + Math.round((raw - min) / step) * step : raw));
    if (Number(input.value) === value) return;
    input.value = String(value);
    changed = true;
    input.dispatchEvent(new Event("input", { bubbles: true }));
  }
  function down(event) {
    if (input.disabled || pointerId !== null || event.isPrimary === false || event.button !== 0) return;
    const bounds = input.getBoundingClientRect();
    const { min, max } = limits();
    const center = bounds.left + thumbSize / 2 + (bounds.width - thumbSize) * (Number(input.value) - min) / (max - min || 1);
    const onThumb = Math.abs(event.clientX - center) <= thumbSize / 2 + 3;
    // Preserve the grab point instead of jumping when the thumb edge is pressed.
    grabOffset = onThumb ? event.clientX - center : 0;
    pointerId = event.pointerId;
    changed = false;
    event.preventDefault();
    input.focus({ preventScroll: true });
    input.setPointerCapture(pointerId);
    if (!onThumb) update(event);
  }
  function move(event) {
    if (event.pointerId !== pointerId) return;
    event.preventDefault();
    update(event);
  }
  function finish(event) {
    if (event.pointerId !== pointerId) return;
    if (event.type === "pointerup") update(event);
    const previousId = pointerId;
    pointerId = null;
    if (input.hasPointerCapture(previousId)) input.releasePointerCapture(previousId);
    if (changed) input.dispatchEvent(new Event("change", { bubbles: true }));
    changed = false;
  }
  input.addEventListener("pointerdown", down);
  input.addEventListener("pointermove", move);
  input.addEventListener("pointerup", finish);
  input.addEventListener("pointercancel", finish);
  input.addEventListener("lostpointercapture", finish);
  return {
    dispose() {
      const previousId = pointerId;
      pointerId = null;
      if (previousId !== null && input.hasPointerCapture(previousId)) input.releasePointerCapture(previousId);
      input.removeEventListener("pointerdown", down);
      input.removeEventListener("pointermove", move);
      input.removeEventListener("pointerup", finish);
      input.removeEventListener("pointercancel", finish);
      input.removeEventListener("lostpointercapture", finish);
    },
  };
}
