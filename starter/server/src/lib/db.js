import 'dotenv/config';

import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createClient } from '@supabase/supabase-js';

/*
 * ONE DATA LAYER, TWO MODES
 * - SUPABASE_URL + SUPABASE_SERVICE_KEY set → real Postgres via Supabase
 * - Not set → an in-memory array loaded from data/seed.json
 *
 * Routes never know which mode they're in. That's the point:
 * you can build the whole UI today and plug in Supabase tomorrow.
 */

const TABLE = 'resources';
const useSupabase = Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_KEY);

const supabase = useSupabase
  ? createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY, {
      auth: { persistSession: false }, // server-side: no browser session to store
    })
  : null;

export function dbMode() {
  return useSupabase ? 'supabase' : 'memory';
}

// ── In-memory fallback ──────────────────────────────────────
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const seed = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/seed.json'), 'utf8'));
let memory = seed.map((item) => ({ id: crypto.randomUUID(), created_at: new Date().toISOString(), ...item }));

function matches(item, q) {
  const haystack = [item.name, item.description, item.neighborhood, item.category, ...(item.tags || [])]
    .join(' ')
    .toLowerCase();
  return haystack.includes(q.toLowerCase());
}

// ── Public functions used by the routes ────────────────────

export async function listResources({ q, category } = {}) {
  if (useSupabase) {
    let query = supabase.from(TABLE).select('*').order('name');
    if (category) query = query.eq('category', category);
    // ilike = case-insensitive LIKE. The % signs mean "anything before/after".
    if (q) {
      // Strip characters that have special meaning in Supabase filter strings
      const safe = q.replace(/[,()%*\\]/g, ' ').trim();
      query = query.or(`name.ilike.%${safe}%,description.ilike.%${safe}%,neighborhood.ilike.%${safe}%`);
    }
    const { data, error } = await query;
    if (error) throw error;
    return data;
  }

  return memory
    .filter((item) => !category || item.category === category)
    .filter((item) => !q || matches(item, q))
    .sort((a, b) => a.name.localeCompare(b.name));
}

export async function getResource(id) {
  if (useSupabase) {
    const { data, error } = await supabase.from(TABLE).select('*').eq('id', id).maybeSingle();
    if (error) throw error;
    return data;
  }
  return memory.find((item) => item.id === id) || null;
}

export async function createResource(fields) {
  if (useSupabase) {
    const { data, error } = await supabase.from(TABLE).insert(fields).select().single();
    if (error) throw error;
    return data;
  }
  const item = { id: crypto.randomUUID(), created_at: new Date().toISOString(), ...fields };
  memory.push(item);
  return item;
}

export async function updateResource(id, fields) {
  if (useSupabase) {
    const { data, error } = await supabase.from(TABLE).update(fields).eq('id', id).select().maybeSingle();
    if (error) throw error;
    return data;
  }
  const index = memory.findIndex((item) => item.id === id);
  if (index === -1) return null;
  memory[index] = { ...memory[index], ...fields };
  return memory[index];
}

export async function deleteResource(id) {
  if (useSupabase) {
    const { error, count } = await supabase.from(TABLE).delete({ count: 'exact' }).eq('id', id);
    if (error) throw error;
    return count > 0;
  }
  const before = memory.length;
  memory = memory.filter((item) => item.id !== id);
  return memory.length < before;
}
