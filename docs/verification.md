# Supplied machine voices — October 23, 2026

Added Minh's four final ElevenLabs MP3s under `src/assets/voices/` using the filenames already wired by `src/machine-voices.js`. The four visible final transmissions now match the supplied October 23 scripts; Spanish and Vietnamese have matching written captions. The English recordings remain English in every locale and are never presented as dubbed audio.

All four files are 128 kbps MP3s, approximately 11–13 seconds each. Their copied SHA-256 hashes match the delivered files. The production build emits all four as separate hashed assets. The footer credit appears because the files exist; page load, route entry and enabling Sound do not start speech. A real-browser completion confirms Curiosity remains silent until the visitor presses the certification stamp, then streams the actual MP3 beside the exact transmission. Replay starts it again; Sound off stops it and disables replay. Chrome decoded the media and advanced its playback clock. All four files are discovered by Vite, the completion panel fits at 390px, and the browser reports no runtime or console errors.

**77/77 Node tests, four packaging tests and the production build pass.** The new transmission regression test pins all four recording scripts and requires distinct Spanish and Vietnamese captions. Evidence: `tmp/real-machine-voices-qa.mjs` and `tmp/real-machine-voices-results.json`.

---

# Language purity follow-up — October 22, 2026

The follow-up found real gaps missed by the initial language smoke test: Voyager's checklist rebuilt ARIA labels from already translated DOM text, combined rover cell roles were only partially translated, one Webb completion hint and Field notes distance copy remained English, live NASA image titles could introduce new English, original NASA greeting meanings stayed English, and autocomplete/default visitor labels could remain English.

Fixed these by keeping canonical source text for derived messages, translating composed map roles/directions, filling the missing copy, adding Mission Alive translations of all 55 greeting meanings, and putting NASA's verbatim English text in a separate optional disclosure. Live photo titles use known translations or an honest localized NASA archive caption plus ID; source links preserve access to original metadata. Autocomplete labels localize and saved countries resolve to canonical values, even after a language switch. Default anonymous names and English-translation prefixes localize while actual visitor words remain unchanged. Classroom error strings and moderation statuses have translations. Vietnamese serif text uses Times New Roman to avoid the mixed-glyph spacing observed in Georgia on Windows.

After the fixes, **216 browser snapshots pass** across Vietnamese and Spanish, including English round trips: all four real mission completions, failed rover programs, all three Ingenuity landing zones, Webb partial deployment/alignment/infrared, source notes, story chapters, all 55 greetings in each language, graduation and teachers/print-resource DOM. There are zero canonical-output mismatches and no runtime errors. Explicit assertions confirm the Voyager checklist no longer retains a different language and each greeting has its localized meaning. Proper names, source identifiers, units and generated dates are reviewed separately from untranslated interface sentences.

**10 additional focused checks pass** after the final autocomplete/profile changes: translated native suggestions; optional untouched NASA originals; original visitor message/translation preservation; localized default names/countries; canonical country comparison; checklist round trips; and a mocked unknown future NASA image title producing a local archive caption, then returning to its original title in English. Both 390px layouts fit. The Vietnamese and Spanish greeting screenshots were visually inspected after the font change.

**76/76 Node tests and four packaging tests pass; production build succeeds.** New regression tests cover all 55 meanings, combined accessible grid labels, translated location markers, future live-image metadata, cross-language country normalization, and every classroom API error/moderation status. Build still reports scene/application chunk-size advisories.

Evidence: `tmp/language-purity-qa.mjs`, `tmp/language-purity-focused.mjs`, their result JSON files, and `docs/screenshots/language-purity-{vi,es}-greeting-mobile.png`. This is automated Chrome/emulated-mobile validation, not a claim that every future upstream response or every human screen-reader/browser combination was tested. Intentional exceptions are proper names/codes, visitor-authored content, original audio in its spoken language, and explicitly opened original NASA text. Earlier entries below describe their historical versions.

---

# English, Spanish and Vietnamese — October 22, 2026

Added the persistent header language selector, local ES/VI catalogs, exact-text/template translation and incremental DOM updates. Language switches preserve mission state, rover blocks, flight trim, event handlers and typed form values. The selector is native and keyboard accessible; all three autonyms remain readable in every language. The responsive header wraps at small widths. Canonical option values, source URLs, machine IDs, user-authored words and NASA's published English greeting quotations are preserved. Greeting search accepts translated language/country names, including Vietnamese without accents.

Coverage includes all four stories, transmissions, science/part descriptions and challenges, feedback and accessible labels, live data labels, hidden facts/history, recording/classroom forms, certification/finale, teacher guides and five printable resources. Scientific names, measurements, NASA attribution and NGSS codes retain their source meaning. Dates/numbers use the selected locale where formatted; history dates use UTC, while graduation keeps the visitor's calendar day. The language setting adds only a local preference and no translation API. Original recordings remain original; this change does not generate dubbed narration.

Verification: **70/70 Node tests**, **four packaging tests**, and production build pass. Thirteen localization tests cover exact/normalized strings, placeholder parity, nested templates, regex punctuation, invalid locales, user-name protection, NASA identifiers, bilingual search and unchanged canonical source data. Build emits chunk-size advisories for the scene and application/catalog bundles; it completes successfully.

**15 clean-run browser checks pass** with empty progress storage: build Curiosity's real program in Spanish, switch languages mid-program, complete it, fly Ingenuity in Vietnamese with trim preserved across switches, complete Webb in Spanish, find translated Voyager language/country labels, play the original recording, save a written greeting and earn the fourth stamp. Transmissions are translated; graduation opens automatically. Certificate printing preserves a name that itself matches UI copy. All four stamps and the language survive reload; switching back restores English. **Three focused checks pass** for the original 3D model/part descriptions/keyboard camera labels, the localized native delete prompt, and blocked locale storage plus keyboard language selection. Both result files report `failed: false`, with no runtime errors.

The six-route catalog/layout audit reports 390px document/body width and no out-of-bounds visible content. Remaining identical strings are proper names, codes, credits, dates/numeric values and country names shared across languages. Teacher DOM coverage includes hidden print resources. Evidence: `tmp/localization-qa.mjs`, `tmp/localization-focused-qa.mjs`, `tmp/localization-audit.mjs` and their JSON results; screenshots `docs/screenshots/languages-*.png`. Spanish lobby and Vietnamese finale screenshots were visually inspected. An initial 3D screenshot timed out with software rendering; the focused functional model checks pass without that screenshot. These are automated Chrome/emulated-mobile checks, not human screen-reader, physical-device or classroom validation.

The Netlify packager continues to retain only current and previous distinct source ZIPs. No new voice assets, analytics or public publishing defaults were introduced.

---

# MASTER additions A8–A10 verification — October 22, 2026

The latest MASTER attachment adds A8–A10 to the previously completed A1–A7/C work. Existing scientific challenge requirements remain; certification now requires the requested deliberate stamp press. No real ElevenLabs files have been supplied, so speech remains ready for those files and is tested only with clearly separated fixtures.

| Item | Result and implementation |
| --- | --- |
| A8 | PASS. The folded card and reopened Story dialog contain only Built for / It did, followed by the existing meanwhile line. Still out there remains in the source data and appears in the completion panel before the full transmission and gift. The fresh four-module run never opened a reading toggle before earning its stamps, yet checked all four exact present-state paragraphs and transmissions. |
| A9 | PASS. First program failure/bad controller setup/out-of-focus placement uses the exact supplied Curiosity/Ingenuity/Webb virtue line in its existing feedback area. Later failures in that exhibit sequence use the ordinary instructional hint. A new exhibit/reset begins a fresh sequence; ordinary program/flight retries do not reset the virtue allowance. Voyager's DSN absence line is retained. |
| A10 | PASS. Each first completion focuses a prominent native DRIVE/FLY/UNFOLD/LISTEN button and leaves progress unchanged. One click/tap/Space/Enter starts the stamp. Ink settles at 750ms, then progress is saved. Present state appears first; the transmission/audio reveal follows 180ms later, then gift and navigation at 360ms. No second press is needed. Reduced motion uses a fade without slam/bounce; Sound controls a soft synthesized stamp thud. |

The settled stamp remains visible as an ink seal in the completion panel. Its heading receives focus after the button is replaced. The existing polite announcer says `Stamp earned: <machine>. <full transmission>`; Voyager uses its existing queued region. The completion panel itself is not a competing live region.

Navigation/reset disposes the ceremony and all owner-bound reveal/finale timers. Replay of a completed mission shows “Already stamped,” does not change saved progress, and does not automatically speak the transmission or repeat the ceremony. Legacy `mission-alive-passport-v2` stamps still load. The fourth stamp still opens graduation automatically, with a reading interval based on the mandatory completion text instead of immediately covering it. The completion button can open graduation sooner. A guard prevents the delayed automatic path from reopening a finale that was opened and closed manually.

## Verification

- **57/57 Node tests pass**, including four stamp-cycle tests for delayed commit, duplicate activation, cancellation and stale callbacks, plus two first-failure feedback state tests. Production build passes with the existing Three.js chunk-size advisory.
- **43 clean-run browser checks pass:** genuinely empty storage, four real mission completions, native Enter/Space/tap/click across the four stamps, unchanged pre-press count, measured commits around 755–770ms, exact present state → transmission → gift order, full polite announcements, 390px waiting/settled layouts, automatic finale, X/Escape, retained two-beat reading sections, and real completed-module replay without a second award. No stamps were injected for this run.
- **Eight focused checks pass:** each first virtue followed by its practical hint, normal-motion waiting pulse and weighted ink animations, actual departure about 68ms after press with no late award, reset during stamping, ordered timed reveals and no runtime/console errors. Native mouse input at the pulsing button's center is used because Playwright's generic locator click waits for stationary geometry. Initial normal-motion automation encountered action-completion/timing stalls; no app or simulation behavior was changed to bypass them. Final timing and animation evidence is recorded in the result file.
- **Three legacy/finale guard checks pass:** an isolated fixture loads three old stamps, completes the remaining Webb mission through real controls and presses its stamp. Opening/closing graduation manually and advancing the browser clock 60 seconds does not reopen it. This seeded fixture is separate from the clean 0/4 run.
- **11 supplied-audio fixture checks pass:** no final voice or stamp before the waiting button is pressed; final playback accompanies the revealed transmission after pressing; explicit replay, Sound, navigation/reset, once-per-attempt optional cues, recoverable playback denial and 390px layout remain functional. Fixture media stays confined to intercepted browser requests; no fake machine MP3 is added to source or ZIP.

Evidence: `tmp/ceremony-clean-run-qa.mjs`, `tmp/ceremony-focused-qa.mjs`, `tmp/ceremony-finale-guard-qa.mjs`, `tmp/ceremony-voices-fixture-qa.mjs` and their corresponding results JSON files. All four result files report `failed: false`. Screenshots under `docs/screenshots` include `ceremony-*-waiting-mobile.png`, `ceremony-*-transmission-mobile.png`, `ceremony-normal-completed-mobile.png` and `ceremony-automatic-finale-mobile.png`. Representative waiting/completion screenshots were visually inspected.

These are Chrome desktop/emulated-mobile and media-fixture checks, not human screen-reader, physical-device or student testing. No new NASA API or voice-generation service was used. The countdown target remains exactly `2026-11-18T10:16:07Z`; real voice deliveries remain pending as previously agreed.

Packaging retains only the current source ZIP and the exact distinct version before A8–A10. ZIP contents, required Functions, source bytes, file permissions, integrity and previous-version hash are checked after packaging. No public Netlify redeploy is made.

The older reports below describe their corresponding snapshots.

---

# MASTER prompt verification — October 22, 2026

Checked against the October 22 self-contained MASTER prompt. Minh confirmed that the ElevenLabs files have not been generated and requested code that waits for them. The implementation below is complete for that scope; no substitute machine speech or dummy MP3 is shipped. This is a local source/build and replacement upload ZIP, not a public Netlify redeploy.

| Item | Result |
| --- | --- |
| A1 | Already applied. Visible product framing, including teachers, KWL, certificate, titles and metadata, uses academy/training. Only compatibility identifiers contain `museum`. No additional science-content instance required changing. The earlier exact Webb sentence and its product-framing review are recorded in the F10 report below. |
| A2 | Updated both the exhibit voice and the teacher read-aloud hook to exactly: “Every move I make was planned on Earth hours ago. Then I go alone.” The old steering phrase is absent from runtime source. |
| A3 | Already complete and preserved, including the final “I am still saying it.” The fresh-run browser test checks the full visible Voyager transmission. |
| A4 | Written-item confirmation is “Delete this private greeting from this device?” and success is “Private greeting deleted from this device.” Audio retains `recording`. Browser checks cancel and accept against actual disposable IndexedDB entries. |
| A5 | Already applied and retained. All four begin with voice/objective, then the original challenge. Story and briefing remain separate initially closed disclosures below it, with working one-click reading. |
| A6 | Added each exact supplied meanwhile line at the end of its three-beat card and in the reopened Story dialog. All four exact strings and their placement were checked independently in the browser. No original beat was removed. |
| A7 | Each exact gift line follows its stamp transmission. The finale carries “You carry patience, daring, precision, and endurance now. That is the crew.” next to the existing roll call. These are text only; no new counters, badges, progress or storage fields were introduced. |
| B | Awaiting Minh's four final MP3s, as explicitly agreed. Generation, voice quality and actual ElevenLabs output have not been claimed or tested. Exact filenames/scripts and optional mid-lines are in `docs/MACHINE_VOICES.md`. |
| C1 | Ready for supplied assets. Stamp playback keeps the written transmission, obeys Sound, and provides a replay button only for an existing final file. Sound off stops playback and disables replay. Page load, route entry and enabling Sound never start speech. Other recordings/mechanism loops are kept from masking the final voice. Browser autoplay denial is caught and replay can retry. |
| C2 | Optional files are wired only to a blocked programmed Curiosity route, an active Ingenuity flight outside the safe wind band, or an out-of-focus Webb placement/keyboard adjustment. Each machine's cue plays at most once per attempt. Reset/new attempt restores the allowance; incidental cues cannot interrupt a final transmission. Pointer cancellation does not trigger Webb speech. |
| C3 | The exact ElevenLabs credit is prepared in the project footer, hidden until at least one supplied machine-voice asset exists. The no-file build has no visible credit claim or inactive voice controls. |

The countdown remains exactly `2026-11-18T10:16:07Z`. Existing mission mechanics, stamp rules, 55 original greetings, NASA recordings and 3D models are retained.

## Verification

- **51/51 Node tests pass**, including six new playback-controller tests covering no-file behavior, explicit playback, module isolation, once-per-attempt cues, autoplay/media failures and cancellation of a pending play promise. Four archive-retention tests also pass.
- **Production build passes** with the existing large Three.js chunk advisory. Vite includes only real supplied voice files. Independent isolated production-build tests verified both an empty voice set and correctly named final/mid fixture files without adding any MP3 to the actual project.
- **38 clean-run browser checks pass:** fresh empty storage and 0/4, all four real completions, four full transmissions, four exact gift lines, all meanwhile lines in folded cards/dialogs, automatic 4/4 finale with zero certificate actions, X/Escape, preserved reading order and 390px layout across lobby/modules/teachers/finale. No runtime or console errors.
- **Five greeting checks pass:** no absent-voice requests or false visible credit; cancel preserves the written greeting; accept removes it with the right terminology; audio deletion still says recording; 390px fit and no runtime errors.
- **Ten supplied-asset browser-fixture checks pass:** actual media time advances, no load autoplay, conditional attribution/replay, blocked-route and out-of-focus cues, once-per-attempt limits, navigation/Sound/reset cancellation, wind correction followed by an actual successful stamp and final playback, replay, recoverable injected `NotAllowedError`, mobile replay layout and the corrected teacher hook.

The supplied-asset fixture intercepts browser requests and uses existing NASA MP3 bytes solely to test media behavior; those bytes are never shipped or presented to visitors as generated machine voices. One initial test left Ingenuity outside the safe band too long while sending 65 separate keypresses and did not complete the flight. The final test uses one ordinary pointer correction into the safe band; it passes without changing simulation behavior.

Evidence: `tmp/master-clean-run-qa.mjs` / `tmp/master-clean-run-results.json`, `tmp/master-greetings-qa.mjs` / `tmp/master-greetings-results.json`, `tmp/master-voices-fixture-qa.mjs` / `tmp/master-voices-fixture-results.json`. Screenshots include four `master-*-transmission-mobile.png` files and `master-automatic-finale-mobile.png` under `docs/screenshots`. The fixture replay screenshot is test-only, not evidence that real ElevenLabs files are present. These checks use Chrome and emulated mobile, not physical-device, student or human screen-reader testing.

Packaging keeps only `mission-alive-netlify-update.zip` (this version) and `mission-alive-netlify-previous.zip` (the exact distinct version before this MASTER update). Archive contents, Functions, regular-file permissions, source bytes and previous-version hash are checked after packaging. No new public deployment is made.

The older reports below describe their corresponding snapshots.

---

# Consolidated F1–F11 verification — October 21, 2026

The revised fix list adds F10 and F11. F1–F9 were already implemented; they were audited again, with 45/45 Node tests and eight production-build browser checks passing. F11 supersedes F3's earlier instruction to show the story card before Voyager's player. This report describes the local source/build and upload ZIP, not a redeploy of the public site.

## F10 — academy wording

The lobby now reads exactly: “The machines cannot come home. So this academy does the next best thing: it trains you on them.” The user clarified that all other product references must agree, including teachers and certificates. The remaining Webb sentence was shown to the user before editing: “Webb is the youngest machine in this museum, and the only one whose mission is still near its beginning.” It refers to Mission Alive, not a real institution, so that single word is now “academy.” Teacher-page descriptions, both entry buttons, printable worksheets, the certificate and the chapter-reader introduction now use academy/training language. No real-world museum reference was found.

There are no remaining visitor-facing “museum” product labels. Internal compatibility identifiers such as `museum-announcer`, `museum-lobby`, `data-enter-museum` and `onEnterMuseum` remain; these are not displayed. All scientific facts and four final transmissions are unchanged.

## F11 — challenge before reading

All four exhibits now present the machine's voice and one-sentence objective first, followed by the existing interactive challenge. Two independent disclosures, “Mission story” and “Before you take control,” follow the challenge and are closed initially. They preserve the three-beat story, original quotation/source, chapter reader, training line, science brief and existing supporting copy. Opening a disclosure takes one click. Voyager's full catalog, Signal Lab and time capsule remain in its separate closed “More to explore.”

The layout moves original nodes and restores them on navigation/reset, preserving listeners and IDs. The first interaction is reached without passing the story or briefing; Webb's first wing ends 698px below the exhibit top at 1280 × 768. All four original 3D canvases still mount with usable dimensions, including Voyager after opening More. No mechanic, stamp requirement or countdown target was changed; the target remains exactly `2026-11-18T10:16:07Z`.

The chapter reader's final Continue button opens the folded briefing before scrolling to it. A review caught the Story dialog's old “Start exploring” target pointing at the now-hidden training line; it now uses the actual challenge jump. Desktop tests verify both paths for every exhibit, plus immediate Webb arrow-key adjustment after a pointer click and clean restoration after each reset.

## V1–V3 results

- **V1 PASS:** a new Chrome context began with empty storage and 0/4 stamps. Four genuine challenge completions reached 4/4 and opened TRAINING COMPLETE automatically, with zero certificate-button clicks. The overlay appeared about 8.4 seconds after saving the final greeting, about 2.5 seconds after its queued stamp announcement. X and Escape both closed it.
- **V2 PASS:** every stamp displayed its own exact transmission, independently checked against the visible text:

| Machine | Exact transmission |
| --- | --- |
| Curiosity | They gave me two years. I took fourteen. The mountain is not finished with me yet. |
| Ingenuity | Five flights was all they asked. I flew seventy-two. My wings are broken now, but I already flew. |
| Webb | I am the youngest one here, and my watch has only just begun. There is so much light left to catch. |
| Voyager 1 | They built me to last five years. It has been forty-nine. Everything I say takes a day to reach home. I am still saying it. |

- **V3 PASS:** at 390 × 844 the lobby, every exhibit, teachers and automatic finale fit horizontally, with no visible-control bounds failures. The opened story/briefing sections also fit. No page-specific layout failure was found; representative screenshots were visually inspected.

Evidence: `tmp/f11-clean-run-qa.mjs` / `tmp/f11-clean-run-results.json` (32 checks), `tmp/f11-layout-qa.mjs` / `tmp/f11-layout-results.json` (26 checks), and `tmp/consolidated-data-qa.mjs` / `tmp/consolidated-data-results.json` (eight checks against the final production build). Screenshots include `f11-voyager-challenge-top-mobile.png`, `f11-webb-challenge-desktop.png`, four `f11-*-transmission-mobile.png` files and `f11-automatic-finale-mobile.png` in `docs/screenshots`.

The final runs reported no runtime or console errors. Initial concurrent software-3D automation timed out; sequential 2D functional runs and separate 3D canvas checks passed. These are Chrome desktop/emulated-mobile checks, not physical-device, student or human screen-reader testing. The production build passes with the existing large Three.js chunk advisory.

Packaging retains exactly two source archives: `mission-alive-netlify-update.zip` for this F10/F11 version, and `mission-alive-netlify-previous.zip` for the distinct F1–F9 version immediately before it. No separate static or dated ZIP is generated. ZIP integrity, portable file permissions, required Functions and byte-for-byte source contents are checked after packaging.

The older reports below describe their corresponding snapshots.

---

# Consolidated F1–F9 verification — October 21, 2026

Checked against the supplied consolidated fix list. F6, F7 and clean-run evidence already existed; F1–F5, F8 and F9 needed additions or stricter behavior. This report describes the local source/build and replacement ZIPs, not an automatic redeploy of the public Netlify site.

| Task | Result | Evidence |
| --- | --- | --- |
| F1 | PASS | `server/dsn-now.mjs` derives contact only from active up/down signals for the spacecraft, never assignment alone. `src/voyager-contact.js` requires an explicitly active snapshot and shows friendly station, actual DSS identifiers and range. Failed fetches clear contact even if cached metadata is recent; stale/legacy snapshots are quiet. Tests cover Voyager and JWST assignment-only cases, active uplink/downlink, range from active dishes only, failure, cache, recovery and cleanup. Production-browser fixtures show assignment-only → exact absence; active → Madrid/DSS 63/range; a failed refresh → exact absence. A separate real NASA feed smoke check also returned active Madrid/DSS63. |
| F2 | PASS | Unconfigured community publishing and offline classroom controls are omitted, with no unlock/deployment promises. Private recording and writing remain available. Configured classroom creation/review and community publishing remain. A runtime/build text sweep finds no `will unlock` placeholder. The unavailable live-distance state reports current unavailability rather than a future deployment promise. |
| F3 | PASS | `src/exhibit-layout.js` keeps story/brief, short player, own greeting, arrival result, distance/countdown and DSN in order. The default player offers English, Spanish and Vietnamese. One initially closed `More to explore` contains all 55 searchable greetings, Signal Lab and the time-capsule/archive controls. All original nodes/handlers are restored before navigation/reset. Nine greeting-browser checks cover audio, catalog filtering, country comparison, WebMCP selection, keyboard typed save, archived-item focus/stamp/transmission and navigation restoration. A production test verifies exact kept-node order, 55 retained entries and a usable 3D canvas after opening More. |
| F4 | PASS | A real first-attempt safe flight displays exactly `Your flight plan worked.` A crater attempt followed by a successful flat landing displays exactly `A revised flight plan worked.` The log contains both genuine attempts. |
| F5 | PASS | Pointer down/up explicitly retains focus on the wing. Mouse click then three arrow keys changes the left wing to 30 percent open without Tab. The pure keyboard path reaches the first wing in three Tab presses, opens both wings and reaches alignment. Pointer completion no longer steals focus to a star. |
| F6 | PASS | Grouped integer km update each second using the same Horizons interpolation and one-way light-time. Production-build checks observe the value changing and confirm that its text fits inside a 390px card. Signal Lab reads the numeric km value. |
| F7 | PASS | The native range input has a larger thumb, pointer capture and scoped touch handling. Browser tests start on the thumb, drift vertically, then drag horizontally; trim moves without page scroll or pointer cancellation. Track presses, repeated drags and keyboard operations remain functional. |
| F8 | PASS | Long Webb story/briefing and the repeated control introduction are retained in a closed disclosure. The compact title and original training line remain visible above the challenge/model. At 1280 × 768 the first wing begins about 680px below the exhibit top, with its bottom about 764px below: within one viewport. This measures the actual control, not a shortcut link. |
| F9 | PASS | Header/footer/nav, page title and metadata use academy/training. Exhibit narratives, the lobby/mission briefing line and certificate/teacher narrative were not rewritten. Browser checks find no museum label in the requested chrome. |

The stored countdown target is now exactly `2026-11-18T10:16:07Z`. The earlier code used `10:16:00Z`; the seven-second difference was corrected to match this prompt and [NASA's published instant](https://science.nasa.gov/mission/voyager/voyager-1/voyager-1-what-is-a-light-day/). Tests cover the last second before and the exact instant; no exact hour is printed in the visitor block.

## V1–V3 results

V1 passed in a fresh Chrome context with empty browser storage and 0/4 stamps. Four real challenge completions reached TRAINING COMPLETE automatically after the fourth stamp, with zero certificate-button actions. The final Voyager stamp's announcement preceded the overlay by about 2.5 seconds; queued playback/save announcements make the interval from saving the greeting longer. No stamps or completion state were injected.

V2 independently checked these exact visible transmissions at their corresponding stamp moments:

| Machine | Exact text shown |
| --- | --- |
| Curiosity | They gave me two years. I took fourteen. The mountain is not finished with me yet. |
| Ingenuity | Five flights was all they asked. I flew seventy-two. My wings are broken now, but I already flew. |
| Webb | I am the youngest one here, and my watch has only just begun. There is so much light left to catch. |
| Voyager 1 | They built me to last five years. It has been forty-nine. Everything I say takes a day to reach home. I am still saying it. |

V3 passed at 390 × 844 for the lobby, Curiosity, Ingenuity, Webb and Voyager, plus teachers and the automatic finale. No horizontal document/body overflow or clipped visible controls were found. Focused checks additionally cover the opened 55-language catalog, saved archive, Webb alignment, and raw km readout. No runtime or console errors occurred in the successful browser runs. These are Chrome desktop/emulated-mobile checks, not physical device or human screen-reader tests.

Verification: 45/45 Node tests pass; production build passes (the existing large Three.js chunk advisory remains). Browser evidence: `tmp/consolidated-controls-qa.mjs`, `tmp/consolidated-data-qa.mjs`, `tmp/f3-greetings-qa.mjs`, `tmp/review-clean-run-qa.mjs`, and their results JSON files. Full-run controls use the app's supported 2D mode for reliable software-rendered automation; the collapsed Voyager model was separately checked in 3D. An initial screenshot attempt during software 3D rendering timed out; functional assertions and subsequent 2D screenshot/3D canvas checks succeeded. The old route-ready waits were updated to use the public Webb title because its story is intentionally collapsed by F8.

The older reports below describe their corresponding snapshots.

---

# Review fixes and clean-run verification — October 21, 2026

This entry addresses the review of the visible Voyager counter, Ingenuity thumb dragging, Webb scroll depth, mobile layout, final transmissions and automatic graduation.

- Voyager now displays grouped whole kilometres instead of three-decimal billions, retaining the same Horizons anchor/range-rate interpolation. The text updates every second in either motion mode; accessible labels remain throttled and no per-second announcement region is added. Signal Lab reads the numeric `data-distance-km` value rather than parsing a formatted string. Five new tests verify formatting, one-second progression, reduced-motion cadence, unavailable-data behavior and disposal.
- Ingenuity retains its native range input and keyboard support. The thumb is 26px, the hit area is 46px high, and touch scrolling is disabled only on this control. `src/range-pointer.js` captures an active pointer, preserves its grab offset and dispatches normal input/change events. Real Chrome mouse and emulated 390px touch sequences test a thumb drag with 25px vertical drift before horizontal movement, direct track click, repeated dragging and Home/End/arrow keys. The drag changes trim without a pointer cancellation or page scrolling. These are browser-emulated touch checks, not physical-phone tests.
- Webb now has three compact step-jump buttons. The briefing's challenge link goes directly to mirror deployment. Releasing the second wing advances to the alignment field after the native pointer sequence; keyboard deployment also advances focus to star A. The unlocked infrared shortcut avoids scrolling past the image sequence to find the next control. All three original steps, the NASA image sequence, models, and stamp conditions remain.
- `tmp/review-clean-run-qa.mjs` starts a new Chrome context at 390 × 844 with empty storage and verifies 0/4 before interaction. Four genuine challenge completions produce the four exact independent transmissions. On the final run, the fourth stamp automatically opened TRAINING COMPLETE about 2.5 seconds after its announcement, with no certificate button action. The delay from saving the last greeting was about 8.5 seconds because playback/save/stamp messages are queued for accessibility. X and Escape both work.
- The clean run checks document/body width and visible-control bounds across the lobby, all four modules, teachers, opened Webb alignment, flight comparison and the automatic finale. No horizontal overflow, uncaught JavaScript errors or console errors were observed. Screenshots include `review-*-transmission-mobile.png`, `review-before-fourth-stamp-mobile.png` and `review-automatic-finale-mobile.png`.
- `npm test`: 40/40 pass. `npm run build`: passes with the existing scene-chunk size advisory. `tmp/review-controls-qa.mjs` exercises mouse/touch controls and the production-build API branch using a deterministic Horizons-shaped fixture; fixture values are not presented as a live NASA measurement. Result files are `tmp/review-clean-run-results.json` and `tmp/review-controls-results.json`.
- The final production-build check observed `25,827,000,000 km` change to `25,827,000,017 km` in about a second with reduced motion enabled. The raw readout fits internally at 390px, and Signal Lab uses its numeric kilometres. All six focused checks passed without runtime or console errors. Screenshots `review-voyager-km-mobile.png` and `review-webb-auto-alignment-mobile.png` were visually inspected.

The older reports below describe their corresponding snapshots.

---

# Open-data add-on verification — October 21, 2026

Current report for the supplied version-agnostic D1–D4 add-on. The earlier hybrid implementation report follows below. Existing objectives, stamp conditions, story copy, and the Voyager distance formula were retained.

| Task | Result | Implementation and evidence |
| --- | --- | --- |
| D1 | PASS | `src/voyager-countdown.js` stores the requested UTC target, uses only the visitor clock, and updates days/hours/minutes once per minute. Browser tests advance a clock before the target, cross the exact instant, and reload in December. The exact before/after copy matches; the timer disappears at the instant and no exact milestone hour is printed. |
| D2 | PASS | `src/voyager-contact.js` uses only `/api/dsn-now`. The shared server relay retains last-good XML for five minutes, refreshes at most every 30 seconds, deduplicates dishes, and ages old contacts into the exact quiet fallback. Browser requests abort after 15 seconds. The real NASA feed was read successfully through the local relay. Deterministic browser fixtures verify Canberra, two antennas, range wording, timestamp, quiet-state recovery, and the existing single Voyager live region. Unit tests break the upstream feed, reject malformed XML, test cached failures and a hanging browser request, then verify recovery and cleanup. |
| D3 | PASS | `src/webb-alignment-story.js` uses the three NASA image assets in `public/assets`. Actual keyboard alignment yields scattered → hexagonal → stacking → stacked → deep field; the stacked stage held for 1.2 seconds. All three image files loaded in the browser. Exact caption and credit appear without a blur effect. Missing images use a schematic; leaving or resetting cancels the pending reveal. Provenance and full credits are in `docs/ASSETS.md`. |
| D4 | PASS | NASA's final PDF was imported into `src/data/ingenuity-flights.json` with all 72 rows, source metadata, PDF hash and spot checks. Flight 61 is 24 m and 129.5 s. A real simulator attempt produced “Your flight: 2.2 m, 7.9 s…” with the requested comparison and source link. Only maximum altitude and duration are compared; missing/invalid measurements use the exact fallback. |

Acceptance test 5 also passes: real interactions completed Curiosity, Ingenuity, Webb, and Voyager and reached graduation without seeded stamps. Both typed-greeting and synthetic-microphone routes still earn Voyager's stamp. All six routes and graduation fit a 390px viewport; the four new cards were additionally checked for internal horizontal overflow. No uncaught JavaScript or console errors occurred in the complete run or the focused open-data run.

- `npm test`: 35/35 passed. `npm run build`: passed; the existing advisory about the Three.js scene chunk remains.
- Browser scripts/results: `tmp/open-data-qa.mjs`, `tmp/open-data-qa-results.json`, `tmp/hybrid-qa.mjs`, `tmp/hybrid-qa-results.json`.
- Screenshots: `docs/screenshots/open-data-voyager-countdown-mobile.png`, `open-data-ingenuity-comparison-mobile.png`, and the `open-data-webb-*-mobile.png` sequence. Images were also visually inspected.
- Static-only hosting intentionally has no Voyager DSN relay and uses the quiet fallback. The local Vite server and Netlify source deployment provide the relay; the new Vite configuration is included by the source-packaging script.
- These remain illustrative simulation results, not calibrated flight measurements. The NASA dates and milestone instant are the requested stored values, not a newly calculated ephemeris crossing. No live student, physical microphone, or human screen-reader testing was performed in this add-on.

---

# Hybrid implementation verification — October 21, 2026

This is the current report for the supplied HYBRID prompt (October 21). Older entries below are historical and may describe superseded copy or stamp requirements.

## Task report

| Task | Result | Change and location |
| --- | --- | --- |
| 1 | Complete | `index.html` crew briefing and crew certification; `src/main.js` training-module labels and dynamic progress. Teacher/printable labels, hidden-fact completion copy, and classroom gallery role wording agree with the new wrapper. Existing storage key, IDs, and stamp data model retained. |
| 2 | Complete | Exact four titles and twelve beats in `src/story-layer.js`; rendered as a persistent card at the top of each module by `src/main.js`. The existing four-chapter mission archive remains available in a disclosure. Story button still opens the story dialog. |
| 3 | Complete | Exact four transmissions in `src/story-layer.js`, shown by the existing stamp-success handler alongside confirmation. |
| 4 | Complete | Exact training brief lines in `src/main.js`, immediately after the story card and before the archive/science/interactive. |
| 5 | Complete implementation | `src/greetings.js`, `src/personal-records.js`, `src/greetings.css`: exact typed-greeting label, native keyboard controls, visible focus, linked validation errors, recording-to-save focus, and saved-item focus. `src/main.js` owns the single queued polite live region, routes playback/save/stamp feedback through it, suppresses duplicate 2D/3D regions, focuses the entered module, and cancels stale graduation timers on reset. The existing two stamp conditions are unchanged. |
| 6 | Complete | Exact graduation copy and three crew lines only in `index.html` graduation overlay; Finish returns to briefing. X, Escape, existing certificate area, and print controls retained. Background controls are inert while the overlay is open. |
| 7 | No new stretch build | No separate new mission patch or undocumented certificate spec was added. Existing name/date/four-stamp printable certificate is retained. |

## Acceptance tests

| No. | Result | Evidence |
| --- | --- | --- |
| 1 | PASS | Rendered lobby has CREW BRIEFING and CREW CERTIFICATION; all four module labels appear. Rendered lobby, four modules, and teachers page contain no visitor role wording. |
| 2 | PASS | Browser compares all twelve rendered beats to story data, then to the supplied prompt. All 39 supplied backtick copy strings across Tasks 1–6 were also checked against source; dynamic module labels checked in DOM. Webb third and Voyager second beats match word for word. |
| 3 | PASS | Actual Curiosity, Ingenuity, Webb, and Voyager completions each produced the exact transmission. No stamps were injected for this run. |
| 4 | PASS | DOM/source checks place Arceneaux, McFall, and Diaz-Merced only in graduation content. |
| 5 | PASS — automated browser paths | In isolated browser storage, Tab/Enter/text input completed actual original-audio playback + typed greeting + stamp. A separate isolated run used Tab/Enter with Chrome's synthetic microphone through record/stop/save + stamp. Playing language, saved greeting, and exact `Stamp earned: Voyager 1` were observed in the polite region. This is not a human screen-reader or real-microphone test. |
| 6 | PASS | Graduation renders TRAINING COMPLETE, both body paragraphs, three crew lines, Finish, and retained certificate. No next-steps/checklist was introduced. |
| 7 | PASS | Source/UI review found no added ranks, levels, XP, or trainee-score progression. Physical flight terms such as level touchdown retain their scientific meaning. |
| 8 | PASS | Real interactions completed all four missions and reached graduation; X and Escape close it. All six routes and graduation fit a 390px viewport without horizontal document overflow. No uncaught JavaScript or console errors in the successful full run. Separate smoke checks rendered all four 3D canvases. |

## Additional regressions and evidence

- Old progress under `mission-alive-passport-v2` still loads. A separate three-stamp seed was used only for backward-compatibility/reset and screenshot tests, not the complete-run test.
- Reset after Voyager's stamp announcement cancels the pending automatic graduation, preventing an overlay over a fresh attempt.
- Voyager has one active announcement region including implicit native output statuses in 2D. Its late-created 3D anatomy card also uses the same region.
- Full mission run used the app's existing 2D controls with reduced motion to avoid headless software-rendering delays. All four 3D models were checked separately at 390px. No simulation or stamp rules were bypassed.
- `npm test`: 19/19 passed. `npm run build`: passed. Vite retains its existing advisory about the Three.js scene chunk exceeding 500 kB.
- Browser scripts: `tmp/hybrid-qa.mjs`, `tmp/hybrid-focused-qa.mjs`.
- Machine-readable evidence: `tmp/hybrid-qa-results.json`, `tmp/hybrid-focused-results.json`.
- Screenshots: `docs/screenshots/hybrid-lobby-desktop.png`, `hybrid-lobby-mobile.png`, `hybrid-voyager-story-mobile.png`, `hybrid-graduation-mobile.png`, `hybrid-graduation-mobile-finish.png`, and `hybrid-webb-3d-mobile.png`.

## Limits and copy concerns retained verbatim

- Real screen-reader output (for example NVDA/VoiceOver), a physical microphone, and testing with students have not been performed. The browser tests verify keyboard behavior, accessible names/live-region semantics and emitted messages; they do not prove human usability.
- Requested wording was not silently rewritten. The Ingenuity brief's “Nothing this light should be able to fly there” is a dramatic statement that can mislead: low mass helps flight, while low atmospheric density is the obstacle.
- Webb's “permanent cold and dark” describes its shielded observing side, not the entire sunlit observatory. The 344 single-point-failure wording simplifies engineering failure modes. Planned primary mission durations are not identical to hard designed lifetimes.
- The fourteen/forty-nine-year transmission lines are dated to 2026 and require future editorial review. Existing local-greeting copy still explains that greetings remain here and are not transmitted to Voyager.
- No new replay mechanics, other-module stamp logic, classroom publication behavior, or NASA APIs were added by this prompt. Existing progress and greetings remain intact.

---

## Historical verification entries

# Verification — October 5, 2026

## Passed

- Seven automated tests: fact-source metadata, fact-card reading budget, explicit projected-data labeling, one-to-one coverage of 55 MP3 files and translations, language/country/alias search, and historical-region labels.
- Production build succeeds. All 55 MP3s are emitted as individual assets. SHA-256 comparisons confirm the packaged recordings match the supplied originals byte-for-byte (4,164,466 total audio bytes).
- The default route opens the museum lobby with four mission cards, a 0/4–4/4 passport meter, persistent local stamps, and a continue button that selects the next incomplete mission.
- Every exhibit presents its quote, source link, machine explanation, three mechanism/science notes, and mission objective before the challenge. “Go to challenge” scrolls to the interactive scene and controls.
- Each 3D scene exposes four moving machine-anatomy markers plus a keyboard-friendly dock. Selecting either surface opens a sourced explanation card; Voyager diagram selections also switch the artifact to its protective cover.
- Curiosity's 11-block program (`MOVE`, turns, `DRILL & ANALYZE`, and loops) reaches the sedimentary outcrop and uplink site and awards a patch. Free Explore can be entered or left independently. Its Mastcam survey, drilling/analysis, and science-uplink sequence was completed end to end. The rover-integrity meter, large-rock collision damage, contact latch, and incomplete-program paths were also checked.
- Ingenuity requires the checklist and safe rotor band; its flight/landing cycle awards a patch.
- Webb alignment is disabled before deployment; full deployment and alignment award a patch; reset restores the lock.
- Voyager record rotation, outward travel, and actual greeting playback award a patch.
- Vietnamese can be found by `Tiếng Việt`, selected, and played. The browser decodes the supplied recording and reaches its end (about 2.93 seconds).
- Country filter `India` produces 11 matching recordings. A nonexistent search shows an empty state; Clear filters restores all 55.
- Switching tracks pauses the previous recording and resets playback time. Leaving Voyager removes the audio player.
- Voyager's Personal Golden Record Studio exposes language, country/region, translation, microphone recording, preview, private IndexedDB save, download, and deletion controls. Public submission stays disabled unless a community API is explicitly configured; configured submissions require a consent checkbox and enter a moderation queue.
- The server-side `/voyager-distance` endpoint was checked against JPL Horizons for Voyager 1 (`-31`) relative to Earth's center (`399`). It returns apparent range, range-rate, UTC anchor time, model/source metadata, and `telemetry: false`. The server caches that anchor for one hour; the browser interpolates once per second and keeps the static NASA milestone as an offline fallback.
- The manual 2D view is available; its controls remain visible.
- At a 360 × 800 viewport, the Voyager page fits horizontally. The library stacks cleanly. A desktop layout was also visually checked.
- No browser console errors were observed during the final interaction checks.
- Optional WebMCP tools register in the supported preview browser. Search and selection update the same visible UI. An invalid ID fails without changing the selection. They do not autoplay audio.

## Limits and follow-up

This is a practice prototype, not a competition-ready release. Real-device touch, another browser engine, learner testing, exhaustive audio listening, offline/network-failure behavior, and independent audio provenance checks remain outstanding. File-header checks establish MP3 packaging, not the authenticity or semantic content of every recording.

The Three.js scene bundle is approximately 506 kB minified / 128 kB gzip and is loaded separately. Vite emits an advisory for crossing its 500 kB chunk threshold. The application builds successfully. Greeting audio is loaded on demand.

Country and region search associations are curated, non-exhaustive discovery aids. Historical-language associations are labeled. The app does not identify a speaker's nationality.

No public deployment or hackathon submission has been made.

## Golden Record imagery

Added the NASA/JPL-Caltech front-disc photograph and the user-supplied protective-cover image as separate selectable views. Both files were visually inspected against NASA's descriptions. The 3D view preserves the photographs as textures, and the 2D fallback uses the same assets. Source URLs, credits, dimensions, and usage notes are in `ASSETS.md`.

Curiosity now uses a five-by-five programming grid with visible hazards, a sedimentary outcrop, and an uplink site. Learners compose an 11-block maximum science plan, debug it one step at a time or run it continuously, and must use a loop to complete the intended route. The science action models Curiosity drilling powdered rock and delivering it to the SAM and CheMin laboratories inside the rover. Learners can switch into manual Free Explore at any time using touch controls or WASD/arrow keys, with a circular terrain boundary, position/heading readout, translating follow camera, rover-integrity meter, and a three-step field sequence: survey the cyan outcrop with Mastcam, drill/analyze the sample, then reach the gold beacon and transmit the findings. Large visible rocks cause collision damage; small decorative stones do not, and continued contact with one rock registers as one impact. The initial rover pose faces toward the crater interior. Curiosity and Ingenuity use distant overview cameras so their substantially wider generated terrain reads clearly against the machines. Rock, boundary, science-target, energy, incomplete-program, and success feedback all keep the program editable for another attempt. Ingenuity uses an eight-second sequence with rotor spool-up, smooth ascent, hover, short scouting drift, descent, rotor wash, touchdown, altitude, phase feedback, and a moving wind-trim target. Flights below 45% stability land without completing the mission and can be retried. Reduced-motion mode removes dust, shake, drift, and continuous altitude easing while preserving the challenges.

The four opening story lines are short quotations attributed and linked to NASA or JPL sources. Voyager retains the 55 user-supplied greeting recordings and pairs each one with NASA's published English translation. All other mechanism sounds are synthesized locally with Web Audio: a motor and wheel crunch for Curiosity, rotor and air noise for Ingenuity, servo movement for Webb, and a light mechanism tick for the record control.
