# Mission Alive privacy and sharing

Last updated: November 14, 2026.

Mission Alive requires no account. Certification stamps, certificate names, interface settings, and personal Golden Record drafts remain in the visitor’s browser by default.

## Classroom Golden Records

A classroom greeting reaches the server only after a visitor enters a class code and explicitly confirms the sharing statement. A submission may contain a nickname, language, country, written greeting, English translation, audio, and creation time.

Every submission remains pending until the teacher reviews it. After approval, the class title and approved greeting become available through the public Classroom voices from Earth gallery. Anyone visiting the site may read the approved text or play its audio. Teachers and students should use nicknames and nonspecific class titles that do not identify students.

The teacher can reject a pending greeting or remove a published greeting using the private teacher key. The key must be stored safely because the site has no teacher account recovery. Classroom data remains in Netlify Blobs until the teacher removes it or the site operator deletes it. There is currently no automatic end-of-year deletion.

## Optional AI screening

If the site owner configures `CLASSROOM_OPENAI_API_KEY`, submitted text may be checked with OpenAI moderation before entering the teacher queue. Audio may be transcribed and checked. AI screening never publishes a greeting and never replaces teacher approval. If screening is unavailable, the submission remains pending for teacher review.

## External mission data

Voyager distance and DSN status requests use same-origin serverless endpoints. They do not include a learner name, greeting, certificate, or passport progress.
