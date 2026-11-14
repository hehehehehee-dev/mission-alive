# Start here

Mission Alive is shared between Codex and Claude. Before editing, read `CLAUDE.md` (project rules for every AI collaborator, not only Claude), then `docs/AI_HANDOFF.md` — section 0 (“Current state”) and the newest entry in section 9 (“Handoff log”) tell you where the last collaborator stopped — then `docs/CHANGELOG.md`.

# Handoff after every commit

Before every commit, update section 0 of `docs/AI_HANDOFF.md` and add a section 9 log entry, in the same commit. Record the branch, commit subject, what changed, how it was verified, and what is left for the next collaborator. Claude follows the same rule, so this file is how work passes between the two.

# Direct main workflow

The owner has explicitly chosen a direct deployment workflow. Work on `main`; after a coherent change passes its relevant checks, commit it and push it to `origin/main` so Netlify can deploy it. Do not create a feature branch unless the owner changes this instruction. Never force-push or rewrite public history.

# Netlify packaging preference

The user wants only the current Netlify version and the previous distinct version retained locally. Use `scripts/package-netlify.py` after validating changes; it keeps `mission-alive-netlify-update.zip` and `mission-alive-netlify-previous.zip` in this project root. Do not create additional dated or static Netlify ZIP copies. This preference does not authorize removing hosted Netlify deployments.

# Sources and attribution

Every NASA or other astronomy/space-organization resource used in the app, including every image, background, surface map, illustration, video, recording, dataset, API, and factual source, must appear in the visible Sources & credits section. Keep the central catalog in `src/resource-credits.js` current and retain credit near the resource where practical. For each media asset record its title, exact organization/creator credit, official source page, original download URL, local file, where it is used, and any presentation changes. Distinguish photographs/observations, composites, texture-based renders, official artist concepts, and original Mission Alive simulations. New dynamically loaded archive images must register their NASA ID, original source and supplied credit. Do not describe illustrations or simulations as photographs, or imply agency endorsement.

# Documentation sync

Every product, code, content, data, or UX change must update `docs/CHANGELOG.md` and any affected Markdown guide in the same commit. Claude and other collaborators rely on these files to understand the current project. A change is not complete while its documentation describes an older state.
