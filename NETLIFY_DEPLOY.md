# Deploy Mission Alive to Netlify

The project includes a Vite build and Netlify Functions for Voyager 1’s JPL Horizons estimate, NASA DSN Now station links, and shared Golden Record greetings. Deploy the project source rather than only the `dist` folder if you want those online features.

English, Spanish and Vietnamese are bundled in the source ZIP. The header selector saves the visitor's choice locally; no translation API, secret or Netlify environment setting is needed.

## Netlify Drop

1. Sign in to Netlify and open [Netlify Drop](https://app.netlify.com/drop).
2. Drop `mission-alive-netlify-update.zip` onto the deploy dropzone for your existing site's **Deploys** page. This source ZIP uses portable file permissions and includes the module required by the Voyager function.
3. Netlify reads `netlify.toml`, runs `npm run build`, publishes `dist`, and deploys the functions at `/api/voyager-distance`, `/api/dsn-now`, and `/api/greetings`.
4. Open the deployed site, visit Voyager, and confirm the counter says “JPL Horizons ephemeris anchored…” rather than “Live estimate unavailable.”

After validating changes, run `python scripts/package-netlify.py`. Keep only these two deploy archives in the project root:

- `mission-alive-netlify-update.zip`: the current source version to upload.
- `mission-alive-netlify-previous.zip`: the previous distinct source version for rollback.

The packager finishes and checks the new ZIP before replacing either version, rotates the current version only when its contents change, and removes older `mission-alive-netlify*.zip` files from this project root. Repeating the command without source changes preserves the previous version. It no longer creates a separate static ZIP; source ZIPs include the Functions needed for Voyager and classroom records. This retention policy applies to local ZIPs, not deployment history on Netlify.

Retention was initialized on October 21, 2026 with the current build and the newest older source archive still available (October 7, 2026). Subsequent packages keep the immediately preceding distinct build.

## Optional community recordings

Personal greetings already record and save privately in the visitor’s browser. Public sharing still needs the moderated recording backend described in `docs/COMMUNITY_RECORDINGS.md`. Configure `VITE_COMMUNITY_API_URL` only after that service is deployed. Microphone capture requires HTTPS outside localhost; Netlify supplies HTTPS automatically.

Shared greetings use a separate Netlify Function and Blob store; see `docs/SHARED_GREETINGS.md`. Greetings publish immediately (owner decision). Optional AI screening requires a server-only `CLASSROOM_OPENAI_API_KEY`; owner removal requires a server-only `COMMUNITY_ADMIN_TOKEN`.

## Quick checks after deployment

- Visit `/api/voyager-distance` and confirm it returns JSON with `distanceKm`, `rangeRateKmS`, and `observedAt`.
- In Voyager, confirm the distance is displayed as grouped whole kilometres (for example `25,827,000,000 km`) and changes each second. This remains an ephemeris-based estimate; no telemetry or per-second API polling is implied.
- Visit `/api/dsn-now` and confirm it returns three stations with current `observedAt` timestamps. An unavailable/stale feed must never be shown as live.
- An assigned VGR1 target alone is not a contact. The Voyager summary requires an active signal, shows its DSS identifiers/range and becomes quiet on a failed refresh. Confirm the deployed function was updated along with the frontend.
- In Voyager, confirm the contact block reflects the returned `voyager1` array and displays the feed timestamp. A failed refresh or stale data must clear active contact and silently use the quiet state, even if recent cached metadata exists. The countdown uses the visitor's clock and switches to the supplied past-tense text at the stored November 18 milestone.
- Complete Webb alignment: real scattered images, a real hexagonal array, a simplified stacking diagram, a 1.2-second stacked-point hold, then SMACS 0723 with its caption and credit.
- Finish an Ingenuity attempt and check the maximum-altitude/duration comparison with Flight 61 (24 m, 129.5 s). No horizontal-distance comparison is made.
- Visit `/api/greetings?action=list` and confirm it returns a JSON `greetings` array. A 404 means this deploy did not include Functions.
- Complete one exhibit and confirm the stamp button waits without changing the count. Press it, check the 750ms ink animation and present-state → transmission → gift reveal, then reload and confirm the stamp remains. Replay shows “Already stamped” without a second ceremony.
- In Voyager, play a greeting, write your own without granting microphone access, then press LISTEN to stamp the certification.
- After the fourth pressed stamp, allow the completion-reading interval and confirm the finale opens automatically. X and Escape close it; opening and closing it early must not make it reopen later.
- After four stamps, enter a name in the finale and print a one-page Mission Alive Graduate certificate; cancel print to confirm the app returns normally.
- Allow microphone access, record a short greeting, and confirm it appears under “My saved greetings.”
- Open Curiosity’s real-image tab and confirm NASA images appear.
- In Curiosity, play a Perseverance recording; check that the audio pauses when you switch exhibits or turn sound off.
- Inspect numbered parts in each exhibit. Confirm the hidden-fact count survives a reload and the lobby badge advances toward 16/16. In 2D view, use the alternate inspect buttons.
- Check the lobby history card. It should say “on this date” only on a matching anniversary; otherwise it labels the dated entry as an archive highlight.
