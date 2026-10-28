export const marsSounds = [
  {
    id: "first",
    label: "First sounds from Mars",
    detail: "Feb. 19, 2021 · A muffled recording about 18 hours after landing. A little wind is audible.",
    file: "/assets/mars-first-sound.mp3",
    source: "https://science.nasa.gov/resource/first-audio-recording-of-sounds-on-mars/",
  },
  {
    id: "wind",
    label: "Martian wind",
    detail: "Feb. 22, 2021 · Listen around 20 seconds for wind. NASA removed rover background noise.",
    file: "/assets/mars-wind.mp3",
    source: "https://science.nasa.gov/resource/perseverance-rovers-supercam-records-wind-on-mars/",
  },
  {
    id: "drive",
    label: "Metal wheels driving",
    detail: "Mar. 7, 2021 · A 90-second edited highlight from Perseverance's drive over Martian ground.",
    file: "/assets/mars-rover-drive.mp3",
    source: "https://science.nasa.gov/resource/sounds-of-perseverance-mars-rover-driving-sol-16-90-second-highlights/",
  },
];

export function marsSoundsMarkup() {
  return `<section class="mars-sounds" aria-labelledby="mars-sounds-title">
    <div class="mars-sounds-heading"><span class="mars-sound-wave" aria-hidden="true">◖◗</span><div><p class="eyebrow">REAL SOUND FROM MARS · NASA ARCHIVE</p><h2 id="mars-sounds-title">Hear the Red Planet.</h2></div></div>
    <p>Curiosity has no microphone. Another Mars rover, <strong>Perseverance</strong>, recorded these real sounds. Choose a clip, then listen while you explore the rover.</p>
    <div class="mars-sound-choices" role="group" aria-label="Choose a Mars recording">${marsSounds.map((clip, index) => `<button type="button" data-mars-sound="${clip.id}" aria-pressed="false"><span>0${index + 1}</span>${clip.label}<small>Listen ↗</small></button>`).join("")}</div>
    <div class="mars-sound-player" hidden><p id="mars-sound-detail"></p><audio id="mars-sound-audio" controls preload="none" aria-label="NASA recording from Mars"></audio><div><a id="mars-sound-source" target="_blank" rel="noopener">NASA recording and context ↗</a><span>NASA/JPL-Caltech</span></div></div>
    <p class="mars-sound-status" id="mars-sound-status" role="status">Pick a recording to hear Mars.</p>
  </section>`;
}

export function mountMarsSounds(root, { onPlay } = {}) {
  const audio = root.querySelector("#mars-sound-audio");
  const player = root.querySelector(".mars-sound-player");
  const status = root.querySelector("#mars-sound-status");
  const buttons = [...root.querySelectorAll("[data-mars-sound]")];
  root.querySelector(".mars-sound-choices").addEventListener("click", async (event) => {
    const button = event.target.closest("[data-mars-sound]");
    if (!button) return;
    const clip = marsSounds.find((item) => item.id === button.dataset.marsSound);
    if (!clip) return;
    audio.pause();
    audio.src = clip.file;
    root.querySelector("#mars-sound-detail").textContent = clip.detail;
    root.querySelector("#mars-sound-source").href = clip.source;
    player.hidden = false;
    buttons.forEach((item) => item.setAttribute("aria-pressed", String(item === button)));
    try {
      await audio.play();
      status.textContent = `Playing ${clip.label.toLowerCase()} — recorded by Perseverance.`;
    } catch {
      status.textContent = "Press play in the audio control to hear the recording.";
    }
  });
  audio.addEventListener("play", () => onPlay?.());
  audio.addEventListener("pause", () => {
    if (!audio.ended && audio.currentTime > 0) status.textContent = "Recording paused. Press play to continue listening.";
  });
  audio.addEventListener("ended", () => { status.textContent = "Recording ended. Choose another sound to continue listening."; });
  audio.addEventListener("error", () => { status.textContent = "The recording could not load. Open its NASA source to listen there."; });
  return {
    pause() { audio.pause(); },
    dispose() { audio.pause(); audio.removeAttribute("src"); audio.load(); },
  };
}
