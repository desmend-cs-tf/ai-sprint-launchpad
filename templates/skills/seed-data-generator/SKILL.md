---
name: seed-data-generator
description: Generate 25-40 realistic, clearly fictional seed records as JSON for a table or model, matching its schema. Use when the user asks for sample data, seed data, fake data, mock data, or test records.
---

# Seed data generator

Good seed data makes a demo believable and exposes UI bugs early. Quantity and variety matter more than polish.

## Rules
1. Read the schema first (SQL, zod, or Mongoose) and match every field name and type exactly.
2. Produce **25–40 records** unless the user says otherwise.
3. **Vary everything:** short and long text, every category/enum value at least twice, empty optional fields in ~20% of rows, a few edge cases (very long name, special characters like é and ñ, an apostrophe).
4. Use real **neighborhood/city names** for realism, but **fictional** organizations, people, emails (`@example.com`), and phone numbers (`555-01xx`). Never invent real-looking addresses for real businesses.
5. Output valid JSON (an array). No comments inside JSON.
6. Save to `server/src/data/<name>.json` and tell the user how to load it (seed script or SQL insert).
7. Finish with a 3-line summary: count, category spread, edge cases included.
