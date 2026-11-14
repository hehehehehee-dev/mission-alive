# Classroom Golden Records

The Voyager studio now has a classroom collection. A teacher creates a record and receives two values: a 12-character **class code** for students and a private **teacher key** for moderation. Students save a greeting locally first, then explicitly consent to submit it to the class. Text works without microphone access. Up to 30 seconds of audio can be recorded; class uploads must be under 2 MB.

Submissions remain pending. The teacher can hear pending audio, read the words and optional English translation, then approve or reject. Approval puts the greeting in the public classroom gallery; anyone visiting the site can hear or read it. The teacher can later remove a published greeting. The teacher key is also saved on that browser, but must be copied somewhere private to survive a browser reset. Do not share it with students.

The serverless API is `netlify/functions/class-record.mjs`, routed at `/api/class-record`. It stores class metadata, audio, pending entries, and public gallery entries in a site-wide Netlify Blobs store. Site-wide Blobs survive redeploys. The class is limited to 60 submitted entries; the gallery shows the latest 40 approved greetings. No accounts or student email addresses are required. Passport stamps remain local.

## Optional AI screening

Set `CLASSROOM_OPENAI_API_KEY` as a server-side Netlify environment variable if you want pre-screening. The function sends text fields to OpenAI's Moderation API. For audio, it attempts a transcription and checks that transcript too. A flagged submission is rejected before the teacher queue. If no key is set or an AI call fails, the submission stays pending for the teacher to review; it is never auto-published. The queue labels its AI status. A recording whose audio could not be transcribed is marked `audio-unchecked` when the text check succeeded, so the teacher knows to listen. OpenAI transcription can incur charges. Never put this key in `VITE_` variables, the ZIP, or frontend code.

## Deploy and verify

Use the **source ZIP** on a logged-in Netlify project that performs the Vite build and bundles Netlify Functions, or use Netlify CLI / Git deployment. A prebuilt static `dist` ZIP cannot serve `/api/class-record`; it will show the classroom UI but cannot create a class or share submissions. After deploying, test `GET /api/class-record?action=gallery` and expect `{ "recordings": [] }` on a new site. Check the Netlify deploy log for the `class-record` function. Then create a test class in Voyager, submit a written greeting, confirm it is absent from the public gallery until teacher approval, and remove it afterward.

## Before inviting real students

- Review your school's consent and student-content policy. A teacher's approval makes the chosen name, class title, country, written text, translation, and audio public. Use nicknames and nonspecific class titles.
- Publish a privacy notice that names the data stored, the public gallery, retention period, and a contact for deletion requests. The current app has no automatic end-of-year deletion.
- Check Netlify Function and Blob usage and apply traffic limits appropriate for school traffic. The site is a pilot, not an abuse-resistant open publishing service.
- Do not promise that AI catches every harmful submission. The teacher always reviews before publication.

The travel counter is an **imagined journey**, not the physical location of a new message. It multiplies elapsed time since saving by NASA's approximate Voyager 1 Sun-relative speed of 17 km/s; the greeting is not on Voyager.

The public app summarizes these rules in the footer’s **Privacy & sharing** dialog. Any change to collected fields, approval behavior, publication, removal, retention, or AI screening must update that dialog and `docs/PRIVACY.md` in the same commit.
