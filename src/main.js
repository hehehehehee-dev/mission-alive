import "./style.css";
import { trainingMissions, missionIds, MISSION_COUNT, restoredStamps, certificationComplete } from "./certification.js";
import { mountLanguageSwitcher, getLanguage, getSourceText, t } from "./i18n.js";
mountLanguageSwitcher();
import facts from "./facts.json";
import { greetingMarkup, mountGreetings } from "./greetings.js";
import { recordArtifacts, recordCredit } from "./record-artifacts.js";
import { createMachineAudio } from "./machine-audio.js";
import { createMachineVoices } from "./machine-voices.js";
import { createStoryVoice } from './story-voice.js';
import './story-voice.css';
import { mountStampCeremony } from "./stamp-ceremony.js";
import "./stamp-ceremony.css";
import { createFrictionFeedback } from "./friction-feedback.js";
import { mountVoyagerDistance, lightDayLink } from "./voyager-distance.js";
import { enhanceRangePointer } from "./range-pointer.js";
import { mountExhibitLayout } from "./exhibit-layout.js";
import { collapseChallengeNotes } from './challenge-steps.js';
import { mountMissionDirections } from './mission-actions.js';
import './mission-actions.css';
import './challenge-steps.css';
import { voyagerCountdownMarkup, mountVoyagerCountdown } from "./voyager-countdown.js";
import { voyagerContactMarkup, mountVoyagerContact } from "./voyager-contact.js";
import { webbAlignmentMarkup, mountWebbAlignment } from "./webb-alignment-story.js";
import "./webb-alignment-story.css";
import { flightGameMarkup, mountFlightGame } from "./ingenuity-flight-game.js";
import "./ingenuity-flight-game.css";
import "./ingenuity-flight-comparison.css";
import { createSpaceAmbience } from "./space-ambience.js";
import { createMissionFilm } from "./mission-film.js";
import { mountCuriosityGallery } from "./curiosity-gallery.js";
import { teacherPageMarkup, mountTeacherPage } from "./teachers.js";
import { mountMachineStory } from "./machine-stories.js";
import { storyLayer } from "./story-layer.js";
import { missionCallMarkup } from './mission-calls.js';
import { dsnWidgetMarkup, mountDsnWidget } from "./dsn-widget.js";
import { missionHistoryMarkup } from "./mission-history.js";
import { marsSoundsMarkup, mountMarsSounds } from "./mars-sounds.js";
import { hiddenFactPassportMarkup, mountHiddenFacts } from "./hidden-facts.js";
import { journeyStops, mountMoonPanel, mountLocationMap } from "./moon-stories.js";
import { mountResourceCredits } from './resource-credits.js';
import './resource-credits.css';
import { showMissionView, missionViews, mountPlanetComparison, mountHomecoming } from './journey-experience.js';
import './journey-experience.css';
import { mountAccessPreferences } from './access-preferences.js';
import { mountRoverTextMap, roverPosition, describeStar, mountRangeButtons } from './accessible-controls.js';
import './accessible-academy.css';
import './moon-labs.css';
import './typography.css';
import './consolidated-polish.css';
import './quick-start.css';
import { quickStartMarkup, whyMarkup } from './quick-start.js';
import './lobby-launch.css';
import './lobby-day.css';
import './academy-navigation.css';
import './feedback-impact.css';
import './intro-sequence.css';
import { playIntro, shouldAutoPlayIntro } from './intro-sequence.js';
import './readable-type.css';
import { feedbackLinkMarkup, mountFeedbackLinks } from './feedback.js';
import { mountImpact } from './impact.js';
mountFeedbackLinks();
let impactView = null;
import { mountLobbyTheme } from './lobby-theme.js';
mountLobbyTheme();
import {
  curiosityFieldSites,
  curiosityTerrainRocks,
} from "./mars-terrain.js";
const WEBB_SNAP_RADIUS = 0.12;
const exhibits = {
  curiosity: {
    name: "Curiosity",
    action: "Drive",
    place: "03 / GALE CRATER, MARS",
    title: "Every discovery<br>starts with a <em>choice.</em>",
    story:
      "“Since the beginning of time, humankind’s curiosity has led us to constantly seek new life…new possibilities just beyond the horizon.”",
    storyAttribution: "Charles Bolden · NASA Administrator",
    storySource:
      "https://www.jpl.nasa.gov/videos/first-recorded-voice-from-mars/",
    question:
      "Why should Curiosity inspect a rock target before drilling and analyzing it?",
    scene: "CURIOSITY / SURFACE EXPLORER",
    machineVoice:
      "Every move I make was planned on Earth hours ago. Then I go alone.",
  },
  ingenuity: {
    name: "Ingenuity",
    action: "Fly",
    place: "04 / JEZERO CRATER, MARS",
    title: "A small leap.<br><em>A new possibility.</em>",
    story: "“Ingenuity is what allows people to accomplish amazing things.”",
    storyAttribution: "Vaneeza Rupani · Student who named Ingenuity",
    storySource:
      "https://www.jpl.nasa.gov/news/alabama-high-school-student-names-nasas-mars-helicopter/",
    question: "Why test a small aircraft before sending a bigger one?",
    scene: "INGENUITY / FLIGHT DEMONSTRATOR",
    machineVoice: "I was built to attempt up to five flights. I flew seventy-two.",
  },
  webb: {
    name: "Webb",
    action: "Unfold",
    place: "05 / A TELESCOPE IN DEEP SPACE",
    title: "Folded for the journey.<br><em>Open to the universe.</em>",
    story:
      "“Today, we present humanity with a groundbreaking new view of the cosmos—a view the world has never seen before.”",
    storyAttribution: "Bill Nelson · NASA Administrator",
    storySource:
      "https://science.nasa.gov/missions/webb/nasa-reveals-webb-telescopes-first-images-of-unseen-universe/",
    question: "How are unfolding a mirror and aligning it different?",
    scene: "WEBB / MIRROR DEPLOYMENT",
    machineVoice:
      "My mirror is wider than the rocket that carried me. So I learned to fold.",
  },
  voyager: {
    name: "Voyager 1",
    action: "Listen",
    place: "06 / BEYOND THE PLANETS",
    title: "Far from home.<br><em>Carrying all of us.</em>",
    story:
      "“The launching of this bottle into the cosmic ocean says something very hopeful about life on this planet.”",
    storyAttribution: "Carl Sagan · Voyager Golden Record team",
    storySource:
      "https://science.nasa.gov/mission/voyager/golden-record-contents/",
    question: "Which sound would you choose to tell someone about Earth?",
    scene: "VOYAGER / THE GOLDEN RECORD",
    machineVoice:
      "I am the farthest thing humans have ever made. When I whisper home, my voice takes almost a full day to arrive.",
  },
};
const missionIconSvgs = {
  apollo17: '<svg viewBox="0 0 72 48" aria-hidden="true"><path d="M15 30h42l-5-14H25l-8 7zM27 16V9h12v7M45 16l5-8"/><circle cx="21" cy="35" r="7"/><circle cx="51" cy="35" r="7"/></svg>',
  surveyor3: '<svg viewBox="0 0 72 48" aria-hidden="true"><path d="M36 6v11M29 7h14M25 19h22l8 12H17zM24 30 13 43M48 30l11 13M36 31v12"/><circle cx="13" cy="43" r="3"/><circle cx="59" cy="43" r="3"/></svg>',
  curiosity: '<svg viewBox="0 0 72 48" aria-hidden="true"><path d="M16 28h40l-5-12H28l-7 7zM37 16V7h9M46 7l4 5M22 31 13 39M50 31l9 8"/><circle cx="13" cy="40" r="5"/><circle cx="29" cy="37" r="5"/><circle cx="46" cy="37" r="5"/><circle cx="60" cy="40" r="5"/></svg>',
  ingenuity: '<svg viewBox="0 0 72 48" aria-hidden="true"><path d="M36 13v27M25 27h22l-4 12H29zM9 12h54M18 8h36M30 40l-7 6M42 40l7 6"/></svg>',
  webb: '<svg viewBox="0 0 72 48" aria-hidden="true"><path d="m36 7 9 5v10l-9 5-9-5V12zM18 17l9-5M18 17v10l9 5M54 17l-9-5M54 17v10l-9 5M27 32l9 5 9-5M14 40h44L47 29H25z"/></svg>',
  voyager: '<svg viewBox="0 0 72 48" aria-hidden="true"><path d="M16 9c0 16 10 26 26 26M16 9c16 0 26 10 26 26M18 11l22 22M42 35l14 9M43 20l13-9M36 29l9-15"/><circle cx="42" cy="35" r="4"/></svg>',
};
const briefings = {
  curiosity: {
    label: "ROVING SCIENCE LABORATORY",
    title: "How Curiosity reads the history written in rock",
    summary:
      "Curiosity is a car-sized rover built to investigate whether ancient Mars offered environments where microbial life could have survived. It combines careful driving with instruments that inspect, drill, and analyze Martian material.",
    points: [
      ["SEE", "Mastcam surveys the landscape and helps the team choose a safe, scientifically useful rock target."],
      ["SAMPLE", "The rover can drill rock into powder and deliver that material to its onboard laboratories."],
      ["ANALYZE", "CheMin studies minerals while SAM investigates chemistry and compounds associated with habitability."],
    ],
    challenge:
      "Build a short command program or drive freely. Analyze a rock, then choose the claim your evidence actually supports.",
  },
  ingenuity: {
    label: "MARS FLIGHT DEMONSTRATOR",
    title: "How a small helicopter learned to fly on another world",
    summary:
      "Mars has an atmosphere less than one percent as dense as Earth’s near the surface. Ingenuity used fast counter-rotating blades, a lightweight body, and autonomous control to prove powered flight was possible there.",
    points: [
      ["SPIN", "Two counter-rotating rotors generate lift while helping cancel the twisting force each rotor creates."],
      ["BALANCE", "A flight computer adjusts the blades rapidly because radio commands from Earth arrive too late for live piloting."],
      ["SCOUT", "Its success showed how future aircraft could examine terrain ahead of rovers and reach difficult places."],
    ],
    challenge:
      "Choose a landing patch, act as the onboard computer to push against gusts, then land on level ground.",
  },
  webb: {
    label: "FOLDING SPACE OBSERVATORY",
    title: "How eighteen mirrors become one enormous eye",
    summary:
      "Webb’s 18 gold-coated mirror segments sit on a rigid backplane, with tiny actuators behind each one. A five-layer sunshield protects the cold telescope below. The observatory folded to fit inside its rocket, then unfolded and aligned its mirrors in space.",
    points: [
      ["UNFOLD", "Two mirror wings swing open after launch so the primary mirror reaches its full width."],
      ["ALIGN", "Tiny actuators adjust each segment’s position and curvature with extreme precision."],
      ["FOCUS", "When the separate images overlap correctly, the segments behave like a single 6.5-meter mirror."],
    ],
    challenge:
      "Open both mirror wings, align the star images, then reveal what infrared light can show through some dust.",
  },
  voyager: {
    label: "INTERSTELLAR MESSENGER",
    title: "How a record became a portrait of planet Earth",
    summary:
      "Each Voyager carries a gold-plated record containing sounds, images, music, and greetings selected to represent life and culture on Earth. Its protective cover includes diagrams intended to explain how to play it and where it came from.",
    points: [
      ["LISTEN", "The record includes spoken greetings in 55 languages alongside natural sounds and music."],
      ["DECODE", "Engravings describe playback, image reconstruction, time units, and the Sun’s location using pulsars."],
      ["IMAGINE", "The record is a time capsule rather than a conversation—the spacecraft may travel for billions of years."],
    ],
    challenge:
      "Play or read a greeting from Earth, then record or write your own greeting for the stamp. Sound and a microphone are optional. You can also send a signal to compare cosmic distances.",
  },
};
const trainingBriefs = {
  curiosity: "No one steers this rover live. A signal takes minutes to cross the dark, so its drivers plan every move, send it, and wait. That is now your job.",
  ingenuity: "The air on Mars is about one percent as thick as Earth's. Nothing this light should be able to fly there. Your job is to keep it in the air anyway.",
  webb: "This telescope was too big to launch whole, so it folded up to fit its rocket and had to unfold itself, once, perfectly, where no one could reach it. Your job is that unfolding.",
  voyager: "Everything you send this machine takes almost a day to arrive, and everything it answers was said a day ago. Your job is to speak across that distance.",
};
const challengeIncidents = {
  curiosity: ["A rock impact can stop the rover and drain its integrity.", "Debug the route, try again, and finish the science plan."],
  ingenuity: ["A flight can look stable and still fail at touchdown.", "Read the flight log, change the plan, and fly the next attempt."],
  webb: ["One mirror image out of place keeps the telescope from acting as one eye.", "Open, align, and test again before revealing infrared light."],
  voyager: ["The message crosses space slowly, and a microphone may be unavailable.", "Choose a greeting, then type or record your reply."],
};
function challengeIncidentMarkup(id) {
  const [incident, repair] = challengeIncidents[id];
  return `<aside class="mission-incident" aria-label="Mission moment"><p class="eyebrow">MISSION MOMENT</p><p>${incident}</p><p class="fine">${repair}</p></aside>`;
}
const PROGRESS_KEY = "mission-alive-passport-v2";
const MOTION_KEY = "mission-alive-reduced-motion";
const JOURNEY_KEY = "mission-alive-journey-v1";
function initialReducedMotion() {
  try {
    const saved = localStorage.getItem(MOTION_KEY);
    if (saved !== null) return saved === "true";
  } catch {
    // The OS preference remains available when storage is blocked.
  }
  return matchMedia("(prefers-reduced-motion: reduce)").matches;
}
function loadProgress() {
  try {
    const saved = JSON.parse(localStorage.getItem(PROGRESS_KEY) || "[]");
    return restoredStamps(saved);
  } catch {
    return new Set();
  }
}
function loadJourneyProgress(stamps) {
  try {
    const saved = localStorage.getItem(JOURNEY_KEY);
    const savedIndex = journeyStops.indexOf(saved);
    if (savedIndex >= 0) return savedIndex;
  } catch {
    // Derive a sensible starting point from stamps when storage is blocked.
  }
  return Math.max(0, ...[...stamps].map((id) => journeyStops.indexOf(id)));
}
const $ = (s) => document.querySelector(s);
const moonPanel = mountMoonPanel($("#moon-panel-slot"), {
  isStamped: id => completed.has(id),
  onNavigate: id => navigateTo(id),
  onEarned(id) {
    if (completed.has(id)) return;
    completed.add(id);
    saveProgress();
    updateMissionProgress();
    configureJourneyStart();
  },
  onContinue() {
    if (certificationComplete(completed)) { openFinale(); return; }
    navigateTo(missionIds.find(id => !completed.has(id)) || 'lobby');
  },
  isComplete: () => certificationComplete(completed),
});
let current = "curiosity",
  state = {},
  scene,
  greetingPlayer,
  voyagerDistance,
  voyagerCountdown,
  voyagerContact,
  webbAlignment,
  trimPointer,
  exhibitLayout,
  stampCeremony,
  curiosityGallery,
  dsnWidget,
  locationMap,
  marsSoundPlayer,
  hiddenFactCache,
  roverTextMap,
  rangeButtons = [],
  completed = loadProgress(),
  journeyProgress = loadJourneyProgress(completed),
  sound = false,
  audioContext,
  reduce = initialReducedMotion(),
  force2d = false,
  last = performance.now();
let frictionFeedback = createFrictionFeedback();
const completionTimers = new Set();
document.body.classList.toggle("motion-reduced", reduce);
document.body.classList.toggle("motion-allowed", !reduce);
$("#motion").setAttribute("aria-pressed", String(reduce));
$("#motion").textContent = reduce ? "Motion reduced" : "Reduce motion";
const announcer = $("#museum-announcer");
const voyagerAnnouncer = $("#voyager-announcements");
let voyagerAnnouncementQueue = [];
let voyagerAnnouncementTimer = 0;
let voyagerFinaleTimer = 0;
let voyagerSearchAnnouncementTimer = 0;
let voyagerAnnouncementVersion = 0;
let lastVoyagerAnnouncement = "";
function resetVoyagerAnnouncements() {
  voyagerAnnouncementVersion++;
  clearTimeout(voyagerAnnouncementTimer);
  clearTimeout(voyagerFinaleTimer);
  clearTimeout(voyagerSearchAnnouncementTimer);
  voyagerAnnouncementTimer = 0;
  voyagerAnnouncementQueue = [];
  lastVoyagerAnnouncement = "";
  voyagerAnnouncer.textContent = "";
  clearTimeout(pendingAnnouncement);
  announcer.textContent = "";
  voyagerAnnouncer.hidden = current !== "voyager";
  announcer.setAttribute("aria-live", current === "voyager" ? "off" : "polite");
  $("#discovery").setAttribute("aria-live", "off");
}
function announceVoyager(message, onPublished) {
  if (current !== "voyager" || !message) return;
  if (message === lastVoyagerAnnouncement || voyagerAnnouncementQueue.some((item) => item.message === message)) return;
  const required = /^Playing |saved|^Stamp earned:/i.test(message);
  if (required) voyagerAnnouncementQueue = voyagerAnnouncementQueue.filter((item) => item.required);
  voyagerAnnouncementQueue.push({ message, onPublished, required });
  if (voyagerAnnouncementTimer) return;
  const publishNext = () => {
    if (current !== "voyager") { resetVoyagerAnnouncements(); return; }
    const item = voyagerAnnouncementQueue.shift();
    if (!item) { voyagerAnnouncementTimer = 0; return; }
    lastVoyagerAnnouncement = item.message;
    const version = voyagerAnnouncementVersion;
    voyagerAnnouncer.textContent = "";
    requestAnimationFrame(() => {
      if (current !== "voyager" || version !== voyagerAnnouncementVersion) return;
      voyagerAnnouncer.textContent = item.message;
      item.onPublished?.();
    });
    voyagerAnnouncementTimer = window.setTimeout(publishNext, Math.max(2000, item.message.length * 45));
  };
  publishNext();
}
let lastAnnouncementAt = -2000;
let pendingAnnouncement = 0;
let lastAnnouncement = "";
let priorityAnnouncementUntil = 0;
function announce(message, priority = false, onPublished) {
  if (current === "voyager") { announceVoyager(message, onPublished); return; }
  if (!message || message === lastAnnouncement) return;
  if (!priority && performance.now() < priorityAnnouncementUntil) return;
  clearTimeout(pendingAnnouncement);
  const version = voyagerAnnouncementVersion;
  const publish = () => {
    if (version !== voyagerAnnouncementVersion) return;
    announcer.textContent = "";
    requestAnimationFrame(() => {
      if (version !== voyagerAnnouncementVersion) return;
      announcer.textContent = message;
      onPublished?.();
    });
    lastAnnouncement = message;
    lastAnnouncementAt = performance.now();
  };
  const delay = Math.max(0, 2000 - (performance.now() - lastAnnouncementAt));
  if (priority) priorityAnnouncementUntil = performance.now() + delay + 2200;
  if (priority && delay === 0) publish();
  else if (delay === 0) publish();
  else pendingAnnouncement = window.setTimeout(publish, delay);
}
const spaceAmbience = createSpaceAmbience($("#space-ambience"));
spaceAmbience.setReduced(reduce);
const missionFilm = createMissionFilm($("#mission-film"));
missionFilm.setReduced(reduce);
function disposeOpenData() {
  flightGame?.dispose();
  flightGame = null;
  $('#reset')?.classList.remove('needs-repair');
  storyVoice?.dispose();
  storyVoice = null;
  impactView?.dispose();
  impactView = null;
  roverTextMap = null;
  rangeButtons.forEach(control => control.dispose());
  rangeButtons = [];
  stampCeremony?.dispose();
  stampCeremony = null;
  for (const timer of completionTimers) clearTimeout(timer);
  completionTimers.clear();
  $("#discovery").classList.remove("has-completion");
  machineVoices.stop();
  trimPointer?.dispose();
  trimPointer = null;
  voyagerCountdown?.dispose();
  voyagerCountdown = null;
  voyagerContact?.dispose();
  voyagerContact = null;
  webbAlignment?.dispose();
  webbAlignment = null;
  exhibitLayout?.dispose();
  exhibitLayout = null;
  locationMap?.dispose();
  locationMap = null;
}
const backgroundCredits = {
  lobby: [
    "Lobby background: Flying Through Galaxies · NASA Goddard/Conceptual Image Lab ↗",
    "https://svs.gsfc.nasa.gov/14950/",
  ],
  curiosity: [
    "Background: Curiosity’s 1.8-billion-pixel Mars panorama · NASA/JPL ↗",
    "https://svs.gsfc.nasa.gov/31140/",
  ],
  ingenuity: [
    "Background: First aerial color image of Mars · NASA/JPL-Caltech ↗",
    "https://science.nasa.gov/resource/first-aerial-color-image-of-mars/",
  ],
  webb: [
    "Background: Webb Deep Field · NASA, ESA, CSA, STScI ↗",
    "https://svs.gsfc.nasa.gov/31186/",
  ],
  voyager: [
    "Background film: Voyager and the heliosphere · NASA SVS ↗",
    "https://svs.gsfc.nasa.gov/13544/",
  ],
};
function updateBackgroundCredit(id) {
  const [label, href] = backgroundCredits[id];
  $("#ambient-credit").innerHTML = `<a href="${href}" target="_blank" rel="noopener">${label}</a>`;
}
let navigationPending = false;
let queuedNavigation = null;
async function navigateTo(id) {
  if (navigationPending) { queuedNavigation = id; return; }
  // The mission opening now lives at the top of the page itself, so arriving
  // goes straight to the story and then the challenge with no extra dialog.
  if (reduce) {
    setRoute(id);
    return;
  }
  navigationPending = true;
  document.body.classList.add("is-warping");
  try {
    await spaceAmbience.warp();
    setRoute(id);
  } finally {
    window.setTimeout(() => {
      document.body.classList.remove("is-warping");
      navigationPending = false;
      const queued = queuedNavigation;
      queuedNavigation = null;
      if (queued && queued !== current) navigateTo(queued);
    }, 80);
  }
}
function setRoute(id) {
  if (moonPanel.dialog.open) moonPanel.dialog.close();
  if (id === 'journey') { history.pushState({ route: id }, '', '/#journey'); renderJourneyAlias(); return; }
  if (Object.hasOwn(academyPageTitles, id)) {
    history.pushState({ route: id }, "", `/#${id}`);
    renderAcademyPage(id);
    return;
  }
  if (id === "teachers") {
    history.pushState({ route: id }, "", "/teachers");
    renderTeachers();
    return;
  }
  const target = `/#${id}`;
  if (`${location.pathname}${location.hash}` === target) {
    id === "lobby" ? renderLobby() : missionIds.slice(0, 2).includes(id) ? renderMoonRoute(id) : render(id);
    return;
  }
  history.pushState({ route: id }, "", target);
  id === "lobby" ? renderLobby() : missionIds.slice(0, 2).includes(id) ? renderMoonRoute(id) : render(exhibits[id] ? id : "curiosity");
}

function renderMoonRoute(id) {
  renderLobby();
  current = id;
  advanceJourney(id);
  document.body.dataset.exhibit = id;
  moonPanel.openRoute(id, () => navigateTo('lobby'));
}
const machineAudio = createMachineAudio();
let storyVoice = null;
let flightGame = null;
const machineVoices = createMachineVoices({ onState({ id, kind, state: voiceState }) {
  if (id === current && kind === 'final') storyVoice?.update(voiceState);
} });
$("#machine-voice-credit").hidden = !machineVoices.available;

function playMachineTransmission(id) {
  if (!sound || !machineVoices.has(id)) return;
  greetingPlayer?.pause();
  marsSoundPlayer?.pause();
  machineAudio.stop();
  void machineVoices.playTransmission(id);
}
const driveKeys = new Set();
const roverMission = {
  size: 5,
  start: { x: 0, y: 4, dir: 0 },
  sample: { x: 1, y: 1 },
  goal: { x: 4, y: 0 },
  obstacles: new Set(["0,2", "2,3", "3,1", "4,2"]),
  maxBlocks: 11,
};
const roverCommands = {
  move: { label: "MOVE FORWARD", short: "MOVE", className: "move" },
  left: { label: "TURN LEFT", short: "LEFT", className: "turn" },
  right: { label: "TURN RIGHT", short: "RIGHT", className: "turn" },
  analyze: {
    label: "DRILL & ANALYZE",
    short: "ANALYZE",
    className: "scan",
  },
  repeat2: { label: "REPEAT NEXT ×2", short: "LOOP ×2", className: "loop" },
  repeat3: { label: "REPEAT NEXT ×3", short: "LOOP ×3", className: "loop" },
};
const roverDirections = [
  { dx: 0, dy: -1, name: "north" },
  { dx: 1, dy: 0, name: "east" },
  { dx: 0, dy: 1, name: "south" },
  { dx: -1, dy: 0, name: "west" },
];
const curiosityCollisionRocks = [
  ...curiosityTerrainRocks
    .filter((rock) => rock.size >= 0.17)
    .map((rock) => ({
      x: rock.x,
      z: rock.z,
      radius: 0.42 + rock.size * 1.25,
    })),
  { x: -3, z: 0, radius: 0.78 },
  { x: 0, z: 1.15, radius: 0.78 },
  { x: 1.5, z: -1.15, radius: 0.78 },
  { x: 3, z: 0, radius: 0.78 },
];
const nav = $(".exhibits");
nav.innerHTML = Object.entries(trainingMissions)
  .map(
    ([id, e], i) =>
      `<button data-exhibit="${id}"><span class="number">0${i + 1}</span><span><span class="module-number">TRAINING MODULE ${i + 1}</span><strong>${e.name}</strong><small>${e.action} · Discover <span class="current-marker" hidden>(current)</span></small></span><span class="done" aria-label="Completed" hidden>✦</span></button>`,
  )
  .join("");
nav.addEventListener("click", (e) => {
  const b = e.target.closest("[data-exhibit]");
  if (b) navigateTo(b.dataset.exhibit);
});
$("#passport").onclick = () => {
  navigateTo("lobby");
};
$("#teachers-link").onclick = () => navigateTo("teachers");
$("#teachers-footer-link").onclick = () => navigateTo("teachers");
$("#lobby-teachers").onclick = () => navigateTo("teachers");
$("#teachers-page").innerHTML = teacherPageMarkup();
mountTeacherPage($("#teachers-page"), {
  onEnterMuseum: () => navigateTo("lobby"),
});

const CREW_NAME_KEY = 'mission-alive-crew-name-v1';
try { $('#graduate-name').value = localStorage.getItem(CREW_NAME_KEY) || ''; } catch { /* Private browsing. */ }
const cleanCrewName = value => value.trim().replace(/\s+/g, ' ').slice(0, 60);
function certificateName() {
  return cleanCrewName($('#graduate-name').value) || t('Mission Alive crew member');
}
$('#graduate-name').oninput = () => {
  $('#certificate-name').textContent = certificateName();
  try { localStorage.setItem(CREW_NAME_KEY, cleanCrewName($('#graduate-name').value)); } catch { /* Keep it for this visit. */ }
};

let finaleReturnFocus = null;
const homecoming = mountHomecoming($('#finale'));
const planetComparison = mountPlanetComparison($('#planet-comparison'));
function closeFinale(restoreFocus = true) {
  if ($("#finale").hidden) return;
  homecoming.stop();
  $("#finale").hidden = true;
  document.body.classList.remove("finale-open");
  $("#app").inert = false;
  if (restoreFocus && finaleReturnFocus?.isConnected)
    finaleReturnFocus.focus({ preventScroll: true });
  finaleReturnFocus = null;
}

function openFinale({ homecoming: playHomecoming = true } = {}) {
  if (!certificationComplete(completed) || !$("#finale").hidden) return;
  if (moonPanel.dialog.open) moonPanel.dialog.close();
  state.finaleOpened = true;
  for (const timer of completionTimers) clearTimeout(timer);
  completionTimers.clear();
  finaleReturnFocus = document.activeElement;
  $('#certificate-name').textContent = certificateName();
  $("#finale-date").dataset.i18nDate = new Date().toISOString();
  $("#finale-date").textContent = new Intl.DateTimeFormat(getLanguage(), { dateStyle: "long" }).format(new Date());
  const confetti = $("#finale-confetti");
  confetti.replaceChildren();
  const colors = ["#f1c66f", "#78d6be", "#78bcec", "#ed8e75", "#f5efe2"];
  for (let i = 0; i < (reduce ? 0 : 52); i++) {
    const piece = document.createElement("i");
    piece.style.setProperty("--x", `${(i * 37) % 100}vw`);
    piece.style.setProperty("--delay", `${(i % 13) * -0.17}s`);
    piece.style.setProperty("--duration", `${3.6 + (i % 7) * 0.28}s`);
    piece.style.setProperty("--drift", `${-70 + (i * 29) % 140}px`);
    piece.style.setProperty("--color", colors[i % colors.length]);
    confetti.append(piece);
  }
  $("#finale").hidden = false;
  $('#finale').scrollTop = 0;
  homecoming.start({ reducedMotion: reduce, requested: playHomecoming });
  $("#app").inert = true;
  document.body.classList.add("finale-open");
  $("#finale-close").focus({ preventScroll: true });
  beep(784, 0.18);
  window.setTimeout(() => beep(988, 0.24), 170);
}

$("#finale-passport").onclick = () => {
  closeFinale(false);
  navigateTo("lobby");
};
$("#finale-teachers").onclick = () => {
  closeFinale(false);
  navigateTo("teachers");
};
$("#finale-close").onclick = () => closeFinale();
$("#lobby-certificate").onclick = () => {
  if (certificationComplete(completed)) openFinale({ homecoming: false });
};
$("#print-certificate").onclick = () => {
  if (!certificationComplete(completed)) return;
  const name = certificateName();
  $("#certificate-name").textContent = name;
  $("#certificate-date").dataset.i18nDate = new Date().toISOString();
  $("#certificate-date").textContent = new Intl.DateTimeFormat(getLanguage(), { dateStyle: "long" }).format(new Date());
  $("#certificate-status").textContent = "Opening your browser's print dialog…";
  document.body.classList.add("printing-certificate");
  requestAnimationFrame(() => window.print());
};
window.addEventListener("afterprint", () => {
  document.body.classList.remove("printing-certificate");
  $("#certificate-status").textContent = "Your name stays in this browser and is not uploaded.";
});
window.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !$("#finale").hidden) {
    event.preventDefault();
    closeFinale();
  }
});

function saveProgress() {
  try {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify([...completed]));
  } catch {
    /* Progress still works for this visit if storage is unavailable. */
  }
}

function advanceJourney(stop) {
  const nextProgress = journeyStops.indexOf(stop);
  if (nextProgress < 0 || nextProgress <= journeyProgress) {
    locationMap?.setProgress(journeyProgress);
    return false;
  }
  journeyProgress = nextProgress;
  try {
    localStorage.setItem(JOURNEY_KEY, journeyStops[journeyProgress]);
  } catch {
    /* Journey position still works for this visit if storage is unavailable. */
  }
  locationMap?.setProgress(journeyProgress);
  configureJourneyStart();
  return true;
}

function startIntro() {
  playIntro({ reduced: reduce, onStart: () => navigateTo("apollo17") });
}

function configureJourneyStart() {
  const button = $("#start-journey");
  if (!button) return;
  const nextMission = missionIds.find((id) => !completed.has(id));
  button.textContent = completed.size
        ? nextMission
          ? `Continue with ${trainingMissions[nextMission].name}`
          : "Visit the machines again"
        : "Start mission 01 · Apollo 17 LRV";
  button.onclick = () => navigateTo(nextMission || "curiosity");
}

function updateMissionProgress() {
  const count = completed.size;
  $("#passport").textContent = `${count} / ${MISSION_COUNT} stamped`;
  $("#passport").setAttribute(
    "aria-label",
    `Open crew certification · ${count} of ${MISSION_COUNT} stamps earned`,
  );
  $("#passport").style.setProperty("--passport-progress", `${count * 100 / MISSION_COUNT}%`);
  nav.querySelectorAll("[data-exhibit]").forEach((button) => {
    button.querySelector(".done").hidden = !completed.has(button.dataset.exhibit);
  });
  if (!$("#lobby-progress")) return;
  $("#lobby-progress").textContent = `${count} / ${MISSION_COUNT} STAMPS`;
  $("#passport-progress-bar").style.width = `${count * 100 / MISSION_COUNT}%`;
  // One slot per mission, in mission order, so each earned stamp is something you can see.
  let slots = $("#passport-stamp-row");
  if (!slots) {
    slots = document.createElement("ol");
    slots.id = "passport-stamp-row";
    slots.className = "passport-stamp-row";
    slots.setAttribute("aria-hidden", "true");
    slots.innerHTML = missionIds.map((id, index) => `<li data-stamp-slot="${id}"><b>${index + 1}</b><span data-i18n-skip>${trainingMissions[id].name.replace(/ Lunar Roving Vehicle$/, "")}</span></li>`).join("");
    $(".passport-track").after(slots);
  }
  slots.querySelectorAll("[data-stamp-slot]").forEach((slot) => {
    const earned = completed.has(slot.dataset.stampSlot);
    slot.classList.toggle("is-earned", earned);
    slot.querySelector("b").textContent = earned ? "✓" : String(missionIds.indexOf(slot.dataset.stampSlot) + 1);
  });
  $("#passport-message").textContent =
    count === MISSION_COUNT
      ? "Crew certification complete. Six machines, six training modules, one journey through space exploration."
      : count
        ? `${MISSION_COUNT - count} mission${MISSION_COUNT - count === 1 ? "" : "s"} remain. Choose your next machine.`
        : "Complete a machine’s challenge to earn its stamp.";
  $("#lobby-certificate").hidden = count !== MISSION_COUNT;
  $("#lobby-missions")
    ?.querySelectorAll("[data-lobby-exhibit]")
    .forEach((card) => {
      const done = completed.has(card.dataset.lobbyExhibit);
      card.classList.toggle("is-complete", done);
      card.querySelector(".mission-stamp").textContent = done ? "STAMPED ✓" : "OPEN";
    });
}

function briefingMarkup(id) {
  const briefing = briefings[id];
  return `<div class="briefing-copy"><p class="eyebrow">BEFORE YOU TAKE CONTROL · ${briefing.label}</p><h2 id="briefing-title">${briefing.title}</h2><p>${briefing.summary}</p><a href="${facts[id].source_url}" target="_blank" rel="noopener">Learn from ${facts[id].source_title} ↗</a></div><div class="briefing-points">${briefing.points.map(([label, text]) => `<article><span>${label}</span><p>${text}</p></article>`).join("")}</div><div class="briefing-challenge"><div><strong>YOUR OBJECTIVE</strong><p>${briefing.challenge}</p></div><button id="begin-challenge">Go to challenge ↓</button></div>`;
}

const storyDialog = $("#exhibit-story-dialog");
function mountModuleStory(id) {
  const story = storyLayer[id];
  const root = $("#module-story");
  root.replaceChildren();
  const heading = document.createElement("h2");
  heading.id = "module-story-title";
  heading.tabIndex = -1;
  heading.textContent = story.heading;
  const beats = document.createElement("dl");
  beats.className = "exhibit-story-beats";
  for (const [label, copy] of story.beats.slice(0, 2)) {
    const beat = document.createElement("div");
    const term = document.createElement("dt");
    term.textContent = `${label}:`;
    const description = document.createElement("dd");
    description.textContent = copy;
    beat.append(term, description);
    beats.append(beat);
  }
  const meanwhile = document.createElement("p");
  meanwhile.className = "story-meanwhile";
  meanwhile.textContent = story.meanwhile;
  root.append(heading, beats, meanwhile);
  const brief = document.createElement("p");
  brief.className = "training-brief-line";
  brief.textContent = trainingBriefs[id];
  $("#module-training").replaceChildren(brief);
  if (id === "voyager") {
    const framing = document.createElement("p");
    framing.className = "voyager-listening-brief";
    framing.textContent = "This machine speaks in sound. Its record carries greetings, music, and the sounds of Earth. This module can be completed by listening.";
    $("#module-training").append(framing);
  }
}
function openExhibitStory(id) {
  const story = storyLayer[id];
  if (!story) return;
  if (storyDialog.open) storyDialog.close();
  showMissionView(storyDialog, id);
  storyDialog.querySelector('.mission-view-notes').open = false;
  $("#exhibit-story-machine").textContent = exhibits[id].name;
  $("#exhibit-story-title").textContent = story.heading;
  $("#exhibit-story-meanwhile").textContent = story.meanwhile;
  const beats = $("#exhibit-story-beats");
  beats.replaceChildren();
  for (const [label, copy] of story.beats.slice(0, 2)) {
    const beat = document.createElement("div");
    const term = document.createElement("dt");
    const description = document.createElement("dd");
    term.textContent = label;
    description.textContent = copy;
    beat.append(term, description);
    beats.append(beat);
  }
  storyDialog.showModal();
  storyDialog.scrollTop = 0;
  $("#start-exploring").focus({ preventScroll: true });
}
$('#mission-view-close').onclick = () => storyDialog.close();
storyDialog.addEventListener('close', () => {
  if (document.activeElement === document.body || document.activeElement === storyDialog) $('#story-reopen').focus({ preventScroll: true });
});
$("#story-reopen").onclick = () => openExhibitStory(current);
$("#start-exploring").onclick = () => {
  storyDialog.close();
  // Let the dialog restore focus before starting the smooth scroll.
  requestAnimationFrame(() => $("#begin-challenge").click());
};

/** Story first, in one glance: a real mission image and two short beats, then the challenge. */
function missionOpening(id) {
  const view = missionViews[id];
  const story = storyLayer[id];
  if (!view || !story) return null;
  const section = document.createElement("section");
  section.id = "mission-opening";
  section.className = "mission-opening";
  section.setAttribute("aria-label", `${exhibits[id].name} · mission opening`);
  const figure = document.createElement("figure");
  figure.className = "mission-opening-view";
  const image = document.createElement("img");
  image.src = view.image;
  image.alt = view.alt;
  image.loading = "lazy";
  image.decoding = "async";
  const caption = document.createElement("figcaption");
  const captionText = document.createElement("span");
  captionText.textContent = view.caption;
  const kind = document.createElement("small");
  kind.textContent = view.kind;
  const source = document.createElement("a");
  source.href = view.source;
  source.target = "_blank";
  source.rel = "noopener";
  source.textContent = `${view.credit} ↗`;
  source.dataset.i18nSkip = "";
  caption.append(captionText, kind, source);
  const frame = document.createElement("div");
  frame.className = "mission-opening-photo";
  frame.append(image);
  figure.append(frame, caption);
  if (id === "voyager") {
    // At thumbnail size Earth is a single pixel. Mark where it is; the photo itself is unchanged.
    figure.dataset.marker = "earth";
    const marker = document.createElement("span");
    marker.className = "mission-opening-marker";
    marker.setAttribute("aria-hidden", "true");
    marker.textContent = "Earth is here";
    frame.append(marker);
  }
  const beats = document.createElement("dl");
  beats.className = "mission-opening-beats";
  for (const [label, copy] of story.beats.slice(0, 2)) {
    const beat = document.createElement("div");
    const term = document.createElement("dt");
    const description = document.createElement("dd");
    term.textContent = label;
    description.textContent = copy;
    beat.append(term, description);
    beats.append(beat);
  }
  section.append(figure, beats);
  return section;
}

function renderLobby() {
  if (moonPanel.dialog.open) moonPanel.dialog.close();
  $('#academy-page').hidden = true;
  $('.skip').href = '#lobby-missions';
  $('.skip').textContent = 'Skip to training modules';
  disposeOpenData();
  if (storyDialog.open) storyDialog.close();
  delete document.body.dataset.printResource;
  machineAudio.stop();
  marsSoundPlayer?.dispose();
  marsSoundPlayer = null;
  hiddenFactCache = null;
  dsnWidget?.dispose();
  dsnWidget = null;
  curiosityGallery?.dispose();
  curiosityGallery = null;
  voyagerDistance?.dispose();
  voyagerDistance = null;
  greetingPlayer?.dispose();
  greetingPlayer = null;
  scene?.dispose();
  scene = null;
  current = "lobby";
  resetVoyagerAnnouncements();
  document.body.dataset.exhibit = "lobby";
  spaceAmbience.setTheme("lobby");
  missionFilm.setExhibit("lobby");
  updateBackgroundCredit("lobby");
  nav.hidden = true;
  $(".exhibit").hidden = true;
  $("#greetings").hidden = true;
  $("#discovery").hidden = true;
  $("#teachers-page").hidden = true;
  $("#lobby").hidden = false;
  updateViewModeButton();
  $('#hidden-fact-passport-slot').innerHTML = hiddenFactPassportMarkup();
  locationMap = mountLocationMap($('#location-map-slot'), {
    journeyProgress,
    onCompare: trigger => planetComparison.open($('#location-map-slot'), trigger),
    onExhibit: id => { advanceJourney(id); navigateTo(id); },
    onMoon: id => { advanceJourney(id); navigateTo(id); },
    isStamped: id => completed.has(id),
  });
  configureJourneyStart();
  updateMissionProgress();
  window.scrollTo({ top: 0, behavior: "instant" });
}

function renderJourneyAlias() {
  renderLobby();
  $('#location-map-slot').scrollIntoView({ block: 'start', behavior: 'instant' });
}
const academyPageTitles = Object.freeze({ 'mission-notes': 'Mission notes', about: 'About Mission Alive', impact: 'Playtest impact' });
document.querySelectorAll('[data-academy-page]').forEach(button => {
  button.onclick = () => navigateTo(button.dataset.academyPage);
});
function renderAcademyPage(id) {
  renderLobby();
  current = id;
  $('#lobby').hidden = true;
  $('#academy-page').hidden = false;
  $('.skip').href = '#academy-page-title';
  $('.skip').textContent = 'Skip to page content';
  $('#academy-page-title').textContent = academyPageTitles[id];
  for (const key of Object.keys(academyPageTitles)) $(`#academy-${key}`).hidden = key !== id;
  if (id === 'mission-notes') {
    $('#dsn-widget-slot').innerHTML = dsnWidgetMarkup();
    dsnWidget = mountDsnWidget($('#dsn-widget-slot'));
    $('#mission-history-slot').innerHTML = missionHistoryMarkup();
  }
  if (id === 'impact') impactView = mountImpact($('#academy-impact'));
  locationMap?.dispose();
  locationMap = null;
  $('#academy-page-title').focus({ preventScroll: true });
  window.scrollTo({ top: 0, behavior: 'instant' });
}

function renderTeachers() {
  if (moonPanel.dialog.open) moonPanel.dialog.close();
  $('#academy-page').hidden = true;
  $('.skip').href = '#teachers-page';
  $('.skip').textContent = 'Skip to teacher guide';
  disposeOpenData();
  if (storyDialog.open) storyDialog.close();
  machineAudio.stop();
  marsSoundPlayer?.dispose();
  marsSoundPlayer = null;
  hiddenFactCache = null;
  dsnWidget?.dispose();
  dsnWidget = null;
  curiosityGallery?.dispose();
  curiosityGallery = null;
  voyagerDistance?.dispose();
  voyagerDistance = null;
  greetingPlayer?.dispose();
  greetingPlayer = null;
  scene?.dispose();
  scene = null;
  current = "teachers";
  resetVoyagerAnnouncements();
  document.body.dataset.exhibit = "lobby";
  spaceAmbience.setTheme("lobby");
  missionFilm.setExhibit("lobby");
  updateBackgroundCredit("lobby");
  nav.hidden = true;
  $("#lobby").hidden = true;
  $(".exhibit").hidden = true;
  $("#greetings").hidden = true;
  $("#discovery").hidden = true;
  $("#teachers-page").hidden = false;
  updateViewModeButton();
  window.scrollTo({ top: 0, behavior: "instant" });
}
function meter(label, id) {
  return `<div class="meter-row"><span>${label}</span><output id="${id}-value">0%</output></div><div class="meter"><i id="${id}-bar"></i></div>`;
}
function setMeter(id, value) {
  const v = Math.round(value);
  if ($(`#${id}-value`)) {
    const previous = $(`#${id}-value`).textContent;
    $(`#${id}-value`).textContent = v + "%";
    $(`#${id}-bar`).style.width = v + "%";
    if (previous !== `${v}%` && ["energy", "health", "rotor"].includes(id)) {
      const label = { energy: "Rover energy", health: "Rover integrity", rotor: "Rotor power" }[id];
      announce(`${label}: ${v} percent.`);
    }
  }
}
function setStatus(text) {
  $("#stage-status").textContent = text;
  if (current !== "voyager" && /COMPLETE|EARNED|FAILED|STOPPED|ERROR|IMPACT|READY|UPLOADED|LANDING ZONE SELECTED|LOCKED/.test(text))
    announce(text, /COMPLETE|FAILED|STOPPED|ERROR|IMPACT|UPLOADED/.test(text));
}
function updateSoundButton() {
  $("#sound").textContent = sound ? "Sound on" : "Sound off";
  $("#sound").setAttribute("aria-pressed", String(sound));
  machineVoices.setEnabled(sound);
  const replay = $("[data-replay-transmission]");
  if (replay) {
    replay.disabled = !sound;
    replay.title = sound ? "Listen to this machine again" : "Turn on Sound to replay this transmission";
  }
}
function beep(freq = 440, duration = 0.15) {
  if (!sound) return;
  audioContext ??= new (window.AudioContext || window.webkitAudioContext)();
  audioContext.resume();
  const o = audioContext.createOscillator(),
    g = audioContext.createGain();
  o.type = "sine";
  o.frequency.value = freq;
  g.gain.setValueAtTime(0.06, audioContext.currentTime);
  g.gain.exponentialRampToValueAtTime(
    0.001,
    audioContext.currentTime + duration,
  );
  o.connect(g);
  g.connect(audioContext.destination);
  o.start();
  o.stop(audioContext.currentTime + duration);
}
function afterCompletion(delay, callback) {
  const owner = state, machine = current;
  const timer = window.setTimeout(() => {
    completionTimers.delete(timer);
    if (state === owner && current === machine) callback();
  }, delay);
  completionTimers.add(timer);
}

function playStampThud() {
  if (!sound) return;
  audioContext ??= new (window.AudioContext || window.webkitAudioContext)();
  void audioContext.resume();
  const now = audioContext.currentTime;
  const tone = audioContext.createOscillator();
  const gain = audioContext.createGain();
  tone.type = "sine";
  tone.frequency.setValueAtTime(110, now);
  tone.frequency.exponentialRampToValueAtTime(36, now + 0.16);
  gain.gain.setValueAtTime(0.075, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
  tone.connect(gain).connect(audioContext.destination);
  tone.start(now);
  tone.stop(now + 0.21);
}

function renderCompletion(id, fresh) {
  const story = storyLayer[id];
  const verb = { curiosity: "DRIVE", ingenuity: "FLY", webb: "UNFOLD", voyager: "LISTEN" }[id];
  const hidden = fresh ? " hidden" : "";
  $("#discovery .fact h3").textContent = fresh ? "✦ MISSION STAMP EARNED" : "ALREADY STAMPED";
  $("#discovery .reflection").innerHTML =
    `<div class="completion-panel" data-completion-phase="${fresh ? "present" : "complete"}"><p class="completion-status"><span class="completion-seal" aria-hidden="true">${verb}</span>${fresh ? "MISSION STAMP EARNED" : "Already stamped"}</p><section class="completion-story" aria-labelledby="completion-story-title"><p class="eyebrow">STILL OUT THERE</p><h3 id="completion-story-title" tabindex="-1">${exhibits[id].name}</h3><p>${story.beats[2][1]}</p></section><div class="final-transmission"${hidden}><span>FINAL TRANSMISSION</span><blockquote>${story.transmission}</blockquote><p class="mission-gift"${hidden}>${story.gift}</p>${machineVoices.has(id) ? '<button type="button" class="secondary transmission-replay" data-replay-transmission>Replay transmission</button>' : ""}</div><p class="completion-reflection"${hidden}>${exhibits[id].question}</p><button id="next"${hidden}>${certificationComplete(completed) ? "Open crew certification" : "Next unstamped module"}</button></div>`;
  $('#discovery .completion-panel').insertAdjacentHTML('beforeend', feedbackLinkMarkup());
  const replay = $("[data-replay-transmission]");
  if (replay) {
    replay.setAttribute("aria-label", `Replay ${exhibits[id].name} transmission`);
    replay.onclick = () => playMachineTransmission(id);
  }
  updateSoundButton();
  $("#next").onclick = () => {
    const ids = missionIds;
    if (certificationComplete(completed)) {
      openFinale();
      return;
    }
    const currentIndex = ids.indexOf(id);
    const ordered = [...ids.slice(currentIndex + 1), ...ids.slice(0, currentIndex + 1)];
    navigateTo(ordered.find((id) => !completed.has(id)) || "lobby");
  };
  $("#completion-story-title").focus({ preventScroll: true });
  $(".completion-panel").scrollIntoView({ behavior: reduce ? "instant" : "smooth", block: "start" });
  if (!fresh) {
    announce(`Already stamped: ${exhibits[id].name}.`, true);
    return;
  }
  const owner = state;
  afterCompletion(180, () => {
    $(".final-transmission").hidden = false;
    $(".completion-panel").dataset.completionPhase = "transmission";
    playMachineTransmission(id);
    const message = `Stamp earned: ${exhibits[id].name}. ${story.transmission}`;
    announce(message, true, () => {
      if (state !== owner || current !== id || !certificationComplete(completed) || state.finaleOpened) return;
      // Let the mandatory present-state beat and voice be read before graduation.
      const words = `${story.beats[2][1]} ${story.transmission} ${story.gift}`.split(/\s+/).length;
      afterCompletion(Math.max(12000, words * 330), () => {
        if (certificationComplete(completed) && state.stamped && !state.finaleOpened) openFinale();
      });
    });
  });
  afterCompletion(360, () => {
    $(".mission-gift").hidden = false;
    $(".completion-reflection").hidden = false;
    $("#next").hidden = false;
    $(".completion-panel").dataset.completionPhase = "complete";
  });
}

function success() {
  if (state.done) return;
  state.done = true;
  machineVoices.stop();
  machineAudio.stop();
  const id = current, owner = state;
  exhibitLayout?.revealCompletion();
  $("#discovery").classList.add("has-completion");
  $("#discovery").append($("#discovery .fact"));
  if (completed.has(id)) {
    state.stamped = true;
    renderCompletion(id, false);
    return;
  }
  $("#stage-status").textContent = "MISSION COMPLETE · PRESS YOUR CERTIFICATION STAMP";
  $("#discovery .fact h3").textContent = "FROM THE MISSION ARCHIVE";
  stampCeremony = mountStampCeremony($("#discovery .reflection"), {
    name: exhibits[id].name,
    verb: { curiosity: "DRIVE", ingenuity: "FLY", webb: "UNFOLD", voyager: "LISTEN" }[id],
    reducedMotion: reduce,
    onPress: playStampThud,
    onSettled: () => {
      if (state !== owner || current !== id || completed.has(id)) return;
      completed.add(id);
      state.stamped = true;
      saveProgress();
      updateMissionProgress();
      $("#stage-status").textContent = "DISCOVERY COMPLETE · CERTIFICATION STAMPED";
      renderCompletion(id, true);
    },
  });
}
function controls() {
  if (current === "curiosity")
    return `<p class="eyebrow">GALE CRATER SCIENCE PLAN</p><h2>Drill a Martian outcrop.</h2><p>Navigate to the cyan sedimentary outcrop (DRILL OUTCROP). Drill powdered rock for Curiosity’s SAM and CheMin laboratories, then park at the gold uplink site (UPLINK).</p>${challengeIncidentMarkup("curiosity")}${meter("Rover integrity", "health")}<button class="secondary free-explore" id="free-explore">Enter Free Explore</button><div class="drive-pad" id="drive-pad" hidden aria-label="Free Explore driving controls"><span></span><button data-drive="forward" aria-label="Drive forward">▲</button><span></span><button data-drive="left" aria-label="Turn left">↶</button><button data-drive="reverse" aria-label="Drive backward">▼</button><button data-drive="right" aria-label="Drive right">↷</button></div><p class="fine" id="explore-help" hidden>Drive with WASD or arrow keys. Avoid rocks: every impact damages the rover.<span class="readout" id="explore-readout">0.0 m from center</span></p><section class="field-mission" id="field-mission" hidden><p class="eyebrow">FREE EXPLORE MISSIONS</p><ol><li data-field-step="0">Survey cyan outcrop (DRILL OUTCROP) with Mastcam</li><li data-field-step="1">Drill and analyze rock powder</li><li data-field-step="2">Reach gold beacon (UPLINK) and uplink data</li></ol><p id="mission-guidance">Drive to the cyan outcrop (DRILL OUTCROP).</p><button class="primary" id="mission-action" disabled>Too far from target</button></section><div id="program-workspace"><div class="rover-grid" id="rover-grid" role="img" aria-label="Five by five rover mission map"></div><div class="map-legend" aria-hidden="true"><span><i class="legend-sample"></i>Outcrop</span><span><i class="legend-rock"></i>Hazard</span><span><i class="legend-goal"></i>Uplink</span></div><div class="program-heading"><strong>COMMAND BLOCKS</strong><output id="block-count">0 / ${roverMission.maxBlocks}</output></div><div class="block-palette" aria-label="Command blocks">${Object.entries(roverCommands).map(([command, info]) => `<button class="code-block ${info.className}" data-command="${command}">${info.label}</button>`).join("")}</div><div class="program-heading"><strong>YOUR PROGRAM</strong><span>Select a block to add it</span></div><ol class="program-list" id="program-list" aria-label="Rover program"></ol><div class="program-actions"><button id="step-program">Step</button><button class="primary" id="run-program">Run science plan</button></div><div class="program-tools"><button id="undo-program">Undo</button><button id="clear-program">Clear</button></div>${meter("Energy remaining", "energy")}<p class="program-status" id="program-status" role="status">Build a science plan of up to ${roverMission.maxBlocks} blocks.</p><p class="fine">Curiosity drills powdered rock and delivers it to SAM and CheMin inside the rover. Loop blocks repeat the command directly after them.</p></div>`;
  if (current === "ingenuity") return flightGameMarkup();
  if (current === "webb")
    return `<p class="eyebrow">YOUR MISSION</p><h2>Bring the stars together.</h2><p>Drag both folded mirror wings away from the center, then align the scattered star images.</p>${challengeIncidentMarkup("webb")}<div class="webb-step"><strong>01 · DRAG THE MIRROR OPEN</strong><p class="fine">Pull the gold LEFT and RIGHT mirror wings toward their matching outer brackets.</p><div class="webb-deploy-field" id="webb-deploy-field" aria-label="Mirror wing deployment field"><span class="webb-deploy-rail" aria-hidden="true"></span><span class="webb-deploy-core" aria-hidden="true"></span><button class="webb-wing-handle is-left" data-wing="left" aria-label="Left mirror wing, folded. Drag left or use arrow keys"><span>⬡</span><small>LEFT</small></button><button class="webb-wing-handle is-right" data-wing="right" aria-label="Right mirror wing, folded. Drag right or use arrow keys"><span>⬡</span><small>RIGHT</small></button></div></div><div class="webb-step" id="webb-focus-step" hidden><strong>02 · ALIGN THE IMAGES</strong><p class="fine">Drag each light point into the gold target circle (CROSSHAIR) and it will snap to focus. Arrow keys now move in 5% steps.</p><div class="webb-focus-field" id="webb-focus-field" aria-label="Star alignment field"><span class="webb-focus-grid" aria-hidden="true"></span><span class="webb-focus-target" aria-hidden="true"></span><button class="webb-star" data-star="0" aria-label="Star image A. Drag to the center or use arrow keys">A</button><button class="webb-star" data-star="1" aria-label="Star image B. Drag to the center or use arrow keys">B</button><button class="webb-star" data-star="2" aria-label="Star image C. Drag to the center or use arrow keys">C</button></div><output class="webb-focus-count" id="webb-focus-count">0 / 3 images focused</output></div><p class="fine" id="webb-state" role="status">Drag the left and right mirror wings outward.</p><p class="fine">This challenge simplifies Webb’s mirror alignment. The real observatory also deployed its five-layer sunshield and other structures.</p>`;
  return `<p class="eyebrow">YOUR MISSION</p><h2>Listen, then answer.</h2><p>Hear a message from Earth if you want. Send your own written or recorded greeting to earn the Voyager stamp. No microphone is required.</p>${challengeIncidentMarkup("voyager")}<ol class="voyager-objectives" aria-label="Voyager mission objectives"><li data-voyager-step="listen">Hear Earth <span class="optional-label">optional</span></li><li data-voyager-step="greeting">Send your own message <span class="required-label">required for the stamp</span></li></ol><div class="record-views" role="group" aria-label="Choose an artifact to view"><button data-record-face="front" aria-pressed="true">Record front</button><button data-record-face="cover" aria-pressed="false">Protective cover</button></div><p class="fine" id="record-caption">${recordArtifacts.front.caption}</p><a class="record-credit" id="record-source" href="${recordArtifacts.front.source}" target="_blank" rel="noopener">Photo: ${recordCredit}</a><label for="record">Turn the Golden Record <span class="optional-label">optional</span></label><input id="record" type="range" min="0" max="360" value="0"><div class="voyager-listen-actions" role="group" aria-label="Voyager message actions"><button id="open-greetings">Hear Earth</button><button class="primary" id="open-your-record">Send yours</button></div><p class="fine">NASA’s 1977 greetings and today’s visitor voices stay together below. Your own greeting is the mission action.</p><section class="voyager-live" aria-labelledby="voyager-live-heading"><p class="eyebrow" id="voyager-live-heading">DISTANCE FROM EARTH · LIVE ESTIMATE</p><output class="readout" id="voyager-live-distance">Awaiting mission data…</output><span id="voyager-live-light-time">${lightDayLink()}</span><p class="fine" id="voyager-live-status" role="status">Checking mission data…</p><a class="fine" href="https://ssd-api.jpl.nasa.gov/doc/horizons.html" target="_blank" rel="noopener">How this estimate works ↗</a></section><label for="distance">Imagine the journey outward <span class="optional-label">optional</span></label><input id="distance" type="range" min="0" max="100" value="0"><p class="fine">Projected milestone · 18 NOV 2026<span class="readout">${facts.distance.value} billion km</span>One-way signal time: ${facts.distance.signal_hours} hours.<br>NASA projection, not live telemetry.</p>`;
}
function bindHold(el, on, off) {
  el.onpointerdown = (e) => {
    el.setPointerCapture(e.pointerId);
    on();
  };
  el.onpointerup = off;
  el.onpointercancel = off;
  el.onlostpointercapture = off;
  el.onkeydown = (e) => {
    if (e.code === "Space" || e.code === "Enter") {
      e.preventDefault();
      on();
    }
  };
  el.onkeyup = (e) => {
    if (e.code === "Space" || e.code === "Enter") {
      e.preventDefault();
      off();
    }
  };
  el.onblur = off;
}
function learningMarkup(id) {
  if (id === "curiosity")
    return `<section class="learning-panel" id="curiosity-conclusion" hidden aria-labelledby="curiosity-conclusion-title"><p class="eyebrow">SCIENCE DECISION · YOUR REPORT TO EARTH</p><h3 id="curiosity-conclusion-title">What can this rock tell us?</h3><p>Your simulated sample shows layers and minerals that can form in water. Choose the headline supported by that evidence.</p><div class="learning-choices"><button data-science-claim="life">We found life on Mars</button><button data-science-claim="habitable">Ancient Mars may have supported microbial life</button></div><p class="learning-feedback" id="curiosity-claim-feedback" role="status">Look at what the instruments measured, then decide.</p><a class="fine" href="https://science.nasa.gov/resource/the-science-of-curiosity-seeking-signs-of-past-mars-habitability/" target="_blank" rel="noopener">NASA: Curiosity studies past habitability ↗</a></section>`;
  if (id === "ingenuity") return "";
  if (id === "webb")
    return `<section class="webb-step learning-panel" id="webb-infrared-step" hidden aria-labelledby="webb-infrared-title"><strong>03 · REVEAL WHAT VISIBLE LIGHT MISSES</strong><h3 id="webb-infrared-title">Look through the dust</h3><p>Now that the mirror is focused, shift from visible light toward infrared. See what appears behind this illustrated dust cloud.</p><div class="webb-vision" id="webb-vision" style="--infrared:0"><span class="webb-vision-dust" aria-hidden="true"></span><span class="webb-vision-hidden" aria-hidden="true">✦</span><span class="webb-vision-label">STAR-FORMING REGION</span></div><label for="webb-wavelength" class="fine">Visible light ← wavelength → Infrared</label><input id="webb-wavelength" type="range" min="0" max="100" value="0" aria-label="Shift from visible light toward infrared"><p class="learning-feedback" id="webb-infrared-feedback" role="status">Move toward infrared to reveal the hidden glow.</p><p class="fine">Concept illustration. Infrared can pass through some dust clouds; actual Webb images use measured wavelengths and processed color.</p><a class="fine" href="https://science.nasa.gov/mission/webb/fact-sheet/" target="_blank" rel="noopener">NASA: why Webb observes infrared ↗</a></section>`;
  return `<section class="learning-panel signal-lab" aria-labelledby="signal-lab-title"><p class="eyebrow">SIGNAL LAB · OPTIONAL</p><h3 id="signal-lab-title">How long does “hello” take?</h3><p>Choose a destination, then send a radio ping. Radio travels at light speed, so even a quick reply takes time.</p><div class="learning-choices"><button data-signal-target="moon">Moon</button><button data-signal-target="au">1 AU</button><button data-signal-target="voyager">Voyager 1</button></div><button class="secondary" id="send-signal" disabled>Send a ping</button><p class="learning-feedback" id="signal-result" role="status">Choose a destination to compare.</p><div class="signal-beam" aria-hidden="true"><i id="signal-beam-fill"></i></div><p class="fine">1 AU is the approximate Sun–Earth distance. The Moon comparison uses an average distance. Voyager uses the live JPL estimate when available.</p></section>`;
}
function bindControls() {
  if (current === "curiosity") {
    roverTextMap = mountRoverTextMap($('#program-workspace'), roverMission, () => state, message => announce(message, true));
    $$("[data-science-claim]").forEach((button) => {
      button.onclick = () => chooseCuriosityClaim(button.dataset.scienceClaim);
    });
    $$("[data-command]").forEach((button) => {
      button.onclick = () => addRoverCommand(button.dataset.command);
    });
    $("#run-program").onclick = runRoverProgram;
    $("#step-program").onclick = stepRoverProgram;
    $("#undo-program").onclick = () => {
      if (state.programRunning || !state.program.length) return;
      state.program.pop();
      state.programRevision += 1;
      resetRoverSimulation();
      updateRoverProgramUI();
      if (!state.program.length) $('[data-command="move"]')?.focus();
    };
    $("#clear-program").onclick = () => {
      if (state.programRunning) return;
      state.program = [];
      state.programRevision += 1;
      resetRoverSimulation();
      updateRoverProgramUI();
      $('[data-command="move"]')?.focus();
    };
    $("#free-explore").onclick = toggleFreeExplore;
    const recoveryMarkup = '<aside class="rover-recovery" hidden><button type="button" data-recover-rover>Repair &amp; restart rover</button><p>Your blocks stay. Change the route and try again.</p></aside>';
    $('#program-workspace .program-actions').insertAdjacentHTML('beforebegin', recoveryMarkup);
    $('#drive-pad').insertAdjacentHTML('beforebegin', recoveryMarkup);
    $$('[data-recover-rover]').forEach(button => { button.onclick = recoverCuriosity; });
    $$("[data-drive]").forEach((button) => {
      const action = button.dataset.drive;
      button.onpointerdown = (event) => {
        button.setPointerCapture(event.pointerId);
        driveKeys.add(action);
      };
      button.onpointerup = () => {
        driveKeys.delete(action);
        nudgeFreeExplore(action);
      };
      button.onpointercancel = () => driveKeys.delete(action);
      button.onlostpointercapture = () => driveKeys.delete(action);
      button.onkeydown = (event) => {
        if (event.code === "Space" || event.code === "Enter") {
          event.preventDefault();
          driveKeys.add(action);
        }
      };
      button.onkeyup = (event) => {
        if (event.code === "Space" || event.code === "Enter") {
          event.preventDefault();
          driveKeys.delete(action);
          nudgeFreeExplore(action);
        }
      };
      button.onblur = () => driveKeys.delete(action);
    });
    $("#mission-action").onclick = performFieldMissionAction;
    drawRoverGrid();
    updateRoverProgramUI();
    setMeter("energy", 100);
    setMeter("health", state.health);
    const controlsPanel = $("#controls");
    const intro = controlsPanel.querySelector("h2")?.nextElementSibling;
    const tabs = document.createElement("div");
    tabs.className = "curiosity-view-tabs";
    tabs.setAttribute("role", "tablist");
    tabs.setAttribute("aria-label", "Curiosity exhibit view");
    tabs.innerHTML =
      '<button role="tab" aria-selected="true" data-curiosity-view="mission">Mission simulator</button><button role="tab" aria-selected="false" data-curiosity-view="photos">What Curiosity actually saw</button>';
    const missionPanel = document.createElement("section");
    missionPanel.id = "curiosity-mission-panel";
    missionPanel.setAttribute("role", "tabpanel");
    missionPanel.setAttribute('aria-labelledby', 'curiosity-mission-tab');
    const photoPanel = document.createElement("section");
    photoPanel.id = "curiosity-photo-panel";
    photoPanel.className = "curiosity-photo-panel";
    photoPanel.setAttribute("role", "tabpanel");
    photoPanel.setAttribute('aria-labelledby', 'curiosity-photos-tab');
    photoPanel.hidden = true;
    photoPanel.innerHTML =
      '<p class="eyebrow">REAL IMAGES FROM MARS</p><h3>Through Curiosity’s cameras</h3><p class="fine" id="curiosity-photo-status">Contacting NASA’s live image archive…</p><div class="curiosity-photo-grid" id="curiosity-photo-grid"></div><a class="curiosity-raw-source" id="curiosity-raw-source" target="_blank" rel="noopener">Explore Curiosity’s full NASA Raw Images archive ↗</a>';
    const firstMissionNode = controlsPanel.querySelector(".meter-row");
    let node = firstMissionNode;
    while (node) {
      const next = node.nextSibling;
      missionPanel.append(node);
      node = next;
    }
    intro.after(tabs, missionPanel, photoPanel);
    curiosityGallery = mountCuriosityGallery(photoPanel);
    const selectCuriosityView = button => {
      const showPhotos = button.dataset.curiosityView === "photos";
      missionPanel.hidden = showPhotos;
      photoPanel.hidden = !showPhotos;
      tabs.querySelectorAll("[data-curiosity-view]").forEach(item => {
        item.setAttribute('aria-selected', String(item === button));
        item.tabIndex = item === button ? 0 : -1;
      });
    };
    const viewTabs = [...tabs.querySelectorAll('[data-curiosity-view]')];
    viewTabs.forEach((tab, index) => {
      tab.id = index ? 'curiosity-photos-tab' : 'curiosity-mission-tab';
      tab.setAttribute('aria-controls', index ? photoPanel.id : missionPanel.id);
      tab.tabIndex = index ? -1 : 0;
      tab.onclick = () => selectCuriosityView(tab);
      tab.onkeydown = event => {
        if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
        event.preventDefault();
        const next = event.key === 'Home' ? viewTabs[0] : event.key === 'End' ? viewTabs[1] : viewTabs[1 - index];
        selectCuriosityView(next);
        next.focus();
      };
    });
  }
  if (current === "ingenuity") {
    flightGame = mountFlightGame($("#controls"), {
      host: $("#stage"), state, fallback: force2d,
      onSuccess: success,
      onAnnounce: text => announce(text, true),
      onStart() { machineVoices.beginAttempt("ingenuity"); },
      onStop() { machineAudio.stop(); },
    });
  }
  if (current === "webb") {
    rangeButtons.push(mountRangeButtons($('#webb-wavelength'), { label: 'wavelength', step: 25 }));
    $('#webb-deploy-field').insertAdjacentHTML('afterend', '<div class="wing-button-controls" role="group" aria-label="Open mirror wings without dragging"><button type="button" data-open-wing="left">Open left wing</button><button type="button" data-open-wing="right">Open right wing</button></div>');
    $$('[data-open-wing]').forEach(button => { button.onclick = () => setWebbWingProgress(button.dataset.openWing, 1); });
    $('#webb-focus-field').insertAdjacentHTML('afterend', '<fieldset class="star-button-controls"><legend>Fine adjustment without dragging</legend><div class="star-choices" role="group" aria-label="Choose a star image"><button type="button" data-star-choice="0" aria-pressed="true">Image A</button><button type="button" data-star-choice="1" aria-pressed="false">Image B</button><button type="button" data-star-choice="2" aria-pressed="false">Image C</button></div><p id="star-position" role="status"></p><div class="star-direction-pad" role="group" aria-label="Move the selected image"><button type="button" data-star-direction="up">↑ <span>Up</span></button><button type="button" data-star-direction="left">← <span>Left</span></button><button type="button" data-star-direction="right">→ <span>Right</span></button><button type="button" data-star-direction="down">↓ <span>Down</span></button></div><p class="fine">Each press moves the selected image 5%. The target is 50% across and 50% down.</p></fieldset>');
    $$('[data-star-choice]').forEach(button => { button.onclick = () => { state.selectedStar = +button.dataset.starChoice; updateWebbPointerControls(); }; });
    $$('[data-star-direction]').forEach(button => { button.onclick = () => {
      const delta = { up: [0, -.05], down: [0, .05], left: [-.05, 0], right: [.05, 0] }[button.dataset.starDirection];
      const spot = state.webbSpots[state.selectedStar];
      setWebbSpot(state.selectedStar, spot.x + delta[0], spot.y + delta[1]);
    }; });
    collapseChallengeNotes($('.star-button-controls'), 'Fine adjustment without dragging');
    $("#webb-wavelength").oninput = (event) => updateWebbInfrared(Number(event.target.value));
    const deployField = $("#webb-deploy-field");
    $$("[data-webb-step]").forEach((button) => {
      button.onclick = () => jumpWebbStep(button.dataset.webbStep);
    });
    let activeWing = null;
    const dragWing = (event) => {
      if (!activeWing || state.webbWings[activeWing]) return;
      const bounds = deployField.getBoundingClientRect();
      const ratio = Math.max(0, Math.min(1, (event.clientX - bounds.left) / bounds.width));
      const progress = activeWing === "left" ? (0.4 - ratio) / 0.26 : (ratio - 0.6) / 0.26;
      setWebbWingProgress(activeWing, progress);
    };
    deployField.onpointerdown = (event) => {
      const handle = event.target.closest("[data-wing]");
      if (!handle) return;
      activeWing = handle.dataset.wing;
      event.preventDefault();
      handle.focus({ preventScroll: true });
      deployField.setPointerCapture(event.pointerId);
      dragWing(event);
    };
    deployField.onpointermove = (event) => {
      if (deployField.hasPointerCapture(event.pointerId)) dragWing(event);
    };
    const finishWingDrag = (event) => {
      if (!activeWing) return;
      const handle = $(`[data-wing="${activeWing}"]`);
      if (state.webbWingProgress[activeWing] >= 0.72)
        setWebbWingProgress(activeWing, 1);
      if (deployField.hasPointerCapture(event.pointerId))
        deployField.releasePointerCapture(event.pointerId);
      activeWing = null;
      handle.focus({ preventScroll: true });
    };
    deployField.onpointerup = finishWingDrag;
    deployField.onpointercancel = finishWingDrag;
    $$("[data-wing]").forEach((button) => {
      button.onkeydown = (event) => {
        const alignmentWasReady = state.deploy === 1;
        const wing = button.dataset.wing;
        const outward = wing === "left" ? "ArrowLeft" : "ArrowRight";
        const inward = wing === "left" ? "ArrowRight" : "ArrowLeft";
        if (event.key === outward || event.key === inward) {
          event.preventDefault();
          setWebbWingProgress(
            wing,
            state.webbWingProgress[wing] + (event.key === outward ? 0.1 : -0.1),
          );
        }
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          setWebbWingProgress(wing, 1);
        }
        if (!alignmentWasReady && state.deploy === 1) jumpWebbStep("focus");
      };
    });
    const focusField = $("#webb-focus-field");
    let activeStar = null;
    focusField.onpointerdown = (event) => {
      const button = event.target.closest("[data-star]");
      if (!button) return;
      activeStar = Number(button.dataset.star);
      state.selectedStar = activeStar;
      if (state.webbSpots[activeStar].locked) return;
      event.preventDefault();
      focusField.setPointerCapture(event.pointerId);
    };
    focusField.onpointermove = (event) => {
      if (activeStar === null || !focusField.hasPointerCapture(event.pointerId)) return;
      const bounds = focusField.getBoundingClientRect();
      setWebbSpot(activeStar, (event.clientX - bounds.left) / bounds.width, (event.clientY - bounds.top) / bounds.height);
    };
    const finishStarDrag = (event) => {
      if (activeStar !== null) {
        const bounds = focusField.getBoundingClientRect();
        setWebbSpot(
          activeStar,
          (event.clientX - bounds.left) / bounds.width,
          (event.clientY - bounds.top) / bounds.height,
        );
        if (event.type === "pointerup" && !state.webbSpots[activeStar].locked) {
          $("#webb-state").textContent = frictionFeedback.failure("webb", getSourceText($("#webb-state")));
          void machineVoices.playMid("webb");
        }
      }
      if (focusField.hasPointerCapture(event.pointerId))
        focusField.releasePointerCapture(event.pointerId);
      activeStar = null;
    };
    focusField.onpointerup = finishStarDrag;
    focusField.onpointercancel = finishStarDrag;
    $$("[data-star]").forEach((button) => {
      const index = Number(button.dataset.star);
      button.onkeydown = (event) => {
        if (state.webbSpots[index].locked) return;
        const directions = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] };
        const direction = directions[event.key];
        if (!direction) return;
        event.preventDefault();
        state.selectedStar = index;
        const step = event.shiftKey ? 0.1 : 0.05;
        const spot = state.webbSpots[index];
        setWebbSpot(index, spot.x + direction[0] * step, spot.y + direction[1] * step);
        announce(`Image ${'ABC'[index]}. ${describeStar(spot)}`);
      };
    });
    updateWebb();
  }
  if (current === "voyager") {
    $$("[data-signal-target]").forEach((button) => {
      button.onclick = () => {
        state.signalTarget = button.dataset.signalTarget;
        $$("[data-signal-target]").forEach((item) =>
          item.classList.toggle("is-selected", item === button),
        );
        $("#send-signal").disabled = false;
        $("#signal-result").textContent = "Destination chosen. Send a ping to see the delay.";
      };
    });
    $("#send-signal").onclick = showSignalJourney;
    $$("[data-record-face]").forEach(
      (button) =>
        (button.onclick = () => {
          state.recordFace = button.dataset.recordFace;
          const artifact = recordArtifacts[state.recordFace];
          $$("[data-record-face]").forEach((item) =>
            item.setAttribute("aria-pressed", String(item === button)),
          );
          $("#record-caption").textContent = artifact.caption;
          $("#record-source").href = artifact.source;
          if (scene) scene.updateViewLabel();
          else $("#stage").setAttribute("aria-label", artifact.alt);
          if ($("#fallback-record-image")) {
            $("#fallback-record-image").src = artifact.image;
            $("#fallback-record-image").alt = artifact.alt;
          }
        }),
    );
    $("#record").oninput = (e) => {
      state.rotation = +e.target.value;
      machineAudio.pulse("record", 0.45);
      checkVoyager();
    };
    $("#distance").oninput = (e) => {
      state.distance = +e.target.value / 100;
      checkVoyager();
    };
    $("#open-greetings").onclick = () => {
      $("#original-greetings-tab")?.click();
      greetingPlayer?.openCatalog();
    };
    $("#open-your-record").onclick = () => {
      const heading = $("#personal-record-heading");
      heading?.scrollIntoView({ behavior: reduce ? "instant" : "smooth", block: "start" });
      heading?.focus({ preventScroll: true });
    };
  }
  $("#reset").onclick = () => render(current);
}
const $$ = (s) => Array.from(document.querySelectorAll(s));

function roverCellKey(x, y) {
  return `${x},${y}`;
}

function resetRoverSimulation() {
  machineVoices.beginAttempt("curiosity");
  state.roverX = roverMission.start.x;
  state.roverY = roverMission.start.y;
  state.roverDir = roverMission.start.dir;
  state.energy = 100;
  state.sampleAnalyzed = false;
  state.execution = [];
  state.programCounter = 0;
  state.loadedRevision = -1;
  state.programRunning = false;
  state.failed = false;
  state.health = 100;
  state.wrecked = false;
  state.motionType = null;
  state.motionUntil = 0;
  machineAudio.stop();
  setMeter("energy", 100);
  setMeter("health", state.health);
  if ($("#program-status"))
    $("#program-status").textContent = "Ready at the start tile.";
  drawRoverGrid();
  updateRoverRecoveryUI();
}

function updateRoverRecoveryUI() {
  const needsRepair = state.failed || state.health <= 0;
  $$('.rover-recovery').forEach(panel => {
    const programPanel = Boolean(panel.closest('#program-workspace'));
    panel.hidden = !needsRepair || programPanel === state.freeExplore;
  });
  $('#reset')?.classList.toggle('needs-repair', needsRepair);
}

function recoverCuriosity() {
  driveKeys.clear();
  resetRoverSimulation();
  state.exploreMoving = false;
  state.collisionCooldown = 0;
  state.rockContact = null;
  state.lastImpactRock = null;
  state.fieldMissionStep = 0;
  state.fieldMissionComplete = false;
  state.scienceReady = false;
  $('#curiosity-conclusion').hidden = true;
  if (state.freeExplore) {
    state.exploreX = -3 + roverMission.start.x * 1.5;
    state.exploreZ = -2.3 + roverMission.start.y * 1.15;
    state.exploreHeading = Math.atan2(state.exploreZ, -state.exploreX);
    updateExploreReadout();
    updateFieldMissionUI();
  }
  updateRoverProgramUI();
  const message = state.freeExplore
    ? 'Rover repaired. Continue exploring from the start.'
    : 'Rover repaired. Your blocks are ready to edit.';
  $('#program-status').textContent = message;
  setStatus('ROVER READY · TRY A SAFER ROUTE');
  announce(message, true);
  (state.freeExplore ? $('[data-drive="forward"]') : $('[data-command="move"]')).focus({ preventScroll: true });
}

function drawRoverGrid() {
  const grid = $("#rover-grid");
  if (!grid) return;
  grid.replaceChildren();
  for (let y = 0; y < roverMission.size; y += 1) {
    for (let x = 0; x < roverMission.size; x += 1) {
      const cell = document.createElement("span");
      const key = roverCellKey(x, y);
      cell.className = "rover-cell";
      const labels = [];
      if (roverMission.obstacles.has(key)) {
        cell.classList.add("is-rock");
        labels.push("rock");
      }
      if (x === roverMission.sample.x && y === roverMission.sample.y) {
        cell.classList.add("is-sample");
        labels.push(state.sampleAnalyzed ? "outcrop analyzed" : "drill outcrop");
      }
      if (x === roverMission.goal.x && y === roverMission.goal.y) {
        cell.classList.add("is-goal");
        labels.push("goal");
      }
      if (x === roverMission.start.x && y === roverMission.start.y) {
        cell.classList.add("is-start");
        labels.push("start");
      }
      if (x === state.roverX && y === state.roverY) {
        const rover = document.createElement("i");
        rover.className = "rover-marker";
        rover.style.setProperty("--direction", `${state.roverDir * 90}deg`);
        rover.textContent = "▲";
        rover.setAttribute("aria-hidden", "true");
        cell.append(rover);
        labels.push(`rover facing ${roverDirections[state.roverDir].name}`);
      }
      cell.setAttribute(
        "title",
        `Column ${x + 1}, row ${y + 1}${labels.length ? `: ${labels.join(", ")}` : ""}`,
      );
      grid.append(cell);
    }
  }
  grid.setAttribute(
    "aria-label",
    `Five by five rover map. Rover at column ${state.roverX + 1}, row ${state.roverY + 1}, facing ${roverDirections[state.roverDir].name}. ${state.sampleAnalyzed ? "Drill sample analyzed." : "Outcrop not analyzed."}`,
  );
  roverTextMap?.update();
}

function updateRoverProgramUI() {
  updateRoverRecoveryUI();
  const list = $("#program-list");
  if (!list) return;
  list.replaceChildren();
  if (!state.program.length) {
    const empty = document.createElement("li");
    empty.className = "program-empty";
    empty.textContent = "Your blocks will appear here.";
    list.append(empty);
  }
  state.program.forEach((command, index) => {
    const info = roverCommands[command];
    const item = document.createElement("li");
    item.className = `program-block ${info.className}`;
    item.dataset.programIndex = index;
    const number = document.createElement("span");
    number.className = "program-number";
    number.textContent = String(index + 1).padStart(2, "0");
    const label = document.createElement("strong");
    label.textContent = info.label;
    const tools = document.createElement("span");
    tools.className = "program-block-tools";
    [
      ["↑", -1, "Move block up"],
      ["↓", 1, "Move block down"],
      ["×", 0, "Remove block"],
    ].forEach(([glyph, offset, aria]) => {
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = glyph;
      button.setAttribute("aria-label", `${aria}: ${info.label}`);
      button.disabled =
        state.programRunning ||
        state.done ||
        state.freeExplore ||
        (offset === -1 && index === 0) ||
        (offset === 1 && index === state.program.length - 1);
      button.onclick = () => editRoverProgram(index, offset);
      tools.append(button);
    });
    item.append(number, label, tools);
    list.append(item);
  });
  $("#block-count").textContent =
    `${state.program.length} / ${roverMission.maxBlocks}`;
  announce(`${state.program.length} of ${roverMission.maxBlocks} command blocks.`);
  const locked =
    state.programRunning ||
    state.done ||
    state.freeExplore ||
    state.health <= 0;
  $$("[data-command]").forEach(
    (button) =>
      (button.disabled =
        locked || state.program.length >= roverMission.maxBlocks),
  );
  $("#run-program").disabled = locked || !state.program.length;
  $("#step-program").disabled = locked || !state.program.length;
  $("#undo-program").disabled =
    locked || !state.program.length;
  $("#clear-program").disabled =
    locked || !state.program.length;
}

function editRoverProgram(index, offset) {
  if (state.programRunning || state.done) return;
  if (offset === 0) state.program.splice(index, 1);
  else {
    const target = index + offset;
    if (target < 0 || target >= state.program.length) return;
    [state.program[index], state.program[target]] = [
      state.program[target],
      state.program[index],
    ];
  }
  state.programRevision += 1;
  resetRoverSimulation();
  updateRoverProgramUI();
  const target = Math.min(state.program.length - 1, Math.max(0, index + offset));
  const item = $(`#program-list [data-program-index="${target}"]`);
  const preferred = item?.querySelectorAll('button')[offset === -1 ? 0 : offset === 1 ? 1 : 2];
  (preferred && !preferred.disabled ? preferred : item?.querySelector('button:not(:disabled)') || $('#step-program:not(:disabled)') || $('[data-command="move"]')).focus({ preventScroll: true });
}

function addRoverCommand(command) {
  if (
    state.programRunning ||
    state.done ||
    !roverCommands[command] ||
    state.program.length >= roverMission.maxBlocks
  )
    return;
  state.program.push(command);
  state.programRevision += 1;
  updateRoverProgramUI();
  $("#program-status").textContent = `${roverCommands[command].label} added.`;
}

function compileRoverProgram() {
  const commands = [];
  for (let index = 0; index < state.program.length; index += 1) {
    const command = state.program[index];
    if (!command.startsWith("repeat")) {
      commands.push(command);
      continue;
    }
    const next = state.program[index + 1];
    if (!next || next.startsWith("repeat")) {
      return {
        error: `Block ${index + 1} needs a movement or science block directly after it.`,
      };
    }
    const count = command === "repeat3" ? 3 : 2;
    for (let repeat = 0; repeat < count; repeat += 1) commands.push(next);
    index += 1;
  }
  return { commands };
}

function prepareRoverExecution() {
  const compiled = compileRoverProgram();
  if (compiled.error) {
    $("#program-status").textContent = frictionFeedback.failure("curiosity", compiled.error);
    setStatus("PROGRAM ERROR · CHECK YOUR LOOP");
    beep(175, 0.25);
    return false;
  }
  const canContinue = !state.failed && state.loadedRevision >= 0 && state.execution.slice(0, state.programCounter).every((command, index) => compiled.commands[index] === command);
  if (!canContinue) resetRoverSimulation();
  state.execution = compiled.commands;
  state.loadedRevision = state.programRevision;
  $("#program-status").textContent =
    `${compiled.commands.length} rover actions compiled.`;
  return true;
}

function finishRoverProgram() {
  state.programRunning = false;
  machineAudio.stop();
  const atGoal =
    state.roverX === roverMission.goal.x && state.roverY === roverMission.goal.y;
  if (atGoal && state.sampleAnalyzed) {
    $("#program-status").textContent =
      `Rock powder analyzed by SAM and CheMin · choose an evidence-based report with ${state.energy}% energy left.`;
    revealCuriosityConclusion();
    updateRoverProgramUI();
    return;
  }
  const missing = [];
  if (!state.sampleAnalyzed) missing.push("drill and analyze the outcrop");
  if (!atGoal) missing.push("reach the gold uplink site (UPLINK)");
  $("#program-status").textContent =
    frictionFeedback.failure("curiosity", `Program ended · still need to ${missing.join(" and ")}. Edit and run again.`);
  setStatus("PROGRAM ENDED · MISSION INCOMPLETE");
  updateRoverProgramUI();
}

function executeRoverCommand(now = performance.now()) {
  if (state.programCounter >= state.execution.length) {
    finishRoverProgram();
    return false;
  }
  const command = state.execution[state.programCounter];
  state.programCounter += 1;
  if (command === "left" || command === "right") {
    state.roverDir =
      (state.roverDir + (command === "right" ? 1 : 3)) % 4;
    state.energy = Math.max(0, state.energy - 2);
    state.motionType = "turn";
    state.motionUntil = now + 430;
    machineAudio.pulse("servo", 0.55);
    $("#program-status").textContent =
      `Action ${state.programCounter}: turned ${command}.`;
  } else if (command === "analyze") {
    state.energy = Math.max(0, state.energy - 5);
    state.motionType = "analyze";
    state.motionUntil = now + 520;
    machineAudio.pulse("servo", 0.9);
    const onSample =
      state.roverX === roverMission.sample.x &&
      state.roverY === roverMission.sample.y;
    if (onSample) {
      state.sampleAnalyzed = true;
      $("#program-status").textContent =
        "Drill complete · powdered rock delivered to SAM and CheMin.";
      setStatus("ROCK SAMPLE ACQUIRED · LAB ANALYSIS COMPLETE");
      beep(610, 0.18);
    } else {
      $("#program-status").textContent =
        "No drill target here · move onto the cyan outcrop (DRILL OUTCROP).";
      setStatus("NO OUTCROP · CHECK THE SCIENCE MAP");
    }
  } else if (command === "move") {
    const direction = roverDirections[state.roverDir];
    const nextX = state.roverX + direction.dx;
    const nextY = state.roverY + direction.dy;
    const outside =
      nextX < 0 ||
      nextY < 0 ||
      nextX >= roverMission.size ||
      nextY >= roverMission.size;
    const blocked = roverMission.obstacles.has(roverCellKey(nextX, nextY));
    if (outside || blocked) {
      state.energy = Math.max(0, state.energy - 15);
      if (blocked) {
        state.roverX = nextX;
        state.roverY = nextY;
        state.health = 0;
        state.wrecked = true;
      }
      state.failed = true;
      state.programRunning = false;
      state.motionType = "collision";
      state.motionUntil = now + 500;
      machineAudio.stop();
      machineAudio.pulse("crunch", 1);
      $("#program-status").textContent = outside
        ? frictionFeedback.failure('curiosity', 'Boundary collision · turn before leaving the map.')
        : 'Rover damaged. Use Repair & restart rover, then change the route.';
      setStatus("ROVER STOPPED · DEBUG YOUR PROGRAM");
      void machineVoices.playMid("curiosity");
      beep(145, 0.4);
      setMeter("energy", state.energy);
      setMeter("health", state.health);
      drawRoverGrid();
      updateRoverProgramUI();
      return false;
    }
    state.roverX = nextX;
    state.roverY = nextY;
    state.energy = Math.max(0, state.energy - 8);
    state.motionType = "move";
    state.motionUntil = now + 470;
    $("#program-status").textContent =
      `Action ${state.programCounter}: moved to ${nextX + 1}, ${nextY + 1}.`;
    setStatus("PROGRAM RUNNING · ROVER IN MOTION");
  }
  setMeter("energy", state.energy);
  drawRoverGrid();
  if (state.energy <= 0) {
    state.failed = true;
    state.programRunning = false;
    $("#program-status").textContent = frictionFeedback.failure("curiosity", "Battery depleted · shorten the route.");
    setStatus("ROVER STOPPED · OUT OF ENERGY");
    updateRoverProgramUI();
    return false;
  }
  return true;
}

function runRoverProgram() {
  if (state.done || state.health <= 0 || !prepareRoverExecution()) return;
  state.programRunning = true;
  state.nextCommandAt = performance.now() + 220;
  setStatus("PROGRAM UPLOADED · EXECUTING COMMANDS");
  updateRoverProgramUI();
}

function stepRoverProgram() {
  if (state.done || state.programRunning || state.health <= 0) return;
  if (
    state.loadedRevision !== state.programRevision ||
    state.programCounter >= state.execution.length
  ) {
    if (!prepareRoverExecution()) return;
  }
  const moved = executeRoverCommand();
  if (moved && state.programCounter >= state.execution.length)
    finishRoverProgram();
  else updateRoverProgramUI();
  announce(`${getSourceText($('#program-status'))} ${roverPosition(state)}`, true);
}

function toggleFreeExplore() {
  if (state.programRunning) return;
  if (state.freeExplore) {
    state.freeExplore = false;
    state.exploreMoving = false;
    driveKeys.clear();
    $("#free-explore").textContent = "Enter Free Explore";
    $("#free-explore").classList.remove("is-active");
    $("#drive-pad").hidden = true;
    $("#explore-help").hidden = true;
    $("#field-mission").hidden = true;
    $("#program-workspace").hidden = false;
    resetRoverSimulation();
    updateRoverProgramUI();
    setStatus("PROGRAM MODE · BUILD OR DEBUG YOUR ROUTE");
    return;
  }
  state.freeExplore = true;
  state.failed = false;
  state.exploreX = -3 + state.roverX * 1.5;
  state.exploreZ = -2.3 + state.roverY * 1.15;
  state.exploreHeading =
    state.programCounter === 0
      ? Math.atan2(state.exploreZ, -state.exploreX)
      : [Math.PI / 2, 0, -Math.PI / 2, Math.PI][state.roverDir];
  state.exploreMoving = false;
  $("#free-explore").textContent = "Return to Program";
  $("#free-explore").classList.add("is-active");
  $("#drive-pad").hidden = false;
  $("#explore-help").hidden = false;
  $("#field-mission").hidden = false;
  $("#program-workspace").hidden = true;
  updateExploreReadout();
  updateFieldMissionUI();
  updateRoverProgramUI();
  setStatus("FREE EXPLORE · DRIVE ANYWHERE");
}

function updateFreeExplore(dt, now) {
  if (!state.freeExplore) return;
  if (state.health <= 0) {
    state.exploreMoving = false;
    driveKeys.clear();
    return;
  }
  const turn =
    (driveKeys.has("left") ? 1 : 0) -
    (driveKeys.has("right") ? 1 : 0);
  const throttle =
    (driveKeys.has("forward") ? 1 : 0) -
    (driveKeys.has("reverse") ? 0.62 : 0);
  state.exploreHeading += turn * dt * 1.45;
  const speed = throttle * dt * 2.25;
  const nextX = state.exploreX + Math.cos(state.exploreHeading) * speed;
  const nextZ = state.exploreZ - Math.sin(state.exploreHeading) * speed;
  const radius = Math.hypot(nextX, nextZ);
  const rockHit = throttle ? findCuriosityRockHit(nextX, nextZ) : null;
  if (rockHit) {
    registerCuriosityRockHit(rockHit, now);
    state.rockContact = rockHit;
  } else if (radius <= 10.1) {
    state.exploreX = nextX;
    state.exploreZ = nextZ;
    if (throttle) releaseRockContactIfClear(nextX, nextZ);
  } else if (throttle) {
    setStatus("TERRAIN EDGE · TURN BACK TOWARD THE CRATER");
  }
  state.exploreMoving = Boolean((throttle && !rockHit) || turn);
  if (state.exploreMoving) {
    state.motionType = throttle ? "move" : "turn";
    state.motionUntil = now + 120;
    if (radius <= 10.1) setStatus("FREE EXPLORE · MANUAL DRIVE");
  } else if (Math.hypot(state.exploreX, state.exploreZ) >= 10.02) {
    setStatus("TERRAIN EDGE · TURN BACK TOWARD THE CRATER");
  }
  updateExploreReadout();
  updateFieldMissionUI();
}

function nudgeFreeExplore(action) {
  if (!state.freeExplore || state.health <= 0) return;
  let blocked = false;
  if (action === "left" || action === "right") {
    state.exploreHeading += action === "left" ? 0.26 : -0.26;
    state.motionType = "turn";
  } else {
    const distance = action === "forward" ? 0.42 : -0.28;
    const nextX =
      state.exploreX + Math.cos(state.exploreHeading) * distance;
    const nextZ =
      state.exploreZ - Math.sin(state.exploreHeading) * distance;
    const rockHit = findCuriosityRockHit(nextX, nextZ);
    if (rockHit) {
      blocked = true;
      registerCuriosityRockHit(rockHit, performance.now());
      state.rockContact = rockHit;
    } else if (Math.hypot(nextX, nextZ) <= 10.1) {
      state.exploreX = nextX;
      state.exploreZ = nextZ;
      releaseRockContactIfClear(nextX, nextZ);
      state.motionType = "move";
    } else {
      blocked = true;
      setStatus("TERRAIN EDGE · TURN BACK TOWARD THE CRATER");
    }
  }
  if (!blocked) {
    state.motionUntil = performance.now() + 430;
    setStatus("FREE EXPLORE · MANUAL DRIVE");
  }
  updateExploreReadout();
  updateFieldMissionUI();
}

function findCuriosityRockHit(x, z) {
  return curiosityCollisionRocks.find(
    (rock) => Math.hypot(x - rock.x, z - rock.z) < rock.radius,
  );
}

function releaseRockContactIfClear(x, z) {
  const rock = state.rockContact;
  if (rock && Math.hypot(x - rock.x, z - rock.z) > rock.radius + 0.55) {
    state.rockContact = null;
  }
}

function registerCuriosityRockHit(rock, now) {
  const key = `${rock.x.toFixed(3)}:${rock.z.toFixed(3)}`;
  const distanceSinceImpact = Math.hypot(
    state.exploreX - state.lastImpactX,
    state.exploreZ - state.lastImpactZ,
  );
  if (state.lastImpactRock === key && distanceSinceImpact < 0.9) return;
  state.lastImpactRock = key;
  state.lastImpactX = state.exploreX;
  state.lastImpactZ = state.exploreZ;
  damageCuriosity(now);
}

function damageCuriosity(now) {
  if (now < state.collisionCooldown) return;
  state.collisionCooldown = now + 900;
  state.health = Math.max(0, state.health - 18);
  state.motionType = "collision";
  state.motionUntil = now + 480;
  setMeter("health", state.health);
  machineAudio.pulse("crunch", 1);
  beep(145, 0.2);
  if (state.health <= 0) {
    driveKeys.clear();
    state.exploreMoving = false;
    setStatus("ROVER DISABLED · RESET THE EXHIBIT TO REPAIR");
  } else {
    setStatus(`ROCK IMPACT · ROVER INTEGRITY ${state.health}%`);
  }
  updateRoverRecoveryUI();
  updateFieldMissionUI();
}

function activeFieldTarget() {
  return state.fieldMissionStep < 2
    ? curiosityFieldSites.outcrop
    : curiosityFieldSites.uplink;
}

function updateFieldMissionUI() {
  if (!$("#field-mission")) return;
  const step = state.fieldMissionStep;
  const target = activeFieldTarget();
  const distance = Math.hypot(
    state.exploreX - target.x,
    state.exploreZ - target.z,
  );
  $$('[data-field-step]').forEach((item) => {
    const itemStep = +item.dataset.fieldStep;
    item.classList.toggle("is-complete", itemStep < step);
    item.classList.toggle("is-active", itemStep === step);
  });
  const action = $("#mission-action");
  if (state.fieldMissionComplete) {
    $("#mission-guidance").textContent =
      state.done ? "Science report complete · findings transmitted to Earth." : "Science sequence complete · choose a careful report below.";
    action.textContent = "Mission complete";
    action.disabled = true;
    return;
  }
  const labels = [
    "Capture Mastcam survey",
    "Drill & analyze outcrop",
    "Transmit science data",
  ];
  const targetName = step < 2 ? "cyan outcrop (DRILL OUTCROP)" : "gold uplink beacon (UPLINK)";
  const closeEnough = distance <= 1.45;
  $("#mission-guidance").textContent = closeEnough
    ? `${targetName} in range · run the science action.`
    : `${distance.toFixed(1)} m to ${targetName}.`;
  action.textContent = closeEnough ? labels[step] : "Too far from target";
  action.disabled = !closeEnough || state.health <= 0;
}

function performFieldMissionAction() {
  if (state.fieldMissionComplete || state.health <= 0) return;
  const target = activeFieldTarget();
  const distance = Math.hypot(
    state.exploreX - target.x,
    state.exploreZ - target.z,
  );
  if (distance > 1.45) return;
  if (state.fieldMissionStep === 0) {
    state.fieldMissionStep = 1;
    setStatus("MASTCAM SURVEY COMPLETE · TARGET APPROVED FOR DRILLING");
    machineAudio.pulse("servo", 0.7);
    beep(520, 0.15);
  } else if (state.fieldMissionStep === 1) {
    state.fieldMissionStep = 2;
    setStatus("DRILL COMPLETE · SAM AND CHEMIN ANALYSIS STORED");
    machineAudio.pulse("servo", 1);
    beep(610, 0.2);
  } else {
    state.fieldMissionStep = 3;
    state.fieldMissionComplete = true;
    setStatus("SCIENCE DATA READY · CHOOSE A CAREFUL CONCLUSION");
    revealCuriosityConclusion();
  }
  updateFieldMissionUI();
}

function revealCuriosityConclusion() {
  state.scienceReady = true;
  const panel = $("#curiosity-conclusion");
  panel.hidden = false;
  panel.scrollIntoView({ behavior: reduce ? "instant" : "smooth", block: "nearest" });
}

function chooseCuriosityClaim(claim) {
  if (!state.scienceReady || state.done) return;
  const feedback = $("#curiosity-claim-feedback");
  if (claim === "life") {
    feedback.textContent = "That goes beyond the evidence. Water-related minerals show conditions that may have supported life; they do not show organisms were there. Try the other report.";
    beep(190, 0.16);
    return;
  }
  feedback.textContent = "Report accepted: possible past habitability. You used the sample as evidence without claiming life was found.";
  $$("[data-science-claim]").forEach((button) => (button.disabled = true));
  success();
}

function updateExploreReadout() {
  if (!$("#explore-readout")) return;
  const distance = Math.hypot(state.exploreX, state.exploreZ);
  let heading = Math.round(((-state.exploreHeading * 180) / Math.PI + 90) % 360);
  if (heading < 0) heading += 360;
  $("#explore-readout").textContent =
    `X ${state.exploreX.toFixed(1)} · Z ${state.exploreZ.toFixed(1)} · ${distance.toFixed(1)} m from center · heading ${heading}°${distance >= 10.02 ? " · boundary" : ""}`;
}

function smoothstep(value) {
  const t = Math.max(0, Math.min(1, value));
  return t * t * (3 - 2 * t);
}

function jumpWebbStep(step) {
  if (step === 'focus' && state.deploy < 1 || step === 'infrared' && state.align < 1) return;
  const panel = $(`#webb-${step}-step`);
  if (!panel) return;
  state.webbVisibleStep = step;
  for (const name of ['deploy', 'focus', 'infrared']) $(`#webb-${name}-step`).hidden = name !== step;
  $$('[data-webb-step]').forEach(button => {
    if (button.dataset.webbStep === step) button.setAttribute('aria-current', 'step');
    else button.removeAttribute('aria-current');
  });
  const control = panel.querySelector(step === "deploy" ? "[data-wing]:not(.is-open)" : step === "focus" ? "[data-star]:not(.is-focused)" : "#webb-wavelength");
  $('.webb-step-nav').scrollIntoView({ behavior: reduce ? 'instant' : 'smooth', block: 'nearest' });
  (control || panel).focus({ preventScroll: true });
}
function updateWebbPointerControls() {
  const selected = state.selectedStar;
  const spot = state.webbSpots[selected];
  $$('[data-open-wing]').forEach(button => {
    const open = state.webbWings[button.dataset.openWing];
    button.setAttribute('aria-disabled', String(open));
    button.textContent = button.dataset.openWing === 'left' ? open ? 'Left wing open ✓' : 'Open left wing' : open ? 'Right wing open ✓' : 'Open right wing';
  });
  $$('[data-star-choice]').forEach(button => {
    const index = +button.dataset.starChoice;
    button.setAttribute('aria-pressed', String(index === selected));
    button.textContent = `Image ${'ABC'[index]}${state.webbSpots[index].locked ? ' ✓' : ''}`;
  });
  if ($('#star-position')) $('#star-position').textContent = `Image ${'ABC'[selected]}. ${describeStar(spot)}`;
  $$('[data-star-direction]').forEach(button => button.setAttribute('aria-disabled', String(spot.locked)));
}
function updateWebb() {
  const previousStep = state.webbUnlockedStep || 'deploy';
  const openCount = Number(state.webbWings.left) + Number(state.webbWings.right);
  state.deploy = (state.webbWingProgress.left + state.webbWingProgress.right) / 2;
  $$("[data-wing]").forEach((button) => {
    const wing = button.dataset.wing;
    const progress = state.webbWingProgress[wing];
    button.style.left = `${50 + (wing === "left" ? -1 : 1) * (10 + 26 * progress)}%`;
    button.classList.toggle("is-open", state.webbWings[wing]);
    button.setAttribute("aria-label", `${wing === "left" ? "Left" : "Right"} mirror wing, ${state.webbWings[wing] ? "locked open" : `${Math.round(progress * 100)} percent open. Drag ${wing} or use arrow keys`}`);
  });
  const focused = state.webbSpots.filter((spot) => spot.locked).length;
  state.align = focused / 3;
  $("#webb-focus-field").classList.toggle("is-complete", focused === 3);
  $$("[data-star]").forEach((button, index) => {
    const spot = state.webbSpots[index];
    button.style.left = `${spot.x * 100}%`;
    button.style.top = `${spot.y * 100}%`;
    button.classList.toggle("is-focused", spot.locked);
    button.setAttribute("aria-label", `Image ${"ABC"[index]}. ${describeStar(spot)}`);
  });
  $("#webb-focus-count").textContent = `${focused} / 3 images focused`;
  const activeStep = openCount !== 2 ? "deploy" : focused !== 3 ? "focus" : "infrared";
  state.webbUnlockedStep = activeStep;
  const visibleStep = previousStep !== activeStep ? activeStep : state.webbVisibleStep || activeStep;
  state.webbVisibleStep = visibleStep;
  for (const name of ['deploy', 'focus', 'infrared']) $(`#webb-${name}-step`).hidden = name !== visibleStep;
  $$("[data-webb-step]").forEach((button) => {
    button.disabled = button.dataset.webbStep === "focus" ? openCount !== 2 : button.dataset.webbStep === "infrared" ? focused !== 3 || openCount !== 2 : false;
    if (button.dataset.webbStep === visibleStep) button.setAttribute("aria-current", "step");
    else button.removeAttribute("aria-current");
  });
  $("#webb-state").textContent =
    openCount < 2
      ? `${openCount} of 2 mirror wings locked · Drag ${openCount ? "the other wing" : "both wings"} outward.`
      : focused < 3
        ? `${focused} of 3 star images focused · Drag the remaining light points to the crosshair.`
        : "Aligned · Now shift to infrared to reveal what visible light misses.";
  setStatus($("#webb-state").textContent);
  webbAlignment?.updateProgress(state.align);
  updateWebbPointerControls();
  if (previousStep !== activeStep) jumpWebbStep(activeStep);
}
function updateWebbInfrared(value) {
  if (state.deploy < 1 || state.align < 1) return;
  state.infrared = Math.max(0, Math.min(100, value));
  $("#webb-vision").style.setProperty("--infrared", state.infrared / 100);
  $("#webb-infrared-feedback").textContent = state.infrared >= 75
    ? "A hidden star-forming region comes into view. Infrared light can travel through some dust that blocks visible light."
    : state.infrared >= 35
      ? "The dust is fading; a warm glow is emerging behind it. Keep moving toward infrared."
      : "Visible light is scattered or blocked by this dust. Move toward infrared.";
  if (state.infrared >= 75) success();
}
function setWebbWingProgress(wing, value) {
  if (state.webbWings[wing]) return;
  const progress = Math.max(0, Math.min(1, value));
  const wasOpen = state.webbWings[wing];
  state.webbWingProgress[wing] = progress;
  state.webbWings[wing] = progress >= 0.98;
  if (!wasOpen && state.webbWings[wing]) {
    state.webbWingProgress[wing] = 1;
    machineAudio.pulse("servo", 0.8);
    beep(350 + (wing === "right" ? 90 : 0), 0.12);
  }
  updateWebb();
  const side = wing === "left" ? "Left" : "Right";
  if (state.webbWings[wing])
    announce(`${side} wing locked, ${Number(state.webbWings.left) + Number(state.webbWings.right)} of 2.`, true);
  else announce(`${side} wing ${Math.round(progress * 100)} percent open.`);
}
function setWebbSpot(index, x, y) {
  if (state.webbSpots[index].locked || state.deploy < 1) return;
  const spot = state.webbSpots[index];
  spot.x = Math.max(0.08, Math.min(0.92, x));
  spot.y = Math.max(0.08, Math.min(0.92, y));
  if (Math.hypot(spot.x - 0.5, spot.y - 0.5) <= WEBB_SNAP_RADIUS) {
    spot.x = 0.5;
    spot.y = 0.5;
    spot.locked = true;
    machineAudio.pulse("servo", 0.55);
    beep(470 + index * 110, 0.14);
  }
  updateWebb();
}
function showSignalJourney() {
  const target = state.signalTarget;
  if (!target) return;
  const moonKm = 384400;
  const auKm = 149597870.7;
  const liveDistanceKm = Number($("#voyager-live-distance").dataset.distanceKm);
  const hasLive = Number.isFinite(liveDistanceKm) && liveDistanceKm > 0;
  const voyagerKm = hasLive ? liveDistanceKm : facts.distance.value * 1e9;
  const km = target === "moon" ? moonKm : target === "au" ? auKm : voyagerKm;
  const seconds = km / 299792.458;
  const oneWay = seconds < 60
    ? `${seconds.toFixed(1)} seconds`
    : seconds < 3600
      ? `${(seconds / 60).toFixed(1)} minutes`
      : `${(seconds / 3600).toFixed(1)} hours`;
  const label = target === "moon" ? "the Moon" : target === "au" ? "1 AU" : "Voyager 1";
  const moonTrips = Math.round(km / moonKm);
  const formattedMoonTrips = moonTrips.toLocaleString();
  const basis = target === "voyager" && !hasLive
    ? " This uses NASA’s projected Nov 18, 2026 light-day milestone; live data is unavailable here."
    : target === "voyager"
      ? " Voyager’s value is a rounded live estimate from JPL Horizons."
      : "";
  $("#signal-result").textContent = `Ping sent to ${label}: about ${oneWay} one way, ${formattedMoonTrips} Moon-distance${moonTrips === 1 ? "" : "s"}. A reply takes twice as long, before any processing time.${basis}`;
  const beam = $("#signal-beam-fill");
  beam.classList.remove("is-sent");
  void beam.offsetWidth;
  beam.classList.add("is-sent");
  beep(480, 0.12);
}
function checkVoyager() {
  const progress = {
    listen: Boolean(state.listened),
    greeting: Boolean(state.greetingAdded),
  };
  $$("[data-voyager-step]").forEach((item) => {
    const complete = progress[item.dataset.voyagerStep];
    item.classList.toggle("is-complete", complete);
    item.setAttribute(
      "aria-label",
      `${complete ? "Complete" : "Incomplete"}: ${getSourceText(item)}`,
    );
  });
  setStatus(
    !progress.greeting
      ? progress.listen
        ? "Now send your own written or recorded greeting below."
        : "Send a written or recorded greeting below to earn the Voyager stamp."
      : "Your greeting joined the Golden Record story.",
  );
  if (progress.greeting) success();
}
let viewerGeneration = 0;
const viewerViews = new Map();
function updateViewModeButton() {
  const button = $('#view-mode');
  button.hidden = ['voyager', 'lobby', 'teachers'].includes(current);
  button.setAttribute('aria-pressed', String(force2d));
  button.textContent = force2d ? '2D view' : '3D view';
  button.setAttribute('aria-label', force2d ? 'Current view: 2D. Switch to 3D.' : 'Current view: 3D. Switch to 2D.');
  $('#stage').tabIndex = force2d ? -1 : 0;
  $('.orbit-hint').textContent = force2d ? 'Use the exhibit controls below' : 'Drag or arrow keys to orbit · Scroll or +/− to zoom · 0 resets';
}
async function mountViewer(id, token, view = null) {
  const generation = ++viewerGeneration;
  const e = exhibits[id];
  updateViewModeButton();
  scene?.dispose();
  scene = null;
  $("#stage canvas")?.remove();
  $("#stage .fallback-card")?.remove();
  $("#stage").classList.remove("fallback");

  try {
    if (force2d) throw Error("2D requested");
    const { createScene } = await import("./scene.js");
    if (state !== token || generation !== viewerGeneration) return;
    scene = createScene(
      $("#stage"),
      id,
      () => {
        force2d = true;
        updateViewModeButton();
        mountViewer(id, token, view);
      },
      (part) => {
        const discovered = hiddenFactCache?.reveal(part.id);
        setStatus(`${part.label.toUpperCase()} · ${discovered ? "HIDDEN FACT UNLOCKED BELOW" : "PART INSPECTED"}`);
        if (id === "voyager") {
          announceVoyager(`${part.label}. ${part.description}`);
          const face = part.id === "record" ? "front" : "cover";
          $(`[data-record-face="${face}"]`)?.click();
        }
        beep(part.sound || 420, 0.12);
      },
      (description) => announce(description),
      { onSelectSite: site => flightGame?.selectSite(site) },
    );
    if (id === "voyager") $("#stage .part-card")?.setAttribute("aria-live", "off");
    scene.setReduced(reduce);
    hiddenFactCache?.disableFallback();
    scene.setState(token);
    if (view) scene.setViewState(view);
    scene.render(0);
    if (id === 'ingenuity') flightGame?.setFallback(false);
  } catch {
    if (state !== token || generation !== viewerGeneration) return;
    if (id === 'ingenuity') flightGame?.setFallback(true);
    $("#stage").classList.add("fallback");
    $("#stage").insertAdjacentHTML(
      "beforeend",
      `<div class="fallback-card">${id === "voyager" ? `<img id="fallback-record-image" src="${recordArtifacts.front.image}" alt="${recordArtifacts.front.alt}" width="240" height="240">` : `<strong>${e.action}. Discover.</strong>`}<p>Use the exhibit controls to explore the same mission in this lightweight view.</p><div class="fallback-track"><i></i></div><output id="fallback-status"${id === "voyager" ? ' role="group" aria-live="off"' : ""}>Ready to explore</output></div>`,
    );
    hiddenFactCache?.enableFallback();
  }
}

async function render(id) {
  $('#academy-page').hidden = true;
  // Hash navigation and browser Back bypass setRoute; dismiss the Moon page
  // here too so it cannot cover the newly rendered training module.
  if (moonPanel.dialog.open) moonPanel.dialog.close();
  $('.skip').href = '#controls';
  $('.skip').textContent = 'Skip to training controls';
  disposeOpenData();
  advanceJourney(id);
  frictionFeedback = createFrictionFeedback();
  machineVoices.beginAttempt(id);
  if (storyDialog.open) storyDialog.close();
  delete document.body.dataset.printResource;
  const enteringExhibit = current !== id || !$("#lobby").hidden;
  machineAudio.stop();
  marsSoundPlayer?.dispose();
  marsSoundPlayer = null;
  hiddenFactCache = null;
  dsnWidget?.dispose();
  dsnWidget = null;
  curiosityGallery?.dispose();
  curiosityGallery = null;
  voyagerDistance?.dispose();
  voyagerDistance = null;
  greetingPlayer?.dispose();
  greetingPlayer = null;
  current = id;
  resetVoyagerAnnouncements();
  document.body.dataset.exhibit = id;
  $(".skip").href = id === "voyager" ? "#greetings" : "#controls";
  spaceAmbience.setTheme(id);
  missionFilm.setExhibit(id);
  updateBackgroundCredit(id);
  $("#lobby").hidden = true;
  $("#teachers-page").hidden = true;
  nav.hidden = false;
  $(".exhibit").hidden = false;
  $("#discovery").hidden = false;
  if (enteringExhibit) window.scrollTo({ top: 0, behavior: "instant" });
  state = {
    roverX: roverMission.start.x,
    roverY: roverMission.start.y,
    roverDir: roverMission.start.dir,
    program: [],
    programRevision: 0,
    loadedRevision: -1,
    execution: [],
    programCounter: 0,
    programRunning: false,
    sampleAnalyzed: false,
    freeExplore: false,
    exploreX: 0,
    exploreZ: 0,
    exploreHeading: 0,
    exploreMoving: false,
    health: 100,
    collisionCooldown: 0,
    rockContact: null,
    lastImpactRock: null,
    lastImpactX: 0,
    lastImpactZ: 0,
    fieldMissionStep: 0,
    fieldMissionComplete: false,
    scienceReady: false,
    energy: 100,
    rotor: 0,
    spinning: false,
    rotorPulseUntil: 0,
    stability: 100,
    trim: 50,
    windTarget: 65,
    landingSite: null,
    autonomySelected: false,
    flightAttempts: 0,
    flightPaced: false,
    flightMaxAltitude: 0,
    crashed: false,
    deploy: 0,
    align: 0,
    webbWings: { left: false, right: false },
    webbWingProgress: { left: 0, right: 0 },
    webbSpots: [
      { x: 0.22, y: 0.27, locked: false },
      { x: 0.78, y: 0.35, locked: false },
      { x: 0.7, y: 0.78, locked: false },
    ],
    selectedStar: 0,
    infrared: 0,
    rotation: 0,
    distance: 0,
    recordFace: "front",
    listened: false,
    greetingAdded: false,
    signalTarget: null,
  };
  document.body.dataset.exhibit = id;
  driveKeys.clear();
  const e = exhibits[id];
  $$("[data-exhibit]").forEach((b) => {
    const selected = b.dataset.exhibit === id;
    if (selected) b.setAttribute("aria-current", "page");
    else b.removeAttribute("aria-current");
    b.querySelector(".current-marker").hidden = !selected;
  });
  // On phones the switcher is one swipeable row; keep the current mission in view
  // without moving the page itself.
  const currentTab = $(`.exhibits [data-exhibit="${id}"]`);
  const switcher = currentTab?.closest(".exhibits");
  if (switcher && switcher.scrollWidth > switcher.clientWidth)
    switcher.scrollLeft = Math.max(0, currentTab.offsetLeft - (switcher.clientWidth - currentTab.offsetWidth) / 2);
  $("#eyebrow").textContent = e.place;
  $("#title").innerHTML = e.title;
  $("#title").insertAdjacentHTML(
    "afterend",
    `<p class="machine-voice" id="machine-voice">“${e.machineVoice}”</p>`,
  );
  document.querySelectorAll("#machine-voice").forEach((node, index) => {
    if (index) node.remove();
  });
  $("#module-mission-objective")?.remove();
  $("#machine-voice").insertAdjacentHTML('afterend', missionCallMarkup(id));
  $("#mission-opening")?.remove();
  const opening = missionOpening(id);
  if (opening) $("#machine-voice").after(opening);
  if (machineVoices.has(id)) {
    storyVoice = createStoryVoice({
      transcript: storyLayer[id].transmission,
      onPlay() {
        sound = true;
        machineAudio.setEnabled(true);
        updateSoundButton();
        playMachineTransmission(id);
      },
      onStop: () => machineVoices.stop(),
    });
    $('#machine-voice').after(storyVoice.root);
  }
  $("#story").textContent = e.story;
  $("#story-source").href = e.storySource;
  $("#story-source").textContent = `— ${e.storyAttribution} · NASA source ↗`;
  $("#story-reopen").setAttribute("aria-label", `Read ${e.name} story`);
  mountModuleStory(id);
  mountMachineStory($("#machine-story"), id, { reducedMotion: reduce });
  $("#machine-story").tabIndex = -1;
  $("#briefing").innerHTML = briefingMarkup(id);
  $("#begin-challenge").onclick = () => {
    if (id === "voyager") {
      greetingPlayer?.openCatalog({ focus: false, scroll: false });
      $("#greeting-audio").scrollIntoView({ behavior: reduce ? "instant" : "smooth", block: "center" });
      $("#greeting-audio").focus({ preventScroll: true });
      return;
    }
    if (id === "webb") {
      jumpWebbStep(state.deploy < 1 ? "deploy" : state.align < 1 ? "focus" : "infrared");
      return;
    }
    $("#challenge-heading").scrollIntoView({
      behavior: reduce ? "instant" : "smooth",
      block: "start",
    });
    $("#controls").focus({ preventScroll: true });
  };
  $("#scene-name").textContent = e.scene;
  $("#stage").setAttribute(
    "aria-label",
    id === "voyager"
      ? recordArtifacts.front.alt
      : "Interactive three-dimensional spacecraft exhibit",
  );
  $("#stage").tabIndex = force2d ? -1 : 0;
  $(".orbit-hint").textContent = force2d
    ? "Use the exhibit controls below"
    : "Drag or arrow keys to orbit · Scroll or +/− to zoom · 0 resets";
  $("#controls").innerHTML =
    controls() + learningMarkup(id) + '<button class="secondary" id="reset">Reset exhibit</button>';
  const missionHeading = $("#controls h2");
  const missionIntro = missionHeading?.nextElementSibling?.matches("p")
    ? missionHeading.nextElementSibling
    : null;
  missionHeading?.insertAdjacentHTML("afterend", quickStartMarkup(id));
  if (missionIntro) {
    const explanation = whyMarkup(`<p>${missionIntro.innerHTML}</p>`);
    missionIntro.remove();
    $("#controls .quick-start")?.insertAdjacentHTML("afterend", explanation);
  }
  if (id === "voyager") {
    $('#voyager-live-distance').insertAdjacentHTML('afterend', '<button type="button" id="read-voyager-distance">Read current distance</button>');
    $('#read-voyager-distance').onclick = () => { voyagerDistance?.refresh(); announceVoyager(`Distance reading: ${getSourceText($('#voyager-live-distance'))}. ${getSourceText($('#voyager-live-light-time'))}.`); };
    // One card: the live number, what it is heading for, and the countdown to it.
    $("#voyager-live-light-time").insertAdjacentHTML("afterend", voyagerCountdownMarkup());
    $("#controls .voyager-live").insertAdjacentHTML("afterend", voyagerContactMarkup());
  }
  if (id === "webb") {
    const deployStep = $("#webb-deploy-field").closest(".webb-step");
    deployStep.id = "webb-deploy-step";
    for (const panel of [deployStep, $("#webb-focus-step"), $("#webb-infrared-step")]) panel.tabIndex = -1;
    deployStep.insertAdjacentHTML("beforebegin", '<nav class="webb-step-nav" aria-label="Webb challenge steps"><button type="button" data-webb-step="deploy" aria-controls="webb-deploy-step" aria-current="step">01 · Open mirror</button><button type="button" data-webb-step="focus" aria-controls="webb-focus-step" disabled>02 · Align stars</button><button type="button" data-webb-step="infrared" aria-controls="webb-infrared-step" disabled>03 · Infrared</button></nav>');
    $("#webb-focus-step").insertAdjacentHTML("beforeend", webbAlignmentMarkup());
    webbAlignment = mountWebbAlignment($("#webb-alignment-story"));
    const webbImageNotes = collapseChallengeNotes($('#webb-alignment-story'), 'Real Webb images');
    webbImageNotes.append($('.webb-real-images'));
    webbAlignment.updateProgress(state.align);
  }
  $("#mars-sounds-slot").innerHTML = id === "curiosity" ? marsSoundsMarkup() : "";
  if (id === "curiosity") {
    marsSoundPlayer = mountMarsSounds($("#mars-sounds-slot"), {
      onPlay: () => {
        machineVoices.stop();
        sound = true;
        machineAudio.setEnabled(true);
        updateSoundButton();
      },
    });
  }
  hiddenFactCache = mountHiddenFacts($("#hidden-facts-slot"), id);
  $("#discovery").innerHTML =
    `<div class="fact"><span class="fact-icon">✧</span><div><h3>FROM THE MISSION ARCHIVE</h3><p>${facts[id].claim}</p><a href="${facts[id].source_url}" target="_blank" rel="noopener">${facts[id].source_title}</a></div></div><div class="reflection"><strong>ONE MACHINE. ONE BIG IDEA.</strong><p>${e.question}</p><button class="secondary" id="discovery-sources">Open Field notes</button></div>`;
  $("#discovery-sources").onclick = openFieldNotes;
  $("#greetings").hidden = id !== "voyager";
  $("#greetings").innerHTML = id === "voyager" ? greetingMarkup() : "";
  exhibitLayout = mountExhibitLayout(id);
  if (enteringExhibit) {
    $("#title").tabIndex = -1;
    $("#title").focus({ preventScroll: true });
  }
  if (id === "voyager")
    greetingPlayer = mountGreetings($("#greetings"), {
      reducedMotion: reduce,
      onAnnounce: announceVoyager,
      onRead: greeting => { if (greeting?.id) { state.listened = true; checkVoyager(); } },
      onPlay: (greeting) => {
        machineVoices.stop();
        sound = true;
        machineAudio.stop();
        machineAudio.setEnabled(true);
        if (greeting?.id) state.listened = true;
        state.playing = true;
        updateSoundButton();
        checkVoyager();
      },
      onPause: () => {
        state.playing = false;
      },
      onSave: (record) => {
        state.greetingAdded = true;
        checkVoyager();
      },
      onCount: (count) => {
        clearTimeout(voyagerSearchAnnouncementTimer);
        voyagerSearchAnnouncementTimer = window.setTimeout(() => announceVoyager(`${count} Golden Record greetings found.`), 300);
      },
    });
  if (id === "voyager") {
    voyagerDistance = mountVoyagerDistance($("#greetings"), { reduced: reduce });
    voyagerCountdown = mountVoyagerCountdown($("#greetings"));
    voyagerContact = mountVoyagerContact($("#greetings"), { onAnnounce: announceVoyager });
  }
  if (id === "voyager") {
    for (const region of document.querySelectorAll('.exhibit [role="status"], .exhibit [aria-live], .exhibit output, #greetings [role="status"], #greetings [aria-live], #greetings output')) {
      region.setAttribute("aria-live", "off");
      if (region.getAttribute("role") === "status") region.removeAttribute("role");
      if (region.tagName === "OUTPUT" && !region.hasAttribute("role")) region.setAttribute("role", "group");
    }
  }
  bindControls();
  mountMissionDirections(id);
  updateMissionProgress();
  setStatus("YOUR DISCOVERY STARTS HERE");
  await mountViewer(id, state);
}
function openFieldNotes() {
  $("#notes-content").innerHTML =
    Object.entries(exhibits)
      .map(
        ([id, e]) =>
          `<h3>${e.name}</h3><p>${facts[id].claim}</p><a href="${facts[id].source_url}" target="_blank" rel="noopener">${facts[id].source_title}</a>`,
      )
      .join("") +
    `<h3>Voyager distance</h3><p><span>${facts.distance.claim}</span> <span>${facts.distance.uncertainty}</span></p><a href="${facts.distance.source_url}" target="_blank" rel="noopener">NASA distance reference</a>`;
  $("#notes").showModal();
}
const resourceCreditPanel = mountResourceCredits($("#resource-credits"), {
  facts,
  quotes: Object.values(exhibits),
  recordImages: { 'record-front': recordArtifacts.front.image, 'record-cover': recordArtifacts.cover.image },
  onFieldNotes: openFieldNotes,
});
$("#sources").onclick = event => resourceCreditPanel.open(event.currentTarget);
$("#credits-footer-link").onclick = event => resourceCreditPanel.open(event.currentTarget);
const privacyDialog = $('#privacy-dialog');
const privacyTrigger = $('#privacy-footer-link');
privacyTrigger.onclick = () => privacyDialog.showModal();
$('#privacy-close').onclick = () => privacyDialog.close();
privacyDialog.addEventListener('click', event => { if (event.target === privacyDialog) privacyDialog.close(); });
privacyDialog.addEventListener('close', () => privacyTrigger.focus({ preventScroll: true }));
$('.skip').onclick = event => {
  event.preventDefault();
  const target = $($('.skip').getAttribute('href'));
  if (!target) return;
  for (let parent = target.parentElement; parent; parent = parent.parentElement) if (parent.tagName === 'DETAILS') parent.open = true;
  target.focus({ preventScroll: true });
  target.scrollIntoView({ behavior: reduce ? 'instant' : 'smooth', block: 'start' });
};
$("#close-notes").onclick = () => $("#notes").close();
$("#sound").onclick = () => {
  sound = !sound;
  if (!sound) {
    greetingPlayer?.pause();
    marsSoundPlayer?.pause();
  }
  machineAudio.setEnabled(sound);
  updateSoundButton();
  if (sound) beep();
};
document.querySelectorAll("[data-header-proxy]").forEach((button) => {
  button.onclick = () => {
    const target = document.getElementById(button.dataset.headerProxy);
    const menu = button.closest("details");
    menu?.removeAttribute("open");
    target?.click();
    const dialog = document.querySelector('dialog[open]');
    if (dialog) dialog.addEventListener('close', () => menu?.querySelector('summary').focus(), { once: true });
    else if (target?.id === 'sound') menu?.querySelector('summary').focus();
  };
});
function setReducedMotion(value) {
  reduce = Boolean(value);
  try { localStorage.setItem(MOTION_KEY, String(reduce)); } catch { /* Keep the choice for this visit. */ }
  document.body.classList.toggle("motion-reduced", reduce);
  document.body.classList.toggle("motion-allowed", !reduce);
  $("#motion").setAttribute("aria-pressed", String(reduce));
  $("#motion").textContent = reduce ? "Motion reduced" : "Reduce motion";
  stampCeremony?.setReduced(reduce);
  scene?.setReduced(reduce);
  flightGame?.setReduced(reduce);
  spaceAmbience.setReduced(reduce);
  missionFilm.setReduced(reduce);
  voyagerDistance?.setReduced(reduce);
  greetingPlayer?.setReduced(reduce);
  announce(reduce ? "Motion reduced." : "Motion enabled.");
  accessPreferences?.syncMotion();
}
$("#motion").onclick = () => setReducedMotion(!reduce);
const accessPreferences = mountAccessPreferences({ trigger: $('#access-settings'), dialog: $('#access-dialog'), getReduced: () => reduce, setReduced: setReducedMotion });
$('#access-dialog .access-help').before($('#sound'));
$("#view-mode").onclick = () => {
  force2d = !force2d;
  const view = scene?.getViewState() || viewerViews.get(current);
  if (view) viewerViews.set(current, view);
  updateViewModeButton();
  if (exhibits[current]) mountViewer(current, state, view);
};
window.addEventListener("blur", () => {
  driveKeys.clear();
  state.exploreMoving = false;
  state.spinning = false;
  machineAudio.stop();
  machineVoices.stop();
});
document.addEventListener("visibilitychange", () => {
  if (document.hidden) machineVoices.stop();
});
window.addEventListener("keydown", (event) => {
  if (
    current !== "curiosity" ||
    !state.freeExplore ||
    event.target.matches("input, button, select, textarea") ||
    $("#notes").open
  )
    return;
  const action = {
    KeyW: "forward",
    ArrowUp: "forward",
    KeyS: "reverse",
    ArrowDown: "reverse",
    KeyA: "left",
    ArrowLeft: "left",
    KeyD: "right",
    ArrowRight: "right",
  }[event.code];
  if (action) {
    event.preventDefault();
    driveKeys.add(action);
  }
});
window.addEventListener("keyup", (event) => {
  const action = {
    KeyW: "forward",
    ArrowUp: "forward",
    KeyS: "reverse",
    ArrowDown: "reverse",
    KeyA: "left",
    ArrowLeft: "left",
    KeyD: "right",
    ArrowRight: "right",
  }[event.code];
  if (action) driveKeys.delete(action);
});
window.addEventListener("hashchange", () => {
  if (["#controls", "#greetings", "#academy-page-title"].includes(location.hash)) return;
  const route = location.hash.slice(1);
  if (route === 'journey') { renderJourneyAlias(); return; }
  if (Object.hasOwn(academyPageTitles, route)) { renderAcademyPage(route); return; }
  if (!route || route === "lobby") renderLobby();
  else if (route === "lobby-missions") {
    if (current !== "lobby") renderLobby();
    requestAnimationFrame(() => $(".mission-passport").scrollIntoView({ block: "start" }));
  }
  else if (route === "teachers") renderTeachers();
  else if (missionIds.slice(0, 2).includes(route)) renderMoonRoute(route);
  else render(exhibits[route] ? route : "curiosity");
});
window.addEventListener("popstate", () => {
  if (location.hash === '#academy-page-title') return;
  if (location.pathname === "/teachers") renderTeachers();
  else {
    const route = location.hash.slice(1);
    if (route === 'journey') { renderJourneyAlias(); return; }
    if (Object.hasOwn(academyPageTitles, route)) { renderAcademyPage(route); return; }
    if (!route || route === "lobby") renderLobby();
    else if (route === "lobby-missions") {
      if (current !== "lobby") renderLobby();
      requestAnimationFrame(() => $(".mission-passport").scrollIntoView({ block: "start" }));
    }
    else if (missionIds.slice(0, 2).includes(route)) renderMoonRoute(route);
    else render(exhibits[route] ? route : "curiosity");
  }
});
function tick(now) {
  const dt = Math.min((now - last) / 1000, 0.05);
  last = now;
  if (!document.hidden && !document.querySelector('dialog[open]') && $('#finale').hidden) {
    const roverMoving =
      current === "curiosity" &&
      !state.failed &&
      (state.programRunning ||
        state.exploreMoving ||
        (state.motionUntil || 0) > now);
    if (roverMoving && !machineVoices.isPlaying) {
      machineAudio.start("rover");
      machineAudio.update({ roughness: 0.58 });
      if (now >= (state.nextCrunch || 0)) {
        machineAudio.pulse("crunch", 0.42);
        state.nextCrunch = now + 520;
      }
    } else if (current === "curiosity") machineAudio.stop();
    if (
      current === "curiosity" &&
      !state.failed &&
      state.programRunning &&
      now >= state.nextCommandAt
    ) {
      const progressed = executeRoverCommand(now);
      if (progressed && state.programCounter >= state.execution.length)
        finishRoverProgram();
      else if (progressed) state.nextCommandAt = now + (reduce ? 220 : 610);
    }
    if (current === "curiosity" && state.freeExplore)
      updateFreeExplore(dt, now);
    if (current === "ingenuity") {
      if (state.spinning && now >= (state.rotorPulseUntil || 0))
        state.spinning = false;
      flightGame?.tick(dt);
      if ((state.spinning || state.flying && (!state.flightPaced || state.flightAdvanceSoundUntil > now)) && !machineVoices.isPlaying) {
        machineAudio.start("rotor");
        machineAudio.update({
          power: state.flying ? Math.max(78, state.rotor) : state.rotor,
        });
      } else machineAudio.stop();
    }
    scene?.setState(state);
    scene?.render(dt);
    if ($("#fallback-status")) {
      const p =
        current === "curiosity"
          ? state.execution.length
            ? (state.programCounter / state.execution.length) * 100
            : 0
          : current === "ingenuity"
            ? state.done
              ? 100
              : state.rotor
            : current === "webb"
              ? (state.deploy + state.align) * 50
              : state.distance * 100;
      $(".fallback-track i").style.width = p + "%";
      $("#fallback-status").textContent = state.done
        ? "Mission complete"
        : getSourceText($("#stage-status"));
    }
  } else machineAudio.stop();
  requestAnimationFrame(tick);
}
const initialRoute = location.hash.slice(1);
if (initialRoute === 'journey') renderJourneyAlias();
else if (Object.hasOwn(academyPageTitles, initialRoute)) renderAcademyPage(initialRoute);
else if (location.pathname === "/teachers") renderTeachers();
else if (!initialRoute || initialRoute === "lobby") {
  renderLobby();
  // The story plays by itself whenever the landing page opens, until the first stamp is earned.
  if (shouldAutoPlayIntro(completed.size)) startIntro();
}
else if (initialRoute === "teachers") setRoute("teachers");
else if (missionIds.slice(0, 2).includes(initialRoute)) renderMoonRoute(initialRoute);
else render(exhibits[initialRoute] ? initialRoute : "curiosity");
requestAnimationFrame(tick);
