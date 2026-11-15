# Playtest feedback and automatic impact

The survey is the owner's [Mission Alive playtest Form](https://docs.google.com/forms/d/e/1FAIpQLSe2RLRGNW1jGAGT5utIXmYD8MPDOUPm1rQaKFUr_e_3AGCKVQ/viewform). The source is response tab `1917228454` in the [response spreadsheet](https://docs.google.com/spreadsheets/d/1VpaHPB1zAnjOdhKy4N7So32Ikwc0vQ3CsnZ8hrIl6O4/edit?gid=1917228454). Both were verified on November 15, 2026; the Sheet had zero response rows. No sample response was submitted.

## Visitor flow

- Every completed mission offers Give feedback. The graduation screen always includes a separate feedback invitation beside the certificate controls, including when a visitor reopens a completed certificate.
- The printable certificate includes the same link. The normal footer also offers feedback to visitors who do not finish, reducing the invitation's dependence on completion.
- Links open Google Forms separately and carry no name, greeting or progress. Feedback never blocks the certificate or a stamp.
- About links to `/#impact`. This page shows only survey aggregates and its data-check time. The source link goes to the Form, not the raw Sheet.

## Automatic refresh

`netlify/functions/playtest-impact.mjs` serves `/api/playtest-impact`. `server/playtest-impact.mjs` uses the public Google Visualization CSV endpoint. It discovers headers with `select * limit 0`, constructs an allowlist projection from the known question titles and reads only those selected columns. Age and short-answer values are never requested. Reordering columns or removing the duplicate question is supported; renaming a question removes it from the allowlist until the server mapping is deliberately updated.

No Google key or new environment variable is needed with the Sheet's currently verified link-readable access. Do not add the Sheet to frontend code, embed it or publish it to the web as a setup step. If access is removed, the API returns an unavailable state, rather than fabricated zeros. The source Sheet and Form are not edited by this integration.

The server caches only aggregates for 60 seconds and deduplicates simultaneous refreshes. The page requests fresh results on opening and about every five minutes while visible. Leaving the page aborts pending work and removes the timer and language listener. New responses require no commit, rebuild or redeploy. Netlify Functions must be deployed; a static-only ZIP cannot serve this endpoint.

## Metrics and limits

| Display | Calculation |
| --- | --- |
| Survey responses | Rows with a nonempty Google-generated timestamp. This is not a unique-person count. |
| Interest in space | Valid paired ratings on a 1–5 scale: before mean, after mean and mean paired change. |
| Feeling space is for me | The same paired calculation for the belonging questions. |
| Want to learn more | Number rating 4 or 5, divided by valid answers to this question. |
| Would recommend | Number rating 4 or 5, divided by valid answers to this question. This is not NPS. |
| Finished six missions | Yes answers divided by valid Yes/No answers. This is self-reported, not linked to app progress. |

The Form currently repeats “After playing, how interested are you in space now?” twice. Equal answers count once. One blank and one valid answer use the valid answer. Conflicting or invalid duplicate answers exclude that response from the interest-pair measure only. Other measures remain independent. The owner may remove the duplicate question in Google Forms; the loader will discover the remaining column automatically.

No age breakdowns, individual timestamps, free-text quotes or written responses are published. Empty data shows zero responses and a waiting message, with no invented score or percentage. Before/after answers are recalled in one post-play survey. Voluntary sampling, possible repeat submissions and lack of a control group mean these results show reported experience, not proof that the app caused an educational change.

## Validation

Automated coverage checks CSV quoting, zero data, valid per-question denominators, missing/out-of-range scores, duplicate conflicts, exclusion of age/free-text columns, cache expiry, five-minute refresh, hidden-tab behavior, retry, abort/disposal and certificate feedback placement. Browser QA uses isolated local aggregate fixtures for populated/error states and restored six-stamp state for certificate UI. These fixtures are not deployed or written into the real Form or Sheet.
