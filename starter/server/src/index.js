import 'dotenv/config'; // ALWAYS first line — loads server/.env before anything reads process.env

import express from 'express';
import cors from 'cors';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

import resourcesRouter from './routes/resources.js';
import aiRouter from './routes/ai.js';
import { configuredProviders } from './lib/ai.js';
import { dbMode } from './lib/db.js';

const app = express();
const PORT = process.env.PORT || 3001;

// ── Middleware ───────────────────────────────────────────────
app.use(cors()); // lets the Vite dev server (port 5173) call this API
app.use(express.json({ limit: '1mb' })); // parses JSON request bodies into req.body

// ── Health check: open http://localhost:3001/api/health ─────
// Tells you at a glance which "mode" the app is running in.
app.get('/api/health', (req, res) => {
  res.json({
    ok: true,
    database: dbMode(), // "supabase" or "memory"
    aiProviders: configuredProviders(), // [] means demo mode
  });
});

// ── API routes ───────────────────────────────────────────────
app.use('/api/resources', resourcesRouter);
app.use('/api/ai', aiRouter);

// ── Production: serve the built React app from client/dist ──
// After `npm run build`, one Render/Railway service can host BOTH
// the API and the front end.
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const clientDist = path.resolve(__dirname, '../../client/dist');
if (fs.existsSync(clientDist)) {
  app.use(express.static(clientDist));
  // Any non-API route returns index.html so React Router (if you add it) works
  app.get(/^\/(?!api).*/, (req, res) => res.sendFile(path.join(clientDist, 'index.html')));
}

// ── Catch-all error handler (keeps stack traces off the client) ─
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Something went wrong on the server.' });
});

app.listen(PORT, () => {
  console.log(`✅ API running on http://localhost:${PORT}`);
  console.log(`   Database: ${dbMode()}`);
  const providers = configuredProviders();
  console.log(`   AI: ${providers.length ? providers.join(' → ') : 'demo mode (no API keys yet)'}`);
});
