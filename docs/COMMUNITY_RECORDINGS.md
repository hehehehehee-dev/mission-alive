# Community Golden Record

The Voyager exhibit can record a greeting for up to 30 seconds, preview it, and save it privately in the browser with IndexedDB. A private recording is never uploaded automatically. The visitor must check the public-sharing consent and press **Submit for publishing**.

## Local development

Copy `.env.example` to `.env.local`, choose a long `COMMUNITY_ADMIN_TOKEN`, and start both processes:

```powershell
npm run community-server
npm run dev
```

Vite reads `VITE_COMMUNITY_API_URL`. The API reads the other variables from the process environment; set them in the hosting service or PowerShell session before starting the server. The example API stores metadata and audio beneath `COMMUNITY_DATA_DIR`, which must be a persistent disk when deployed.

## Publishing flow

1. The browser saves the visitor's audio locally.
2. The visitor explicitly consents and submits it.
3. `POST /recordings` validates the metadata, accepted audio type, 8 MB limit, and per-address submission rate. It stores the item as `pending`.
4. A moderator reviews the pending entry in `community-data/recordings.json` and its matching file in `community-data/audio`.
5. Approve it with:

```powershell
$headers = @{ Authorization = "Bearer $env:COMMUNITY_ADMIN_TOKEN" }
Invoke-RestMethod -Method Post -Headers $headers -Uri "http://127.0.0.1:8787/admin/recordings/RECORDING_ID/approve"
```

Use `/reject` instead of `/approve` to remove a rejected recording and its audio. Published items appear in `GET /recordings`; the web exhibit loads that feed and lets every visitor listen.

## Deployment requirements

- Serve the website over HTTPS. Browsers generally require a secure context for microphone access.
- Deploy `server/community-server.mjs` on a Node host with persistent storage, or replace it with an equivalent managed API/object store.
- Set `COMMUNITY_ALLOWED_ORIGIN` to the exact public website origin.
- Keep `COMMUNITY_ADMIN_TOKEN` only on the server and in moderator tooling. Never prefix it with `VITE_`.
- Put the API behind normal infrastructure rate limiting and malware/content review before inviting public traffic. The included in-memory limiter is a prototype safeguard and resets when the process restarts.
- Publish a privacy policy and retention/deletion contact before accepting public submissions, especially if children may use the site.

## API contract

- `GET /health`
- `GET /voyager-distance` — hourly cached JPL Horizons range and range-rate used by the Voyager live estimate
- `GET /recordings` — published metadata and public audio URLs
- `POST /recordings` — JSON containing `name`, `language`, `country`, `message`, `mimeType`, `audioBase64`, and `consent: true`
- `POST /admin/recordings/:id/approve` — Bearer token required
- `POST /admin/recordings/:id/reject` — Bearer token required

If `VITE_COMMUNITY_API_URL` is absent, the public controls stay visibly disabled while private recording, playback, download, and deletion continue to work.
