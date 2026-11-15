# Apollo 17 and Surveyor 3 training missions

Apollo 17 LRV and Surveyor 3 have dedicated `#apollo17` and `#surveyor3` mission pages. Each page leads from a short sourced introduction through a machine view and an interactive challenge. Completing the challenge unlocks the normal stamp ceremony, so the two Moon missions contribute two of the six certification stamps.

## 3D challenge layer

Both Moon challenges progressively enhance their original SVG teaching models with procedural Three.js scenes. Apollo 17 now shows a complete four-wheel rover with seats, suspension, equipment deck, camera and antenna; the repair controls update the printed map fender on its near wheel. Surveyor shows a triangular strut frame, three landing legs and pads, instrument boxes, camera mast, solar panel and sampling arm. Its patch, probe, digging, footpad and touchdown controls update the same teaching model. These are original Mission Alive reconstructions, not NASA engineering models or exact dimensions.

The shared silver/gold/white materials, filmic lighting and circular regolith stage follow the established four machines. Bias-corrected 512px shadows remove the old striped ground artifacts. Rendering is on demand, capped near 30 fps during interaction, and stops for offscreen or hidden stages. Terrain stones share an instanced mesh. Probe, dust and touchdown animation handles are cancelled on reset/disposal where applicable. These limits reduce rendering work; perceived smoothness still depends on the learner's device.

The rover's three fixed gold fenders use upper semicircular arches along the wheel axles. The fourth wheel remains exposed for the learner's repair. Geometry bounds and two local browser viewing angles verified the correction, released after the owner's approval.

Moon routes open the same way as the other four missions: the real NASA photograph (credit holder shown verbatim) beside “Built for” and “It did”, taken from the machine's sourced `WHY IT WENT` and `WHAT IT DID` facts, then the challenge. The photograph is also reused as a dimmed page background. Surveyor uses the same side-by-side study/control arrangement as Apollo, with a sticky model on desktop and a single column on mobile.

The canvases support pointer orbiting and keyboard turning/zoom. Native HTML controls remain the only required input, every result is repeated as text, motion is shortened when reduced motion is active, and the existing SVG models remain available automatically if WebGL cannot start or loses context.

## Apollo 17 LRV

The default interaction is a repair workbench. Select or drag maps, tape and clamps onto the wheel. The model visibly acquires each component. The next step exposes the existing side-view drawing even when the 3D preview is active: drag the white tip to reshape the patch, or focus it and use arrow keys. Number controls remain in a disclosure, including clearance. The original dust paths, geometry rules and real 3D preview update together. Each active step states the action and passing goal.

The compact flow opens on assembly. Fitting clamps after maps and tape automatically opens Shape and test. The step bar also lets learners try a test before finishing assembly and observe its failure. Length is the main adjustment; angle and clearance are available in Number controls. Trial history is an optional disclosure. The original controls and values are moved rather than recreated.

Players tap maps, tape and clamps (one tap each, in that order), adjust the patch length/angle/clearance, and run a dust test. The workshop starts level and clear of the wheel (30 cm / 0° / 4 cm) but too short to catch dust, so one informed length change after assembly is enough to pass. After a failed test the hint names exactly one control, a direction and a rough amount (“a little”, no word, or “a lot”) — never a winning number. `lrvNextChange()` picks the smallest single change that passes even if the learner presses one or two times too many; if no single change helps, it steers back toward a hidden working shape. A negative model gap is shown as “Touching the wheel”. The same twelve simplified paths are used across trials. A segment crossing stops a dust path; the smallest distance along the whole patch determines wheel clearance. Tape-only attachment slips under an explicitly declared game rule. A promising preview cannot pass until the player runs a test. Several geometries pass, including length/angle/clearance 50/0/8 and 60/0/8 with maps, tape and clamps. Six recent trials remain available for comparison; reset clears the trial history.

The SVG illustration, dimensions, trajectories and thresholds are original teaching choices, not NASA measurements. The historical repair using spare maps, tape and clamps is sourced from [NASA's Lunar Dust and Duct Tape](https://science.nasa.gov/image-article/apod-2004-april-17-lunar-dust-and-duct-tape/). Passing reveals its real photograph, credited **Apollo 17, NASA**. Full provenance is in ASSETS.md and the public Sources & credits catalog.

## Surveyor 3

The fieldwork station uses a pull-and-release probe with four bounded force levels. Keyboard users choose force with arrows and press Enter to measure. Three soil strips can be swept or tapped to excavate the existing three-scoop trench. The measured depths and revealed layers come from the same fictional soil model as the original controls. Patch changes and restart restore the corresponding excavation state. The original numeric/buttons controls remain in a disclosure, and each active step states its action and passing goal.

The compact flow shows Choose, Investigate and Land separately. Choosing a patch advances to investigation. Completing two different probe forces and a trench opens landing automatically. Learners can also try landing early through the step bar; a trial without evidence cannot earn the stamp. Reset returns to Choose. Evidence remains specific to each patch.

Players investigate one of three explicitly fictional soil patches. They press a probe at different forces and inspect a trench, then test an independent fictional lander with adjustable square pads. The probe and pad tests share the same layered pressure/depth model. Pad area is width squared, pressure is fixed simulated load divided by area, and left/right sinking can cause a tilt. A supported recommendation requires at least two distinct probe forces and trench inspection on the selected patch. A wide pad without evidence is a trial, not completion. Smaller pads can fail, and different patches admit different safe footprints. Reset clears the investigation.

[NASA's Surveyor 3 mission page](https://science.nasa.gov/mission/surveyor-3/) supports the real use of the sampler to dig trenches and test soil. The game never implies that Surveyor changed its own footpads or that these fictional layers are actual lunar measurements. The ending distinguishes the imagined machine narration from the fact that Apollo 12 returned the television camera and scoop, with a [JPL historical source](https://www.jpl.nasa.gov/blog/2012/1/surveyor-3-camera-returned-from-the-moon). The already credited photograph of Surveyor in its crater accompanies the ending.

## Access and verification

- Native buttons, checkboxes, radios and range inputs work with keyboard and touch. LRV ranges also have increment/decrement buttons. No timed reflex, dragging requirement or microphone is involved.
- Test results have textual measurements and polite status announcements; history regions can receive focus for keyboard scrolling. SVG observations are also explained in text. English, Spanish and Vietnamese UI is included.
- 101 Node tests passed; production build passed. Focused model tests verify deterministic measurements, multiple successful designs, physical/model failures, and evidence-gated completion.
- Clean-browser Moon trials exercised LRV incomplete/slipping repairs, two successful geometries, history/reset, Surveyor missing evidence/sinking/tilting and revised landings. Dialog Back/Escape, image/source credits, EN/ES/VI, 320/390/1280px widths, higher contrast and larger text were checked. Moon success left passport at 0/4 and certificate at exactly four stamps.
- Four Moon states passed the selected automated axe WCAG A/AA rules with no reported violations. The existing clean four-module path, automatic finale and four-stamp print action also passed, with seven core axe audits reporting no violations.

These browser/automated checks do not replace manual NVDA/VoiceOver or evaluation with disabled students. The labs are playable prototypes; no deployment was performed.
