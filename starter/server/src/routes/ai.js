import 'dotenv/config';

import { Router } from 'express';
import { z } from 'zod';
import { askAI, compareAI } from '../lib/ai.js';
import { listResources } from '../lib/db.js';

const router = Router();

const ChatSchema = z.object({
  message: z.string().trim().min(1).max(2000),
  // Optional short memory of the conversation so far
  history: z
    .array(z.object({ role: z.enum(['user', 'assistant']), content: z.string().max(4000) }))
    .max(10)
    .optional()
    .default([]),
});

/*
 * MINI-RAG (Retrieval-Augmented Generation) — the restaurant analogy:
 *  1. RETRIEVE: the waiter checks what's actually in the kitchen (our database)
 *  2. AUGMENT:  writes those items on the order ticket (the system prompt)
 *  3. GENERATE: the chef (LLM) cooks ONLY with what's on the ticket
 * Result: answers grounded in YOUR data instead of made-up places.
 */
const STOP_WORDS = new Set(['the', 'a', 'an', 'is', 'are', 'i', 'me', 'my', 'for', 'to', 'in', 'of', 'and', 'where', 'can', 'what', 'near', 'find', 'any', 'help', 'need']);

async function retrieveContext(message) {
  const keywords = message
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((word) => word.length > 2 && !STOP_WORDS.has(word));

  // Search once per keyword, merge results, keep the 6 best (most keyword hits)
  const hits = new Map();
  for (const word of keywords.slice(0, 6)) {
    for (const item of await listResources({ q: word })) {
      const entry = hits.get(item.id) || { item, score: 0 };
      entry.score += 1;
      hits.set(item.id, entry);
    }
  }
  return [...hits.values()].sort((a, b) => b.score - a.score).slice(0, 6).map((entry) => entry.item);
}

function buildSystemPrompt(context) {
  const listing = context.length
    ? context
        .map((r) => `- ${r.name} (${r.category}, ${r.neighborhood || 'citywide'}): ${r.description} Hours: ${r.hours || 'n/a'}`)
        .join('\n')
    : '(no matching resources found)';

  return [
    'You are a friendly community resource guide for Chicago residents.',
    'Answer ONLY using the resources listed below. If nothing fits, say so honestly and suggest calling 311 or 211.',
    'Keep answers under 120 words. Use short bullet points. Never invent addresses, phone numbers or hours.',
    '',
    'RESOURCES:',
    listing,
  ].join('\n');
}

// POST /api/ai/chat  { message, history? }
router.post('/chat', async (req, res, next) => {
  try {
    const parsed = ChatSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

    const { message, history } = parsed.data;
    const context = await retrieveContext(message);

    const messages = [
      { role: 'system', content: buildSystemPrompt(context) },
      ...history,
      { role: 'user', content: message },
    ];

    const { provider, text } = await askAI(messages);
    res.json({ provider, reply: text, sources: context.map((r) => ({ id: r.id, name: r.name })) });
  } catch (err) {
    next(err);
  }
});

// POST /api/ai/compare  { message } → every configured model answers side by side
router.post('/compare', async (req, res, next) => {
  try {
    const parsed = ChatSchema.pick({ message: true }).safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

    const context = await retrieveContext(parsed.data.message);
    const results = await compareAI([
      { role: 'system', content: buildSystemPrompt(context) },
      { role: 'user', content: parsed.data.message },
    ]);
    res.json(results);
  } catch (err) {
    next(err);
  }
});

export default router;
