# CLAUDE.md

Claude Code reads this file automatically. All project rules live in AGENTS.md so every tool shares one source of truth:

@AGENTS.md

## Claude-specific
- Project skills are in `.claude/skills/` (e.g. `add-api-route`). Use them when the task matches.
- Prefer small, reviewable diffs. Ask before installing new npm packages.
