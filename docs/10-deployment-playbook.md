# 10 · Deployment Playbook

Pick a host based on your app's shape, not its trendiness. The starter is React + Vite in `starter/client` and Express in `starter/server`; Express can also serve the built client as one Render service.

## Choose a deployment shape

| Shape | Good fit | Common choices | Tradeoff |
|---|---|---|---|
| One full-stack service | Simplest launch; one origin for the UI and `/api` | Render Web Service | Free instances may sleep; first request can be slow. |
| Static front end + API | Independent front-end and API deployments | Netlify, Vercel, Cloudflare Pages + Render | Configure an API proxy or API base URL and restrict API CORS. |
| Static-only app | No server, or serverless/hosted backend | GitHub Pages, Netlify, Vercel, Cloudflare Pages | Static hosting cannot keep API keys secret; never put provider secrets in `VITE_*` variables. |
| Container / broader app platform | Custom runtime, workers, or more control | Fly.io, DigitalOcean App Platform, Railway | Check current free credits, idle behavior, and usage-based billing before launch. |

Platform documentation: [Render](https://render.com/docs), [Vercel](https://vercel.com/docs), [Netlify](https://docs.netlify.com/), [Cloudflare Pages](https://developers.cloudflare.com/pages/), [GitHub Pages](https://docs.github.com/en/pages), [Fly.io](https://fly.io/docs/), [Railway](https://docs.railway.com/), and [DigitalOcean App Platform](https://docs.digitalocean.com/products/app-platform/).

## Use the templates

Copy one platform config from [`templates/deploy/`](../templates/deploy/) to the repository root and follow its README. The Render blueprint deploys the complete starter as one service. The Vercel and Netlify examples deploy the Vite client separately and proxy `/api/*` to an API service; replace the example API host before deploying.

1. Push the project to a Git provider supported by your host.
2. Set build and output paths for the folder that contains the app. In a monorepo, verify the host's root/base-directory setting.
3. Add secrets in the host's server-side environment settings. The starter's server can use `GEMINI_API_KEY`, `GROQ_API_KEY`, `OPENROUTER_API_KEY`, `SUPABASE_URL`, and `SUPABASE_SERVICE_KEY`. Do not expose server keys as `VITE_*` variables.
4. Configure the front-end host's `/api/*` proxy to the API origin, or deliberately change the client API base URL. Restrict API CORS to the deployed front-end origin.
5. Deploy and verify `/api/health`, a real user flow, mobile layout, and logs with secrets redacted.
6. Add a custom domain only after the app works on its host URL. Enable HTTPS and verify redirects, cookies, and email links on the custom domain.

## Launch checklist

Use the [deployment checklist template](../templates/deploy/deployment-checklist.md) for a repeatable release. At minimum, verify secrets and database policies, backups/export, error messages, accessible keyboard use, privacy notices, and a rollback path. For apps involving health, benefits, children, jobs, or safety, complete the relevant safety and privacy review in the [scale-up guide](12-sprint-apps-scale-up.md) before inviting real users.

Free tiers and commercial-use terms change. Confirm the current pricing, sleep/idle rules, bandwidth/build limits, and terms on the provider's own site before committing to a production architecture.