# Claude project instructions

This file is the starting point for Claude or another AI collaborator working on Mission Alive. Read this file, then `docs/CLAUDE_HANDOFF.md` and `docs/CHANGELOG.md`, before editing.

## Project identity

- Product name: **Mission Alive** (no colon).
- Current public release: **v1.0.0**.
- Repository: `https://github.com/hehehehehee-dev/mission-alive`.
- Audience: learners aged 10–14, including keyboard, screen-reader, reduced-motion, low-vision, and sound-off users.
- Frame: an independent interactive space academy. Six machines that cannot come home teach where they rest.
- Languages: English, Spanish, and Vietnamese.

## Source of truth

The running code and automated tests are authoritative. Some older prose and screenshots document earlier four-mission versions and may be stale. In particular, do not restore a four-stamp model from historical documentation.

The current certification loop contains exactly six missions and six stamps, defined in `src/certification.js`:

1. Apollo 17 Lunar Roving Vehicle
2. Surveyor 3
3. Curiosity
4. Ingenuity
5. Webb
6. Voyager 1

Do not add, remove, or silently change a stamp, finale condition, storage key, certificate, or mission success condition unless the owner explicitly requests it.

## Required workflow

1. Inspect the relevant implementation and tests before proposing a change.
2. Work on a branch. Keep `main` releasable.
3. Preserve unrelated user changes and untracked build artifacts.
4. Add or update tests for behavior changes.
5. Run `npm test` and `npm run build`.
6. For UI changes, check keyboard use, reduced motion, English/Spanish/Vietnamese, and a narrow mobile viewport near 390 px.
7. Only after validation, run `python scripts/package-netlify.py` when a new Netlify package is requested. It intentionally retains only the current and previous ZIP.
8. Never deploy, push, publish, or create a release unless the owner asks.
9. Update `docs/CHANGELOG.md` and any affected Markdown guide in the same commit as every product, code, content, data, or UX change. Documentation is part of the definition of done.

## Non-negotiable content rules

- Never invent NASA facts, measurements, quotes, mission status, or image provenance.
- Every NASA, ESA, CSA, STScI, JPL, or other astronomy resource—including images, backgrounds, audio, video, datasets, and APIs—must be recorded in `src/resource-credits.js` and visibly credited in the experience where practical.
- Clearly distinguish photographs, observations, composites, official illustrations, visualizations, and original Mission Alive simulations.
- Do not imply NASA endorsement and do not use the NASA logo as project branding.
- Treat all challenge physics and game values as educational simplifications unless they come from an explicitly cited source.
- Original Golden Record audio and NASA-published translations must not be silently altered.

## UX rules

- A restless child should understand the next action without reading a paragraph.
- Put the challenge first. Use the shared three-step visual Quick Start from `src/quick-start.js`; place deeper explanations in optional disclosures.
- Failure should teach one actionable correction. A learner should normally succeed within two or three informed attempts.
- Never make audio, microphone permission, precise dragging, color alone, hover, or WebGL mandatory.
- Maintain native keyboard controls, visible focus, touch targets, text alternatives, reduced motion, and a functional 2D fallback.
- Use one font family unless the owner explicitly changes the design system.
- Prefer extending existing patterns over adding a new visual language.

## Data and privacy

- Core missions require no account and no analytics.
- Personal greetings remain private unless the visitor explicitly shares them.
- Classroom/public recordings require consent and moderation. Never expose server tokens through a `VITE_` variable.
- Voyager distance is an ephemeris estimate from JPL Horizons, not direct telemetry.
- DSN status must not claim a live contact when data is stale, missing, or only an assignment.

## Commands

```sh
npm install
npm run dev
npm test
npm run build
python scripts/package-netlify.py
```

Node.js 20.19+ or 22.12+ is expected. See `docs/CLAUDE_HANDOFF.md` for architecture, mission mechanics, data flow, verification, and safe collaboration boundaries.
