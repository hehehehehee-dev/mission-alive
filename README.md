# Mission Alive — practice prototype

A static, interactive space academy for learners aged 10–14. Its crew briefing introduces four training modules: Curiosity, Ingenuity, Webb, and Voyager 1. The machines cannot come home, so they teach where they rest.

**Training prototype — not the hackathon submission.** This was created before checking the final competition brief. Do not represent it as work completed during the event. Verify the official challenge, required datasets, prior-work rules, and AI disclosure requirements before adapting it for a submission.

## Run

Requires Node.js 20.19+ or 22.12+.

```sh
npm install
npm run dev
```

Open the local URL printed by Vite.

```sh
npm test
npm run build
```

For the complete Netlify experience, deploy the project source so Netlify builds both `dist` and the Voyager distance function. See `NETLIFY_DEPLOY.md`. A static-only upload of `dist` still runs the academy, but the live JPL counter stays in offline fallback mode. Navigation uses URL hashes, so exhibit links do not require server-side routing.

## The experience

- Cinematic mission atmosphere: every destination has a distinct NASA backdrop—galaxies for the lobby, a Curiosity panorama, Ingenuity's aerial view of Mars, Webb's deep field, and a Voyager heliosphere visualization. Projected 3D stars, drifting light, parallax, and occasional meteors remain above those images. The 1.6 MB Voyager film loads only in its exhibit, pauses off-screen, and yields to a still for data-saver or reduced-motion settings.
- Crew briefing and certification: the lobby introduces four training modules. Completing a challenge presents a large native stamp button. The visitor presses it; after 750ms the ink settles and the existing 0/4–4/4 meter advances. Reduced motion uses a fade. Old stamps remain valid; replaying a completed module says “Already stamped” without awarding again. The `mission-alive-passport-v2` storage key is unchanged.
- Graduation: the fourth new stamp opens `TRAINING COMPLETE` after time to read the completion story, transmission and gift, or immediately through the completion button. The finale keeps its journey recap, three factual crew profiles, close, Escape, reduced-motion and Finish controls.
- Certificate: the existing name, date, four-stamp certificate remains printable after completion. No additional personalized patch system was added.
- For Teachers: the standalone `/teachers` route gives a 60-second fit check, four classroom modes, a Before/During/After lesson flow, detailed exhibit guides, NGSS mappings, misconception checks, assessment and extension ideas, accessibility/privacy guidance, and a native FAQ. Five print layouts provide crew certification, a KWL chart, four exit tickets, a 10-question quiz with answer key, and a first-person “Write Like a Machine” worksheet.
- Challenge-first flow: every module opens with the machine's voice and objective, followed by the challenge. Two background beats and the science brief remain in closed reading sections. After stamping, every player sees the machine's “Still out there” beat, first-person transmission and gift in order, even without opening a reading toggle. First failures use one short virtue line; subsequent failures give practical instructions.
- Machine anatomy hotspots: numbered markers stay attached to major components as the 3D camera moves. Selecting a marker or its keyboard-friendly dock entry opens a concise function card and an official NASA/JPL source. Voyager anatomy selections automatically switch between the playable record and its engraved protective cover when needed.
- Curiosity: switch between a Scratch-inspired Mars science plan and Free Explore. Program the rover to avoid hazards, drill a sedimentary outcrop, analyze powdered rock with SAM and CheMin, and park at an uplink site within an 11-block limit. Free Explore provides touch controls and WASD/arrow-key driving across a wider crater, plus a three-step Mastcam, drilling, and uplink field mission. Complete either route, then choose the evidence-supported habitability claim to earn the stamp. A rover-integrity meter makes collisions with clearly visible large rocks matter; staying pressed against the same rock counts as one impact. A separate “What Curiosity actually saw” tab loads a current selection from NASA’s Image and Video Library, with curated NASA images as a network fallback and a link to the mission’s full raw-image archive.
- Ingenuity: explore one shared 3D Mars field containing three prebuilt landing zones. Choose a zone and the onboard controller, test the radio link, set rotor power with deterministic +10%/−5% controls, and set trim inside the fixed wind band. Earn the stamp by completing a stable flight and landing on the flat plain; a stable flight to the crater rim tips on the slope, while a stable rock-field flight strikes a boulder at touchdown.
- Webb: open both folded mirror wings and bring three scattered star images to a common focus in an optical alignment game, then move toward infrared to reveal the obscured region and earn the stamp. The controls support keyboard input, enlarged grab areas, a generous snap radius, and 5% arrow-key alignment steps.
- Voyager: earn the stamp by playing one of the 55 Golden Record greetings, then recording or writing a personal greeting. No microphone is required. Search by language, country/region, or alternate name; read NASA's published English translation; and use normal audio controls. Turning the record and imagining its outward journey remain optional exploration. The Personal Golden Record Studio records a 30-second greeting or saves written text privately in IndexedDB; only audio recordings can be submitted to a configured moderated public listening archive. The same-origin Netlify function at `/api/voyager-distance` refreshes Voyager 1's geocentric range and range-rate from JPL Horizons hourly while the interface advances the estimate every second; a custom `VITE_MISSION_API_URL` can override it.

All exhibits have reset controls, keyboard-operable inputs, source links, reflection prompts, and completion stamps saved in local storage. Audio starts off. Reduced motion and a manual 2D view are available. WebGL initialization failure uses the same interactive controls with textual feedback.

## Architecture

The October 21 open-data add-on adds four pieces of feedback without changing the objectives or stamp conditions: a client-clock countdown to Voyager 1's November 18 light-day milestone; Voyager-specific contact from the cached same-origin DSN relay; NASA's real Webb alignment mosaic, hexagonal array and first deep field around a simplified stacking diagram; and measured simulator maximum altitude/duration compared with Flight 61 in NASA's final 72-flight Ingenuity log. The countdown, images and flight comparison need no live API. Voyager contact silently uses the requested quiet state if the relay or fresh upstream data is unavailable.

- `src/main.js`: navigation, exhibit states, controls, audio, and completion.
- `src/story-layer.js`: hybrid story cards and first-person stamp transmissions.
- `src/stamp-ceremony.js`: explicit stamp activation, settlement and cancellation guards.
- `src/friction-feedback.js`: first-failure virtue copy followed by instructional hints.
- `src/machine-voices.js`: supplied MP3 playback, replay, Sound and optional incident cues; see `docs/MACHINE_VOICES.md`.
- `src/machine-stories.js`: longer sourced machine stories below the opening cards.
- `src/voyager-countdown.js`, `src/voyager-contact.js`: light-day countdown and honest DSN contact states, sharing the existing Voyager announcer.
- `server/dsn-now.mjs`, `netlify/functions/dsn-now.mjs`, `vite.config.js`: shared DSN parser/cache and hosted/local relays.
- `src/webb-alignment-story.js`: progress-driven NASA image sequence with a brief stacked-point hold.
- `src/ingenuity-flight-comparison.js`, `src/data/ingenuity-flights.json`: simulator comparison and all 72 flights from NASA's final PDF. `scripts/import-ingenuity-flights.py` reproduces the import.
- `src/scene.js`: lazy-loaded Three.js scenes, expanded Mars terrain, rover follow camera, lighting, and camera controls. Geometry and materials are disposed on navigation.
- `src/facts.json`: sourced NASA claims and the date/status of the Voyager milestone.
- `src/curiosity-gallery.js`: safe NASA Image Library gallery with curated fallback assets.
- `src/teachers.js`: teacher-page copy, accessible accordions, printable resources, and print selection behavior.
- `server/voyager-horizons.mjs`: cached JPL Horizons query and response parser shared by local and hosted backends.
- `netlify/functions/voyager-distance.mjs`: same-origin Netlify function at `/api/voyager-distance`.
- `output/pdf/mission-alive-teacher-pack.pdf`: earlier classroom-resource export; regenerate it to match updated printable copy before distributing it.
- `src/style.css`: responsive visual system.
- `docs/classroom.md`: lesson and quiz.
- `docs/demo.md`: demo and video outline.
- `docs/verification.md`: browser checks and remaining limitations.

The core academy needs no account or analytics. Its simulations operate locally after their assets load. The optional Node server supports moderated community recordings and a cached JPL Horizons relay; its admin token remains server-only. Greeting MP3s load individually when played. Reloading offline is not supported by a service worker.

## Languages

Use the header language selector for English, Español or Tiếng Việt. It covers stories, controls, feedback, certification, teacher guides and the five printable worksheets. The selection is saved on this browser when storage is available. Switching languages preserves the active mission, rover program, flight settings and form entries. Greeting search accepts translated language/country labels as well as the canonical English names.

Translations are bundled locally in `src/locales`; there is no translation service or new account requirement. `src/i18n-core.js` translates exact copy and named dynamic templates; `src/i18n.js` updates text and accessible labels without rebuilding mission DOM or changing IDs, select option values or event handlers. Add new English UI copy to both language catalogs. Autocomplete suggestions use local labels and resolve saved countries to their stable canonical values. Visitor names/messages and original NASA recordings remain verbatim. Golden Record captions translate the meaning from NASA's published English; the unchanged NASA text is available in an optional disclosure. The four supplied English machine narrations play only after the stamp interaction or an explicit replay; Spanish and Vietnamese keep matching written captions and do not synthesize dubbed speech. Unknown future live image titles use a localized NASA archive caption and identifier, while the source link retains access to the original metadata.

## Scientific and creative boundaries

This is a stylized educational model, not a physics simulator. Curiosity's programming language, energy costs, terrain grid, rotor percentage, wind trim, animation timing, and spacecraft proportions are illustrative. The rover programmer is a small browser-native interaction inspired by block coding; it does not use Scratch code or an external Scratch API. The opening quotations link to their NASA or JPL source pages. Curiosity's motor, Ingenuity's rotor, Webb's servos, and the record mechanism use synthesized Web Audio effects rather than recordings. Voyager uses the 55 recordings supplied by the user in `golden-record-greetings`. Webb's visible model includes the segmented mirror, actuators, backplane, secondary-mirror supports, instrument/bus assembly, and five-layer sunshield; its challenge focuses on mirror-wing deployment and alignment rather than the full observatory deployment sequence. Voyager recordings are mapped by their numbered filenames. The NASA greeting list is linked for reference and English translations. Country/region associations are curated search aids, not the speaker's nationality or an exhaustive distribution map.

Community recording deployment and moderation are documented in `docs/COMMUNITY_RECORDINGS.md`. Private recordings never upload automatically; public submissions require an explicit sharing action. Microphone capture requires browser permission and, outside localhost, HTTPS.

Voyager's live counter is an ephemeris estimate rather than direct spacecraft telemetry. JPL does not support embedding its API directly in a browser, so `server/community-server.mjs` requests and caches Horizons data server-side. The displayed 25.902 billion km and 24-hour signal time remain as NASA's projected November 18, 2026 milestone and offline fallback.

## Sources and assets

NASA links and claim dates are in `src/facts.json` and the in-app Field notes. The Voyager record and separate protective cover use NASA/JPL-Caltech photographs, with visible credits and source links. All 3D geometry and interface tones were authored in code. The 55 original user-provided MP3 files are preserved and emitted as separate assets during build. No NASA logo is used as this project's branding. Recording identity is based on supplied filenames; individual recording provenance and redistribution rights have not been independently authenticated. Three.js and Vite retain their own licenses. See `docs/ASSETS.md` for image sources and `AI_USE.md` for the development disclosure.

## Further development

Before a competition submission: check official eligibility and challenge fit; perform human source review; test touch on real devices and another browser; test with learners; improve the spacecraft models and educational pacing; record the real demo; and deploy/verify all public submission links.
