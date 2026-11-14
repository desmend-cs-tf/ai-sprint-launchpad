# 08 · Prompting Playbook for Building with AI

Copy, paste, fill in the [brackets].

## The golden template
```
ROLE: You are a senior JavaScript developer and a patient teacher.
CONTEXT: My app is [one sentence]. Stack: React + Vite, Express, Supabase, plain JS.
TASK: [one specific thing].
CONSTRAINTS: [no new packages / keep comments / under 50 lines / mobile-first].
OUTPUT: [the full file / a diff / numbered steps]. Explain each change in one line.
If anything is unclear, ask me before writing code.
```

## Planning
- **Idea → spec:** "Interview me with one question at a time to turn this idea into a spec.md with user stories and acceptance criteria: [idea]. Stop after 8 questions."
- **Scope cut:** "Here's my feature list: [list]. I have 10 hours. Pick the 3 that prove the core value and explain what to cut."
- **Data model:** "Suggest a Postgres table design for [app]. Show SQL, 3 sample rows, and which columns need RLS policies."

## Building
- **One task at a time:** "Implement only task 3 from tasks.md. Show the diff. Stop."
- **Explain like a code review:** "Walk through this file line by line like you're teaching a bootcamp student: [paste]."
- **Seed data:** "Generate 30 realistic but clearly fictional rows for [table] as JSON. Vary neighborhoods, categories and lengths. No real business names or phone numbers."

## Debugging
```
I expected: [what]
Instead I got: [exact error or behavior]
Here's the code: [file]
Here's what I already tried: [list]
Find the root cause before suggesting a fix.
```
- "Add console.log statements that would prove or disprove your theory, then I'll paste the output."

## Reviewing AI code
- "Review this for security: leaked keys, missing validation, SQL/prompt injection, missing auth checks."
- "What would break if 100 people used this at once?"
- "Which of these lines are you least confident about?"

## Making it accessible
- "Audit this React component for accessibility: labels, keyboard navigation, color contrast, screen-reader text. Fix the top 5 issues."

## Demo day
- "Write a 60-second pitch: problem (with one stat), who it helps, live demo steps, what's next."
- "Write a README with: one-line pitch, screenshot placeholder, features, stack, how to run, live link, team."

## Anti-patterns 🚫
- "Build me an app" with no spec → random results, wasted free credits.
- Pasting 10 files and saying "fix it" → the model guesses.
- Accepting code you can't explain → you can't debug it on demo day.
- Pasting API keys or real people's personal info into a chat.
