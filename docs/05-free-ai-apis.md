# 05 · Free AI APIs in JavaScript

You don't need a paid OpenAI account to put AI in your app. Several providers have **free tiers with no credit card**, and most speak the **OpenAI-compatible** format — so one npm package works for all of them.

| Provider | Get a key | OpenAI-compatible base URL | Notes |
|---|---|---|---|
| **Google Gemini** | [aistudio.google.com](https://aistudio.google.com/apikey) | `https://generativelanguage.googleapis.com/v1beta/openai/` | Free tier is Flash / Flash-Lite models; long context. Free-tier data may be used to improve Google products. |
| **Groq** | [console.groq.com](https://console.groq.com/keys) | `https://api.groq.com/openai/v1` | Extremely fast open models; per-minute and per-day caps. |
| **OpenRouter** | [openrouter.ai](https://openrouter.ai/keys) | `https://openrouter.ai/api/v1` | One key, many models. Model IDs ending in `:free` cost $0 (small daily cap). |
| **Cerebras** | [cloud.cerebras.ai](https://cloud.cerebras.ai) | `https://api.cerebras.ai/v1` | Fast, generous daily token allowance. |
| **Mistral** | [console.mistral.ai](https://console.mistral.ai) | `https://api.mistral.ai/v1` | Free "experiment" usage on Mistral models. |
| **GitHub Models** | [github.com/marketplace/models](https://github.com/marketplace/models) | via GitHub token | Try many models with your GitHub account. |
| **Cloudflare Workers AI** | [developers.cloudflare.com/workers-ai](https://developers.cloudflare.com/workers-ai/) | Workers binding or REST | Daily free allowance; great if you deploy on Cloudflare. |

> Free limits change constantly (Google cut its free tier sharply in 2026). Treat any single free provider as unreliable and **set up a fallback**. The community-maintained list [cheahjs/free-llm-api-resources](https://github.com/cheahjs/free-llm-api-resources) tracks current limits.
>
> Anthropic (Claude) and OpenAI don't offer standing free API tiers — use them when you have credits.

## One SDK, any provider
```bash
npm install openai dotenv
```
```js
import 'dotenv/config';
import OpenAI from 'openai';

const ai = new OpenAI({
  baseURL: 'https://api.groq.com/openai/v1', // ← swap this…
  apiKey: process.env.GROQ_API_KEY,          // ← …and this
});

const res = await ai.chat.completions.create({
  model: 'openai/gpt-oss-120b',              // ← …and this
  messages: [
    { role: 'system', content: 'You are a concise helper for Chicago residents.' },
    { role: 'user', content: 'Give me 3 ideas for a community tech workshop.' },
  ],
});

console.log(res.choices[0].message.content);
```

## Fallback chain (keep your demo alive)
```js
async function askWithFallback(messages) {
  for (const p of providers) {           // [{ name, client, model }, …]
    try {
      const r = await p.client.chat.completions.create({ model: p.model, messages });
      return { provider: p.name, text: r.choices[0].message.content };
    } catch (err) {
      console.warn(`${p.name} failed (${err.status}) — trying next`);
    }
  }
  throw new Error('All providers failed');
}
```
Full version: [`../starter/server/src/lib/ai.js`](../starter/server/src/lib/ai.js).

## Compare models side by side
```js
// allSettled: one provider failing doesn't kill the others
const results = await Promise.allSettled(providers.map((p) => callProvider(p, messages)));
results.forEach((r, i) =>
  console.log(providers[i].name, r.status === 'fulfilled' ? r.value : `❌ ${r.reason.message}`)
);
```

## Streaming (text appears word by word)
```js
const stream = await ai.chat.completions.create({ model, messages, stream: true });
for await (const chunk of stream) {
  process.stdout.write(chunk.choices[0]?.delta?.content || '');
}
```
For streaming into React, the **Vercel AI SDK** (`ai` + `@ai-sdk/react`) handles the plumbing: [ai-sdk.dev](https://ai-sdk.dev).

## Structured JSON output (great for apps)
```js
const res = await ai.chat.completions.create({
  model,
  response_format: { type: 'json_object' },
  messages: [
    { role: 'system', content: 'Reply ONLY with JSON: {"category": string, "urgency": "low"|"medium"|"high"}' },
    { role: 'user', content: 'My heat has been out for 3 days and it is 10 degrees.' },
  ],
});
const parsed = JSON.parse(res.choices[0].message.content);
// then validate with zod safeParse before trusting it!
```

## Free / local alternatives
- **Ollama** — run open models on your own computer (needs a decent laptop; 8 GB+ RAM).
- **Transformers.js** — run small models *in the browser*, no server at all (sentiment, embeddings, speech-to-text).

## Rules for AI features
1. Keys live on the server. The browser calls *your* API, your API calls the AI.
2. Validate input before sending it to a model (length limits, zod).
3. Ground answers in your data (RAG) when facts matter. Tell the model to say "I don't know".
4. Show which model answered and let users report bad answers.
5. Don't send personal info (names, addresses, health details) to free tiers that may train on your data.
