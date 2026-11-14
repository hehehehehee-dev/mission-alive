# Consolidated fixes — 14 November 2026

Branch: `fix/nov14-consolidated`. This report concerns the local application and its updated Netlify source package. Nothing was deployed or edited on a competition submission site; the owner clarified that References belongs on the app's own website.

## Must fix

| Item | Result |
|---|---|
| F1 Webb model | Fixed hexagon orientation so the gold faces share the mirror plane. Both physical hinged wings now expand visibly. Before/after images inspected in the in-app browser; geometry tests cover the surface normal and wing movement. |
| F2 References | Sources & credits now includes tools, dependency/license notices, Public Sans, each of four ElevenLabs files, and the existing NASA/ESA/STScI imagery, data, recordings and factual sources. Downloadable references are generated before builds. The dependency inventory includes locked transitive packages and retained installed license files. |
| F3 SI disclosure | Visible SI/AI section explains code, testing, translations, narrative drafts, presentation/gameplay exploration and programmatic illustrations. Each synthetic voice has its own acknowledgment. Optional classroom AI screening is identified separately. No standalone generative-image/video assets were found or introduced; official agency concepts and original code-rendered simulations retain their labels. No unsupported assertion of unaided human-only ideation was added. |
| F4 View toggle | Viewer replacement no longer calls the exhibit renderer. The same mission state, controls and camera survive. Browser check: both wings stayed open, Image A stayed at 27%/27%, and yaw stayed at 26° across 3D → 2D → 3D. Stale fallback-only controls clear after 3D is ready. |
| F5 Private deletion | Replaced native confirm with in-page Confirm delete / Keep private copy. IndexedDB operations resolve after transaction completion. A disposable written greeting was deleted, remained absent after reload, and the cancellation branch preserved a second greeting. |

## Should fix

| Item | Result |
|---|---|
| S1 Six-mission ending | Return map and its readable ordered route include Apollo 17 LRV and Surveyor 3 before Mars, Webb and Voyager. Graduation ends with one sentence containing resourcefulness, judgement, patience, daring, precision and endurance. |
| S2 Apollo hints | Failed designs name dimensions and directions without giving winning settings. Real workshop play: first trial identified angle/clearance; second identified length; the third passed. |
| S3 Name | Optional private lobby field carries into the certificate. Checked with “Minh QA”; blank fields produce the localized “Mission Alive crew member” default. |
| S4 Crew section | Moved the existing “THE CREW IS ALREADY CHANGING” section, with its content unchanged, to For Teachers. It is absent from the finale. |
| S5 Moon callbacks | Apollo's transmission names Apollo 17 leaving the rover; Surveyor's names Apollo 12's visit and camera return. ES/VI versions included. |
| S6 Ceremony | Retained the already implemented first-earn press ceremony: 224px minimum seal, pulsing waiting state, 750ms press/ink cycle, reduced-motion alternative. Browser confirmed the active `stamp-wait` animation. An extra blocking overlay was not added. |
| S7 Automatic finale | Verified in a fresh 0/6 playthrough. Six genuine completions opened graduation automatically after the final transmission, without a Continue/certificate click. The written transmission remains visible before the payoff. |

## Polish

- P1: navigation's blocking phase is now 180ms plus an 80ms settle, rather than 610ms plus 260ms. Queued navigation requests are retained. Dialog entry fades take 220ms and exhibit fades 240ms; challenge scrolling is smooth unless reduced motion is enabled.
- P2: immediate pressed-state feedback and 150ms color/border transitions; secondary reading controls have explicit hover feedback. The stamp payoff keeps its independent 750ms timing.
- P3: restrained lobby photo drift and a visible existing starfield. Browser computed animation was running; reduced motion changed it to `none`.
- P4: Webb orbital pointer rotation uses speed 0.28 and damping 0.09. A 175px test drag changed yaw from 16° to −13°, rather than producing the reported large swing.
- P5: the accessible distance label updates alongside every visible distance value, without adding per-second live announcements.
- P6: reduced-motion distance has no ticking timer; Read current distance explicitly refreshes it. Resume mode starts one timer. Deterministic anchor tests verify freeze, refresh, resume and label synchronization.
- P7: the toggle states the current 2D/3D mode and names its action in the accessible label. It is hidden on Voyager, lobby and teachers screens.

## Verification and limits

- `npm test`: **109 passing**, no failures.
- `npm run build`: succeeds. Existing large-bundle advisory remains.
- Clean in-app-browser journey: Apollo 17 → Surveyor 3 → Curiosity → Ingenuity → Webb → Voyager, six genuine stamps, no early finale at 4/6, automatic graduation at 6/6, exactly six certificate stamps.
- 390px emulation: lobby, four main exhibits, both Moon panels, Sources & credits and finale fit without document overflow. Both Moon dialogs had equal client/scroll widths. This is **not a physical-phone test** (C1).
- No separate WRONG / NEEDS NUANCE fact-check report was supplied or found by filename (C2). The moved teacher content was kept unchanged; no corrections from an unseen report were invented.
- No choice between slides and a demo video was made (C3).
- The specified countdown target remains `2026-11-18T10:16:07Z`; stamp gating and the six-stamp certificate remain intact. Local re-verification is complete. Hosted/live re-verification awaits a deployment (C4).
- Actual microphone capture, physical printing, real student testing and a current live Horizons anchor were not verified in this pass.

The packaging script retains only the current and previous distinct Netlify source ZIPs and includes the new references prebuild script. The prebuild script creates its docs output directory when building an extracted source archive.
