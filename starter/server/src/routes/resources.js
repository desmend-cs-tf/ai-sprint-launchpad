import 'dotenv/config';

import { Router } from 'express';
import { z } from 'zod';
import { listResources, getResource, createResource, updateResource, deleteResource } from '../lib/db.js';

const router = Router();

export const CATEGORIES = ['food', 'housing', 'health', 'jobs', 'youth', 'seniors', 'legal', 'education', 'tech', 'arts'];

/*
 * ZOD SCHEMA = the contract for a "resource".
 * We ALWAYS safeParse user input before it touches the database or an AI model.
 * safeParse never throws — it returns { success, data } or { success, error }.
 */
const ResourceSchema = z.object({
  name: z.string().trim().min(2).max(120),
  category: z.enum(CATEGORIES),
  neighborhood: z.string().trim().max(80).optional().default(''),
  description: z.string().trim().max(1000).optional().default(''),
  hours: z.string().trim().max(120).optional().default(''),
  website: z.string().trim().url().or(z.literal('')).optional().default(''),
  tags: z.array(z.string().trim().max(30)).max(10).optional().default([]),
});

const QuerySchema = z.object({
  q: z.string().trim().max(100).optional(),
  category: z.enum(CATEGORIES).optional(),
});

// GET /api/resources?q=pantry&category=food
router.get('/', async (req, res, next) => {
  try {
    const parsed = QuerySchema.safeParse(req.query);
    if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
    res.json(await listResources(parsed.data));
  } catch (err) {
    next(err);
  }
});

// GET /api/resources/categories → used to build the filter dropdown
router.get('/categories', (req, res) => res.json(CATEGORIES));

// GET /api/resources/:id
router.get('/:id', async (req, res, next) => {
  try {
    const item = await getResource(req.params.id);
    if (!item) return res.status(404).json({ error: 'Not found' });
    res.json(item);
  } catch (err) {
    next(err);
  }
});

// POST /api/resources
router.post('/', async (req, res, next) => {
  try {
    const parsed = ResourceSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
    // 🔐 When you add auth: set ownerId from req.user.userId (the verified token), NEVER from req.body
    res.status(201).json(await createResource(parsed.data));
  } catch (err) {
    next(err);
  }
});

// PATCH /api/resources/:id  (partial update — every field optional)
router.patch('/:id', async (req, res, next) => {
  try {
    const parsed = ResourceSchema.partial().safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
    const item = await updateResource(req.params.id, parsed.data);
    if (!item) return res.status(404).json({ error: 'Not found' });
    res.json(item);
  } catch (err) {
    next(err);
  }
});

// DELETE /api/resources/:id
router.delete('/:id', async (req, res, next) => {
  try {
    const deleted = await deleteResource(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Not found' });
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

export default router;
