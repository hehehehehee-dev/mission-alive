# Netlify packaging preference

The user wants only the current Netlify version and the previous distinct version retained locally. Use `scripts/package-netlify.py` after validating changes; it keeps `mission-alive-netlify-update.zip` and `mission-alive-netlify-previous.zip` in this project root. Do not create additional dated or static Netlify ZIP copies. This preference does not authorize removing hosted Netlify deployments.
