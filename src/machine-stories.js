// First-person mission narration based on the NASA sources linked in each chapter.
export const machineStories = {
  curiosity: [
    {
      label: "MY QUESTION",
      marker: "2012 · GALE CRATER",
      title: "Could Mars ever have been a home?",
      voice: "I landed in Gale Crater with a question: could ancient Mars have supported tiny microbes? Cameras, a drill, and two laboratories came with me so I could read the clues locked inside rock.",
      source: "https://science.nasa.gov/mission/msl-curiosity/science/",
      sourceLabel: "NASA · Curiosity's science goals",
    },
    {
      label: "MY WORK",
      marker: "ROCK BY ROCK",
      title: "I turned stone into evidence.",
      voice: "I photographed layered outcrops, chose places to drill, and delivered powdered rock to SAM and CheMin inside my body. Each sample helped my team reconstruct the changing water and chemistry of Gale Crater.",
      source: "https://science.nasa.gov/mission/msl-curiosity/science-highlights/",
      sourceLabel: "NASA · Curiosity science highlights",
    },
    {
      label: "THE SURPRISE",
      marker: "AN ANCIENT STREAM",
      title: "The dry ground remembered water.",
      voice: "Soon after landing, I found smooth pebbles shaped by an ancient stream. Later, rock layers pointed to long-lived lakes, and my samples revealed organic molecules. Mars had a wetter past than its dusty surface suggests.",
      source: "https://science.nasa.gov/mission/msl-curiosity/science-highlights/",
      sourceLabel: "NASA · Water and organic molecules",
    },
    {
      label: "WHAT IT MEANS",
      marker: "THE CAREFUL CLAIM",
      title: "A possible home is not a living neighbor.",
      voice: "My evidence shows that parts of ancient Mars could have supported microbial life. It does not prove that life was there. When you finish my mission, make the same careful choice between a clue and a conclusion.",
      source: "https://science.nasa.gov/mission/msl-curiosity/science/",
      sourceLabel: "NASA · Evidence of habitability",
    },
  ],
  ingenuity: [
    {
      label: "MY QUESTION",
      marker: "2021 · JEZERO CRATER",
      title: "Could anything fly here?",
      voice: "I traveled beneath the Perseverance rover to test a daring idea: powered flight on another world. Mars has less than one percent of Earth's air density near the ground, so my blades had very little air to push against.",
      source: "https://science.nasa.gov/mission/mars-2020-perseverance/ingenuity-mars-helicopter/",
      sourceLabel: "NASA · Ingenuity mission",
    },
    {
      label: "MY FIRST",
      marker: "APR 19, 2021",
      title: "I lifted off another planet.",
      voice: "My first flight made me the first aircraft to achieve powered, controlled flight on another planet. A message from Earth takes minutes to arrive, so my onboard computer had to make fast corrections while I was in the air.",
      source: "https://science.nasa.gov/resource/nasas-ingenuity-mars-helicopter-successfully-completes-first-flight-2/",
      sourceLabel: "NASA · First flight on Mars",
    },
    {
      label: "THE SURPRISE",
      marker: "5 PLANNED · 72 FLOWN",
      title: "The experiment kept going.",
      voice: "My team planned up to five test flights. I completed 72. After proving flight was possible, I even scouted terrain that could help the Perseverance team plan where to explore next.",
      source: "https://science.nasa.gov/mission/mars-2020-perseverance/ingenuity-mars-helicopter/",
      sourceLabel: "NASA · Ingenuity's 72 flights",
    },
    {
      label: "MY LEGACY",
      marker: "JAN 2024 · FINAL FLIGHT",
      title: "One last test still taught us something.",
      voice: "Rotor damage ended my flying after flight 72. The data from all those attempts now helps engineers imagine future Mars aircraft. In your flight log, a failed landing is a clue for the next design.",
      source: "https://science.nasa.gov/resource/mars-report-the-most-extreme-flights-of-nasas-ingenuity-mars-helicopter/",
      sourceLabel: "NASA · Final flight and lessons",
    },
  ],
  webb: [
    {
      label: "MY PURPOSE",
      marker: "INFRARED EYES",
      title: "I collect light your eyes cannot see.",
      voice: "I was built to gather faint infrared light from faraway galaxies and to look into dusty places where stars are forming. The farther that light traveled, the earlier the universe was when it set out.",
      source: "https://science.nasa.gov/mission/webb/fact-sheet/",
      sourceLabel: "NASA · Webb fact sheet",
    },
    {
      label: "THE PROBLEM",
      marker: "FOLDED FOR LAUNCH",
      title: "My mirror was too big for my rocket.",
      voice: "My main mirror is 6.5 meters wide. Engineers split it into 18 segments and folded its wings for launch. In space, my mirror and sunshield unfolded before the careful work of focusing could begin.",
      source: "https://science.nasa.gov/mission/webb/webbs-mirrors/",
      sourceLabel: "NASA · Webb's mirrors",
    },
    {
      label: "THE SURPRISE",
      marker: "ONE STAR · 18 IMAGES",
      title: "My first star appeared eighteen times.",
      voice: "At first, each mirror segment made its own blurry image of the same star. The team found all 18 points of light, then nudged my mirrors until their images came together. A strange-looking picture was the map to a sharp one.",
      source: "https://science.nasa.gov/blogs/webb/2022/02/11/photons-received-webb-sees-its-first-star-18-times/",
      sourceLabel: "NASA · Webb sees one star 18 times",
    },
    {
      label: "WHAT I REVEAL",
      marker: "BEHIND THE DUST",
      title: "A hidden place came into view.",
      voice: "With infrared light, I revealed parts of the Cosmic Cliffs where new stars were forming behind dust. In my challenge, you will focus scattered light, then uncover a glow that visible light misses.",
      source: "https://science.nasa.gov/universe/nebulae/nasas-webb-reveals-cosmic-cliffs-glittering-landscape-of-star-birth/",
      sourceLabel: "NASA · Webb's Cosmic Cliffs",
    },
  ],
  voyager: [
    {
      label: "MY ASSIGNMENT",
      marker: "1977 · DEPARTURE",
      title: "I left to meet two giant planets.",
      voice: "I launched in 1977 to fly past Jupiter and Saturn. My cameras and instruments would examine worlds that had been little more than distant points of light from Earth.",
      source: "https://science.nasa.gov/mission/voyager/voyager-1/",
      sourceLabel: "NASA · Voyager 1 mission",
    },
    {
      label: "WHAT I FOUND",
      marker: "JUPITER · SATURN",
      title: "The giants held surprises.",
      voice: "At Jupiter I found a faint ring and two new moons. At Saturn I found five more moons and another ring. Every flyby made the outer solar system more complicated—and more interesting—than it had looked from home.",
      source: "https://science.nasa.gov/mission/voyager/voyager-1/",
      sourceLabel: "NASA · Voyager's discoveries",
    },
    {
      label: "THE SURPRISE",
      marker: "1990 · PALE BLUE DOT",
      title: "I looked back toward home.",
      voice: "Before my cameras were switched off, I looked back and photographed Earth. From so far away, our whole world was only a pale blue dot. That tiny point was everyone I had ever left behind.",
      source: "https://science.nasa.gov/mission/voyager/voyager-1s-pale-blue-dot/",
      sourceLabel: "NASA · The Pale Blue Dot",
    },
    {
      label: "WHAT I CARRY",
      marker: "2012 · INTERSTELLAR SPACE",
      title: "My journey became a message.",
      voice: "I crossed the heliopause into interstellar space in 2012. I still carry Earth's Golden Record: images, music, natural sounds, and greetings in 55 languages. Even if nobody ever finds it, it tells a story about us.",
      source: "https://science.nasa.gov/mission/voyager/voyager-1/",
      sourceLabel: "NASA · Voyager 1 and its record",
    },
  ],
};

export function mountMachineStory(root, id, { reducedMotion = false } = {}) {
  const chapters = machineStories[id];
  if (!root || !chapters) return;
  root.innerHTML = `
    <div class="machine-story-heading">
      <p class="eyebrow">THE MACHINE'S STORY · FOUR CHAPTERS</p>
      <h2 id="machine-story-title">Before you take control, hear what happened.</h2>
      <p>A first-person retelling of NASA mission facts. Choose a chapter or follow the journey in order.</p>
    </div>
    <div class="machine-story-reader">
      <div class="story-chapters" role="group" aria-label="Choose a story chapter">
        ${chapters.map((chapter, index) => `<button type="button" data-story-step="${index}" aria-pressed="false"><small>0${index + 1}</small><span>${chapter.label}</span></button>`).join("")}
      </div>
      <article class="story-chapter" aria-live="polite">
        <div class="story-chapter-top"><span id="story-marker"></span><output id="story-count"></output></div>
        <h3 id="story-chapter-title"></h3>
        <p id="story-chapter-voice"></p>
        <a id="story-chapter-source" target="_blank" rel="noopener"></a>
      </article>
      <div class="story-progress" aria-hidden="true"><i id="story-progress-fill"></i></div>
      <div class="story-controls"><button type="button" id="story-previous">← Previous</button><button type="button" id="story-next">Next chapter →</button></div>
    </div>`;
  let current = 0;
  const buttons = [...root.querySelectorAll("[data-story-step]")];
  const show = (index) => {
    current = Math.max(0, Math.min(chapters.length - 1, index));
    const chapter = chapters[current];
    root.querySelector("#story-marker").textContent = chapter.marker;
    root.querySelector("#story-count").textContent = `0${current + 1} / 0${chapters.length}`;
    root.querySelector("#story-chapter-title").textContent = chapter.title;
    root.querySelector("#story-chapter-voice").textContent = `“${chapter.voice}”`;
    const source = root.querySelector("#story-chapter-source");
    source.href = chapter.source;
    source.textContent = `${chapter.sourceLabel} ↗`;
    root.querySelector("#story-progress-fill").style.width = `${((current + 1) / chapters.length) * 100}%`;
    buttons.forEach((button, step) => button.setAttribute("aria-pressed", String(step === current)));
    root.querySelector("#story-previous").disabled = current === 0;
    root.querySelector("#story-next").textContent = current === chapters.length - 1
      ? "Continue to mission science ↓"
      : "Next chapter →";
  };
  buttons.forEach((button) => {
    button.onclick = () => show(Number(button.dataset.storyStep));
  });
  root.querySelector("#story-previous").onclick = () => show(current - 1);
  root.querySelector("#story-next").onclick = () => {
    if (current < chapters.length - 1) show(current + 1);
    else {
      const briefing = document.querySelector("#briefing");
      const disclosure = briefing?.closest("details");
      if (disclosure) disclosure.open = true;
      briefing?.scrollIntoView({
        behavior: reducedMotion ? "instant" : "smooth",
        block: "start",
      });
    }
  };
  show(0);
}
