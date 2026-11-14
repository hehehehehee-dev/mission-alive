# Nov 14 leftover re-test fixes

Branch: `fix/nov14-leftover-retests`. No deployment performed.

## Changes

1. Added the exact Apollo 17 LRV resourcefulness and Surveyor 3 evidence gift lines after their final narration. They use the same `.mission-gift` typography and gold (`#eecf98`) as the original four.
2. Added the two exact Moon callbacks to the ends of their story-card text. Existing official source links remain visible; no new media was introduced.
3. Finale and For Teachers now share: “You carry six things home: resourcefulness, evidence, patience, daring, precision, endurance. That is the crew.”
4. Both Moon map labels and their accessible names now say training. Back and Close labels also say Moon training.
5. Screen entry fades are 260ms ease-out; dialogs enter/exit with 220ms opacity and discrete display/overlay transitions. Start exploring waits for native dialog focus restoration before starting the existing smooth scroll. Reduced motion disables these effects.
6. Non-disabled buttons receive immediate active brightness/inset feedback, with zero transition delay on press and visible secondary hover outlines. Existing stamp-press behavior was left alone.
7. Increased existing star brightness and twinkle range, with a roughly four-second twinkle cycle and lobby canvas opacity 0.68. Kept the existing drift and reduced-motion stop logic.
8. Apollo's three criterion cards now expose visible Pass/Fail words after testing; before a test they still show Not tested. Verdicts use the existing dustSafe, wheelSafe, and attachmentHolding booleans.

New labels and lines include Spanish and Vietnamese translations.

## Verification

- `npm test`: 109 passing tests, no failures.
- `npm run build`: passes; existing bundle-size advisory remains.
- Real browser Apollo test: unassembled design displayed three Fail verdicts; assembled level patch with measured gap **3.0 cm** displayed **Pass 3.0 cm**, and all three criteria passed.
- Browser checked both Moon gift lines, exact callbacks, training labels, and matching finale/teacher closing text. Moon gift computed gold is rgb(238,207,152), with the existing 15.2px font.
- Start exploring observed scroll positions progressing from 0 to 540.8 to 614.4px, rather than one immediate jump. Teacher screen computed fade is 0.26s; story dialog entry is 0.22s.
- Lobby screenshots taken five seconds apart show changed star positions/brightness. Reduce motion gives both lobby and photo animation name `none`; the existing canvas reduced-motion path stops requestAnimationFrame updates.
- New Moon gift/back/close text checked in Vietnamese; Surveyor gift checked in Spanish.
- Supplemental 390px browser emulation: Moon dialog clientWidth and scrollWidth both 342px. This does not substitute for Minh's real-phone check.
- Reviewed diff: the countdown stays **2026-11-18T10:16:07Z**; certification still requires all six mission IDs. No threshold, pinned-close positioning, stamp ceremony, finale trigger, or other mission mechanics changed. The original four gift lines remain intact.

## Hosted verification limitation

Opened https://stalwart-vacherin-eb6cc2.netlify.app/#lobby during this pass. It still serves the earlier Moon STORY labels. The revised files are local and packaged for the user's Netlify update; the hosted build has not received these changes, so post-update live acceptance cannot yet be claimed. No hosted data or deployments were modified.

Preview evidence: `output/leftover-retests/apollo-gift.jpg` (English), `output/leftover-retests/apollo-gift-vi.jpg` (Vietnamese).
