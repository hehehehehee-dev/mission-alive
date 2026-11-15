# Mission Alive privacy and sharing

Last updated: November 15, 2026.

Mission Alive requires no account. Certification stamps, certificate names, interface settings, and personal Golden Record drafts remain in the visitor’s browser by default.

## Classroom Golden Records

A classroom greeting reaches the server only after a visitor enters a class code and explicitly confirms the sharing statement. A submission may contain a nickname, language, country, written greeting, English translation, audio, and creation time.

Every submission remains pending until the teacher reviews it. After approval, the class title and approved greeting become available through the public Classroom voices from Earth gallery. Anyone visiting the site may read the approved text or play its audio. Teachers and students should use nicknames and nonspecific class titles that do not identify students.

The teacher can reject a pending greeting or remove a published greeting using the private teacher key. The key must be stored safely because the site has no teacher account recovery. Classroom data remains in Netlify Blobs until the teacher removes it or the site operator deletes it. There is currently no automatic end-of-year deletion.

## Optional AI screening

If the site owner configures `CLASSROOM_OPENAI_API_KEY`, submitted text may be checked with OpenAI moderation before entering the teacher queue. Audio may be transcribed and checked. AI screening never publishes a greeting and never replaces teacher approval. If screening is unavailable, the submission remains pending for teacher review.

## External mission data

Voyager distance and DSN status requests use same-origin serverless endpoints. They do not include a learner name, greeting, certificate, or passport progress.

## Optional playtest feedback and impact

Feedback links open the owner's Google Form in a separate tab. There is no automatic submission, and Mission Alive does not prefill certificate names, saved greetings or progress. Feedback is optional and never gates a stamp, graduation or printing. The Form itself remains under the owner's Google Forms settings.

The public impact page reads `/api/playtest-impact`. The server first requests spreadsheet headers without response rows, then requests only the known rating and Yes/No columns, plus the timestamp needed to count response rows. It never requests age or short-answer response values. The browser receives only aggregate counts, averages and a data-check time, with no individual answers or response timestamps. The raw response Sheet is not linked or embedded in the app.

Results refresh about every five minutes while the page is open, with up to one minute of server caching. Each measure reports its own valid answer count. Incomplete, invalid or conflicting duplicate answers are excluded from that measure. Counts represent voluntary submissions, not unique people or verified certificate completions. Before/after ratings are retrospective, reported together in the same survey; they do not establish a causal learning effect.
