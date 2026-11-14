# Mission Alive v1.0 — Claude handoff

## 1. What this project is

Mission Alive is a Vite-powered, browser-native interactive space academy for ages 10–14. Learners meet six machines, learn their real purpose and achievements, complete a mission-inspired interaction, press a physical-looking stamp, and graduate after collecting all six stamps.

The narrative spine is: **the machines cannot come home, so they teach where they rest**. The emotional payoff is the machine’s first-person final transmission, the quality it gives the learner, the six-stamp finale, and a printable certificate.

This is not a general NASA encyclopedia. Each mission should leave one memorable scientific or engineering idea:

| Mission | Interaction | Core takeaway |
| --- | --- | --- |
| Apollo 17 LRV | Build, shape, and dust-test a replacement fender | Engineers can repurpose ordinary materials under constraints. |
| Surveyor 3 | Probe, trench, compare evidence, and test a fictional lander | Measure the ground before trusting a landing decision. |
| Curiosity | Block-program or freely drive a rover science plan | Habitability evidence is not proof of life; delayed missions need sequences. |
| Ingenuity | Choose terrain, link, power, trim, fly, and land | Thin air and terrain make controlled flight an engineering experiment. |
| Webb | Unfold mirror wings, align images, and reveal infrared | Launch constraints drive folding; precision and infrared reveal more. |
| Voyager 1 | Hear/read a Golden Record greeting and add one | Interstellar distance, signal delay, and human communication at scale. |

## 2. Experience flow and invariants

The canonical mission registry is `src/certification.js`. `MISSION_COUNT` must be derived from that registry rather than hard-coded.

The normal flow is:

1. Lobby direct mission CTA, unified visual certification deck, and outward journey map.
2. Mission story/objective.
3. 3D or accessible 2D machine view and anatomy hotspots.
4. Visual Quick Start.
5. Interactive challenge with actionable feedback.
6. Explicit stamp press and 750 ms ink-settle ceremony.
7. “Still out there” story, final transmission, and mission gift.
8. After all six stamps: finale, journey recap, and printable certificate.

Important invariants:

- Progress key: `mission-alive-passport-v2` in `src/main.js`.
- A stamp is committed only after the stamp ceremony settles.
- Replaying a completed mission must not create a duplicate credential.
- Leaving or resetting during an unfinished ceremony must not award a stamp later.
- The finale opens only when `certificationComplete()` confirms all six mission IDs.
- Moon missions are full certification missions, not optional story cards in the current version.
- Sound begins off. Microphone permission is never required to finish Voyager.
- The optional learner name is requested below the mission choices and is used only for the certificate. Do not place it before the first mission CTA.
- The visual machine picker and certification tracker are one shared deck. Do not create a second six-machine grid in the lobby.
- Mobile keeps language and passport visible while secondary utilities live in the accessible header Menu.
- Completion must survive reload through validated stored mission IDs.

## 3. Technical map

### Application shell

- `index.html` — application shell, dialogs, finale, certificate, navigation landmarks.
- `src/main.js` — main coordinator: routes, state, mission controls, completion, finale, persistence, and feature mounting.
- `src/style.css` plus focused CSS modules — responsive visual system.
- `src/certification.js` — six-mission registry and completion checks.
- `src/exhibit-layout.js` — challenge/reading layout organization.
- `src/quick-start.js` and `src/quick-start.css` — shared three-step visual onboarding.

### Missions and narrative

- `src/scene.js` — lazy Three.js scenes, cameras, hotspots, geometry disposal, and 2D fallback relationship.
- `src/story-layer.js` — concise narrative beats, transmissions, and gifts for the four deep-space/Mars exhibits.
- `src/machine-stories.js` — longer sourced stories.
- `src/machine-parts.js` — anatomy hotspots and official sources.
- `src/moon-labs.js` — Apollo 17 and Surveyor 3 launch, stamp, and transmission coordination.
- `src/moon-lrv-game.js` — original fender-repair teaching model.
- `src/moon-surveyor-game.js` — original dimensionless lunar-soil teaching model.
- `src/friction-feedback.js` — first-failure virtue and later actionable hints.
- `src/stamp-ceremony.js` — explicit activation and cancellation-safe stamp settlement.

### Data and media

- `src/resource-credits.js` — central public catalog for every external resource.
- `src/facts.json` — sourced mission facts and dated/status-sensitive claims.
- `src/voyager-distance.js` — client display/interpolation for the JPL Horizons anchor.
- `server/voyager-horizons.mjs` and `netlify/functions/voyager-distance.mjs` — cached server-side Horizons request.
- `src/dsn-widget.js`, `src/voyager-contact.js`, `server/dsn-now.mjs`, and `netlify/functions/dsn-now.mjs` — honest active-contact DSN states.
- `src/greetings-catalog.js`, `src/greetings.js`, and `golden-record-greetings/` — 55 Voyager greetings.
- `src/personal-records.js` — visitor-written/recorded greetings and optional configured sharing.
- `src/mars-sounds.js` — credited Perseverance audio used beside Curiosity; never describe it as Curiosity audio.
- `src/webb-alignment-story.js` — real Webb alignment imagery sequence.
- `src/data/ingenuity-flights.json` — NASA’s 72-flight log transcription.

### Localization and accessibility

- `src/i18n-core.js` — exact and templated translation logic.
- `src/i18n.js` — DOM localization without rebuilding mission state.
- `src/locales/` — English-source mappings to Spanish and Vietnamese.
- `src/access-preferences.js`, `src/accessible-controls.js`, and `src/accessible-academy.css` — reduced motion, view preferences, text maps, and non-pointer controls.

Any new visible English UI string must receive Spanish and Vietnamese equivalents. Do not translate visitor names/messages, original recordings, stable machine/instrument identifiers, or source data that needs to remain verbatim.

## 4. External services and environment variables

The core static experience works without accounts. Live or community functions are progressive enhancements.

Client variables:

- `VITE_MISSION_API_URL` — optional mission-data backend override.
- `VITE_COMMUNITY_API_URL` — optional moderated community-recording backend.
- `VITE_CLASSROOM_API_URL` — optional classroom Golden Record backend.

Server-only variables include:

- `COMMUNITY_ADMIN_TOKEN`
- `COMMUNITY_ALLOWED_ORIGIN`
- `COMMUNITY_DATA_DIR`
- `CLASSROOM_OPENAI_API_KEY`

Never expose server secrets in client source or a `VITE_` variable. `.env.example` contains placeholders only; real `.env` files are ignored.

## 5. Testing and release gates

Minimum automated gate:

```sh
npm test
npm run build
```

The test suite protects certification restoration, stamp cancellation, localization purity, greeting assets, NASA source records, DSN freshness, Voyager distance behavior, Webb imagery, Moon simulation rules, machine audio, accessibility controls, and the visual Quick Starts.

For interaction changes, manually verify:

- a clean six-mission run in mission order;
- stamp press, settle, transmission, finale, and exactly six certificate stamps;
- reload with partial progress;
- reset during an unfinished attempt and during a pending ceremony;
- keyboard-only completion or equivalent accessible controls;
- reduced-motion and sound-off behavior;
- English, Spanish, and Vietnamese without mixed-language leakage;
- about 390 px width without overlapping controls or unreadable labels;
- live-data failure/stale states without fabricated claims.

For Netlify Drop, run:

```sh
python scripts/package-netlify.py
```

This creates `mission-alive-netlify-update.zip`, moves the last distinct package to `mission-alive-netlify-previous.zip`, writes safe POSIX file permissions into the ZIP, and removes other matching local package copies. These ZIPs are intentionally untracked.

## 6. Git and release practice

- Public repository: `https://github.com/hehehehehee-dev/mission-alive`.
- Stable branch: `main`.
- Current release tag: `v1.0.0` at commit `0d6d1bb`.
- Use a focused branch and commit for each coherent change.
- Do not rewrite public release history or force-push `main`.
- Do not commit `dist`, `node_modules`, `.env`, `community-data`, `output`, `tmp`, or Netlify ZIPs.
- Do not publish a GitHub release or deploy Netlify without an explicit owner request.

## 7. Documentation trust levels

Use in this order:

1. Current source and tests.
2. `CLAUDE.md` and this handoff.
3. `docs/CHANGELOG.md` for the latest product and content changes.
4. Focused current docs such as `docs/ACCESSIBILITY.md`, `docs/ASSETS.md`, `docs/MOON-LABS.md`, and `docs/MACHINE_VOICES.md`.
5. `README.md` for broad context, while checking claims against code.
6. Dated playtests, fix lists, and screenshots only as historical evidence.

If prose conflicts with the implementation, do not guess. Report the mismatch and verify the intended current behavior before changing a protected invariant.

## 8. Good first tasks for another AI collaborator

- Audit and update stale four-mission prose in `README.md` without changing behavior.
- Run a keyboard/screen-reader/mobile regression and record reproducible findings.
- Improve one mission’s pacing using existing Quick Start and feedback patterns.
- Add missing test coverage before touching a fragile interaction.
- Review a NASA claim against its official source and improve attribution metadata.

Avoid broad rewrites of `src/main.js`, new frameworks, a second design system, mandatory tutorials, or speculative mission facts. Small, verified changes preserve the working end-to-end journey.
