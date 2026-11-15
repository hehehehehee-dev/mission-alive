# Mission Alive change log

Claude and other collaborators should read this file after `CLAUDE.md`. Every product, code, content, data, or UX change must update this log in the same commit. Keep entries short and factual. Do not repeat the full commit diff.

## 2026-11-15

### Preview: make every mission feel like a help request

- Reframed the landing hero as an incoming training signal: six machines need the learner's help, six stamps unlock the certificate, and one quiet line states that these are academy simulations based on real mission problems.
- Reframed the journey map as six calls for help. Every machine card now states one short first-person request before its Play mission action; after its stamp is earned, Help request changes to Mission helped.
- Added the same compact Problem / Your move / Reward briefing to all six mission pages. The four main exhibits receive it after their opening story; the two Moon routes receive it before the existing lab. No tutorial modal, gameplay rule, stamp, finale or certificate logic changed.
- Added complete Spanish and Vietnamese copy, reduced-motion-safe signal animation, and regression coverage. 183 tests, the production build and diff check pass. The English landing hero and all six map requests were confirmed in the local browser; 390 px and mission-page visual checks remain pending.

### Preview: ask for the certificate name at graduation

- Removed the optional name field from the bottom of the long lobby map, where playtesters could miss it and where it competed with starting a mission.
- The same optional name field now appears only in the completed six-stamp finale, directly beside Print certificate. Existing locally saved names still prefill it, and edits continue to stay in the browser.
- Updated the lobby and copy regressions plus the shared AI instructions. The preview remains uncommitted at the owner's request.

### Preview: keep bonus progress above the journey

- Moved the existing 0/16 hidden-fact badge beside the stamp progress and above the long journey map, where it is visible before scrolling through the mission route.
- Made the same badge more compact in the lobby; its storage, 16-fact target, completion rule and bonus reward are unchanged.
- Added a layout regression that keeps the badge before the map. The preview remains uncommitted at the owner's request.

### Preview: shorten the first story glance

- Cut the Built for and It did opening beats for Curiosity, Ingenuity, Webb and Voyager from paragraphs to a maximum of 18 words each.
- Kept the real mission image, optional character voice, longer on-request story, mission objective and source trail unchanged, so sound-off and reading users retain the same paths.
- Added matching Spanish and Vietnamese copy and a regression budget that prevents the visible opening beats from growing back into paragraphs. The preview remains uncommitted at the owner's request.

### Preview: make the academy goal explicit

- Replaced the vague lobby hook with one short line that tells learners the whole loop: complete six space missions, earn six stamps, and unlock the graduation certificate.
- Kept the existing hero, journey map, passport and six-mission flow unchanged; no extra instruction card or paragraph was added.
- Added matching Spanish and Vietnamese copy and updated the localization regression. The preview remains uncommitted at the owner's request.

### Preview: guide Ingenuity directly and teach every game once

- Replaced Ingenuity's detached position track and left/right buttons with direct guidance on the 3D terrain. The craft automatically flies toward the selected landing patch; holding on the terrain only counters wind drift. A chase camera follows behind Ingenuity and looks toward the destination. Arrow keys/A/D remain available.
- Choosing terrain now reveals one large gold FLY NOW button next to the model. It replaces the former setup sequence while preserving a deliberate launch moment. Wind, lift and drift act from the first flight frame; there is no protected practice animation or pre-flight pace choice. After a failure the same button reads RETRY NOW.
- Failed landings now leave the helicopter visibly wrecked: the body tips, rotor planes bend, rotation stops and dense gray smoke rises. Reduced motion retains a static damaged state.
- Removed the redundant “Smoke means this landing failed” explanation. A drifted craft now stays airborne until it misses the prepared zone, makes an emergency touchdown, buckles a landing leg and strikes a rotor. The result states that damage and the correction directly. Slope and boulder failures retain their own causes.
- Replaced tiny square smoke points with 72 soft round puffs, higher opacity and a taller continuously animated plume. Reduced motion shows the full plume without moving it.
- Removed Pause, Resume flight and Fly one step. Flight is always continuous; leaving the tab pauses automatically and returning resumes automatically without another decision. Reduced motion changes presentation, not the control flow.
- All six missions keep their visual How to play guide closed but highlight it on a learner's first visit. The game remains immediately operable, and the guide stays reopenable without another instruction card or modal.
- Added EN/ES/VI guidance, a six-game friction audit and controller/scene regression coverage. 179 tests pass; browser and 390px verification remain pending. The preview is still uncommitted at the owner's request.
- Rebuilt Apollo 17's side diagram as the same two-wheel rover silhouette shown in 3D. Both views now anchor the patch to the same exposed wheel, use the same model scale, and show matching green maps, white tape and orange clamps. The 3D patch sits outside the body instead of disappearing through it. A patch that touches the wheel or extends into the equipment zone turns red and displays FAIL immediately; it cannot pass the dust test.
- Reframed Surveyor 3 as a stationary geology field lab instead of a smaller landing-zone game. Its three circles are now one continuous soil transect with three sample points; the probe moves between them, excavated cross-sections reveal layers, and a separate two-foot pressure rig performs the final footprint test while Surveyor stays put. Step names and copy now distinguish sampling, probing and footprint evidence from Ingenuity's flight loop.

### Preview: a clear next action after choosing a flight patch

- In 3D, Ingenuity's terrain labels are the single zone selector. The duplicate palette only appears in 2D fallback.
- Choosing a patch now displays its name, an explicit Press Lift off instruction and a gold launch button on the model's own deck. Pacing and retry live there too. Steering is hidden until launch.
- 176 tests pass, including scene selection enabling the deck action and switching fallback without losing the patch. Added EN/ES/VI instructions. Browser access remains unavailable, so visual verification is pending. Still uncommitted at the owner's request.

### Preview: visual Ingenuity flight game (not committed or deployed)

- Replaced the link, rotor-power and numeric-trim form with a visual flight game using the existing 3D helicopter and three landing environments. Select a labelled patch, lift off, then hold/tap left or right against visible gusts. Ground markers, dotted path boundaries, lean, drift and a ground shadow connect input to the scene.
- Controls remain alongside the model. Pause, one-second steps and retry from just before landing provide a forgiving alternative to realtime input. Rocks and slopes remain flyable experiments and fail at touchdown with specific feedback; a safe level landing calls the existing stamp ceremony. No stamp or certificate count changes.
- Updated EN/ES/VI controls, Quick Start, teacher guidance, Sources & credits, accessibility notes and `docs/INGENUITY_FLIGHT.md`. Flight values are identified as an original teaching simulation.
- Validation: 174 tests cover flight outcomes, steering, retry, equivalent time stepping, pause-on-blur, reduced-motion pacing, cleanup and a single success callback. Browser verification was blocked by unavailable browser access and native URL-policy uncertainty, so actual WebGL/mobile/UI playtesting remains pending. Owner asked to keep everything local and uncommitted.

### Preview: story voices and obvious Curiosity repair (not committed or deployed)

- Added Hear my message / Stop my message beside the opening story for the four machines with supplied recordings. The matching transcript appears on request, translated with the interface; audio is explicitly labelled English. No autoplay, new AI generation or new recording. Sound-off, navigation and reset stop playback.
- Curiosity shows a gold Repair & restart rover action at the failed program or Free Explore controls and highlights the existing reset. Repair restores health and the start position, keeps the program blocks, and preserves the current driving mode. Hazard feedback now tells the player which action to use.
- Verified 161 tests/build, all four voice routes, mouse/keyboard, EN/ES/VI, 390px and reduced motion; actual hazard crash/recovery preserved two blocks. Owner explicitly requested keeping this work uncommitted for review.

### Phone header links in one swipeable row

- On phones the five header links (Sources & credits, For Teachers, Display & access, Mission notes, About) stay visible, as agreed, but sit in one swipeable row instead of a three-column grid. The header is about 122 px tall instead of about 175 px, so the lobby headline starts about 50 px higher.
- The row is limited to the screen width; an unconstrained row had made the whole page wider than a 390 px phone.

### Stamps you can see

- The lobby now shows one stamp slot per mission under “Your mission stamps”: a dashed numbered circle until the mission is done, then a gold tilted ✓ stamp with the machine's name in bold. Slots are built from the mission registry.
- The progress bar is 12 px tall (was 5 px) and fills smoothly; it stays still with reduced motion.
- On the journey map, a finished mission's card turns green with a gold ✓ stamp on its corner, in addition to the existing “Stamp earned ✓” text.
- No stamp, finale or storage rule changed; this is display only.

### Child-readable text sizes and a compact phone mission switcher

- Added `src/readable-type.css`, loaded last: labels are now at least 12 px and text meant to be read at least 14 px (was as small as 7.7–10 px in places such as “TRAINING MODULE”, map callouts, opening labels and the stamp counter). Sizes use rem so the larger-text setting still scales them.
- On phones the six-mission switcher above each mission is one swipeable row of names about 49 px tall instead of a 290 px block; the current mission is scrolled into view. The hidden labels stay available to screen readers. The first challenge control moves up by about 200 px.
- Desktop layout is unchanged.

### Optional feedback and automatically updated impact

- Added the owner's Google Form to every mission ending, the footer, the graduation certificate controls and the printable certificate. Feedback stays optional; certificate names and progress are not prefilled or uploaded.
- About links to a localized `#impact` page. A same-origin Netlify function discovers Sheet headers, then requests only known closed-question columns. Age and short-answer values are never requested or returned.
- Results refresh about every five minutes while open, without rebuilding the site. Counts, paired means and per-question denominators are reported honestly; empty and failed data have distinct states. Conflicting duplicate After ratings are excluded from that measure.
- Updated privacy and the playtest guide. Verified the actual source had zero responses; populated/error and six-stamp graduation views were tested locally with isolated fixtures, without submitting a real response.
- Validation: 154 tests, production build and live Sheet aggregation passed. The printed certificate link was inspected in the markup; physical printing and a fresh six-mission playthrough were not repeated.
- Post-deploy verification: production API returned HTTP 200 with actual zero-response aggregates, and the public impact page displayed the matching waiting state and data-check time.

### Make the lobby map the mission picker

- Corrected the previous interpretation of the owner's request: removed the Choose your mission card grid and restored the full journey map directly in the lobby, above the optional certificate name.
- Each of the six map callouts has a large solid surface and an explicit Play mission / Play again action. Earned stamps are shown on the corresponding callout. The point and its leader still locate the machine on the Moon, Mars or deep-space view.
- Increased scene spacing to keep enlarged labels clear of neighboring headings and source credits, including larger text at 390px. The old `#journey` URL opens the lobby map. Mission notes, About, visible header links and Settings remain as agreed.
- Verified all six callout clicks reach the correct mission, EN/ES/VI actions, 390px/desktop, larger text/high contrast and no callout overflow. Tests and production build pass (146 tests). Six-stamp conditions are unchanged.

### Direct navigation and separate academy pages

- Removed lobby dropdowns. Kept the six enlarged mission cards as the main entry and added a direct journey-map link. The optional certificate name is a normal field below the cards with readable helper text.
- Mission notes, About and the journey map have separate hash routes with Back links and direct reload/history support. DSN/archive and map rendering start on their respective pages rather than the lobby.
- For Teachers, Sources, Settings, Mission notes and About are visible header actions at desktop and mobile widths. Motion and sound are in Settings; repeated footer actions are hidden while privacy remains available.
- Updated DSN placement in Sources and the generated reference exports. EN/ES/VI, 390px navigation, page reload/history, map rendering and Settings were checked. Validation: 146 tests and production build passed.

### Sunlight lobby with fewer decisions

- The lobby defaults to a cream background, dark text and a clear blue start button. A keyboard-operable Sun/Moon button remembers the lobby display choice; mission scenes keep their existing appearance.
- Replaced the adult-facing hook with two direct actions and one short line. The six mission cards retain their icons, names, action verbs and earned stamps, while repeated subtitles and open labels no longer compete for attention.
- The journey map and bonus discoveries share an optional disclosure. Source credits, live-data notes and all six mission links remain available.
- Secondary lobby header actions share Menu on desktop and mobile; closing a dialog opened there returns keyboard focus to Menu.
- Added EN/ES/VI copy and preference tests. Verified desktop/390px, keyboard toggle, persistence, reduced motion, larger text, high contrast, map expansion and lobby-to-mission navigation. Validation: 145 tests and production build passed.

### Consolidate mission guidance and Voyager voices

- Voyager's language/country search and selected greeting now share one listening area with one native player. Keyboard tabs switch between the original 1977 greetings and approved visitor recordings; the public gallery no longer sits inside More to explore.
- Removed the cover-painting grid and duplicate Voyager instruction cards. Text and audio now share one private-save action. Optional name, country and translation fields are grouped; saved greetings remain beside the studio, with classroom sharing and review in one disclosure.
- All six missions group the visual Quick Start and explanation under How to play. The four original exhibits combine story and briefing under Story & science. Signal Lab's result sits with the optional lab.
- Audio stops when another Voyager voice starts or when a gallery filter removes it. Missing class/consent actions reveal the appropriate sharing control.
- Fixed direct hash/Back/Forward navigation leaving the Moon page over another module. EN/ES/VI and 390px layouts were checked, including the Voyager text-to-stamp path. Public production gallery returned zero approved recordings; populated playback was tested with an isolated local fixture only.
- Validation: 143 tests and production build passed. Handoff and classroom guide updated; no publication rules or stamp conditions changed.

## 2026-11-14

### Rover gameplay and mission experiments

- Curiosity's numbered anatomy hotspots hide during driving/command motion and return when it stops.

- Appending Curiosity commands preserves a matching executed prefix; entering a rock tile disables the rover and turns its particle effect into rising grey smoke.
- Moon steps permit early experimentation; Surveyor recommendations still require evidence.
- Voyager adds a locally saved, keyboard-operable record-cover painting grid.
- Verified incremental movement, hazard damage and smoke, marker visibility, and cover persistence locally; released after the owner's explicit push request.

### Golden Record logo

- Replaced the “M•” mark and the unrelated triangle favicon with one logo: Voyager's Golden Record with a heartbeat shaped like an M. The header mark and the browser-tab icon now share the same shape.
- The heartbeat redraws slowly in the header only when motion is allowed; with reduced motion it stays still. The mark is decorative (`aria-hidden`); the link keeps its text name.
- Original Mission Alive artwork; no NASA logo or NASA image is used.

### Rover fender orientation

- Corrected the three fixed Apollo rover fenders to form upper wheel arches aligned with the Z wheel axles. The previous extra rotation turned their arcs sideways and below the hubs.
- Added a geometry regression for all three fixed fenders; the fourth wheel remains exposed for the repair challenge.
- The owner approved releasing the previously held local correction with the mission gameplay changes.

### Make mission actions distinct and explain each active step

- Apollo now has a select/place or drag/drop repair workbench. Its editable side-view patch is visible beside the 3D preview; the white tip supports dragging and keyboard length/angle adjustment. Numeric settings are optional.
- Surveyor now has a pull-and-release probe and three sweepable excavation strips. These feed the existing force, trench and landing model; button alternatives remain available.
- All six missions have short first-person context, a direct action and a completion goal at the relevant playable step. Curiosity uses commands, Ingenuity flight control, Webb optical alignment and Voyager a personal message.
- Replaced the earlier generic Mission Moment cards in the active controls. Spanish and Vietnamese cover every new instruction and tool label.
- Production playtesting corrected field-tool state binding and separated selected-patch data from navigation targets, so excavation visuals update and landing adjustments stay in the landing step.
- Reset and alternative force buttons also synchronize the visual probe. The displayed measurement appears once beside the field tools.
- The patch tip has a larger invisible touch target around its visible grip; assembly/measurement feedback is shown once and quick-start wording matches the new workbench.

### Six-module navigation on both Moon missions

- Apollo 17 LRV and Surveyor 3 now show the same six-module training navigation used by Curiosity, Ingenuity, Webb, and Voyager.
- The active Moon mission is marked as current, earned missions show their completion star, and every module remains directly reachable without returning to the lobby.

### Make Moon choices explain themselves

- Apollo 17 and Surveyor 3 challenge panels now keep a visible mission identity beside the controls, so the machine name remains clear while a learner scrolls.
- Surveyor's three fictional patches now show their actual teaching difference: even shallow cover, even deep cover, or uneven cover with tilt risk. The underlying model and evidence rules remain unchanged.

### Add a mission moment before every challenge

- Each of the six missions now opens its challenge with a short incident and a repair direction, so the learner has a reason to act before touching controls.
- The Moon labs describe the dust-shield failure and the unexpected ground response; Curiosity, Ingenuity, Webb, and Voyager connect their existing retry loops to a clear failure or constraint.
- The additions are concise, translated into Spanish and Vietnamese, and do not alter stamp conditions or the underlying challenge models.

### Curiosity gallery images restored in production

- The Content-Security-Policy added earlier allowed images and requests only from the site itself, so the Curiosity gallery's NASA images were blocked on Netlify. The policy now also allows `https://images-assets.nasa.gov` for images and `https://images-api.nasa.gov` for the gallery search. Nothing else was loosened.
- A test now fails if the gallery uses a host the policy does not allow, or if any other external host is added to the policy.

### One challenge step at a time

- Webb now replaces the completed deployment panel with alignment, then replaces alignment with infrared. The step bar reopens unlocked earlier steps without losing progress.
- Apollo automatically leaves assembly after maps, tape and clamps are fitted. Its next panel shows length and the dust test; angle and clearance remain in More adjustments.
- Surveyor reveals site selection, evidence gathering and landing one at a time, advancing when evidence is complete. Its history and Apollo's trial table are initially collapsed.
- Webb's additional arrow-button controls and real-image sequence are available in clearly labelled disclosures. Keyboard operation remains available throughout.
- The complete static NASA gallery is inside the image disclosure too, with responsive image heights so source dimensions cannot stretch the control panel.
- Step navigation and reset retain the existing controls, game outcomes and stamp conditions, with Spanish and Vietnamese labels.

### Moon pages open like the other four missions

- Apollo 17 and Surveyor 3 pages now use the same opening as the other missions: the real NASA photograph beside “Built for” and “It did”, taken from each machine's existing sourced facts, then the challenge. The photo is no longer pinned to the right of a narrow summary.
- Moon photo credits now show the credit holder verbatim (for example “NASA/Harrison Schmitt”) instead of the half-translated “Ảnh credit:” / “Imagen credit:”.

### Story first, then play, with no intro dialog

- Curiosity, Ingenuity, Webb and Voyager no longer open a separate “mission view” dialog with a Start exploring button before the page. The page itself now opens with the real mission image (credited), the machine's voice, and two short beats (“Built for”, “It did”), then Your mission and the challenge directly below.
- The dialog remains available from the existing story button; “Still out there”, the transmission and the gift still follow the stamp.
- On the Voyager Pale Blue Dot thumbnail, Earth is a single pixel, so a ring labelled “Earth is here” marks its measured position. The photo itself is not altered.
- Spanish and Vietnamese copy added.

### Moon model and presentation rebuild

- Replaced the isolated Apollo wheel and box shapes with a full rover reconstruction; added Surveyor's triangular frame, instrument mast, legs, pads and sampler.
- Matched the existing machine scenes' metal palette, lighting and regolith base; corrected shadow artifacts on the ground.
- Added on-demand, visibility-aware rendering with a 30 fps interaction cap and cancellation of particle/probe animation work.
- Shortened Moon page introductions, added credited NASA mission photography, and placed Surveyor controls beside its model on desktop.
- Centered Surveyor's camera on the chosen soil patch and removed the second page scrollbar while Moon training is open.
- The existing repair, evidence, landing and six-stamp rules remain in place.

### One Voyager distance and countdown card

- The light-day countdown now sits inside the live distance card, under the sentence that explains it, instead of in a second card.
- Replaced the stale Signal arrival line (“Voyager's one-way light-time is shown below”) with an invitation to time a ping in Signal Lab; Spanish and Vietnamese copy added.

### Clearer 3D study and shorter Ingenuity controls

- Moved the keyboard-friendly anatomy tray below the canvas for Curiosity, Ingenuity, Webb, and Voyager so part names no longer cover the machines.
- Constrained long part labels to a horizontally scrollable tray at narrow widths instead of allowing them to widen the page or the 3D stage.
- Kept the 3D study column visible beside long controls on wider screens; mobile retains a normal, unobstructed document flow.
- Reworked Ingenuity into three progressive panels: choose a site and onboard controller, power the rotors, then fly and land. Only the active panel is shown.
- Replaced seven repeated rotor-power presses with one safe-speed action while preserving the safe band, wind trim, continuous/step-by-step flight, terrain failures, retries, stamp, and flight log.
- Added Spanish and Vietnamese copy and regression tests for the new layout and flow.

### Voyager distance card without the confusing light-time

- Removed “23.99 hours one way at light speed”. Rounded beside the light-day countdown, it looked like a contradiction (the real gap was about 31 light-seconds, which Voyager needs days to cover).
- The live card now says what the number is heading for: one light-day (about 25.9 billion km), when a message takes a full day to reach us. It switches to past tense on NASA’s milestone date, the same instant the countdown uses.
- Replaced the adult status line with “Estimate from NASA/JPL Horizons, not a signal from the spacecraft”. Spanish and Vietnamese copy added.

### Direct main deployment workflow

- Updated the shared Codex and Claude instructions to commit and push validated changes directly to `main`, which is connected to Netlify auto-deploy.
- Reconciled the rebuilt public repository history with the current application history without force-pushing or changing the application tree.

### 3D Moon challenges

- Moved the new 3D work into the playable Apollo 17 and Surveyor 3 challenges instead of keeping a separate decorative model viewer.
- Apollo's controls now reshape a 3D map fender, and each dust test animates caught versus escaping particles around the rover wheel.
- Surveyor's patch, probe, trench, footpad, and touchdown controls now update a 3D soil-and-lander simulation, including visible sinking and tilt.
- Preserved the original SVG simulations as automatic WebGL fallbacks and kept every result available as accessible text.

### Initial Moon model previews (superseded)

- Added lightweight procedural previews for Apollo 17 LRV and Surveyor 3. These standalone viewers were replaced in the next change by 3D scenes inside the actual challenges, avoiding a repeated decorative step.

### Apollo 17 repair playtest fixes

- A child playtest needed six dust tests to pass; the target is two or three. The workshop now starts level and clear of the wheel (30 cm / 0° / 4 cm) but too short, so one length change after assembly passes.
- Hints now name one control, a direction and a rough amount (“a little” / “a lot”) instead of two changes at once, and are chosen so they still pass if the learner presses one or two times too many. No winning number is revealed.
- Maps, tape and clamps apply with one tap each; the separate “Apply selected tool” button is gone.
- A negative model gap now reads “Touching the wheel” instead of a minus number.
- Spanish and Vietnamese copy added for every new hint and label.

### Public privacy notice and deployment headers

- Added a keyboard-accessible “Privacy & sharing” footer dialog explaining local-only progress, classroom submission consent, teacher moderation, public gallery fields, removal, retention, and optional AI screening.
- Added Spanish and Vietnamese copy for the full notice.
- Added CSP, HSTS, frame protection, and browser permission restrictions to the Netlify deployment while preserving same-origin microphone recording and APIs.

### Shared AI handoff

- Renamed `docs/CLAUDE_HANDOFF.md` to `docs/AI_HANDOFF.md` so Claude and Codex share one handoff.
- Added a “Current state” section and a per-commit handoff log; `CLAUDE.md` and `AGENTS.md` now require both to be updated in every commit.

### Dedicated Apollo 17 and Surveyor 3 pages

- Added direct `#apollo17` and `#surveyor3` routes instead of opening both missions through the shared Moon chooser.
- Each Moon route now opens as a full-page mission with its own purpose, official source, existing interactive challenge, stamp ceremony, and return action.
- Updated the Moon map pins, lobby cards, browser history, and direct-link loading to use the dedicated routes without changing the six-stamp finale.
- The route-page back button now has a matching accessible name (“Back to academy”) instead of the stale “Close Moon training” label, and both its visible text and name have Spanish and Vietnamese translations.

### Unified training and certification deck

- Merged the duplicate machine picker and certification grid into one six-card training deck.
- Kept the visual machine silhouettes while adding mission numbers, descriptions, live stamp state, and the shared progress bar to the same cards.
- Preserved the direct mission CTA, six-stamp progress, passport, finale, and certificate behavior.

### Journey map credit spacing

- Anchored the Moon and Mars image credits inside their own scenes on desktop and mobile so they cannot overlap the following frontier heading or distance label.

### Lobby launch bay redesign

- Replaced the text-heavy opening flow with an immediate mission CTA and a visual six-machine launch bay.
- Added original code-drawn machine silhouettes with direct links to all six missions.
- Moved the optional certificate name field below the mission choices.
- Moved teacher and project background copy into a lower “About Mission Alive” disclosure.
- Replaced repeated mission-card instructions with one action verb and one “Open mission” link.
- Collapsed mobile header utilities into a keyboard-accessible Menu while keeping language and passport visible.
- Added reduced-motion behavior and English, Spanish, and Vietnamese copy for the new controls.

### Problem framing and lobby hook

- Replaced the three-paragraph lobby introduction with a two-line child-readable hook beneath the main headline.
- Added Spanish and Vietnamese translations for both hook lines.
- Rewrote the project-page problem section around verified LEGO/Harris Poll figures and a separately sourced 11-to-14 STEM-interest finding.
- Added both research sources to the public resource catalogue.
- Added a repository rule requiring future changes to update Markdown documentation for Claude in the same commit.

### GitHub presentation

- Rebuilt the README around product framing, Quick Start, a 90-second tour, architecture, verification, accessibility, privacy, deployment, and source documentation.
- Added a sourced Problem and Solution document.
- Added `CLAUDE.md` and the full Claude handoff.

### Learner onboarding

- Added a shared three-step visual Quick Start to all six missions.
- Moved longer explanations behind optional “Why this works” disclosures.
- Added English, Spanish, and Vietnamese copy for the onboarding pattern.
