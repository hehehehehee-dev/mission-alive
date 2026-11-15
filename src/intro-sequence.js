// Opening story for first-time visitors: Commander Mira wakes a new cadet (the
// player), six machines call for help in speech bubbles, and the cadet is sent
// on the first mission. No voice and no autoplaying sound; reading is the only
// way through, so it works with sound off. Skip is always available.

export const INTRO_SPEAKERS = Object.freeze({
  mira: { name: "Commander Mira", side: "left" },
  cadet: { name: "You, the new cadet", side: "right" },
});

// Each beat is one speech bubble. `photo` beats are messages from a machine.
export const INTRO_BEATS = Object.freeze([
  { scene: "bridge", who: "cadet", text: "Zzz… huh? Where am I?", asleep: true },
  { scene: "bridge", who: "mira", text: "Wake up, cadet. Welcome to Mission Alive Academy." },
  { scene: "bridge", who: "mira", text: "Messages are coming in from very far away. Look." },
  { scene: "message", photo: "/assets/moon-apollo17-lrv.jpg", label: "APOLLO 17 ROVER · THE MOON", text: "My fender broke. Dust is everywhere!" },
  { scene: "message", photo: "/assets/moon-surveyor3-apollo12.jpg", label: "SURVEYOR 3 · THE MOON", text: "Is this ground safe to land on?" },
  { scene: "message", photo: "/assets/curiosity-gale-panorama.jpg", label: "CURIOSITY · MARS", text: "I need a safe route up the mountain." },
  { scene: "message", photo: "/assets/ingenuity-aerial.jpg", label: "INGENUITY · MARS", text: "The wind is strong. Can you help me land?" },
  { scene: "message", photo: "/assets/webb-deep-field.jpg", label: "WEBB · DEEP SPACE", text: "My mirrors are folded. Help me see!" },
  { scene: "message", photo: "/assets/voyager-heliosphere.jpg", label: "VOYAGER 1 · INTERSTELLAR SPACE", text: "Is anyone still listening?" },
  { scene: "bridge", who: "cadet", text: "Six machines… and they can't come home?" },
  { scene: "bridge", who: "mira", text: "That's right. They are far away, and they are calling for help." },
  { scene: "bridge", who: "mira", text: "I can't reach them. But you can." },
  { scene: "bridge", who: "cadet", text: "Me?!" },
  { scene: "bridge", who: "mira", text: "You are our newest crew member. Answer each call and earn its stamp." },
  { scene: "bridge", who: "cadet", text: "Okay. Let's go!", last: true },
]);

/** Plays on every landing-page load until the learner has earned a stamp. */
export function shouldAutoPlayIntro(stampCount) {
  return stampCount === 0;
}
/** Milliseconds a bubble stays before moving on by itself. */
export function beatDuration(text) {
  return 1800 + String(text).length * 55;
}

const miraSvg = (cls = "") => `<svg class="intro-person intro-mira ${cls}" viewBox="0 0 200 270" role="img" aria-label="Commander Mira, the academy teacher">
  <circle cx="100" cy="42" r="26" fill="#1c1410"/><circle cx="100" cy="30" r="20" fill="#1c1410"/>
  <path d="M30 270c0-62 30-92 70-92s70 30 70 92z" fill="#1f3a5f"/><path d="M70 182l30 34 30-34" fill="#eaf0f3"/>
  <circle cx="142" cy="222" r="14" fill="#f0c98a" stroke="#b8791f" stroke-width="3"/><path d="M136 222l4 4 8-9" fill="none" stroke="#0b141c" stroke-width="3" stroke-linecap="round"/>
  <rect x="88" y="150" width="24" height="36" rx="10" fill="#8d5a3b"/>
  <ellipse cx="100" cy="112" rx="46" ry="52" fill="#9a6340"/>
  <path d="M54 104c2-44 30-62 46-62s44 18 46 62c-8-26-26-36-46-36s-38 10-46 36z" fill="#1c1410"/>
  <g class="intro-eyes"><ellipse cx="82" cy="118" rx="6" ry="8" fill="#1c1410"/><ellipse cx="118" cy="118" rx="6" ry="8" fill="#1c1410"/></g>
  <path d="M72 104q10-6 20 0M108 104q10-6 20 0" fill="none" stroke="#1c1410" stroke-width="3" stroke-linecap="round"/>
  <ellipse class="intro-mouth" cx="100" cy="145" rx="14" ry="6" fill="#5a1f1f"/>
</svg>`;

const cadetSvg = (cls = "") => `<svg class="intro-person intro-cadet ${cls}" viewBox="0 0 200 270" role="img" aria-label="You, the new cadet">
  <path d="M34 270c0-60 28-86 66-86s66 26 66 86z" fill="#f2f4f5"/><path d="M34 270c0-34 8-56 22-70l12 70z" fill="#ef8a4c"/><path d="M166 270c0-34-8-56-22-70l-12 70z" fill="#ef8a4c"/>
  <path d="M72 188l28 28 28-28" fill="#ef8a4c"/><circle cx="100" cy="236" r="12" fill="#f0c98a" stroke="#b8791f" stroke-width="3"/>
  <rect x="88" y="160" width="24" height="30" rx="10" fill="#d49a6b"/>
  <ellipse cx="100" cy="116" rx="44" ry="48" fill="#e0a877"/>
  <path d="M56 108c0-40 24-56 44-56s44 16 44 56c-6-18-16-28-30-30-8 12-22 16-36 14-10 2-18 8-22 16z" fill="#3a2418"/>
  <g class="intro-eyes"><ellipse cx="82" cy="122" rx="7" ry="9" fill="#1c1410"/><ellipse cx="118" cy="122" rx="7" ry="9" fill="#1c1410"/><circle cx="84" cy="119" r="2.5" fill="#fff"/><circle cx="120" cy="119" r="2.5" fill="#fff"/></g>
  <g class="intro-sleep" fill="none" stroke="#1c1410" stroke-width="3.5" stroke-linecap="round"><path d="M74 124q8 6 16 0M110 124q8 6 16 0"/></g>
  <circle cx="72" cy="136" r="1.8" fill="#b97a4c"/><circle cx="80" cy="140" r="1.8" fill="#b97a4c"/><circle cx="120" cy="140" r="1.8" fill="#b97a4c"/><circle cx="128" cy="136" r="1.8" fill="#b97a4c"/>
  <ellipse class="intro-mouth" cx="100" cy="148" rx="12" ry="6" fill="#6a2a22"/>
</svg>`;

export function introMarkup() {
  return `<div class="intro-sequence" id="intro-sequence" role="dialog" aria-modal="true" aria-label="Mission Alive story">
    <div class="intro-sky" aria-hidden="true"></div>
    <div class="intro-bridge" aria-hidden="true"><div class="intro-earth"></div></div>
    <div class="intro-photo" aria-hidden="true"></div>
    <div class="intro-top"><span class="intro-eyebrow" id="intro-eyebrow">MISSION ALIVE ACADEMY · EARTH ORBIT</span><button type="button" class="intro-skip" id="intro-skip">Skip</button></div>
    <div class="intro-people" aria-hidden="true">${miraSvg()}${cadetSvg("is-asleep")}</div>
    <div class="intro-bubble" id="intro-bubble" aria-live="polite" role="status"><span class="intro-tag" id="intro-tag"></span><p id="intro-text"></p></div>
    <div class="intro-controls"><span class="intro-dots" id="intro-dots" aria-hidden="true"></span><button type="button" class="intro-next primary" id="intro-next">Next</button></div>
  </div>`;
}

/**
 * Show the story. `onStart` runs when the cadet presses the final button;
 * `onClose` runs for Skip as well. Returns { close }.
 */
export function playIntro({ onStart = () => {}, onClose = () => {}, reduced = false, root = document.body } = {}) {
  const holder = document.createElement("div");
  holder.innerHTML = introMarkup();
  const el = holder.firstElementChild;
  root.append(el);
  const q = (selector) => el.querySelector(selector);
  const bubble = q("#intro-bubble"), text = q("#intro-text"), tag = q("#intro-tag");
  const next = q("#intro-next"), skip = q("#intro-skip"), dots = q("#intro-dots");
  const mira = q(".intro-mira"), cadet = q(".intro-cadet"), photo = q(".intro-photo"), eyebrow = q("#intro-eyebrow");
  const previousFocus = document.activeElement;
  const appRoot = document.querySelector("#app");
  if (appRoot) appRoot.inert = true;
  document.body.classList.add("intro-open");
  dots.innerHTML = INTRO_BEATS.map(() => "<i></i>").join("");
  let index = -1, timer = 0, closed = false, photoToken = 0;

  function setScene(beat) {
    el.dataset.scene = beat.scene;
    if (beat.scene === "message") {
      const token = ++photoToken;
      photo.style.backgroundImage = `url("${beat.photo}")`;
      photo.classList.remove("is-in");
      void photo.offsetWidth;
      if (token === photoToken) photo.classList.add("is-in");
    }
  }

  function show(i) {
    clearTimeout(timer);
    if (i >= INTRO_BEATS.length) return finish(false);
    index = i;
    const beat = INTRO_BEATS[i];
    setScene(beat);
    const speaker = beat.who ? INTRO_SPEAKERS[beat.who] : null;
    el.dataset.side = speaker ? speaker.side : "center";
    mira.classList.toggle("is-speaking", beat.who === "mira");
    cadet.classList.toggle("is-speaking", beat.who === "cadet");
    cadet.classList.toggle("is-asleep", Boolean(beat.asleep));
    mira.classList.toggle("is-dim", beat.who === "cadet");
    cadet.classList.toggle("is-dim", beat.who === "mira");
    eyebrow.textContent = beat.scene === "message" ? "INCOMING MESSAGE" : "MISSION ALIVE ACADEMY · EARTH ORBIT";
    tag.textContent = beat.scene === "message" ? beat.label : speaker.name.toUpperCase();
    // Replay the pop-in animation for every bubble.
    bubble.classList.remove("is-in");
    void bubble.offsetWidth;
    bubble.classList.add("is-in");
    text.textContent = beat.text;
    dots.querySelectorAll("i").forEach((dot, n) => dot.classList.toggle("is-on", n <= i));
    next.textContent = beat.last ? "Start mission 01" : "Next";
    next.classList.toggle("is-start", Boolean(beat.last));
    if (!reduced && !beat.last) timer = window.setTimeout(() => show(i + 1), beatDuration(beat.text));
  }

  function finish(started) {
    if (closed) return;
    closed = true;
    clearTimeout(timer);
    document.removeEventListener("keydown", onKey, true);
    el.remove();
    if (appRoot) appRoot.inert = false;
    document.body.classList.remove("intro-open");
    if (previousFocus?.isConnected) previousFocus.focus({ preventScroll: true });
    if (started) onStart();
    onClose(started);
  }

  function onKey(event) {
    if (event.key === "Escape") { event.preventDefault(); finish(false); }
    else if (event.key === "ArrowRight") { event.preventDefault(); next.click(); }
  }

  next.addEventListener("click", () => (INTRO_BEATS[index]?.last ? finish(true) : show(index + 1)));
  skip.addEventListener("click", () => finish(false));
  document.addEventListener("keydown", onKey, true);
  show(0);
  next.focus({ preventScroll: true });
  return { close: () => finish(false), element: el };
}
