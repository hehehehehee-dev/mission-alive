# Mission Alive v1.0 — AI collaborator handoff (Claude and Codex)

This is the shared handoff for every AI collaborator. Claude starts from `CLAUDE.md`, Codex starts from `AGENTS.md`, and both continue here.

## 0. Current state (update with every commit)

Whoever commits (Claude, Codex, or a human) updates this section and adds an entry to section 9 **in the same commit**. The next collaborator should be able to continue from this section alone, then confirm with `git log` and `git status`.

- **Active branch:** `main`. The owner has authorized direct commits and pushes to `origin/main` after validation; Netlify auto-deploys from that branch.
- **Release authorization:** the owner has authorized validated work to be committed and pushed directly to `origin/main`; Netlify deploys that branch automatically.
- **Last change:** owner decision (2026-11-15): greetings publish immediately via `/api/greetings` (`server/shared-greetings.mjs`, `src/shared-greetings.js`), behind a consent box, with Report (hides at once), sharer delete key and owner token. The classroom Golden Record flow was removed. See `docs/SHARED_GREETINGS.md`.
- **Impact route:** `/#impact` is now linked directly from the persistent header. It displays only aggregate closed-question results from the configured Google Sheet through the Netlify function; ages, short answers and individual rows are excluded.
- **Impact display:** interest and belonging show the after-playing average out of 5; learn-more, recommendation and completion show percentages; response count is a plain total. Per-card methodology text was removed, while one caution/method note remains below the grid.
- **Last verification:** 183 tests/build pass, including a server test (consent required, public at once, report hides, delete removes every copy). Local browser: consent gate, stamp still awarded. Posting to production was not tested; only `GET /api/greetings?action=list` should be checked after deploy.
- **Not yet verified:** physical touch dragging for Apollo's new pieces, screen-reader announcement order, translated Apollo browser rendering, new Ingenuity flight UI on a physical device, fresh six-stamp gameplay, and production security headers.
- **Playtest findings not yet fixed (2026-11-14, child persona):**
  - The former three-panel Ingenuity flow has been superseded by this local visual-flight prototype. Its engine is tested, but the new UI still needs hands-on child playtesting before publication.
- **Next suggested steps:**
  1. Let the owner play the new local Ingenuity prototype; do not commit. Verify scene targets, responsive layout, real keyboard/touch input, all three landings, automatic tab pause/resume, retry and the existing stamp ceremony once browser access works.
  2. After the next Netlify auto-deploy, confirm CSP, HSTS, Permissions-Policy, and the classroom gallery endpoint in production.
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
| Ingenuity | Select 3D terrain, counter visible gusts with left/right input, and retry landing | Onboard autonomy and safe terrain matter as much as getting airborne. |
| Webb | Unfold mirror wings, align images, and reveal infrared | Launch constraints drive folding; precision and infrared reveal more. |
| Voyager 1 | Hear/read a Golden Record greeting and add one | Interstellar distance, signal delay, and human communication at scale. |

## 2. Experience flow and invariants

The canonical mission registry is `src/certification.js`. `MISSION_COUNT` must be derived from that registry rather than hard-coded.

The normal flow is:

1. Lobby incoming training signal, direct mission CTA, stamp progress and the outward journey map as the main mission picker. Each map card is one short help request. No separate machine-card grid.
2. Mission opening on the page itself (no dialog): real mission image, machine voice, “Built for” and “It did” beats, then a shared Problem / Your move / Reward rescue briefing. Built by `missionOpening()` and `src/mission-calls.js`.
3. 3D or accessible 2D machine view and anatomy hotspots.
4. Short action and goal at the active step; optional **How to play** combines the three-step visual Quick Start and explanation.
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
- The optional learner name is requested only in the completed six-stamp finale and is used only for the certificate. Do not add a name field to the lobby or place it before gameplay.
- The journey map is the visual mission picker, with one stamp-progress row and six obvious Play mission buttons. Do not restore a second machine-card grid.
- The help language is emotional academy framing, not a live emergency claim. Keep the visible line that says these are academy simulations based on real mission problems.
- Mobile keeps language and passport visible while secondary utilities live in the accessible header Menu.
- Lobby defaults to Sun mode; `src/lobby-theme.js` validates `mission-alive-lobby-theme-v1` and scopes light styling to the lobby and information pages. `src/academy-navigation.css` keeps header actions visible and map callouts large. The map initializes in the lobby and disposes when leaving; `#journey` is a compatibility alias to it. DSN/history remain at `#mission-notes`, context at `#about`. Do not hide the map in a disclosure or move it to a separate page, and do not hide primary header links in Menu.
- Voyager uses one **Voices from Earth** listening area: original 1977 greetings and approved visitor greetings in keyboard tabs. One native player controls the selected NASA greeting. One private-save button handles either written or recorded replies; saved drafts remain visible, classroom setup/review is optional, and no drawing exercise is present.
- Long story/briefing content in the four original exhibits shares one **Story & science** disclosure. Avoid adding extra instruction cards that repeat the current step's action.
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
- Work directly on `main`; make one focused commit for each coherent, validated change and push it to `origin/main` so Netlify can auto-deploy.
- Do not rewrite public release history or force-push `main`.
- Do not commit `dist`, `node_modules`, `.env`, `community-data`, `output`, `tmp`, or Netlify ZIPs.
- Do not publish a GitHub release or trigger a separate manual Netlify deployment without an explicit owner request.

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

### 2026-11-15 — Claude — `main`
- **Commit:** Add an opening story with Commander Mira and a new cadet
- **Changed:** new `src/intro-sequence.js`, `src/intro-sequence.css`, `tests/intro-sequence.test.js`; `src/main.js` (import, `startIntro()`, auto-play on the landing route when `shouldAutoPlayIntro(completed.size)`), 32 rows in `src/locales/nov14.js`.
- **Verified:** 192 tests; build; local browser at 1280 and 390 px in English and Vietnamese: auto-plays with no stamps, not with one stamp, Esc and Skip release the locked page.
- **Left for next:** the intro replays on every landing load until the first stamp (could be once per day or tab if it annoys returning teachers); characters are code-drawn placeholders that an illustrator could replace; no voice (owner chose speech bubbles only). Codex's uncommitted edits in `src/main.js`, `src/exhibit-layout.js`, `src/greetings.css`, `src/quick-start.js` and others were left out.

### 2026-11-15 — Claude — `main`
- **Commit:** Keep the site header on the Moon mission pages
- **Changed:** `src/moon-stories.js` (route pages use non-modal `dialog.show()` placed under the header via `--moon-route-top`; `main` is inert while open; a late `close` event is ignored if the page reopened), `src/readable-type.css`, `tests/readable-type.test.js`.
- **Verified:** 188 tests; build; local browser at 1024 and 390 px: Home, About, module switching to Curiosity, Moon to Moon, and Back to `#apollo17` all leave the header usable and the lobby locked only while a Moon page is open.
- **Left for next:** the non-route Moon dialog (`play()`/`open()`) still uses `showModal`; it is not reachable from the current UI.

### 2026-11-15 — Claude — `main`
- **Commit:** Add a Home link, separate the map cards, and hide an empty DSN card
- **Changed:** `index.html` (Home link), `src/readable-type.css` (Home styles, Mars and Moon callout offsets), `src/voyager-contact.js` (card hidden while unavailable), one row in `src/locales/nov14.js`, tests.
- **Verified:** 187 tests; build; local browser: Home from Voyager returns to the lobby; Mars gap 46–58 px and Moon gap 21–36 px at 390, 768, 1366 and 1920 px; no horizontal overflow; DSN card hidden with no local API.
- **Note:** Codex had uncommitted edits in `src/main.js`, `src/exhibit-layout.js`, `src/greetings.css`, `src/quick-start.js` and docs at the same time; they are not part of this commit.

### 2026-11-15 — Claude — `main`
- **Commit:** Share greetings with everyone at once and remove classroom sharing
- **Changed:** new `server/shared-greetings.mjs`, `server/greeting-screening.mjs`, `netlify/functions/shared-greetings.mjs`, `src/shared-greetings.js`, `docs/SHARED_GREETINGS.md`; `src/personal-records.js`, `src/exhibit-layout.js`, `src/teachers.js`, `src/project-attribution.js`, `index.html` privacy dialog, `docs/PRIVACY.md`, `CLAUDE.md` data rule, README, `NETLIFY_DEPLOY.md`, `src/locales/nov14.js`, tests. Removed `src/class-record.js`, `netlify/functions/class-record.mjs`, `tests/class-record.test.js`, `docs/CLASSROOM_RECORDS.md`.
- **Verified:** 183 tests; build; local browser at `#voyager`.
- **Left for next:** confirm on production that `/api/greetings?action=list` returns JSON and that a real share and delete work; decide whether to set `CLASSROOM_OPENAI_API_KEY` (without it nothing is screened) and `COMMUNITY_ADMIN_TOKEN` (needed for owner removal or restoring reported greetings). Claude advised the owner that children's voice recordings published without review carry privacy and safety risk; the owner chose direct publishing.

### 2026-11-15 — Codex — `main`
- **Commit:** Turn Apollo repair into a spatial game
- **Changed:** replaced Mission 1's ordered tool buttons with a seven-piece map/seam/clamp build board, one primary reach control, progressive stage gating, shorter instructions, optional material rationale, EN/ES/VI copy, tests and Moon UX documentation.
- **Verified:** 185/185 Node tests; production build; automated Chrome mouse drag plus build → shape → passing dust test; build and shape bounds at 390 px with no document overflow; desktop and mobile initial renders.
- **Left for next:** physical touch-drag and screen-reader playtest, translated browser pass, fresh six-stamp regression, and deployed Netlify check.

### 2026-11-15 — Codex — `main` — UNCOMMITTED FLIGHT NEXT-ACTION FIX
- **Commit:** none; keep all current preview changes local.
- **Changed:** moved launch, pacing and retry onto the helicopter's deck. Scene selection immediately displays the patch name, explicit next instruction and enabled gold Lift off button. Hide steering before launch. Removed the redundant 3D zone palette; native alternatives appear only in 2D fallback, with view switches preserving the chosen patch. Added ES/VI copy and updated the flight guide.
- **Verified:** 176 tests and production build pass, including next-action availability on scene selection and fallback visibility/state preservation. Browser connector still unavailable; no visual claims for this change.
- **Left for next:** owner to refresh and try selection → launch in the local prototype. No commit/push until instructed; original flight UI browser checks remain pending.

### 2026-11-15 — Codex — `main` — UNCOMMITTED INGENUITY PROTOTYPE
- **Commit:** none; owner explicitly requested local playtesting first.
- **Changed:** new `ingenuity-flight-game.js` with fixed-substep simulation and native input UI; retained 3D model and three terrain groups. Added projected site buttons, route guides, gust arrows, a ground shadow and visible lean/drift; shared left/right controls stay with the canvas. Removed retired link/power/trim setup and wired safe landing into the unchanged `success()` stamp ceremony. Checkpoint retry, continuous/paced play, EN/ES/VI copy, teacher instructions and simulation attribution included.
- **Verified:** 174 automated tests cover safe/rock/slope/drift results, steering, checkpoints, deterministic pacing, UI callback count, pause-on-blur, reduced-motion pacing and cleanup. Browser UI verification was attempted but blocked by unavailable browser access and native URL-policy uncertainty; no more app input was attempted after that stop. No images of the new game were captured. Local Vite preview remains on port 5176.
- **Left for next:** do not commit/push. Owner should try the local prototype; verify actual desktop/390px rendering, projected site taps, keyboard/touch steering, all outcomes, repeat/reset and stamp ceremony. Existing voice/Curiosity changes remain uncommitted too. The new game uses invented teaching values, not measured flight physics.

### 2026-11-15 — Codex — `main` — UNCOMMITTED PREVIEW
- **Commit:** none; owner asked to review more changes before committing.
- **Changed:** story-message player beside the opening text for Curiosity, Ingenuity, Webb and Voyager, using existing MP3s and their exact transcripts. Added translated playback/recovery controls. Curiosity gets a prominent repair action on failure, keeps blocks on repair, resets science/free-drive state, and gives an explicit crash correction. Existing reset also lights up. No credit-consuming speech generation or new narration asset.
- **Verified:** 161 tests/build, local keyboard/mouse playback, four character routes, EN/ES/VI, 390px and reduced motion. Actual two-MOVE hazard crash then repair retained both blocks. Switched wrecked rover to Free Explore and verified recovery kept Free Explore active. Captures in ignored/untracked `output/voice-recovery/`. Current preview server uses port 5176; other local servers were already occupying 5173–5175.
- **Left for next:** do not commit/push until instructed. These are short English character messages, not recordings of the Built for / It did paragraphs. Apollo 17 and Surveyor 3 still have no supplied narration files. Full six-stamp gameplay was not repeated.

### 2026-11-15 — Claude — `main`
- **Commit:** Put the phone header links in one swipeable row
- **Changed:** `src/readable-type.css`, `tests/readable-type.test.js`.
- **Verified:** 158 tests; build; local browser at 390 px in English and Vietnamese.
- **Left for next:** three stacked headings before play on the four deep-space/Mars missions; copy reading level; no celebration when returning to the lobby with a new stamp. Not checked on the deployed site.

### 2026-11-15 — Claude — `main`
- **Commit:** Show earned stamps as stamps in the lobby and on the map
- **Changed:** `src/main.js` (stamp slot row), `src/moon-stories.js` (`.is-earned` on map cards), `src/readable-type.css`, `tests/readable-type.test.js`.
- **Verified:** 157 tests; build; local browser at 390 px and 1024 px.
- **Left for next:** no celebration moment when returning to the lobby with a new stamp; phone header still 177 px with five adult-facing buttons; three stacked headings before play; copy reading level. Not checked on the deployed site or in Spanish/Vietnamese.

### 2026-11-15 — Claude — `main`
- **Commit:** Raise text to a child-readable floor and compact the phone mission switcher
- **Changed:** new `src/readable-type.css`, one import and a small scroll-into-view block in `src/main.js`, new `tests/readable-type.test.js`.
- **Verified:** 156 tests; build; local browser at 390 px and 1366 px (see section 0).
- **Left for next (design audit, child audience):** stamps earned are still only a 12 px “Stamp earned ✓” on the map and a 5 px progress bar; the phone header is 177 px with five adult-facing buttons above the hook; three stacked headings before play remain on the four deep-space/Mars missions; copy reads at about grade 8–11 against a grade 5–7 target; lobby map credits stay at 12 px by choice.

### 2026-11-15 — Codex — `main`
- **Commit:** Record production feedback integration verification
- **Changed:** recorded verification of the deployed feedback/impact integration; no product changes.
- **Verified:** production HTML contains the impact page, `/api/playtest-impact` returns HTTP 200 with aggregate-only zero-response data, and the production browser displays the waiting state and data-check time. Temporary local QA server stopped.
- **Left for next:** collect genuine voluntary responses; broader gameplay checks and the duplicated Form question remain as recorded below.

### 2026-11-15 — Codex — `main`
- **Commit:** Collect optional feedback and refresh public playtest impact
- **Changed:** Form links on mission endings, footer, graduation and print certificate; About → Impact; allowlisted server-side Sheet projection, aggregate-only API, five-minute page refresh with one-minute server cache, explicit denominators and empty/error states. Added translations, tests, privacy copy and `docs/PLAYTEST_IMPACT.md`.
- **Verified:** live Form/Sheet and actual zero-response aggregate; unit coverage for exclusions, score validity, duplicate After conflicts, caching and refresh/disposal. Browser empty/populated/error states, EN/ES/VI at 390px, restored six-stamp certificate controls and unprefilled feedback URLs. No response or source-sheet edit was made.
- **Left for next:** the Form repeats the interest-after question. The owner can remove it; header discovery supports that automatically. Do not create public seed responses or infer causal learning gains. Source access must remain readable for this public-data implementation; failure is shown honestly. Existing gameplay QA remains outstanding above.

### 2026-11-15 — Codex — `main`
- **Commit:** Make the lobby map the main mission picker
- **Changed:** restored the journey map to the lobby and removed the separate six-card chooser. Added large, explicit Play mission / Play again callout surfaces with earned-stamp labels, localized actions, and extra scene spacing. Retained Notes/About, Settings and the name below the map. Legacy `#journey` opens the lobby map.
- **Verified:** 146 tests/build; browser clicks on all six callout surfaces, correct routes, 390px/desktop, EN/ES/VI, larger text/high contrast, alias URL, source-credit clearance and scene-bound checks. Mobile Moon labels initially touched the next scene; corrected with font-relative scene spacing.
- **Left for next:** full six-stamp graduation was not replayed. The owner's latest direction is map-first lobby, not card-first lobby; earlier log entries describe superseded designs. Preserve unrelated notices and local artifacts.

### 2026-11-15 — Codex — `main`
- **Commit:** Give academy information its own pages and visible navigation
- **Changed:** separate Journey, Mission notes and About pages; enlarged machine cards; direct name field below; five visible header actions on mobile/desktop; motion and sound moved to Settings. DSN placement and reference exports synchronized. Existing mission routes and six-stamp rules retained.
- **Verified:** 146 tests/build; browser EN/ES/VI, 390px header buttons, page reload/history, optional map rendering and Settings. Fixed inherited grid-column rules that initially distorted the mobile header. The earlier Voyager and six-mission tests remain unchanged.
- **Left for next:** full six-stamp gameplay has not been repeated in this navigation pass. Preserve unrelated notices and local artifacts; source-reference export changes belong to this commit because DSN now lives on Mission notes.

### 2026-11-15 — Codex — `main`
- **Commit:** Brighten and simplify the academy lobby
- **Changed:** default light lobby, persistent Sun/Moon control, short child-facing opening, compact six-mission cards, and optional journey/bonus section. Added localized copy and theme preference tests; updated the old hook assertions to use the active translation catalogs.
- **Verified:** 145 tests and production build; browser checks in EN/ES/VI on desktop/390px, keyboard control, theme restoration, reduced motion, larger text, high contrast, map canvases after expansion and mission navigation. Fixed a high-contrast specificity conflict found during the visual pass.
- **Left for next:** broader gameplay/finale checks remain as listed above. No new NASA assets, data services, stamp rules or recording publication behavior were introduced. Preserve unrelated notices and untracked artifacts.

### 2026-11-15 — Codex — `main`
- **Commit:** Consolidate mission guidance and Voyager voices
- **Changed:** combined original greeting search/player and visitor gallery with keyboard tabs; removed cover painting and redundant Voyager guidance; unified text/audio private saving, grouped optional metadata and classroom sharing, and retained visible drafts. Combined Quick Start/explanation and story/briefing sections. Stopped filtered-out audio and fixed a Moon overlay left open by hash/history navigation.
- **Verified:** 143 tests and production build; local original/approved-fixture audio playback, language search, country comparisons, gallery filtering, keyboard tabs, private text saving and settled Voyager stamp; all six 390px layouts, ES/VI, reduced motion, and Moon → exhibit Back/Forward. Production gallery returned HTTP 200 with zero approved greetings. Local QA uses an in-memory store in untracked `tmp/preview-greeting-qa.mjs`; no production test recordings were created.
- **Left for next:** full six-stamp playthrough and the listed Ingenuity gameplay checks were not repeated in this UI pass. Actual visitor content appears only after explicit sharing and teacher approval. Keep existing unrelated `public/third-party-notices.txt` line endings and untracked packages/artifacts out of this commit.

### 2026-11-14 — Codex — `main`
- **Commit:** Release rover gameplay and mission experiments
- **Changed:** released the held Apollo fender correction, incremental Curiosity execution/hazard damage/smoke, moving-rover hotspot visibility, early Moon trials, and local Voyager cover drawing. Synchronized the pending documentation with the owner's push authorization.
- **Verified:** 141 tests, production build and diff checks; local browser keyboard progression and hazard entry, hidden/returned anatomy markers, visible reduced-motion smoke, and Voyager cover persistence across reload. Retained Claude's already-committed Golden Record logo.
- **Left for next:** production smoke/marker check after Netlify deployment; physical-device/screen-reader testing and a fresh six-stamp finale run remain separate verification work.

### 2026-11-14 — Claude — `main`
- **Commit:** Replace the header mark and favicon with the Golden Record logo
- **Changed:** `index.html` (inline SVG `.brand-mark`, data-URI favicon), `src/style.css` and `src/lobby-launch.css` (mark sizing, `brand-pulse` animation gated on `body.motion-allowed`), `tests/project-copy.test.js`.
- **Verified:** `npm test`; `npm run build`; local browser: 47 px mark in the header, animation on with motion allowed and off with reduced motion.
- **Left for next:** the printable certificate and Teachers page do not show the logo yet. Codex's uncommitted rover-fender work was left out of this commit.

### 2026-11-14 — Codex — `main`
- **Commit:** Synchronize the field probe on reset and record playtesting
- **Changed:** synchronized the field-tool force display with the actual game force, including resets and alternative buttons; removed duplicated visible probe readings.
- **Verified:** production keyboard Apollo pass/stamp offer; Surveyor evidence-gated pass/stamp offer; actual 390 px swipe/pull gestures; no overflow in Moon tools or the other four mission guides; translated directions inspected in VI and ES. Tests/build rerun for this follow-up.
- **Left for next:** physical-device/screen-reader testing and a fresh six-stamp finale run remain outside this focused playtest.

### 2026-11-14 — Codex — `main`
- **Commit:** Keep field tool state separate from patch navigation
- **Changed:** bound observers to the real Moon game regions, renamed selected-patch state so it cannot match a patch button, and restricted step advancement to actual patch buttons.
- **Verified:** production Apollo keyboard assembly and patch reshaping passed; Surveyor probes recorded distinct depths. Regression now checks excavation state and absence of the conflicting patch attribute.
- **Left for next:** recheck Surveyor excavation/landing after deploy, then finish responsive and language checks.

### 2026-11-14 — Codex — `main`
- **Commit:** Give Moon missions hands-on tools and guide every active task
- **Changed:** new `mission-actions.js/css` and locale catalog; material placement, visible patch manipulation, probe pulling and excavation strips; active-step guidance for all six missions; synchronized Moon docs.
- **Verified:** 139 Node tests; production build; diff whitespace checks.
- **Left for next:** inspect production pointer/keyboard interactions and EN/ES/VI at desktop and 390 px; no clean six-stamp run claimed for this change.

### 2026-11-14 — Codex — `main`
- **Commit:** Give every challenge a mission moment
- **Changed:** added short incident/repair story strips to Curiosity, Ingenuity, Webb, Voyager, Apollo 17, and Surveyor; added Spanish/Vietnamese strings, Moon copy, styling, and changelog notes.
- **Verified:** `npm test` 136/136; `npm run build`; `git diff --check`.
- **Left for next:** inspect the production strips at desktop and about 390 px; deeper mechanic changes remain optional because the existing challenges already provide drag, driving, range, keyboard, and retry interactions.

### 2026-11-14 — Codex — `main`
- **Commit:** Explain Moon mission choices in the challenge
- **Changed:** added persistent Apollo 17/Surveyor mission labels, descriptive Surveyor patch options, Spanish/Vietnamese translations, focused regression coverage, and changelog notes.
- **Verified:** `npm test` 136/136; `npm run build`; `git diff --check`.
- **Left for next:** inspect the deployed Moon challenge at desktop and about 390 px; all other current challenge choices have distinct visible controls or outcome feedback.

### 2026-11-14 — Codex — `main`
- **Commit:** Restore the six-module navigation on Moon missions
- **Changed:** added the shared six-mission navigation pattern to Apollo 17 and Surveyor 3 route pages, with current/completed states and direct routing; updated Moon styles, regression coverage, and product docs.
- **Verified:** `npm test` 136/136; `npm run build`; `git diff --check`.
- **Left for next:** verify the auto-deployed navigation visually at desktop and about 390 px; the unrelated production/CSP and Ingenuity checks remain open.

### 2026-11-14 — Claude — `main`
- **Commit:** Let the Curiosity gallery load NASA images under the CSP
- **Changed:** `netlify.toml` (two NASA hosts added to the policy), `tests/project-copy.test.js`.
- **Verified:** `npm test` 136/136; live-site check after deploy recorded in the session.
- **Left for next (design review of the live site, child audience, 2026-11-14):**
  - Bug: browser Back from `#apollo17`/`#surveyor3` to another mission leaves the Moon dialog open over the page (`hashchange`/`popstate` render the mission without closing `.moon-panel`).
  - Bug: a tab left open across a deploy gets a 404 for the lazy `scene-*.js` chunk and silently falls back to the 2D view until reload.
  - DSN widget's direct `eyes.nasa.gov` fallback is blocked by `connect-src`; production uses the `/api/dsn-now` relay, so this was left as is.
  - Text too small for ages 10–14: lobby card tagline 8.6 px, “Open mission →” 9 px, “TRAINING MODULE” 9.3 px, opening labels 10.4 px, “Earth is here” 9.9 px; about two thirds of lobby text is 13 px or smaller on a phone.
  - On a 390 px phone the first challenge control is about two screens down and the six-module nav takes 290 px on every mission page.
  - Stamped lobby cards look the same as open ones apart from a 9.9 px “STAMPED ✓”; progress bar is 5 px tall; “1 mission remain.” needs a plural fix.
  - Three stacked headings before play (“YOUR MISSION”, “MISSION CHALLENGE · Now take control.”, “YOUR MISSION · …”).
  - Reading level estimates (English): lobby about grade 10, Voyager about grade 11; target is grade 5–7.

### 2026-11-14 — Codex — `main`
- **Commit:** Record production challenge step verification
- **Changed:** recorded successful production keyboard transitions for Webb, Apollo and Surveyor and narrow-screen layout results.
- **Verified:** actual wing buttons and star arrow keys advanced Webb to infrared; map/tape/clamps advanced Apollo; two probe forces plus three scoops advanced Surveyor to landing; 390px routes have no horizontal overflow. Browser initially timed out during some software-rendered navigation, then completed all focused checks.
- **Left for next:** physical-device usability sessions and a full six-stamp replay were not part of this focused layout verification.

### 2026-11-14 — Codex — `main`
- **Commit:** Fold the complete Webb reference gallery into optional notes
- **Changed:** moved the static three-image NASA gallery into the same disclosure as the alignment sequence; responsive image height prevents intrinsic 1685–2000px images from stretching the controls.
- **Verified:** production inspection identified the 5896px alignment panel and confirmed Webb stage replacement; 135-test/build gate rerun for the follow-up.
- **Left for next:** finish production Moon interaction and narrow-screen checks; browser automation experienced repeated timeouts during Moon navigation.

### 2026-11-14 — Codex — `main`
- **Commit:** Show one challenge step at a time
- **Changed:** Webb stage replacement, shared Moon stage navigation, automatic assembly/evidence progression, collapsed optional controls and logs, localized labels.
- **Verified:** 135 Node tests and production build; browser verification follows deployment.
- **Left for next:** verify actual Webb/Moon automatic transitions, keyboard return navigation, and 390px layout on production.

### 2026-11-14 — Claude — `main`
- **Commit:** Open the Moon pages with the shared mission opening
- **Changed:** `src/moon-stories.js` (route summary now holds a `.mission-opening` with photo, Built for, It did; no longer re-hides the photo on leave; verbatim credit), `src/moon-labs.css` (removed the absolutely positioned photo), `tests/mission-opening.test.js`.
- **Verified:** `npm test` 134/134; `npm run build`; local browser desktop and 390 px (no horizontal scroll), back-and-reopen keeps the photo, EN/ES/VI.
- **Note:** Codex had uncommitted edits in `src/main.js`, `src/moon-labs.js`, `src/moon-lrv-game.js`, `src/moon-surveyor-game.js` at the same time; they are not part of this commit.

### 2026-11-14 — Claude — `main`
- **Commit:** Tell each mission's story on the page before the challenge
- **Changed:** `src/main.js` (no auto `openExhibitStory()` in `navigateTo()`, new `missionOpening()`), `src/style.css`, two rows in `src/locales/nov14.js`, new `tests/mission-opening.test.js`.
- **Verified:** `npm test` 132/132; `npm run build`; local browser desktop and 390 px, EN/ES/VI; Earth marker within 2 px of the measured dot.
- **Left for next:** Story beats are not yet woven into individual challenge steps. (Moon pages aligned in the next entry.)

### 2026-11-14 — Codex — `main`
- **Commit:** Center the lunar study and remove double scrolling
- **Changed:** centered Surveyor's camera on the selected patch, locked underlying page scrolling while Moon training is open, and sized mobile canvases to 310px.
- **Verified:** deployed first-pass models visually inspected at 1440px; both Moon routes have no horizontal overflow at 390px and NASA images/credits load. Automated test/build gate rerun for the camera/CSS follow-up.
- **Left for next:** physical low-powered-device performance measurement; no measured FPS claim is made.

### 2026-11-14 — Codex — `main`
- **Commit:** Rebuild Moon machines and unify their study presentation
- **Changed:** full rover and Surveyor teaching reconstructions, consistent materials and lunar stage, corrected shadows, offscreen render pause and frame cap, shorter route intro with existing credited NASA photography, Surveyor study/control columns.
- **Verified:** 129 Node tests and production build pass; production visual inspection follows deployment.
- **Left for next:** inspect both models at desktop and 390 px, verify actual orbit and scene framing, and assess smoothness on a physical low-powered device.

Newest first. One entry per commit, written in the same commit. Keep each entry short; `docs/CHANGELOG.md` holds the product-facing detail and `git show` holds the diff.

Entry format:

```md
### YYYY-MM-DD — <agent> — `<branch>`
- **Commit:** <commit subject>
- **Changed:** <files or areas, one line>
- **Verified:** <tests, build, browser checks>
- **Left for next:** <unfinished work, risks, or "nothing">
```

### 2026-11-14 — Claude — `main`
- **Commit:** Merge the Voyager distance and countdown into one card
- **Changed:** `src/main.js`, `src/exhibit-layout.js`, `src/style.css`, one row in `src/locales/nov14.js`, a layout test in `tests/voyager-distance.test.js`.
- **Verified:** `npm test` 129/129; `npm run build`; local browser at desktop and 390 px.
- **Left for next:** check the merged card on the deployed site.

### 2026-11-14 — Codex — `main`
- **Commit:** Record production anatomy layout verification
- **Changed:** updated the shared handoff with the deployed 390 px results for all four main 3D routes and the deployed Ingenuity step transition.
- **Verified:** production DOM/layout audit: external anatomy tray, no canvas overlap, no document overflow, and internal label scrolling on Curiosity, Ingenuity, Webb, and Voyager.
- **Left for next:** terrain-outcome and flight-pacing gameplay checks remain; the shared layout regression is complete.

### 2026-11-14 — Codex — `main`
- **Commit:** Contain anatomy trays on narrow screens
- **Changed:** constrained the shared stage column and anatomy tray to the viewport so long part labels scroll inside the tray instead of widening the document or touching the canvas.
- **Verified:** production 390 px audit identified the overflow; focused regression test, `npm test` 128/128, `npm run build`, and `git diff --check` after the fix.
- **Left for next:** recheck all four production routes at 390 px after Netlify auto-deploy.

### 2026-11-14 — Codex — `main`
- **Commit:** Keep 3D models clear and simplify Ingenuity setup
- **Changed:** moved the shared anatomy dock outside all four main canvases, made the study column sticky on desktop, and replaced Ingenuity's long setup form with three progressive panels and one-action safe rotor power; added ES/VI copy, accessibility notes, and regression tests.
- **Verified:** live pre-change audit across Curiosity, Ingenuity, Webb, and Voyager; `npm test` 128/128; `npm run build`; `git diff --check`.
- **Left for next:** verify the auto-deployed production UI at desktop and about 390 px, including all three Ingenuity terrain outcomes and both flight pacing modes.

### 2026-11-14 — Claude — `main`
- **Commit:** Replace confusing Voyager light-time with the light-day milestone
- **Changed:** `src/voyager-distance.js` (`lightDayLink()`, plain status strings, removed `formatUtc`), `src/main.js` (initial card text, link label), 5 rows in `src/locales/nov14.js`, `tests/voyager-distance.test.js`.
- **Verified:** `npm test` 126/126; `npm run build`; local browser check EN/ES/VI.
- **Left for next:** NASA's milestone (Nov 18 10:16:07 UTC) is about 13 h earlier than a straight-line extrapolation of the current Horizons range rate; not investigated. Uncommitted Codex edits to `index.html`, `src/scene.js`, `src/style.css` were left out of this commit.

### 2026-11-14 — Codex — `main`
- **Commit:** Adopt direct main deployment workflow
- **Changed:** synchronized `AGENTS.md`, `CLAUDE.md`, and this handoff so validated work is committed and pushed directly to `origin/main`; reconciled the rebuilt public repository history without force-pushing.
- **Verified:** documentation consistency; `origin/main` is an ancestor of the reconciled local `main`; the preceding application gate remains `npm test` 125/125, `npm run build`, and `git diff --check`.
- **Left for next:** continue on `main`, push after validation, and confirm the production Netlify headers after auto-deploy.

### 2026-11-14 — Codex — `fix/nov14-leftover-retests`
- **Commit:** Move Moon interactions into 3D challenge scenes
- **Changed:** replaced the redundant standalone Moon model viewer with progressive 3D layers inside Apollo's fender/dust challenge and Surveyor's soil/landing challenge; synchronized existing controls and outcomes; retained SVG and text fallbacks, localization, keyboard orbit/zoom, and reduced-motion timing.
- **Verified:** `npm test` 125/125; `npm run build`; `git diff --check`. Static regression confirms both challenges retain their 2D fallback and introduce no external asset.
- **Left for next:** visually play both challenge scenes at desktop and about 390 px in EN/ES/VI; verify dust paths, probe travel, and failed/successful touchdown framing.

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
