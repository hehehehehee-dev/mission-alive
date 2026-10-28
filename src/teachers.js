const guides = [
  {
    id: "curiosity",
    number: "01",
    name: "Curiosity — Roving Science Laboratory",
    hook: "Every move I make was planned on Earth hours ago. Then I go alone.",
    time: "10–12 min",
    action: "Explore the rover's instruments in 3D, then write a block program to reach an outcrop, drill, analyze the powder, and choose a report supported by the evidence. The final decision distinguishes possible habitability from a claim that life was found.",
    goals: [
      "Distinguish evidence of habitability from evidence of life (Curiosity found the first, not the second).",
      "Explain why rovers are programmed in advance instead of driven live (signal delay).",
      "Describe how the rover identifies, samples, and chemically analyzes rock.",
    ],
    science: "Gale Crater and its layered history · Mastcam imaging · drill sampling · SAM and CheMin onboard chemistry labs · radioisotope (nuclear) power and why it suits Mars · algorithms as sequenced commands with loops.",
    standards: "NGSS MS-ESS1-3 (analyze data to determine scale properties of solar system objects) · MS-ESS2-2 (evidence for how surface processes change a landscape over time — applied to Mars strata; see note in the standards map) · MS-ETS1-4 (iterative testing and modification of a design — the programming challenge).",
    misconception: "“Curiosity found aliens.” It did not. It found evidence that ancient Gale Crater had conditions suitable for microbial life — liquid water, chemistry, energy sources. Habitability ≠ inhabitants. Second misconception: “NASA drives it with a joystick.” Signal delay makes that impossible; engineers upload command sequences — exactly what students do in the challenge.",
    questions: [
      ["Before", "What would count as proof that a place could have supported life — without finding life itself?"],
      ["During", "Why can't engineers just drive Curiosity the way you'd drive a remote-control car?"],
      ["After", "Curiosity analyzed rock powder and found the ingredients for life. What did it not find — and why does that distinction matter to scientists?"],
    ],
    vocabulary: [
      ["Gale Crater", "the ancient impact crater Curiosity explores"],
      ["outcrop", "rock exposed at the surface"],
      ["sample", "material collected for testing"],
      ["habitability", "whether conditions could support life"],
      ["RTG", "nuclear power source that runs the rover day and night"],
    ],
    fast: "Curiosity's challenge lets you program up to 11 blocks. Find the shortest program that still completes the mission. What did the loops save you?",
  },
  {
    id: "ingenuity",
    number: "02",
    name: "Ingenuity — Mars Flight Demonstrator",
    hook: "I was built to attempt up to five flights. I flew seventy-two.",
    time: "8–10 min",
    action: "Choose an onboard flight controller, test the radio link, then choose a landing site, set rotor power, and simulate wind corrections. The flight log records what failed at touchdown so students can revise the next plan quickly.",
    goals: [
      "Explain why flying on Mars is hard despite weaker gravity (air ~1% as dense as Earth's — almost nothing for rotors to push against).",
      "Explain why Ingenuity had to fly itself autonomously (radio delay to Mars).",
      "Explain the value of a technology demonstration: Ingenuity was built to attempt up to 5 flights and completed 72.",
    ],
    science: "Lift and rotor speed in thin air · counter-rotating rotors canceling torque · autonomous flight vs. remote control · solar power and cold survival · how demo missions de-risk future ones (rotorcraft are now candidates for future Mars exploration).",
    standards: "NGSS MS-PS2-2 (change in motion depends on forces and mass — lift vs. gravity) · MS-ETS1-3 (analyze test data to identify improvements — 72 flights of iteration).",
    misconception: "“Lower gravity makes flying easy.” Gravity is not the hard part — the air is. Ingenuity's rotors spun many times faster than an Earth helicopter's just to bite into Mars's thin atmosphere. Second: “It sent photos back live.” Nothing from Mars is live; every command and image crosses minutes of delay.",
    questions: [
      ["Before", "Gravity on Mars is weaker than on Earth. So why would flying there be harder, not easier?"],
      ["During", "Ingenuity can't wait for instructions from Earth mid-flight. What does it have to decide on its own?"],
      ["After", "Engineers planned up to 5 demonstration flights and got 72. What does a demo that overperforms make possible next?"],
    ],
    vocabulary: [
      ["Jezero Crater", "Ingenuity's flying field on Mars"],
      ["demonstrator", "a test vehicle built to prove an idea works"],
      ["torque", "twisting force; opposite-spinning rotors cancel it"],
      ["autonomous", "deciding without outside control"],
      ["rotor", "the spinning blade that creates lift"],
    ],
    fast: "Ingenuity's final flight was January 18, 2024, after a rotor was damaged. If you were designing its successor, what one thing would you change — and what trade-off would that create?",
  },
  {
    id: "webb",
    number: "03",
    name: "Webb — Folding Space Observatory",
    hook: "My mirror is wider than the rocket that carried me. So I learned to fold.",
    time: "10 min",
    action: "Unfold Webb's two mirror wings, align three star images, then shift an illustrated scene from visible light toward infrared to reveal a region hidden by dust.",
    goals: [
      "Explain why Webb's mirror had to fold (6.5 m mirror, ~5 m rocket fairing) and what unfolding made possible.",
      "Distinguish deploying the mirror from aligning it — 18 segments behaving as one.",
      "Explain why Webb observes infrared light, and why distant galaxies appear shifted into it.",
    ],
    science: "Infrared astronomy and the expanding universe (redshift) · why looking far away is looking back in time · segmented mirrors and actuators (each segment moves in steps smaller than a wavelength of light) · the five-layer sunshield and why Webb must stay colder than −220 °C · launch packaging as an engineering constraint.",
    standards: "NGSS MS-PS4-2 (waves are reflected, absorbed, transmitted — mirrors and light) · MS-ETS1-4 (iterative alignment process) · supports HS-ESS1-2 discussions at the upper end (origin/expansion of the universe).",
    misconception: "“Webb sees like a camera.” It sees heat-light — infrared our eyes can't detect, which is why its images are assigned visible colors. Two more: “Webb replaced Hubble” (they observe different light and often work together), and the classic: “Looking at distant galaxies means looking back in time” — that one is true. Teach it: the light arriving now left billions of years ago.",
    questions: [
      ["Before", "Why would a telescope need to fold like origami — and what could go wrong?"],
      ["During", "Unfolding the mirror and aligning it are different jobs. What's the difference?"],
      ["After", "Webb's first sharp image took months of alignment. Why can't the segments just be built perfectly in the first place?"],
    ],
    vocabulary: [
      ["segment", "one of 18 hexagonal mirror pieces"],
      ["actuator", "a tiny motor that nudges a segment into place"],
      ["sunshield", "five layers that block heat from the Sun, Earth, and Moon"],
      ["infrared", "light just beyond red, invisible to eyes"],
      ["redshift", "distant galaxies' light stretched toward infrared as the universe expands"],
    ],
    fast: "A human hair is about 100,000 nanometers wide. Webb's segments were aligned to within a fraction of a wavelength of light. Find out how many nanometers that is — and compare.",
  },
  {
    id: "voyager",
    number: "04",
    name: "Voyager 1 — Interstellar Messenger",
    hook: "I am the farthest thing humans have ever made. When I whisper home, my voice takes almost a full day to arrive.",
    time: "10–12 min",
    action: "Explore the Golden Record, listen to one of its 55 greetings, and record or write a private greeting to earn the stamp. A microphone is optional. An optional signal lab compares the Moon, 1 AU, and Voyager 1 through one-way radio travel time and Moon-distance multiples, using JPL Horizons when available.",
    goals: [
      "Use astronomical units and light-time to describe solar-system scale (Voyager 1 is ~160+ AU away; its signal takes roughly a day, one way — the live number is on screen).",
      "Explain the Golden Record's purpose: a time capsule and message, designed to be playable by whoever finds it.",
      "Explain how the pulsar map encodes “where home is” for a finder who shares nothing with us.",
    ],
    science: "Scale of the solar system (AU, light-time) · the heliopause and interstellar space (crossed in 2012) · deep-space communication (the received signal is billions of times weaker than a digital watch battery, arriving ~24 h late) · finite power — Voyager's nuclear generators produce less power each year, so instruments are being switched off one by one · the Record: 55 languages, 90 minutes of music, 115 images.",
    standards: "NGSS MS-ESS1-3 (scale properties of the solar system — the strongest fit among these training modules) · MS-PS4-3 (digitized signals as a reliable way to encode and transmit information — the Record and deep-space link).",
    misconception: "“Voyager has left the solar system.” Depends on the definition — it crossed the heliopause in 2012 and is in interstellar space, but the Sun's gravity and the Oort cloud extend far beyond it. Second: “We can talk to Voyager like a phone call.” One-way light time is nearly a full day; a round trip takes almost two. Have students check the live number — it changes daily.",
    questions: [
      ["Before", "If you could send one sound into space, to be found a billion years from now, what would you choose?"],
      ["During", "The greetings are recorded in 55 languages. Why send so many — and what can a recording say that words on a page can't?"],
      ["After", "As Voyager's instruments gradually fall silent, the spacecraft will keep traveling for billions of years. What is it for, once it can no longer talk to us?"],
    ],
    vocabulary: [
      ["AU (astronomical unit)", "Earth's average distance from the Sun, ≈150 million km"],
      ["light-time", "how long a signal takes to travel a distance"],
      ["heliopause", "the boundary where the Sun's wind gives way to interstellar space"],
      ["interstellar", "between the stars"],
      ["pulsar map", "a diagram using flashing stars as landmarks to locate our Sun"],
    ],
    fast: "Voyager's distance on this page is live. Using its speed, calculate how much farther away it will be by your next birthday. Show your units.",
  },
];

function guideMarkup(guide) {
  return `<details class="exhibit-guide" id="teacher-${guide.id}">
    <summary><span>${guide.number}</span><span><small>${guide.time}</small><strong>${guide.name}</strong><em>“${guide.hook}”</em></span><b aria-hidden="true">+</b></summary>
    <div class="guide-body">
      <section><h3>What students do</h3><p>${guide.action}</p></section>
      <section><h3>Learning goals</h3><ol>${guide.goals.map((goal) => `<li>${goal}</li>`).join("")}</ol></section>
      <section><h3>Core science</h3><p>${guide.science}</p></section>
      <section><h3>Standards</h3><p>${guide.standards}</p></section>
      <aside class="misconception"><strong>MISCONCEPTION ALERT</strong><p>${guide.misconception}</p></aside>
      <section><h3>Discussion questions</h3><div class="question-grid">${guide.questions.map(([phase, question]) => `<p><strong>${phase}</strong>${question}</p>`).join("")}</div></section>
      <section><h3>Vocabulary</h3><dl class="vocabulary">${guide.vocabulary.map(([term, meaning]) => `<div><dt>${term}</dt><dd>${meaning}</dd></div>`).join("")}</dl></section>
      <aside class="fast-finisher"><strong>FAST FINISHERS</strong><p>“${guide.fast}”</p></aside>
    </div>
  </details>`;
}

const printableCards = [
  ["passport", "Crew Certification", "Four stamp boxes and one reflection prompt per machine."],
  ["kwl", "Pre-Visit KWL", "Know, Want to know, and Learned prompts for all four machines."],
  ["exit", "Exit Tickets", "Four half-page tickets with exhibit reflection and a 3-2-1 check."],
  ["quiz", "Mission Quiz", "Ten multiple-choice questions plus a separate teacher answer key."],
  ["writing", "Write Like a Machine", "A first-person machine diary worksheet with ELA prompts."],
];

function printableResources() {
  return `<div class="print-resource" data-resource="passport">
    <div class="print-title"><span>MISSION ALIVE</span><h1>Crew Certification</h1><p>Name ______________________________ &nbsp; Class __________ &nbsp; Date __________</p></div>
    <div class="paper-passport">
      ${guides.map((guide) => `<section><span>${guide.number}</span><h2>${guide.name.split(" — ")[0]}</h2><blockquote>“${guide.hook}”</blockquote><div class="paper-stamp">STAMP OR CHECK</div><p>One thing this machine taught me:</p><div class="writing-lines"></div><div class="writing-lines"></div></section>`).join("")}
    </div><footer>4 / 4 STAMPS = CERTIFIED CREW</footer>
  </div>
  <div class="print-resource" data-resource="kwl">
    <div class="print-title"><span>MISSION ALIVE</span><h1>Pre-Visit KWL</h1><p>Name ______________________________ &nbsp; Class __________ &nbsp; Date __________</p></div>
    <p>Before training, write what you already know and what you want to learn. Return afterward to complete the last column.</p>
    <table class="kwl-table"><thead><tr><th>Machine</th><th>What I know</th><th>What I want to know</th><th>What I learned</th></tr></thead><tbody>${guides.map((guide) => `<tr><th>${guide.name.split(" — ")[0]}</th><td></td><td></td><td></td></tr>`).join("")}</tbody></table>
  </div>
  <div class="print-resource" data-resource="exit">
    ${[0, 2].map((start) => `<div class="exit-ticket-sheet"><div class="print-title"><span>MISSION ALIVE</span><h1>Exit Tickets</h1><p>Cut into two half-page tickets. Give each learner the exhibit they explored.</p></div><div class="exit-ticket-grid">${guides.slice(start, start + 2).map((guide) => `<section><h2>${guide.name.split(" — ")[0]}</h2><p><strong>AFTER</strong> ${guide.questions[2][1]}</p><p><strong>3</strong> facts I learned</p><div class="writing-lines"></div><p><strong>2</strong> questions I still have</p><div class="writing-lines"></div><p><strong>1</strong> machine I would want to meet, and why</p><div class="writing-lines"></div></section>`).join("")}</div></div>`).join("")}
  </div>
  <div class="print-resource" data-resource="quiz">
    <div class="print-title"><span>MISSION ALIVE</span><h1>Mission Quiz</h1><p>Name ______________________________ &nbsp; Class __________ &nbsp; Date __________</p></div>
    <ol class="mission-quiz">
      <li>What did Curiosity find in Gale Crater?<ol type="A"><li>Living aliens</li><li>Conditions that could once support microbial life</li><li>A working spacecraft</li><li>Plants</li></ol></li>
      <li>Why do engineers upload command sequences to Curiosity?<ol type="A"><li>It has no wheels</li><li>Its camera is broken</li><li>Signal delay prevents live joystick driving</li><li>Mars has no gravity</li></ol></li>
      <li>Why is flight difficult on Mars?<ol type="A"><li>The atmosphere is very thin</li><li>Gravity is stronger</li><li>There is no sunlight</li><li>Rotors cannot turn</li></ol></li>
      <li>Ingenuity was designed for five flights. How many did it complete?<ol type="A"><li>5</li><li>18</li><li>55</li><li>72</li></ol></li>
      <li>Why did Webb's primary mirror fold?<ol type="A"><li>To block radio signals</li><li>It was wider than the rocket fairing</li><li>To make visible light</li><li>It broke before launch</li></ol></li>
      <li>How many mirror segments must act as one on Webb?<ol type="A"><li>3</li><li>5</li><li>18</li><li>72</li></ol></li>
      <li>What kind of light does Webb observe?<ol type="A"><li>Only ultraviolet</li><li>Infrared</li><li>Only visible green</li><li>Radio only</li></ol></li>
      <li>How many languages are represented in the Golden Record greetings?<ol type="A"><li>4</li><li>18</li><li>55</li><li>115</li></ol></li>
      <li>What does Voyager's pulsar map help describe?<ol type="A"><li>How to fly on Mars</li><li>Where our Sun is located</li><li>How to align Webb</li><li>Where Curiosity drilled</li></ol></li>
      <li>What boundary did Voyager 1 cross in 2012?<ol type="A"><li>The heliopause</li><li>Mars's atmosphere</li><li>Earth's Moon</li><li>Webb's orbit</li></ol></li>
    </ol>
    <section class="answer-key"><div class="print-title"><span>TEACHER COPY</span><h1>Mission Quiz Answer Key</h1></div><ol><li><strong>B.</strong> Conditions that could once support microbial life.</li><li><strong>C.</strong> Signal delay prevents live joystick driving.</li><li><strong>A.</strong> The atmosphere is very thin.</li><li><strong>D.</strong> 72 flights.</li><li><strong>B.</strong> It was wider than the rocket fairing.</li><li><strong>C.</strong> 18 mirror segments.</li><li><strong>B.</strong> Infrared light.</li><li><strong>C.</strong> 55 languages.</li><li><strong>B.</strong> Where our Sun is located.</li><li><strong>A.</strong> The heliopause.</li></ol></section>
  </div>
  <div class="print-resource" data-resource="writing">
    <div class="print-title"><span>MISSION ALIVE · ELA</span><h1>Write Like a Machine</h1><p>Name ______________________________ &nbsp; Class __________ &nbsp; Date __________</p></div>
    <p class="worksheet-lead">Choose one machine. Write its diary entry for the most important day of its life, in first person.</p>
    <fieldset><legend>1 · Choose your voice</legend>${guides.map((guide) => `<label>□ ${guide.name.split(" — ")[0]}</label>`).join("")}</fieldset>
    <fieldset><legend>2 · Plan the moment</legend><p>The day I chose: __________________________________________________________________</p><p>The hardest thing was: _____________________________________________________________</p><p>I sensed or discovered: ____________________________________________________________</p><p>This mattered because: _____________________________________________________________</p></fieldset>
    <fieldset><legend>3 · Begin in first person</legend><p><strong>My name is ____________________. I am ____________________. Today, I ____________________.</strong></p></fieldset>
    <div class="diary-lines">${Array.from({ length: 10 }, () => "<i></i>").join("")}</div>
    <p class="fine-print"><strong>Check before submitting:</strong> I stayed in first person · I used two accurate facts from the exhibit · I described a feeling, choice, or reflection beyond the facts.</p>
  </div>`;
}

export function teacherPageMarkup() {
  return `<div class="teachers-hero">
    <p class="eyebrow">FOR TEACHERS · CLASSROOM GUIDE</p>
    <h1 id="teachers-title">Bring four NASA machines<br><em>into your classroom.</em></h1>
    <p>Mission Alive is a free, browser-based interactive space academy where Curiosity, Ingenuity, Webb, and Voyager 1 tell their own stories — and your students help finish their missions.</p>
    <div class="teachers-actions"><button class="primary" data-enter-museum>Enter the academy</button><button class="secondary" data-print-resource="all">Print the teacher pack ↓</button></div>
    <ul class="teacher-trust" aria-label="At a glance"><li>Ages 10–14</li><li>Grades 5–9</li><li>Full visit ≈ one class period</li><li>No accounts</li><li>Private by default</li></ul>
  </div>

  <section class="teacher-section teacher-glance" aria-labelledby="glance-title"><div class="teacher-section-heading"><p class="eyebrow">60-SECOND FIT CHECK</p><h2 id="glance-title">At a glance</h2></div><dl>
    <div><dt>Full visit</dt><dd>40–50 minutes (one class period)</dd></div><div><dt>Single exhibit</dt><dd>8–12 minutes — assign one as homework or a bell-ringer</dd></div><div><dt>Devices</dt><dd>Any modern browser. Works on school Chromebooks and tablets; also runs whole-class from one projector</dd></div><div><dt>Cost</dt><dd>Free</dd></div><div><dt>Accounts</dt><dd>None — for teachers or students</dd></div><div><dt>Student data</dt><dd>No server collection by default. Certification stamps and private greetings stay on the device. Students can explicitly submit a greeting to a classroom record; the teacher must approve it before public listening.</dd></div><div><dt>Internet</dt><dd>Needed for live Voyager distance and classroom records</dd></div><div><dt>Reading level</dt><dd>Written for ages 10–14; every exhibit opens with the machine speaking in first person</dd></div>
  </dl></section>

  <section class="teacher-section" aria-labelledby="modes-title"><div class="teacher-section-heading"><p class="eyebrow">FLEXIBLE BY DESIGN</p><h2 id="modes-title">Four ways to run the visit</h2></div><div class="classroom-modes">
    <article><span>MODE A · 35–45 MIN</span><h3>Whole-class guided visit</h3><p>You drive, the class decides. At each challenge — Curiosity's driving program, Ingenuity's preflight checklist, Webb's alignment, Voyager's record — take a class vote before acting. Best for introducing a new unit.</p></article>
    <article><span>MODE B · 40–50 MIN</span><h3>Self-paced exploration</h3><p>Students explore in any order and collect all four certification stamps. You circulate with the discussion questions below. Students who finish early get the extension prompts.</p></article>
    <article><span>MODE C · 4 × ~10 MIN</span><h3>Station rotation</h3><p>Four groups, four devices, one exhibit per station. At each rotation, the group must earn the stamp before moving on. The printable certification sheet tracks it on paper if devices are shared.</p></article>
    <article><span>MODE D · 15–20 MIN</span><h3>Flipped or homework</h3><p>Assign one exhibit plus its reflection question the night before a lesson. Start the lesson with the “After” discussion questions. Works because each exhibit is self-contained.</p></article>
  </div></section>

  <section class="teacher-section" aria-labelledby="flow-title"><div class="teacher-section-heading"><p class="eyebrow">ONE-CLASS FLOW</p><h2 id="flow-title">Before · During · After</h2></div><div class="visit-flow">
    <article><span>01 · 5 MIN</span><h3>Before</h3><p>Print the certification worksheet. Pick one exhibit and ask its “Before” question cold — no wrong answers, you're surfacing what students think they know. Optional: KWL chart (Know / Want to know / Learned).</p></article>
    <article><span>02 · EXPLORE</span><h3>During</h3><p>Students earn certification stamps by completing each exhibit's mission challenge. Your checkpoints: the misconceptions in the exhibit guides — listen for them as students talk, they're the teachable moments.</p></article>
    <article><span>03 · 10 MIN</span><h3>After</h3><p>3-2-1 exit ticket: <strong>3</strong> facts you learned, <strong>2</strong> questions you still have, <strong>1</strong> machine you'd want to meet. Then one “After” discussion question as a whole class.</p></article>
  </div></section>

  <section class="teacher-section" aria-labelledby="guides-title"><div class="teacher-section-heading"><p class="eyebrow">EXHIBIT-BY-EXHIBIT</p><h2 id="guides-title">Teaching guides</h2><p>Open a guide for its hook, goals, core science, standards, misconception checks, discussion prompts, vocabulary, and a fast-finisher task.</p></div><div class="exhibit-guides">${guides.map(guideMarkup).join("")}</div></section>

  <section class="teacher-section" aria-labelledby="classroom-record-title"><div class="teacher-section-heading"><p class="eyebrow">A YEAR-LONG TIME CAPSULE</p><h2 id="classroom-record-title">Make a Golden Record for your class</h2><p>In Voyager's recording studio, create a record named for your class. Give students the 12-character class code. They can add a short audio or written greeting in their home language, plus an English translation. You review each one before it appears in the public classroom gallery. Revisit the record at the end of the year and compare how far each greeting would have traveled at Voyager 1's speed.</p><p>Save your private teacher key outside the browser; the class code alone cannot approve submissions. Students need no account, and a microphone is optional. Use a class title and nicknames that do not identify students.</p><a class="primary teacher-class-link" href="/#voyager">Open Voyager's classroom studio →</a></div></section>

  <section class="teacher-section" aria-labelledby="printables-title"><div class="teacher-section-heading"><p class="eyebrow">ZERO-PREP HANDOUTS</p><h2 id="printables-title">Printable resources</h2><p>Print the complete pack or choose one resource. Print layouts use clean black text on white paper.</p></div><div class="printable-cards">${printableCards.map(([id, name, description], index) => `<article><span>0${index + 1}</span><h3>${name}</h3><p>${description}</p><button data-print-resource="${id}">Print ${name}</button></article>`).join("")}</div></section>

  <section class="teacher-section teacher-two-column"><div><div class="teacher-section-heading"><p class="eyebrow">CHECK UNDERSTANDING</p><h2>Assessment ideas</h2></div><ul class="teacher-list"><li><strong>3-2-1 exit ticket</strong> — fastest formative check; scan for the exhibit-guide misconceptions.</li><li><strong>Claim–Evidence–Reasoning paragraph:</strong> “Pick one machine. Make a claim about what it taught humanity. Support it with two facts from its exhibit.” Example stem: “Ingenuity had to fly itself because ___; we know this because ___.”</li><li><strong>Mini-poster: Adopt a Machine</strong> — student pairs produce a one-page “mission profile” for their machine: name, mission, hardest moment, one number that matters (distance, flight count, mirror size…), drawn or printed image.</li><li><strong>Quick rubric (optional, for the write-up):</strong> Accuracy of two facts (from the exhibit) · Habitability-vs-life / delay / scale distinction used correctly · First-person voice sustained · One reflection beyond the facts.</li></ul></div>
  <div><div class="teacher-section-heading"><p class="eyebrow">GO FURTHER</p><h2>Extension activities</h2></div><ol class="teacher-list"><li><strong>Design the 5th exhibit.</strong> Which machine deserves the next gallery — Perseverance? Europa Clipper? Hubble? Students pitch: hook sentence, the challenge trainees would play, the one fact nobody forgets.</li><li><strong>Record your own Golden Record.</strong> 60 seconds of audio per class: a greeting, a sound of your school, one song. Discuss: what did you leave out, and why? (Pairs with Voyager's 55 languages.)</li><li><strong>Light-time math.</strong> Using the live Voyager number on screen and the speed of light (299,792 km/s), compute one-way signal time. Then: how long would a signal take to reach Voyager 2? New Horizons? The nearest star? (Ratios & proportional reasoning.)</li><li><strong>The engineers' constraint.</strong> Each exhibit hides one hard constraint (delay, thin air, rocket size, power). Students write the “constraint card” for a machine of their choice: <em>The hard thing was… so the engineers…</em></li></ol></div></section>

  <section class="teacher-section" aria-labelledby="standards-title"><div class="teacher-section-heading"><p class="eyebrow">LESSON PLANNING</p><h2 id="standards-title">Standards map</h2></div><div class="standards-scroll"><table class="standards-table"><thead><tr><th>Exhibit</th><th>NGSS</th><th>Also supports</th></tr></thead><tbody><tr><th>Curiosity</th><td>MS-ESS1-3 (scale properties) · MS-ETS1-4 (iterative design)</td><td>MS-ESS2-2 by analogy (reading surface history — taught on Mars strata; the standard is Earth-framed, the thinking transfers)</td></tr><tr><th>Ingenuity</th><td>MS-PS2-2 (forces & motion) · MS-ETS1-3 (test data → improvement)</td><td>Engineering design (MS-ETS1-1) — defining the flight problem</td></tr><tr><th>Webb</th><td>MS-PS4-2 (reflection of waves) · MS-ETS1-4</td><td>HS-ESS1-2 at upper end (universe's expansion, redshift)</td></tr><tr><th>Voyager 1</th><td>MS-ESS1-3 (solar-system scale — strongest fit) · MS-PS4-3 (digitized signals)</td><td>CCSS Math 6.RP/7.RP (light-time ratios) · ELA W.6-8.3 (narrative writing, Write Like a Machine)</td></tr></tbody></table></div><p class="standards-note">Alignments are provided as a starting point for lesson planning; verify against your state's adopted standards.</p></section>

  <section class="teacher-section teacher-two-column"><div><div class="teacher-section-heading"><p class="eyebrow">ACCESS FOR EVERY LEARNER</p><h2>Accessibility & tech</h2></div><ul class="teacher-list"><li>Full keyboard navigation — every exhibit and challenge can be completed without a mouse.</li><li><em>Reduce motion</em> toggle and <em>2D view</em> fallback, both reachable from the footer.</li><li>Works with shared devices: no login, progress lives in the crew certification on the student's device.</li><li>Golden Record greetings are listed with language names and translations. No microphone is required: a student can write a greeting to complete Voyager.</li><li>Use a current Chrome, Edge, Safari, or Firefox browser. Internet is needed for Voyager's live JPL distance.</li><li>Clearing browser data resets stamps; use the printable certification sheet if that matters for grading.</li></ul></div>
  <div><div class="teacher-section-heading"><p class="eyebrow">PRIVACY & SAFETY</p><h2>Built for school devices</h2></div><ul class="teacher-list"><li>No accounts, sign-ups, required names, or emails — for students or teachers.</li><li>Crew certification progress never leaves the device. A personal greeting stays private until someone explicitly submits it to a classroom record. After a teacher approves it, anyone online can find it in the classroom gallery. Use nicknames and class titles that do not identify students.</li><li>No ads, chat, or external social embeds inside exhibits.</li><li>Science claims link to NASA/JPL sources in each exhibit and the Field notes panel.</li></ul></div></section>

  <section class="teacher-section" aria-labelledby="faq-title"><div class="teacher-section-heading"><p class="eyebrow">COMMON QUESTIONS</p><h2 id="faq-title">FAQ</h2></div><div class="teacher-faq">
    <details><summary>Does it cost anything?</summary><p>No. It's free, and it stays on the open web.</p></details>
    <details><summary>Do my students need accounts?</summary><p>No. They open the page and walk in. That's deliberate — it works on locked-down school devices.</p></details>
    <details><summary>How long is a visit?</summary><p>One class period for all four exhibits (40–50 min). A single exhibit takes 8–12 minutes and stands alone — assign one as homework or a warm-up.</p></details>
    <details><summary>Can I assign just one exhibit?</summary><p>Yes. Each exhibit ends with its own reflection question and stamp. Start with Curiosity for the fullest story arc, or Voyager 1 if you're teaching scale and distance.</p></details>
    <details><summary>A student lost their stamps. What now?</summary><p>Progress lives in the browser on that device. If browser data was cleared, the printable certification sheet is the backup record — or have them re-earn the stamp; each exhibit is replayable.</p></details>
    <details><summary>Can students take something home?</summary><p>Yes. After collecting all four stamps, they can enter a name and print a one-page Mission Alive Graduate certificate. The name stays in the browser and is not uploaded.</p></details>
    <details><summary>Does it work on our Chromebooks?</summary><p>Yes — it's a web page, no installs. It also runs whole-class from one computer and a projector.</p></details>
    <details><summary>Where does the science come from?</summary><p>Each exhibit cites NASA/JPL sources in its mission archive and Field notes. Voyager's distance is live from JPL's Horizons system.</p></details>
  </div></section>
  <div class="teacher-final-cta"><p class="eyebrow">READY WHEN YOUR CLASS IS</p><h2>Four machines. One class period.</h2><div class="teachers-actions"><button class="primary" data-enter-museum>Enter the academy</button><button data-print-resource="all">Print the teacher pack ↓</button></div></div>
  <div class="print-resources" aria-hidden="true">${printableResources()}</div>`;
}

export function mountTeacherPage(container, { onEnterMuseum }) {
  const printTarget = new URLSearchParams(location.search).get("print");
  if (["all", ...printableCards.map(([id]) => id)].includes(printTarget))
    document.body.dataset.printResource = printTarget;
  container.querySelectorAll("[data-enter-museum]").forEach((button) => {
    button.addEventListener("click", onEnterMuseum);
  });
  container.querySelectorAll("[data-print-resource]").forEach((button) => {
    button.addEventListener("click", () => {
      document.body.dataset.printResource = button.dataset.printResource;
      window.print();
    });
  });
  window.addEventListener("afterprint", () => {
    delete document.body.dataset.printResource;
  });
}
