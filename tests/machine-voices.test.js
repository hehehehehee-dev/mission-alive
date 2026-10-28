import test from "node:test";
import assert from "node:assert/strict";
import { createMachineVoices, machineVoiceAssets } from "../src/machine-voices.js";

const files = {
  curiosity: { final: "/supplied/voice-curiosity.mp3", mid: "/supplied/voice-curiosity-mid.mp3" },
  ingenuity: { final: "/supplied/voice-ingenuity.mp3", mid: "/supplied/voice-ingenuity-mid.mp3" },
  webb: { final: "/supplied/voice-webb.mp3", mid: "/supplied/voice-webb-mid.mp3" },
  voyager: { final: "/supplied/voice-voyager.mp3" },
};

function harness(options = {}) {
  const created = [], states = [];
  const controller = createMachineVoices({
    enabled: true, files, onState: (state) => states.push(state),
    makeAudio(source) {
      const events = new Map();
      const audio = {
        source, currentTime: 0, paused: true, removed: false,
        play() { this.paused = false; return options.play?.(this) ?? Promise.resolve(); },
        pause() { this.paused = true; },
        removeAttribute(name) { if (name === "src") this.removed = true; },
        load() {},
        addEventListener(name, callback) { events.set(name, callback); },
        removeEventListener(name, callback) { if (events.get(name) === callback) events.delete(name); },
        emit(name) { events.get(name)?.(); },
      };
      created.push(audio);
      return audio;
    },
    ...options,
  });
  return { controller, created, states };
}

test("absent supplied voices do not create audio, request files, or claim availability", async () => {
  const ui = harness({ files: {} });
  assert.equal(ui.controller.available, false);
  assert.equal(ui.controller.has("curiosity"), false);
  ui.controller.beginAttempt("curiosity");
  assert.equal(await ui.controller.playTransmission("curiosity"), false);
  assert.deepEqual(ui.created, []);
  // Node can import the controller without Vite or a browser Audio global.
  assert.ok(Object.keys(machineVoiceAssets).includes("voyager"));
});

test("audio never starts on creation/activation or on enabling sound; explicit playback and replay work", async () => {
  const ui = harness({ enabled: false });
  assert.deepEqual(ui.created, []);
  ui.controller.beginAttempt("curiosity");
  assert.equal(await ui.controller.playTransmission("curiosity"), false);
  ui.controller.setEnabled(true);
  assert.deepEqual(ui.created, []);
  assert.equal(await ui.controller.playTransmission("curiosity"), true);
  assert.equal(ui.controller.isPlaying, true);
  assert.equal(ui.created[0].source, files.curiosity.final);
  assert.equal(await ui.controller.playTransmission("curiosity"), true);
  assert.equal(ui.created[0].paused, true);
  assert.equal(ui.created[0].removed, true);
  assert.equal(ui.created[1].paused, false);
  ui.controller.setEnabled(false);
  assert.equal(ui.controller.isPlaying, false);
  assert.equal(ui.created[1].paused, true);
});

test("only the active machine can speak and changing modules stops the old voice", async () => {
  const ui = harness();
  ui.controller.beginAttempt("voyager");
  assert.equal(await ui.controller.playTransmission("curiosity"), false);
  assert.equal(await ui.controller.playTransmission("voyager"), true);
  ui.controller.beginAttempt("webb");
  assert.equal(ui.created[0].paused, true);
  assert.equal(await ui.controller.playTransmission("voyager"), false);
  assert.equal(await ui.controller.playTransmission("webb"), true);
  ui.controller.dispose();
  assert.equal(ui.created[1].paused, true);
  assert.equal(await ui.controller.playTransmission("webb"), false);
});

test("optional mid-play cues run once per attempt and cannot interrupt a final transmission", async () => {
  const ui = harness();
  ui.controller.beginAttempt("curiosity");
  assert.equal(await ui.controller.playMid("curiosity"), true);
  assert.equal(await ui.controller.playMid("curiosity"), false);
  ui.controller.beginAttempt("curiosity");
  assert.equal(await ui.controller.playMid("curiosity"), true);
  assert.equal(await ui.controller.playTransmission("curiosity"), true);
  assert.equal(await ui.controller.playMid("curiosity"), false);
  assert.equal(ui.created.at(-1).source, files.curiosity.final);
});

test("browser autoplay rejection remains replayable and media errors fail quietly", async () => {
  let rejectFirst = true;
  const ui = harness({ play() {
    if (rejectFirst) { rejectFirst = false; return Promise.reject(Object.assign(new Error("Blocked"), { name: "NotAllowedError" })); }
    return Promise.resolve();
  } });
  ui.controller.beginAttempt("voyager");
  assert.equal(await ui.controller.playTransmission("voyager"), false);
  assert.equal(ui.states.at(-1).state, "blocked");
  assert.equal(await ui.controller.playTransmission("voyager"), true);
  ui.created.at(-1).emit("error");
  assert.equal(ui.states.at(-1).state, "unavailable");
  assert.equal(ui.created.at(-1).paused, true);
});

test("reset cancels a hanging play promise and ignores its later rejection", async () => {
  let reject;
  const ui = harness({ play: () => new Promise((resolve, rejectPlay) => { reject = rejectPlay; }) });
  ui.controller.beginAttempt("ingenuity");
  const pending = ui.controller.playTransmission("ingenuity");
  ui.controller.beginAttempt("webb");
  assert.equal(await pending, false);
  reject(new Error("Late media failure"));
  await new Promise(setImmediate);
  assert.deepEqual(ui.states.map((entry) => entry.state), ["idle"]);
  assert.equal(ui.created[0].paused, true);
});
