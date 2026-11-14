# Agent rules files — where each one goes

| File here | Copy to | Read by |
|---|---|---|
| `AGENTS.md` | repo root | Codex, Cursor, Copilot, Gemini CLI, Kiro, Antigravity, Devin Desktop, many more |
| `CLAUDE.md` | repo root | Claude Code (it imports AGENTS.md with `@AGENTS.md`) |
| `cursor-rule.mdc` | `.cursor/rules/project.mdc` | Cursor |
| `copilot-instructions.md` | `.github/copilot-instructions.md` | GitHub Copilot |

Write the real rules once in AGENTS.md; the others just point to it.
