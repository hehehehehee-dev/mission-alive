# Mission Alive v1.0 — AI collaborator handoff (Claude and Codex)

This is the shared handoff for every AI collaborator. Claude starts from `CLAUDE.md`, Codex starts from `AGENTS.md`, and both continue here.

## 0. Current state (update with every commit)

Whoever commits (Claude, Codex, or a human) updates this section and adds an entry to section 9 **in the same commit**. The next collaborator should be able to continue from this section alone, then confirm with `git log` and `git status`.

- **Active branch:** `fix/nov14-leftover-retests` (ahead of `origin/main`; not pushed or deployed).
- **Last change:** both dedicated Moon routes now include aligned procedural 3D machine views with shared framing, keyboard controls, reduced-motion behavior, offscreen pause, and WebGL fallback.
- **Last verification:** `npm test` 126/126 pass; `npm run build` passes (existing bundle-size advisory only); `git diff --check` passes.
- **Not yet verified:** the new Apollo 17 and Surveyor 3 canvases, footer privacy dialog, and dedicated Moon pages in a real browser at desktop and about 390 px. The local browser surface and Edge headless capture were unavailable. Netlify headers need checking after a future deploy; the live site still runs an older build.
- **Playtest findings not yet fixed (2026-11-14, child persona):**
  - Lobby hook “Kids love space but rarely see themselves in it” is written for adults; suggest a line aimed at the child.
  - Ingenuity has five setup steps before lift-off and +10% power needs seven presses; consider fewer steps or a slider. Flight itself was not played (hidden browser pane paused animation).
- **Next suggested steps:**
  1. Run the browser checks above, including keyboard open, Escape close, and Spanish/Vietnamese privacy copy.
  2. After the owner requests deployment, confirm CSP, HSTS, Permissions-Policy, and the classroom gallery endpoint on Netlify.
  3. Decide whether to remove the now-unused `moonPanel.play()` and `moonPanel.open()` from `src/moon-stories.js`.
- **Open questions for the owner:** none.

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
- Apollo 17 LRV and Surveyor 3 have dedicated `#apollo17` and `#surveyor3` routes. Their challenges still reuse the shared Moon lab and stamp logic.
- Sound begins off. Microphone permission is never required to finish Voyager.
- The optional learner name is requested below the mission choices and is used only for the certificate. Do not place it before the first mission CTA.
- The visual machine picker and certification tracker are one shared deck. Do not create a second six-machine grid in the lobby.
- Mobile keeps language and passport visible while secondary utilities live in the accessible header Menu.
- The footer privacy dialog is the public source of truth for classroom sharing. Keep it synchronized with `docs/PRIVACY.md` and `netlify/functions/class-record.mjs`.
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
2. `CLAUDE.md`, `AGENTS.md`, and this handoff.
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

## 9. Handoff log

Newest first. One entry per commit, written in the same commit. Keep each entry short; `docs/CHANGELOG.md` holds the product-facing detail and `git show` holds the diff.

Entry format:

```md
### YYYY-MM-DD — <agent> — `<branch>`
- **Commit:** <commit subject>
- **Changed:** <files or areas, one line>
- **Verified:** <tests, build, browser checks>
- **Left for next:** <unfinished work, risks, or "nothing">
```

### 2026-11-14 — Codex — `fix/nov14-leftover-retests`
- **Commit:** Add aligned 3D views to both Moon missions
- **Changed:** added shared procedural 3D reconstructions for Apollo 17 LRV and Surveyor 3 with consistent framing, pointer and keyboard orbit, zoom/reset, reduced-motion response, offscreen pause, responsive layout, fallback, localized copy, and updated Moon documentation.
- **Verified:** `npm test` 126/126; `npm run build`; `git diff --check`. Automated tests confirm the shared stage and no new external asset. Local browser surfaces could not capture localhost, so visual QA remains.
- **Left for next:** render both Moon routes in EN/ES/VI at desktop and about 390 px; verify no model is clipped and controls do not overlap the challenge.

### 2026-11-14 — Claude — `fix/nov14-leftover-retests`
- **Commit:** Make the Apollo 17 repair passable in two or three tests
- **Changed:** `src/moon-lrv-game.js` (default 30/0/4, `lrvNextChange()` one-control hints with overshoot tolerance, one-tap tools, “Touching the wheel”); 21 new Spanish/Vietnamese rows in `src/locales/nov14.js`; tests in `tests/moon-lrv-game.test.js` and `tests/webb-pose.test.js`; `docs/MOON-LABS.md`.
- **Verified:** `npm test` 124/124; `npm run build`; local browser replay (EN and VI) passed on the third test including the pre-assembly test; simulated a child who over- or under-presses from 8,463 start shapes: the default passes on the second test after assembly, about 90% of all starts pass within three tests, and none loop.
- **Note:** Codex was adding Moon 3D machine views in the same working tree at the same time (`src/moon-machine-scene.js`, `src/moon-stories.js`, `src/moon-labs.css`, `src/locales/six-missions.js`). Those files are not part of this entry.
- **Left for next:** real-browser replay of Apollo 17 in all three languages; other playtest findings listed in section 0.

### 2026-11-14 — Claude + Codex — `fix/nov14-leftover-retests`
- **Commit:** Share AI handoff and clarify classroom privacy
- **Changed:** fixed and localized the Moon route back-button name; established the shared AI handoff workflow; added a localized public privacy dialog, synchronized privacy guidance, Netlify security headers, and regression coverage without changing the teacher-approved classroom gallery flow.
- **Verified:** `npm test` 120/120; `npm run build`; `git diff --check`. Browser surface unavailable, so responsive visual QA remains.
- **Left for next:** browser QA in all three languages at about 390 px; production response-header verification after an owner-requested deployment; optional cleanup of unused `moonPanel.play()`/`open()`.

### 2026-11-14 — Codex — `fix/nov14-leftover-retests`
- **Commit:** Give Moon missions dedicated pages (`5e63ed7`)
- **Changed:** `#apollo17` and `#surveyor3` routes in `src/main.js`; `openRoute()` in `src/moon-stories.js`; full-page styles in `src/moon-labs.css`.
- **Verified:** `npm test` 118/118 (checked by Claude afterwards).
- **Left for next:** back button had a stale aria-label and no translations (fixed in the entry above).
