# Ingenuity visual flight prototype

Local, uncommitted preview as of November 15, 2026. The owner asked to try this before any commit or deployment. Preserve the earlier story-voice and Curiosity repair work in the same working tree.

## Learner experience

The learner acts as the **onboard computer**, not an Earth-based pilot steering a real-time Mars link. In 3D, choosing a labelled terrain patch reveals one large gold **FLY NOW** button beside the model. This is the only explicit launch confirmation and there is no duplicate zone palette beneath the model. Equivalent native zone buttons appear only in 2D fallback and reveal the same action.

Flight uses the terrain itself as the primary control. After FLY NOW, Ingenuity automatically advances along the straight route toward the selected patch while wind, lift and drift act from the first simulation frame. The learner does not control forward progress; holding on the terrain counters lateral wind. A gold screen target and a matching beacon on the simulated ground follow the pointer. The route offset is calculated perpendicular to the actual route rather than a fixed world axis. Gust arrows, craft lean/drift, a dotted ground route and a shadow make the result visible in the same scene. A/D and left/right keys remain the equivalent non-pointer method.

At lift-off the camera eases into a low chase view behind Ingenuity and looks ahead along the selected route. It follows the craft while retaining the chosen patch in front, instead of keeping the distant study overview during play. The pre-flight view remains orbitable for inspecting the model.

The model, launch, guidance and retry controls stay together. After a failed landing, selecting another patch changes the destination and the same large button becomes **RETRY NOW**. Pause, Resume flight, Fly one step, the link quiz, rotor-power setup, trim percentages and the pre-flight pace toggle are removed from the active game. Story and science remain available through the existing reading section. Like all six missions, the closed How to play guide is highlighted on a learner's first visit but never blocks or pushes the game down; it remains optional and reopenable.

A failed landing visibly damages the model: the body stays tipped on the surface, both rotor planes bend out of alignment, the rotors stop and dense gray smoke rises continuously from the wreck. Drift no longer terminates the flight in midair. The helicopter continues past the prepared landing zone, attempts an emergency touchdown on uneven ground, buckles a landing leg and strikes a rotor. Slope and boulder failures retain their specific causes. Smoke uses a soft round particle texture instead of small square points; reduced motion keeps the damaged pose and a static full plume.

Flight always runs continuously. Leaving the window or hiding the tab pauses it automatically; returning resumes it automatically, with no extra button. Reduced motion removes nonessential pulses and smooth camera/particle movement but does not replace the game with a step mode. Native zone buttons retain the same destination selection in 2D fallback.

## Learning and recovery

- Wind changes direction. The craft visibly moves; pushing toward the center corrects it. Ignoring the gusts misses the landing ring.
- All three patches are available for experiments. A controlled landing on the crater tips over; a landing among boulders catches a leg. Only the level clear patch permits a safe touchdown. These are simplified, authored environments, not a claim that every crater or rock field is impossible for all aircraft.
- Each failure identifies the cause. Retry resumes at the landing checkpoint (16 seconds, altitude 2.4 game meters) with drift/velocity cleared and allows changing the patch. Full Reset exhibit starts the mission again. Existing earned stamps persist.
- The 22-second route, 2.4-meter height, wind forces, center tolerance and pass criteria are invented teaching values. They are not NASA flight-control data. The existing real NASA Flight 61 comparison is shown after the attempt and kept separate.

## Implementation

`src/ingenuity-flight-game.js` contains a deterministic fixed-substep engine and its controller. `src/scene.js` projects labelled site buttons and consumes `state.visualFlight`; it keeps the existing helicopter and terrain geometry. `src/main.js` mounts/disposes the controller, calls its tick and connects a safe landing to the existing `success()` function. Six-stamp registry, persistence, ceremony, finale and certificate logic are unchanged.

`src/locales/ingenuity-flight.js` supplies Spanish/Vietnamese copy. `src/ingenuity-flight-game.css` supplies responsive layout and native controls. `src/resource-credits.js` records the original simulation separately from NASA's real flight log. No network service or generated media is used by the game.

## Verification status

Automated tests cover all three terrain outcomes, inaction drift, corrective guidance, recoverable/terminal drift, checkpoint site changes, deterministic physics, automatic pause/resume on window focus, continuous reduced-motion gameplay, cleanup and exactly one success callback. Further controller tests check scene selection enabling launch, fallback-only zone alternatives, continuous direct guidance and release-to-stop. The full suite currently has 179 tests.

Actual browser verification was **not completed**: the local browser connector was unavailable and native Computer Use stopped because it could not confidently determine the browser URL. Do not claim desktop/mobile framing, real touch/keyboard operation, WebGL performance or the new game's complete stamp flow has been observed. Review at `http://127.0.0.1:5176/#ingenuity` before publication, including 390px, all three languages, enlarged text, reduced motion, all outcomes, reset, 2D fallback, and navigation during a held input. No production deployment was performed.
