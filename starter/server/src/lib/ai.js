import 'dotenv/config';

import OpenAI from 'openai';

/*
 * WHY ONE SDK FOR THREE COMPANIES?
 * Gemini, Groq and OpenRouter all offer an "OpenAI-compatible" endpoint.
 * That means the same `openai` npm package works for all of them —
 * we only swap the baseURL, the API key and the model name.
 * Learn this pattern once and you can switch providers in 30 seconds.
 */
const PROVIDERS = {
  gemini: {
    baseURL: 'https://generativelanguage.googleapis.com/v1beta/openai/',
    apiKey: process.env.GEMINI_API_KEY,
    model: process.env.GEMINI_MODEL || 'gemini-flash-latest',
  },
  groq: {
    baseURL: 'https://api.groq.com/openai/v1',
    apiKey: process.env.GROQ_API_KEY,
    model: process.env.GROQ_MODEL || 'openai/gpt-oss-120b',
  },
  openrouter: {
    baseURL: 'https://openrouter.ai/api/v1',
    apiKey: process.env.OPENROUTER_API_KEY,
    model: process.env.OPENROUTER_MODEL || 'google/gemma-4-31b-it:free',
  },
};

// Read the preferred order from .env, keep only providers that have a key
const order = (process.env.AI_PROVIDER_ORDER || 'gemini,groq,openrouter')
  .split(',')
  .map((name) => name.trim())
  .filter((name) => PROVIDERS[name]);

export function configuredProviders() {
  return order.filter((name) => Boolean(PROVIDERS[name].apiKey));
}

// Build one client per provider (lazily, so missing keys never crash startup)
const clients = {};
function clientFor(name) {
  if (!clients[name]) {
    const { baseURL, apiKey } = PROVIDERS[name];
    clients[name] = new OpenAI({ baseURL, apiKey });
  }
  return clients[name];
}

// Calls ONE provider and returns plain text
async function callProvider(name, messages) {
  const completion = await clientFor(name).chat.completions.create({
    model: PROVIDERS[name].model,
    messages, // [{ role: 'system' | 'user' | 'assistant', content: '...' }]
    temperature: 0.4,
    max_tokens: 600,
  });
  return completion.choices?.[0]?.message?.content?.trim() || '(empty response)';
}

/*
 * askAI — FALLBACK CHAIN
 * Try provider #1. If it errors (rate limit, outage, bad key), try #2, then #3.
 * Free tiers hit limits all the time — this is how you keep a demo alive.
 */
export async function askAI(messages) {
  const available = configuredProviders();

  if (available.length === 0) {
    return {
      provider: 'demo',
      text:
        'Demo mode: add a free API key (GEMINI_API_KEY, GROQ_API_KEY or OPENROUTER_API_KEY) ' +
        'to server/.env and restart to get real AI answers.',
    };
  }

  const errors = [];
  for (const name of available) {
    try {
      const text = await callProvider(name, messages);
      return { provider: name, text };
    } catch (err) {
      console.warn(`⚠️  ${name} failed: ${err.message}`);
      errors.push(`${name}: ${err.status || ''} ${err.message}`);
    }
  }
  throw new Error(`All AI providers failed → ${errors.join(' | ')}`);
}

/*
 * compareAI — SIDE-BY-SIDE CLASSROOM DEMO
 * Ask every configured provider the same question at the same time.
 * Promise.allSettled (not Promise.all!) so one failure doesn't kill the others.
 */
export async function compareAI(messages) {
  const available = configuredProviders();
  const results = await Promise.allSettled(available.map((name) => callProvider(name, messages)));

  return results.map((result, i) => ({
    provider: available[i],
    model: PROVIDERS[available[i]].model,
    ok: result.status === 'fulfilled',
    text: result.status === 'fulfilled' ? result.value : result.reason.message,
  }));
}
