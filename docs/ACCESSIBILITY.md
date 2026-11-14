# Reading and accessible control pass

Branch: `feature/readable-accessible-academy`

This pass provides a quieter default interface and equivalent ways to perform the existing four training tasks. It does not claim WCAG conformance or certification.

## Interface

- The lobby places the four training choices before optional map exploration. Its primary action starts/resumes training; the Moon stories remain on the map. DSN and the archive remain available in Mission notes. Their data logic is unchanged.
- Text uses a simpler hierarchy, solid reading surfaces, less decorative glow, larger captions and visible focus indicators. The NASA photos, route, ship and models remain.
- Display & access in the header offers higher contrast, larger text and reduced motion. Settings are local to the browser and work for the current visit if storage is unavailable. The native dialog has explicit focus wrapping, Escape and return focus.
- Each mission photo starts with a short introduction; the complete existing notes are available through Read my mission notes. Sources remain visible.
- Skip links focus the actual destination without changing the app route or resetting a simulation. Games pause while a dialog is open.

## Equivalent controls

- **Curiosity:** a table shares the visual map's actual obstacles, sample, uplink and rover state, including analyzed samples. Row/column headings, a position description and a Read current position action supplement Step. Reordering/removing a program block retains keyboard focus. Symbols supplement the map colors. The existing mission/photo tabs support arrow keys and Home/End.
- **Ingenuity:** continuous flight remains available. Step-by-step flight advances the same simulated flight time and wind/terrain rules only when Continue flight is activated. Players can adjust trim between stages. Unsafe terrain still fails and permits a retry. Trim has increment/decrement buttons.
- **Webb:** buttons open each wing. Players choose image A/B/C and move it with labeled direction buttons; coordinates and the target are available in text. Keyboard and drag controls remain. Wavelength has increment/decrement buttons. All methods share the existing alignment and completion state.
- **Voyager:** using the existing written greeting is an alternative to playing its recording. Reading a greeting and adding one's own written greeting can earn the same existing stamp without audio playback or microphone access. The live distance remains quiet until a visitor requests a reading; its numeric calculation and cadence are unchanged.
- **Machine parts:** compact visual markers retain broader pointer targets. The part dock has readable labels and horizontal scrolling; part descriptions and credits use larger text.

New interface strings and state descriptions are included in English, Spanish and Vietnamese.

## Verification performed

- 89 Node tests passed; production Vite build passed.
- Clean Chromium context: Curiosity Step/program and evidence choice → Ingenuity paced crater failure/flat retry → Webb pointer buttons → Voyager written greeting, with four visitor-activated stamp ceremonies, automatic TRAINING COMPLETE, and exactly four certificate stamps. Print action was checked with a browser-print stub.
- axe-core 4.10.3 checks with `wcag2a`, `wcag2aa`, `wcag21aa`, `wcag22aa`: zero reported violations on lobby, display settings with higher contrast/larger text, the four challenge states, finale, mission photo entrance, both Moon panels, teacher page and Webb's 3D/part-information states.
- 320px and 390px layouts, enlarged text, settings persistence, focus wrapping/restoration, functional skip link, shared map table semantics, and all six map destinations were checked.
- Existing Webb 3D scene rendered in Chromium. Its part information remained interactive. Narrow layout was also checked with a 32px root font (200% text resizing); this is a text-resizing check, not a claim that every browser's zoom behavior was tested.
- New settings and Webb controls were checked in Spanish and Vietnamese.

## Remaining manual evaluation

Automated checks and browser keyboard tests do not establish usability for every disability. NVDA and VoiceOver were not available for manual testing in this Windows environment. Screen-reader speech order, switch/voice-control use, forced-colors behavior across browsers, and sessions with disabled students remain manual evaluation tasks. Firefox, Safari and actual device/browser zoom need separate coverage.

Reference: [WCAG 2.2 Quick Reference](https://www.w3.org/WAI/WCAG22/quickref/), [dragging alternatives](https://www.w3.org/WAI/WCAG22/Understanding/dragging-movements.html), [involving disabled users](https://www.w3.org/WAI/test-evaluate/involving-users/).
