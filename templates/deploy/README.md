# Deployment Templates

These examples assume this repository layout: `starter/client` is a Vite static front end and `starter/server` is the Express API. Copy only the config for the host you use to the repository root.

- `render.yaml` deploys the whole starter as one web service. Render reads it as a Blueprint; add the secret values in the Render dashboard when prompted.
- `vercel.json` deploys the client and rewrites `/api/*` to an API hosted elsewhere.
- `netlify.toml` does the same for Netlify, using the client folder as its build base.
- `deployment-checklist.md` is a reusable pre-launch and post-launch review.

For the Vercel and Netlify configs, replace `YOUR-API.onrender.com` with the actual API host before deploying. Deploy the API separately and set its CORS allowlist to the front-end domain. Never put AI or database service keys in a front-end environment variable or in these committed config files. See the [deployment playbook](../../docs/10-deployment-playbook.md) for platform choices, tradeoffs, and launch checks.