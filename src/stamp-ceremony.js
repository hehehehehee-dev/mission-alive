export const STAMP_SETTLE_MS = 750;

// Progress belongs to the caller. It is committed only by onSettled, never by
// mounting the ceremony or by the initial click that starts the animation.
export function createStampCycle({
  onPress = () => {},
  onSettled = () => {},
  schedule = globalThis.setTimeout,
  cancel = globalThis.clearTimeout,
} = {}) {
  let phase = "waiting";
  let timer = null;

  return {
    get phase() { return phase; },
    press() {
      if (phase !== "waiting") return false;
      phase = "stamping";
      timer = schedule(() => {
        timer = null;
        if (phase !== "stamping") return;
        phase = "settled";
        onSettled();
      }, STAMP_SETTLE_MS);
      onPress();
      return true;
    },
    dispose() {
      phase = "disposed";
      if (timer !== null) cancel(timer);
      timer = null;
    },
  };
}

export function mountStampCeremony(root, {
  name,
  verb,
  reducedMotion = false,
  onPress = () => {},
  onSettled = () => {},
} = {}) {
  const document = root.ownerDocument;
  const panel = document.createElement("section");
  panel.className = "stamp-ceremony";
  panel.dataset.stampPhase = "waiting";
  panel.dataset.reducedMotion = String(Boolean(reducedMotion));
  panel.setAttribute("aria-label", `${name} certification stamp`);

  const heading = document.createElement("p");
  heading.className = "stamp-ready";
  heading.textContent = "MISSION COMPLETE";
  const instruction = document.createElement("p");
  instruction.id = "stamp-instruction";
  instruction.className = "stamp-instruction";
  instruction.textContent = "Press to stamp your certification.";

  const area = document.createElement("div");
  area.className = "stamp-press-area";
  const slot = document.createElement("span");
  slot.className = "stamp-slot";
  slot.setAttribute("aria-hidden", "true");
  const ink = document.createElement("span");
  ink.className = "stamp-ink";
  ink.textContent = verb;
  slot.append(ink);

  const button = document.createElement("button");
  button.id = "stamp-certification";
  button.className = "stamp-press";
  button.type = "button";
  button.setAttribute("aria-label", `${verb}: stamp your ${name} certification`);
  button.setAttribute("aria-describedby", instruction.id);
  const machine = document.createElement("span");
  machine.className = "stamp-machine";
  machine.textContent = name;
  const action = document.createElement("span");
  action.className = "stamp-verb";
  action.textContent = verb;
  const certification = document.createElement("span");
  certification.className = "stamp-caption";
  certification.textContent = "CREW CERTIFICATION";
  button.append(machine, action, certification);
  area.append(slot, button);
  panel.append(heading, instruction, area);
  root.replaceChildren(panel);

  const cycle = createStampCycle({
    onPress() {
      panel.dataset.stampPhase = "stamping";
      panel.setAttribute("aria-busy", "true");
      button.disabled = true;
      onPress();
    },
    onSettled() {
      panel.dataset.stampPhase = "settled";
      panel.removeAttribute("aria-busy");
      instruction.textContent = "Certification stamped.";
      onSettled();
    },
  });
  const press = () => cycle.press();
  // Native button activation supplies click for tap, Space and Enter alike.
  button.addEventListener("click", press);
  button.focus({ preventScroll: true });
  panel.scrollIntoView?.({ behavior: reducedMotion ? "instant" : "smooth", block: "center" });

  return {
    get phase() { return cycle.phase; },
    button,
    setReduced(value) { panel.dataset.reducedMotion = String(Boolean(value)); },
    dispose() {
      cycle.dispose();
      button.removeEventListener("click", press);
      panel.remove();
    },
  };
}
