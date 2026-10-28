// Only files actually supplied by the project are included in the build. An
// unfinished voice set must not request absent MP3s or replace the written story.
// Vite supplies env in both dev and production; Node's test runner does not.
// Guarding on typeof import.meta.glob would fail after Vite replaces the call.
const suppliedFiles = import.meta.env
  ? import.meta.glob("./assets/voices/voice-*.mp3", { eager: true, query: "?url", import: "default" })
  : {};

const machines = ["curiosity", "ingenuity", "webb", "voyager"];
export const machineVoiceAssets = Object.freeze(Object.fromEntries(machines.map((id) => [
  id,
  Object.freeze({
    final: suppliedFiles[`./assets/voices/voice-${id}.mp3`] || null,
    mid: id === "voyager" ? null : suppliedFiles[`./assets/voices/voice-${id}-mid.mp3`] || null,
  }),
])));

export function createMachineVoices({
  enabled = false,
  files = machineVoiceAssets,
  makeAudio = (source) => new Audio(source),
  onState = () => {},
} = {}) {
  let soundEnabled = Boolean(enabled);
  let currentMachine = null;
  let active = null;
  let generation = 0;
  let disposed = false;
  const usedMidLines = new Set();
  const has = (id, kind = "final") => machines.includes(id) && typeof files[id]?.[kind] === "string" && files[id][kind].length > 0;
  const available = machines.some((id) => has(id) || has(id, "mid"));

  function release(session) {
    session.cancel();
    session.audio.removeEventListener?.("ended", session.onEnded);
    session.audio.removeEventListener?.("error", session.onError);
    session.audio.pause();
    try { session.audio.currentTime = 0; } catch { /* Some media cannot seek before metadata. */ }
    session.audio.removeAttribute?.("src");
    session.audio.load?.();
  }

  function stop() {
    generation++;
    const previous = active;
    active = null;
    if (previous) {
      release(previous);
      onState({ id: previous.id, kind: previous.kind, state: "idle" });
    }
  }

  async function play(id, kind) {
    if (disposed || currentMachine !== id || !soundEnabled || !has(id, kind)) return false;
    if (kind === "mid" && active?.kind === "final") return false;
    stop();
    const token = generation;
    let audio;
    try { audio = makeAudio(files[id][kind]); } catch {
      onState({ id, kind, state: "unavailable" });
      return false;
    }
    let cancel;
    const cancelled = new Promise((resolve) => { cancel = () => resolve({ cancelled: true }); });
    const session = { id, kind, audio, cancel };
    const finish = (state) => {
      if (active !== session) return;
      active = null;
      generation++;
      release(session);
      onState({ id, kind, state });
    };
    session.onEnded = () => finish("idle");
    session.onError = () => finish("unavailable");
    active = session;
    audio.preload = "none";
    audio.addEventListener?.("ended", session.onEnded);
    audio.addEventListener?.("error", session.onError);
    // A rejection handler remains attached even after cancellation, so late
    // browser rejections cannot become unhandled promises during navigation.
    let started;
    try {
      started = Promise.resolve(audio.play()).then(() => ({ started: true }), (error) => ({ error }));
    } catch (error) {
      started = Promise.resolve({ error });
    }
    const result = await Promise.race([started, cancelled]);
    if (result.cancelled || disposed || token !== generation || active !== session) return false;
    if (result.error) {
      finish(result.error.name === "NotAllowedError" ? "blocked" : "unavailable");
      return false;
    }
    onState({ id, kind, state: "playing" });
    return true;
  }

  return {
    available,
    get isPlaying() { return active !== null; },
    has,
    beginAttempt(id) {
      stop();
      currentMachine = machines.includes(id) ? id : null;
      usedMidLines.clear();
    },
    playTransmission: (id) => play(id, "final"),
    playMid(id) {
      if (disposed || currentMachine !== id || !soundEnabled || !has(id, "mid") || usedMidLines.has(id) || active?.kind === "final") return Promise.resolve(false);
      usedMidLines.add(id);
      return play(id, "mid");
    },
    setEnabled(value) {
      soundEnabled = Boolean(value);
      if (!soundEnabled) stop();
    },
    stop,
    dispose() {
      stop();
      currentMachine = null;
      disposed = true;
      usedMidLines.clear();
    },
  };
}
