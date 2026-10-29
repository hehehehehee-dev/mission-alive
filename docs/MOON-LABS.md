# Optional Moon lab prototypes

These two labs live inside the existing Moon story dialog. Open a Moon map dot, then choose **Repair my dust shield** or **Can this ground hold?** The archive remains available through Back to Moon stories. They are not training exhibits and do not award certification stamps, write passport storage, change the certificate, or trigger graduation.

## Apollo 17 LRV

Players assemble a map patch, join it with tape, choose an attachment, adjust its length/angle/clearance, and run a dust test. The same twelve simplified paths are used across trials. A segment crossing stops a dust path; the smallest distance along the whole patch determines wheel clearance. Tape-only attachment slips under an explicitly declared game rule. A promising preview cannot pass until the player runs a test. Several geometries pass, including length/angle/clearance 50/0/8 and 60/0/8 with maps, tape and clamps. Six recent trials remain available for comparison; reset clears the trial history.

The SVG illustration, dimensions, trajectories and thresholds are original teaching choices, not NASA measurements. The historical repair using spare maps, tape and clamps is sourced from [NASA's Lunar Dust and Duct Tape](https://science.nasa.gov/image-article/apod-2004-april-17-lunar-dust-and-duct-tape/). Passing reveals its real photograph, credited **Apollo 17, NASA**. Full provenance is in ASSETS.md and the public Sources & credits catalog.

## Surveyor 3

Players investigate one of three explicitly fictional soil patches. They press a probe at different forces and inspect a trench, then test an independent fictional lander with adjustable square pads. The probe and pad tests share the same layered pressure/depth model. Pad area is width squared, pressure is fixed simulated load divided by area, and left/right sinking can cause a tilt. A supported recommendation requires at least two distinct probe forces and trench inspection on the selected patch. A wide pad without evidence is a trial, not completion. Smaller pads can fail, and different patches admit different safe footprints. Reset clears the investigation.

[NASA's Surveyor 3 mission page](https://science.nasa.gov/mission/surveyor-3/) supports the real use of the sampler to dig trenches and test soil. The game never implies that Surveyor changed its own footpads or that these fictional layers are actual lunar measurements. The ending distinguishes the imagined machine narration from the fact that Apollo 12 returned the television camera and scoop, with a [JPL historical source](https://www.jpl.nasa.gov/blog/2012/1/surveyor-3-camera-returned-from-the-moon). The already credited photograph of Surveyor in its crater accompanies the ending.

## Access and verification

- Native buttons, checkboxes, radios and range inputs work with keyboard and touch. LRV ranges also have increment/decrement buttons. No timed reflex, dragging requirement or microphone is involved.
- Test results have textual measurements and polite status announcements; history regions can receive focus for keyboard scrolling. SVG observations are also explained in text. English, Spanish and Vietnamese UI is included.
- 101 Node tests passed; production build passed. Focused model tests verify deterministic measurements, multiple successful designs, physical/model failures, and evidence-gated completion.
- Clean-browser Moon trials exercised LRV incomplete/slipping repairs, two successful geometries, history/reset, Surveyor missing evidence/sinking/tilting and revised landings. Dialog Back/Escape, image/source credits, EN/ES/VI, 320/390/1280px widths, higher contrast and larger text were checked. Moon success left passport at 0/4 and certificate at exactly four stamps.
- Four Moon states passed the selected automated axe WCAG A/AA rules with no reported violations. The existing clean four-module path, automatic finale and four-stamp print action also passed, with seven core axe audits reporting no violations.

These browser/automated checks do not replace manual NVDA/VoiceOver or evaluation with disabled students. The labs are playable prototypes; no deployment was performed.
