export const hiddenFacts = {
  curiosity: [
    { part: "mastcam", label: "Two eyes, two views", fact: "Curiosity's left Mastcam has a 34 mm wide-angle lens; its right Mastcam has a 100 mm telephoto lens.", source: "https://science.nasa.gov/resource/seventeen-cameras-on-curiosity/" },
    { part: "arm", label: "Rock flour", fact: "Before powdered rock enters Curiosity's laboratories, its sample-handling system can sieve out grains larger than 150 micrometers.", source: "https://science.nasa.gov/resource/preparing-samples-on-mars/" },
    { part: "power", label: "Warmth from the power source", fact: "Curiosity can use spare heat from its radioisotope generator to help keep systems warm in the Martian cold.", source: "https://science.nasa.gov/planetary-science/programs/radioisotope-power-systems/faq/" },
    { part: "mobility", label: "A message in the tracks", fact: "The holes in Curiosity's six wheels stamp JPL in Morse code into its tracks, which also helps the rover measure wheel slip.", source: "https://science.nasa.gov/resource/curiosity-tracks-its-tracks/" },
  ],
  ingenuity: [
    { part: "rotors", label: "A very fast spin", fact: "Ingenuity's two counter-rotating rotors could spin around 2,400 times each minute to push against Mars's thin air.", source: "https://science.nasa.gov/resource/mastcam-z-captures-ingenuitys-blades-spinning-2/" },
    { part: "solar", label: "A piece of flight history", fact: "Tucked beneath Ingenuity's solar panel was a tiny piece of fabric from the Wright brothers' 1903 aircraft.", source: "https://www.nasa.gov/podcasts/on-a-mission/flying-with-ingenuity-the-mars-helicopter-s4e7/" },
    { part: "fuselage", label: "Phone technology on Mars", fact: "Ingenuity mixed custom parts with off-the-shelf technology related to mobile phones inside its tissue-box-sized body.", source: "https://www.jpl.nasa.gov/news/press_kits/ingenuity/landing/mission/spacecraft/" },
    { part: "legs", label: "Just enough clearance", fact: "Four carbon-composite legs held Ingenuity's body only about 13 cm above a level Martian surface.", source: "https://www.jpl.nasa.gov/news/press_kits/ingenuity/landing/mission/spacecraft/" },
  ],
  webb: [
    { part: "primary", label: "Less gold than you think", fact: "The coating on all Webb's mirrors contains only about 50 grams of gold, roughly the mass of a golf ball.", source: "https://science.nasa.gov/mission/webb/science-overview/science-explainers/telescope-overview/" },
    { part: "secondary", label: "The small mirror in front", fact: "Webb's secondary mirror is about 0.74 meter wide and redirects light from the giant primary mirror toward its instruments.", source: "https://science.nasa.gov/mission/webb/webbs-mirrors/" },
    { part: "backplane", label: "A lighter giant", fact: "Webb's mirror has more than five times Hubble's collecting area, yet its low-density beryllium mirror is lighter.", source: "https://science.nasa.gov/mission/webb/science-overview/science-explainers/telescope-overview/" },
    { part: "sunshield", label: "Five nearly weightless layers", fact: "The inner sunshield layers are only 0.025 mm thick. Spaces between layers let heat radiate outward instead of crossing to the telescope.", source: "https://science.nasa.gov/mission/webb/webbs-sunshield/" },
  ],
  voyager: [
    { part: "record", label: "Pictures in a sound groove", fact: "The Golden Record carries 115 images, encoded as signals that can be reconstructed into pictures.", source: "https://science.nasa.gov/mission/voyager/voyager-1/" },
    { part: "stylus", label: "A cosmic playback speed", fact: "The cover's binary instructions specify one record rotation every 3.6 seconds: about 16⅔ revolutions per minute.", source: "https://science.nasa.gov/mission/voyager/golden-record-cover/" },
    { part: "image-code", label: "512 lines make a picture", fact: "A diagram on the cover shows how to assemble each recorded picture from 512 vertical lines.", source: "https://science.nasa.gov/mission/voyager/golden-record-cover/" },
    { part: "pulsars", label: "A clock on the cover", fact: "Alongside the pulsar map, a tiny uranium-238 spot acts as a slow radioactive clock that could reveal how long the record has traveled.", source: "https://science.nasa.gov/mission/voyager/golden-record-cover/" },
  ],
};

const STORAGE_KEY = "mission-alive-hidden-facts-v1";
const allKeys = new Set(Object.entries(hiddenFacts).flatMap(([id, facts]) => facts.map(({ part }) => `${id}:${part}`)));

export function loadHiddenFactKeys(storage = localStorage) {
  try {
    const saved = JSON.parse(storage.getItem(STORAGE_KEY) || "[]");
    return new Set(Array.isArray(saved) ? saved.filter((key) => allKeys.has(key)) : []);
  } catch { return new Set(); }
}

function save(keys, storage = localStorage) {
  try { storage.setItem(STORAGE_KEY, JSON.stringify([...keys])); } catch { /* The exhibit still works without storage. */ }
}

export function hiddenFactProgress(storage = localStorage) {
  const keys = loadHiddenFactKeys(storage);
  return { found: keys.size, total: allKeys.size, complete: keys.size === allKeys.size };
}

export function hiddenFactPassportMarkup(storage = localStorage) {
  const progress = hiddenFactProgress(storage);
  return `<div class="secret-passport ${progress.complete ? "is-earned" : ""}" aria-label="Researcher badge progress">
    <span class="secret-passport-icon" aria-hidden="true">${progress.complete ? "✦" : "◇"}</span>
    <div><strong>${progress.complete ? "Deep Space Researcher badge unlocked" : "Secret research badge"}</strong><small>Inspect machine parts to uncover ${progress.found} / ${progress.total} hidden facts. All 16 reveal a bonus badge.</small></div>
    <output>${progress.found} / ${progress.total}</output>
  </div>`;
}

export function mountHiddenFacts(root, id) {
  const facts = hiddenFacts[id] || [];
  let keys = loadHiddenFactKeys();
  let fallbackHint = false;
  root.innerHTML = `<section class="hidden-facts" aria-labelledby="hidden-facts-title"><div class="hidden-facts-heading"><div><p class="eyebrow">OPTIONAL DISCOVERY · RESEARCH CACHE</p><h2 id="hidden-facts-title">What is this machine hiding?</h2></div><output id="hidden-facts-count"></output></div><p>Inspect the numbered parts on the 3D model. Each part can reveal a fact that the main story did not tell you.</p><div class="hidden-fact-grid"></div><p id="hidden-facts-status" class="fine" role="status"></p></section>`;
  const grid = root.querySelector(".hidden-fact-grid");
  const status = root.querySelector("#hidden-facts-status");
  const count = root.querySelector("#hidden-facts-count");
  const draw = () => {
    count.textContent = `${facts.filter(({ part }) => keys.has(`${id}:${part}`)).length} / ${facts.length} FOUND`;
    grid.replaceChildren(...facts.map((fact, index) => {
      const found = keys.has(`${id}:${fact.part}`);
      const card = document.createElement("article");
      card.className = `hidden-fact-card${found ? " is-found" : ""}`;
      card.dataset.secretPart = fact.part;
      if (found) {
        const number = document.createElement("span");
        number.textContent = `0${index + 1} · DISCOVERED`;
        const title = document.createElement("h3");
        title.textContent = fact.label;
        const copy = document.createElement("p");
        copy.textContent = fact.fact;
        const link = document.createElement("a");
        link.href = fact.source;
        link.target = "_blank";
        link.rel = "noopener";
        link.textContent = "NASA source ↗";
        card.append(number, title, copy, link);
      } else {
        card.innerHTML = `<span>0${index + 1} · SEALED</span><strong>?</strong><p>Inspect a machine part to reveal this clue.</p>`;
      }
      return card;
    }));
  };
  draw();
  return {
    reveal(part) {
      fallbackHint = false;
      const fact = facts.find((item) => item.part === part);
      if (!fact) return false;
      const key = `${id}:${part}`;
      if (keys.has(key)) {
        status.textContent = `You already found “${fact.label}.”`;
        return false;
      }
      keys.add(key);
      save(keys);
      draw();
      const local = facts.filter((item) => keys.has(`${id}:${item.part}`)).length;
      const progress = hiddenFactProgress();
      status.textContent = progress.complete
        ? "All 16 clues found! Your Deep Space Researcher badge is now in the crew certification."
        : local === facts.length
          ? `All four ${id} clues found. ${progress.found} of 16 toward the bonus badge.`
          : `New clue unlocked: ${fact.label}. ${progress.found} of 16 found.`;
      return true;
    },
    enableFallback() {
      root.querySelector(".hidden-facts > p").textContent = "Inspect the numbered parts below to reveal the same NASA clues in 2D mode.";
      if (!status.textContent) { status.textContent = "In 2D mode, use the buttons below to inspect the same parts."; fallbackHint = true; }
      for (const [index, fact] of facts.entries()) {
        const card = grid.querySelector(`[data-secret-part="${fact.part}"]`);
        if (!card || keys.has(`${id}:${fact.part}`) || card.querySelector('[data-fallback-inspect]')) continue;
        const button = document.createElement("button");
        button.dataset.fallbackInspect = '';
        button.textContent = `Inspect part 0${index + 1}`;
        button.onclick = () => { this.reveal(fact.part); this.enableFallback(); };
        card.append(button);
      }
    },
    disableFallback() {
      root.querySelector('.hidden-facts > p').textContent = 'Inspect the numbered parts on the 3D model. Each part can reveal a fact that the main story did not tell you.';
      root.querySelectorAll('[data-fallback-inspect]').forEach(button => button.remove());
      if (fallbackHint) { status.textContent = ''; fallbackHint = false; }
    },
  };
}
