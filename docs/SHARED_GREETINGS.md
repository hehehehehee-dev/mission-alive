# Shared Golden Record greetings

Owner decision, 15 November 2026: a greeting goes public as soon as it is shared. There is no classroom code, teacher key or review queue. This replaced the classroom Golden Record flow, which had no published entries in production when it was removed.

## How it works for a visitor

1. In Voyager's studio, write a greeting or record up to 30 seconds. Listening to Earth is optional; sending your own greeting is the mission action that earns the stamp.
2. Tick the sharing box: “I made this greeting. I did not say my full name, my school, or where I live. Everyone can hear it.”
3. Press **Share with everyone**. The greeting counts toward the Voyager stamp, is kept on the device under “My shared greetings”, and appears straight away in “Voices from Earth today” for everyone.

Anyone can listen without sharing. In the Voyager challenge, press **Hear Earth** to open the adjacent **Golden Record · 1977** and **Visitor greetings** tabs. The public “Voices from Earth today” list appears before the create-and-share studio.

When automatic transcription is configured on the live server, a recorded greeting also receives a transcript. The transcript is shown with the shared audio and kept in the visitor's device copy. If transcription is unavailable, the audio still shares and still counts toward the stamp.

Without the box ticked, nothing is uploaded. If sharing fails or the site runs locally, the greeting still counts toward the stamp.

## Safeguards that do not delay publishing

- **Report:** any visitor can press Report on a greeting. One report hides it immediately for everyone.
- **Remove from everyone:** the device that shared a greeting keeps a private delete key (only its hash is stored on the server).
- **Owner removal:** `POST /api/greetings` with `{ "action": "owner-remove", "id", "ownerToken" }` deletes any greeting; `owner-restore` brings back a reported one. The token is the server-only `COMMUNITY_ADMIN_TOKEN` environment variable.
- **Automatic screening (optional):** with `CLASSROOM_OPENAI_API_KEY` set, the words are checked with OpenAI moderation and audio is transcribed and checked before publishing. Flagged greetings are refused. Without the key, greetings are published unchecked.
- **Limits:** text up to 240 characters, audio up to 2 MB, 60 requests per minute per IP.

## Server

- Function: `netlify/functions/shared-greetings.mjs` → `/api/greetings`, logic in `server/shared-greetings.mjs`.
- Store: Netlify Blobs `mission-alive-shared-greetings` (`greeting/{id}`, `audio/{id}`, and a `public/{publishedAt}/{id}` index for the list).
- `GET /api/greetings?action=list` returns the 40 newest public greetings without secrets; `GET ?action=audio&id=` streams audio for public greetings only.

## Known limits

- There is no human review before publishing, and screening only runs when the owner configures it.
- One report hides a greeting, so someone could hide many greetings; the owner can restore them.
- Greetings are kept until removed; there is no automatic deletion.
