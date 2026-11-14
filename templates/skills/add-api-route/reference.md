# Reference route (copy this shape)

```js
import 'dotenv/config';

import { Router } from 'express';
import { z } from 'zod';
import { supabase } from '../lib/supabase.js';

const router = Router();

const EventSchema = z.object({
  title: z.string().trim().min(2).max(120),
  starts_at: z.string().datetime(),
  neighborhood: z.string().trim().max(80).optional().default(''),
});

router.get('/', async (req, res, next) => {
  try {
    const { data, error } = await supabase.from('events').select('*').order('starts_at');
    if (error) throw error;
    res.json(data);
  } catch (err) {
    next(err);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const parsed = EventSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

    const { data, error } = await supabase
      .from('events')
      .insert({ ...parsed.data, owner_id: req.user?.userId }) // from verified token, never req.body
      .select()
      .single();
    if (error) throw error;
    res.status(201).json(data);
  } catch (err) {
    next(err);
  }
});

export default router;
```
