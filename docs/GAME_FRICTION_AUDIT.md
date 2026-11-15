# Mission game friction audit

Local preview audit, November 15, 2026. The target is one meaningful action from the challenge surface to visible game response. Navigation from the lobby and the post-success stamp ceremony are not counted as pre-play friction.

## Decision rule

- Remove confirmations, duplicated selectors, setup quizzes and buttons that only unlock another button.
- Keep actions that express the mission's actual learning idea, such as building a command sequence, gathering two different measurements or aligning separate mirror images.
- Tutorials must be optional and in context. No tutorial dialog, expanded first-visit panel or audio permission may block play.

Orientation is not a pre-play gate. The landing hero and map present a help request, and every mission page uses one glanceable Problem / Your move / Reward briefing before the existing controls. It names the purpose and payoff without requiring a dismissal, confirmation or extra start action. The academy-simulation label prevents the rescue framing from reading as a live emergency.

## Results

| Mission | First visible response | Pre-play gate | Decision |
| --- | --- | --- | --- |
| Apollo 17 LRV | Place the first repair material | None | Keep maps, tape and clamps because assembling the improvised fender is the challenge. The three placements are distinct build actions, not start confirmations. Its 3D preview and two-wheel side diagram use the same exposed-wheel anchor, scale and repair colors. Unsafe wheel/equipment collisions turn the design red and say FAIL before a test, so experimentation cannot look accidentally correct. |
| Surveyor 3 | Choose a sample point on one continuous geology transect | None | Keep three sample points because different hidden layers are the experiment variable, but do not present them as landing zones. Surveyor remains stationary; the probe and scoop gather evidence, then a separate two-foot pressure rig tests a footprint. Probe force, excavation and foot width each produce different evidence. |
| Curiosity | Add the first command block or enter Free Explore | None | Keep Run science plan because executing and debugging a sequence is the programming lesson. Step remains an optional recovery tool, not a prerequisite. |
| Ingenuity | Choose a terrain patch, then use the single gold FLY NOW action | One explicit launch confirmation requested by the owner | The craft handles forward travel to the selected destination; the learner only counters wind. Removed rotor setup, controller quiz, trim setup, pause/resume and step pacing. Wind, lift and drift begin on launch with no protected animation. |
| Webb | Pull/open the first mirror wing | None | Keep two wings and three image alignments because folding and multi-image precision are the lesson. No separate Start alignment confirmation is present. |
| Voyager 1 | Play or read one greeting | None | Keep the listen/read choice because encountering a real Golden Record greeting is the lesson. Written reply remains a full alternative to microphone use; saving the reply is the completion action. |

## Shared interface

The mission page itself is the start screen. Story and science remain optional reading, and the intro dialog does not open automatically. How to play stays closed; on the first visit only, its summary receives a visible emphasis and then returns to the normal label after the learner uses a real control. Five missions respond after one meaningful action. Ingenuity deliberately uses a terrain decision followed by one highly visible launch action; it has no other setup gate, tutorial gate or duplicated start control.

## Remaining playtest questions

- Confirm on an actual touch device that Ingenuity's terrain tap does not conflict with page scrolling and that holding feels responsive at 390 px.
- Watch a first-time learner complete Apollo's three-part assembly. If they describe the sequence as repetition rather than construction, replace it with one continuous drag-to-build gesture while retaining keyboard buttons.
- Watch whether Voyager learners understand that reading counts without playing audio. If not, clarify the selected greeting card rather than adding another confirmation.
