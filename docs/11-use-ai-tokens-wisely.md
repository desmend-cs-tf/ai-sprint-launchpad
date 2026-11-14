# 11 · Use AI Tokens Wisely

Spend tokens where they improve the user's result. The aim is not the shortest possible prompt; it is the least expensive reliable workflow that still meets the app's quality and safety bar.

## Reduce unnecessary context

- Ask for only the fields needed for this turn. Do not send an entire chat transcript when a short summary and the latest messages will do.
- Retrieve a few relevant, current source passages instead of attaching whole manuals or datasets. Keep source IDs and URLs so the answer can be checked.
- Keep stable instructions concise. Put optional procedures in an Agent Skill or reference file and load them only when the task needs them.
- Remove repeated headers, boilerplate, duplicated records, and irrelevant history before a model call.
- For multi-turn chat, summarize old turns at a deliberate boundary; preserve the user's goal, constraints, decisions, and unresolved questions.

## Choose the smallest reliable workflow

- Use normal code, database queries, search, or a rules table for deterministic tasks. Call an LLM for interpretation or language generation, not work a simple function can do exactly.
- Route classification, extraction, and short rewrites to a smaller/cheaper model; reserve a stronger model for ambiguous or high-impact cases. Evaluate the route on representative examples first.
- Ask for a constrained response shape (for example, a small JSON object with a schema) and cap output length to the task. Validate structured responses before using them.
- Cache answers only when the input, data freshness, and privacy policy make reuse safe. Invalidate cached results when the underlying source changes.
- Debounce live typing, avoid duplicate submissions, and make long generation an explicit user action. Do not send a request on every keystroke.
- Use retrieval with citations for factual answers. If evidence is missing or stale, say so instead of asking the model to guess.

## Protect people and budgets

- Set per-user and per-IP rate limits, maximum input/output sizes, request timeouts, and a daily spend ceiling or alert.
- Keep API keys on the server. Avoid sending names, addresses, health details, school records, or full benefit/insurance letters unless necessary, consented to, and appropriately protected.
- For sensitive apps, prefer redaction or on-device processing where practical; define retention and deletion before collecting real user data.
- Do not use cheap-model routing to remove human review, grounding, or crisis escalation from a high-impact flow. Cost optimization must not downgrade safety.
- Offer a useful non-AI fallback: sourced links, a form, saved draft, or clear next step when the model is unavailable.

## Measure before and after

Track request count, input/output token usage, latency, error/rate-limit rate, cache-hit rate, and cost by feature. Use provider usage metadata when available; do not log raw prompts or personal data just to measure tokens. Compare quality on a small, consented, representative test set before and after changes, including edge cases and refusal/escalation behavior.

A simple estimate is `monthly cost = requests per month × average cost per request`. Measure the average from actual provider usage rather than estimating from character counts. Recheck free-tier limits and model prices before launch; they change.

## Try this in the starter

1. Start with one provider and one feature; record baseline token usage and response quality.
2. Add input validation and a clear maximum message length.
3. Retrieve only the top few relevant records and cite their source in the response.
4. Cap output tokens to the shortest answer that still teaches or helps.
5. Add caching only for repeatable, non-sensitive requests; add rate limits before inviting a wider audience.
6. Re-run the same quality and safety examples after each optimization. If quality drops, undo that optimization or narrow its scope.

See the [free AI APIs guide](05-free-ai-apis.md), [prompting playbook](08-prompting-playbook.md), and [OWASP GenAI Security guidance](https://genai.owasp.org/).