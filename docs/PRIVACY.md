# Mission Alive privacy and sharing

Last updated: November 15, 2026.

Mission Alive requires no account. Certification stamps, certificate names, interface settings, and a device copy of the visitor’s own greetings remain in the visitor’s browser.

## Shared Golden Record greetings

Owner decision (November 15, 2026): shared greetings are published immediately, with no review queue. The classroom code and teacher-approval flow were removed.

A greeting reaches the server only after the visitor ticks the sharing statement (“I made this greeting. I did not say my full name, my school, or where I live. Everyone can hear it.”) and presses Share with everyone. A shared greeting may contain a nickname, language, country, written greeting, English translation, audio up to 2 MB, and the time it was shared. It is listed at once in “Voices from Earth today”, and anyone visiting the site may read it or play its audio.

Removal:

- The sharing device receives a private delete key, kept with its local copy, and can remove the greeting for everyone with “Remove from everyone”.
- Any visitor can press Report. One report hides the greeting immediately.
- The site owner can permanently remove or restore any greeting with `COMMUNITY_ADMIN_TOKEN` (`owner-remove` / `owner-restore` on `/api/greetings`).

Greetings are stored in Netlify Blobs (`mission-alive-shared-greetings`) until removed. There is no automatic deletion.

## Optional AI screening

If the site owner configures `CLASSROOM_OPENAI_API_KEY`, submitted text is checked with OpenAI moderation and audio is transcribed and checked before publishing. A flagged greeting is refused. Without the key, greetings are published without any automatic check.

## External mission data

Voyager distance and DSN status requests use same-origin serverless endpoints. They do not include a learner name, greeting, certificate, or passport progress.

## Optional playtest feedback and impact

Feedback links open the owner's Google Form in a separate tab. There is no automatic submission, and Mission Alive does not prefill certificate names, saved greetings or progress. Feedback is optional and never gates a stamp, graduation or printing. The Form itself remains under the owner's Google Forms settings.

The public impact page reads `/api/playtest-impact`. The server first requests spreadsheet headers without response rows, then requests only the known rating and Yes/No columns, plus the timestamp needed to count response rows. It never requests age or short-answer response values. The browser receives only aggregate counts, averages and a data-check time, with no individual answers or response timestamps. The raw response Sheet is not linked or embedded in the app.

Results refresh about every five minutes while the page is open, with up to one minute of server caching. Each measure reports its own valid answer count. Incomplete, invalid or conflicting duplicate answers are excluded from that measure. Counts represent voluntary submissions, not unique people or verified certificate completions. Before/after ratings are retrospective, reported together in the same survey; they do not establish a causal learning effect.
