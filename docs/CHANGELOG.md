# Mission Alive change log

Claude and other collaborators should read this file after `CLAUDE.md`. Every product, code, content, data, or UX change must update this log in the same commit. Keep entries short and factual. Do not repeat the full commit diff.

## 2026-11-14

### Public privacy notice and deployment headers

- Added a keyboard-accessible “Privacy & sharing” footer dialog explaining local-only progress, classroom submission consent, teacher moderation, public gallery fields, removal, retention, and optional AI screening.
- Added Spanish and Vietnamese copy for the full notice.
- Added CSP, HSTS, frame protection, and browser permission restrictions to the Netlify deployment while preserving same-origin microphone recording and APIs.

### Shared AI handoff

- Renamed `docs/CLAUDE_HANDOFF.md` to `docs/AI_HANDOFF.md` so Claude and Codex share one handoff.
- Added a “Current state” section and a per-commit handoff log; `CLAUDE.md` and `AGENTS.md` now require both to be updated in every commit.

### Dedicated Apollo 17 and Surveyor 3 pages

- Added direct `#apollo17` and `#surveyor3` routes instead of opening both missions through the shared Moon chooser.
- Each Moon route now opens as a full-page mission with its own purpose, official source, existing interactive challenge, stamp ceremony, and return action.
- Updated the Moon map pins, lobby cards, browser history, and direct-link loading to use the dedicated routes without changing the six-stamp finale.
- The route-page back button now has a matching accessible name (“Back to academy”) instead of the stale “Close Moon training” label, and both its visible text and name have Spanish and Vietnamese translations.

### Unified training and certification deck

- Merged the duplicate machine picker and certification grid into one six-card training deck.
- Kept the visual machine silhouettes while adding mission numbers, descriptions, live stamp state, and the shared progress bar to the same cards.
- Preserved the direct mission CTA, six-stamp progress, passport, finale, and certificate behavior.

### Journey map credit spacing

- Anchored the Moon and Mars image credits inside their own scenes on desktop and mobile so they cannot overlap the following frontier heading or distance label.

### Lobby launch bay redesign

- Replaced the text-heavy opening flow with an immediate mission CTA and a visual six-machine launch bay.
- Added original code-drawn machine silhouettes with direct links to all six missions.
- Moved the optional certificate name field below the mission choices.
- Moved teacher and project background copy into a lower “About Mission Alive” disclosure.
- Replaced repeated mission-card instructions with one action verb and one “Open mission” link.
- Collapsed mobile header utilities into a keyboard-accessible Menu while keeping language and passport visible.
- Added reduced-motion behavior and English, Spanish, and Vietnamese copy for the new controls.

### Problem framing and lobby hook

- Replaced the three-paragraph lobby introduction with a two-line child-readable hook beneath the main headline.
- Added Spanish and Vietnamese translations for both hook lines.
- Rewrote the project-page problem section around verified LEGO/Harris Poll figures and a separately sourced 11-to-14 STEM-interest finding.
- Added both research sources to the public resource catalogue.
- Added a repository rule requiring future changes to update Markdown documentation for Claude in the same commit.

### GitHub presentation

- Rebuilt the README around product framing, Quick Start, a 90-second tour, architecture, verification, accessibility, privacy, deployment, and source documentation.
- Added a sourced Problem and Solution document.
- Added `CLAUDE.md` and the full Claude handoff.

### Learner onboarding

- Added a shared three-step visual Quick Start to all six missions.
- Moved longer explanations behind optional “Why this works” disclosures.
- Added English, Spanish, and Vietnamese copy for the onboarding pattern.
