# Machine voices

Minh supplied the four final ElevenLabs recordings on October 23, 2026. The app keeps the full written transmissions and continues to work if an individual asset cannot play; it does not synthesize substitute speech.

Place the final exported MP3s in `src/assets/voices/` using these exact filenames:

| File | Exact script |
| --- | --- |
| `voice-curiosity.mp3` | I was only supposed to work for two years. Fourteen years later, I'm still here, still climbing. My wheels are worn down and I move slowly, but nobody told me to stop. |
| `voice-ingenuity.mp3` | Honestly, I was just an experiment. Five flights, just to see if flying on Mars was even possible. I ended up flying seventy-two times. My rotor broke on the last one. But hey, I got to fly. |
| `voice-webb.mp3` | I'm the new one out here. I only started watching a few years ago, and the light I catch is older than anything you've ever seen. I've got a long watch ahead of me. I'm just getting started. |
| `voice-voyager.mp3` | They built me to last five years. It's been forty-nine. I'm so far away now that when I say something, it takes a whole day to reach home. But I'm still here. I'm still talking. |

Use four distinct library/Voice Design voices without cloning a real person: calm and patient Curiosity; bright, quick Ingenuity; quiet and precise Webb; elderly, gentle and distant Voyager. Generate the user's scripts exactly and keep words clearly understandable. The supplied prompt requests Eleven Multilingual v2, two takes per line, trimmed MP3s around 15 seconds or less each. Confirm the chosen ElevenLabs plan's current attribution and publication terms before producing the files.

Optional supplied files use the same voices:

- `voice-curiosity-mid.mp3`: “Blocked. I will wait for a new plan.”
- `voice-ingenuity-mid.mp3`: “The wind is pushing. Correcting.”
- `voice-webb-mid.mp3`: “Still eighteen stars. Keep going.”

Vite discovers only files that exist when building. After adding or replacing them, rebuild and package the source using `scripts/package-netlify.py`; keep only the current and previous Netlify archives. Missing files do not create HTTP requests or a broken audio player. Do not add dummy MP3s to the repository or deploy package for testing.

`src/machine-voices.js` provides the playback controller. Construction, route entry and enabling Sound never start speech. Stamp/replay events call `playTransmission(id)`; optional incident events call `playMid(id)` at most once per attempt. `beginAttempt(id)` stops any old speech and resets the incident allowance. `setEnabled(false)`, navigation, reset and disposal stop current or pending playback. A final transmission may interrupt a short incident cue; an incident cannot interrupt a final transmission. Browser autoplay rejection is caught so the written transmission remains usable and a manual replay can try again.

The November 15 local preview also places a Hear my message / Stop my message control beside each of the four opening stories. This reuses the supplied final recording; it is labelled as a short English character message, not a narration of the adjacent science paragraphs. Its matching transcript appears on request and follows the interface language. Explicit Play enables Sound, pauses competing archive players and uses the same controller as the finale; navigation, reset and Sound off stop it. `src/story-voice.js` owns this control. Apollo 17 and Surveyor 3 have no supplied recording and get no empty player. This preview remains uncommitted at the owner's request.

On the first earn, completing the challenge only presents the certification stamp. The visitor's press starts the soft thud when Sound is on; progress commits after 750ms. The present-state story then appears, followed by the transmission and its supplied voice, then the gift. A completed module never automatically repeats its stamp ceremony or voice; its existing replay button remains explicit. Reset/navigation during the ceremony cancels pending progress and speech. The text-first failure cues are separate from the optional MP3 scripts above and do not change their supplied wording.

Show the attribution “Machine voices generated with ElevenLabs.” only when at least one supplied voice asset exists. Missing-file state is implementation documentation, not a visitor-facing unlock promise.
