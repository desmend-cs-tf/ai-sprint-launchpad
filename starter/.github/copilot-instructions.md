# Copilot instructions

Follow the rules in `/AGENTS.md`. Short version:

- Plain JavaScript, ES modules, React 18 + Vite client, Express 4 server.
- First line of every server file: `import 'dotenv/config';`
- Validate input with zod `safeParse` before database or AI calls.
- Never put API keys in `client/`.
- Preserve teaching comments; explain changes in plain English.
