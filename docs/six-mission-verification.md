# Six-mission learning journey

Verified locally on 29 October 2026, branch `feature/six-mission-learning-journey`.

## Changes

- Six persistent credentials: Apollo 17 LRV, Surveyor 3, Curiosity, Ingenuity, Webb, Voyager 1. Existing four-stamp browser progress remains valid as 4/6.
- Both Moon games use the same visitor-activated stamp ceremony as the original missions. Closing, resetting, or invalidating an unfinished trial cancels an uncommitted stamp.
- Apollo repair uses a tool tray, assembly target, draggable patch tip, keyboard geometry controls, deterministic dust trajectories and clearance measurements. Wrong designs can fail and be revised.
- Surveyor uses repeated probe measurements, three progressive scoops, and footpad area/pressure experiments. A stable touchdown without sufficient evidence cannot earn its stamp.
- Both Moon machines have original written final transmissions. These are labelled as Mission Alive narration, not NASA quotations. The illustrative physics remains explicitly fictional.
- Lobby, navigation, progress, graduation, certificate, teacher guides, paper passport, KWL sheet, exit tickets and writing choices support six missions.
- One self-hosted font family: Public Sans, with its SIL OFL license. NASA Horizon lists Public Sans for interfaces and body text. Font provenance is in the public Sources & credits catalog.
- New interface and narration copy includes English, Spanish and Vietnamese.

## Verification

- `npm test`: 104 passing, zero failing.
- `npm run build`: production build succeeds; existing bundle-size advisory remains.
- Clean Chrome run: original four missions first, Moon missions last; four stamps do not graduate; automatic finale at six; certificate has exactly six stamps.
- Second clean Chrome run: both Moon missions first, original four afterward; automatic finale after Voyager; printed-name flow and close control work.
- Nine automated WCAG screen audits in each route: no violations in the checked rules. This does not substitute for testing with people who use assistive technology.
- Keyboard completion, 320/390px layouts, real pointer dragging, three-language font consistency, existing-progress migration and cancellation during the stamp animation checked.
- Self-hosted font loads; computed text styles in the lobby, Moon game, Spanish/Vietnamese interfaces, teacher page and printable resources all use the same family.
- Existing DSN, distance and countdown code unchanged. No deployment performed.

Local browser evidence remains under `output/`; browser runners under `tmp/`.
