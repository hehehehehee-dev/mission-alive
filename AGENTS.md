# Netlify packaging preference

The user wants only the current Netlify version and the previous distinct version retained locally. Use `scripts/package-netlify.py` after validating changes; it keeps `mission-alive-netlify-update.zip` and `mission-alive-netlify-previous.zip` in this project root. Do not create additional dated or static Netlify ZIP copies. This preference does not authorize removing hosted Netlify deployments.

# Sources and attribution

Every NASA or other astronomy/space-organization resource used in the app, including every image, background, surface map, illustration, video, recording, dataset, API, and factual source, must appear in the visible Sources & credits section. Keep the central catalog in `src/resource-credits.js` current and retain credit near the resource where practical. For each media asset record its title, exact organization/creator credit, official source page, original download URL, local file, where it is used, and any presentation changes. Distinguish photographs/observations, composites, texture-based renders, official artist concepts, and original Mission Alive simulations. New dynamically loaded archive images must register their NASA ID, original source and supplied credit. Do not describe illustrations or simulations as photographs, or imply agency endorsement.
