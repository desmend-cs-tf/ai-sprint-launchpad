import 'dotenv/config';

/*
 * Loads src/data/seed.json into your Supabase "resources" table.
 * Run AFTER you've created the table with supabase/schema.sql:
 *   npm run seed            (from the starter root)
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createClient } from '@supabase/supabase-js';

const { SUPABASE_URL, SUPABASE_SERVICE_KEY } = process.env;
if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('❌ Set SUPABASE_URL and SUPABASE_SERVICE_KEY in server/.env first.');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, { auth: { persistSession: false } });

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rows = JSON.parse(fs.readFileSync(path.join(__dirname, '../src/data/seed.json'), 'utf8'));

// upsert on "name" so running the script twice doesn't create duplicates
const { data, error } = await supabase.from('resources').upsert(rows, { onConflict: 'name' }).select('id');

if (error) {
  console.error('❌ Seed failed:', error.message);
  process.exit(1);
}
console.log(`✅ Seeded ${data.length} resources into Supabase.`);
