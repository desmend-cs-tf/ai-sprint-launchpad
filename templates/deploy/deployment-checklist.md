# Deployment Checklist

App: <!-- name -->
Environment: <!-- preview / production -->
Front-end URL:
API URL:
Release owner:
Date:

## Before deploy

- [ ] Build and relevant tests pass from a clean install.
- [ ] Host root directory, build command, output directory, and start command are correct.
- [ ] Secrets are configured in the server/host secret store and are not in Git or browser bundles.
- [ ] Production database schema, backups/export, access policies, and deletion path are checked.
- [ ] API CORS allows only intended origins; rate limits and request-size limits are enabled.
- [ ] Third-party data sources, licenses, update dates, and attribution are documented.
- [ ] Privacy notice, consent, retention, and support/contact route are ready.
- [ ] High-impact flows have a human escalation path and a clear non-AI fallback.

## Verify after deploy

- [ ] Health endpoint returns success.
- [ ] Main user journey works on desktop and a phone.
- [ ] Keyboard and screen-reader basics, focus states, and readable contrast are checked.
- [ ] Error, empty, offline, timeout, and rate-limit states are useful and do not reveal stack traces.
- [ ] Logs and analytics do not retain secrets or unnecessary personal data.
- [ ] Domain, HTTPS, redirects, and email links work.
- [ ] Rollback/redeploy steps and a person responsible for monitoring are known.

## Pilot notes

- Pilot audience and partner permission:
- Success measure:
- Known limitations:
- Incident/escalation contact:
- Next review date: