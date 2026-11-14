# 07 · Diagram Library (Mermaid)

Every diagram below is **Mermaid** — plain text that GitHub, Notion, Obsidian and most AI tools render as a picture. Copy one into your README, change the labels, and you have an architecture diagram.

- Edit live and export PNG/SVG: [mermaid.live](https://mermaid.live)
- Docs: [mermaid.js.org](https://mermaid.js.org)
- Prompt idea: *"Turn this Mermaid diagram into a version for my app: [paste]. My app does X."*

---

## 1. Classic 3-tier web app (the starter)
```mermaid
flowchart LR
  U((User)) --> FE[React + Vite<br/>browser]
  FE -- fetch /api --> API[Express API<br/>Node]
  API -- SQL via supabase-js --> DB[(Supabase<br/>Postgres)]
  API -- chat.completions --> LLM{{AI provider}}
```

## 2. AI chat request — with fallback
```mermaid
sequenceDiagram
  autonumber
  participant B as Browser
  participant S as Express
  participant D as Database
  participant G as Gemini
  participant Q as Groq
  B->>S: POST /api/ai/chat { message }
  S->>S: zod safeParse
  S->>D: search resources by keywords
  D-->>S: top 6 matches
  S->>G: system prompt + matches + question
  G--xS: 429 rate limited
  S->>Q: same request (fallback)
  Q-->>S: answer
  S-->>B: { reply, provider: "groq", sources }
```

## 3. RAG — the restaurant analogy
```mermaid
flowchart LR
  Q[Customer order<br/>user question] --> W[Waiter checks pantry<br/>RETRIEVE from DB]
  W --> T[Writes ingredients on ticket<br/>AUGMENT the prompt]
  T --> C[Chef cooks only with ticket<br/>GENERATE with LLM]
  C --> P[Plate<br/>grounded answer + sources]
```

## 4. Real RAG with embeddings (level-up)
```mermaid
flowchart TB
  subgraph Ingest [Once, when data changes]
    Docs[Docs / rows] --> Chunk[Split into chunks] --> Emb1[Embedding model] --> Vec[(pgvector table)]
  end
  subgraph Query [Every question]
    Ask[User question] --> Emb2[Embedding model] --> Search[Similarity search] --> Top[Top-k chunks]
    Top --> Prompt[Prompt = rules + chunks + question] --> LLM{{LLM}} --> Ans[Answer + citations]
  end
  Vec --> Search
```

## 5. AI agent loop
```mermaid
flowchart TD
  Goal[Goal from user] --> Think[LLM decides next step]
  Think -->|needs info| Tool[Call a tool<br/>search, DB, API, MCP]
  Tool --> Observe[Read the result]
  Observe --> Think
  Think -->|done| Answer[Final answer]
  Think -->|risky action| Human[Ask human to approve]
  Human --> Think
```

## 6. Spec-driven development
```mermaid
flowchart LR
  A[Constitution] --> B[Spec<br/>what + why] --> C[Clarify] --> D[Plan<br/>how] --> E[Tasks] --> F[Implement 1 task]
  F --> G{Tests pass?}
  G -- yes --> H[Commit] --> F
  G -- no --> F
  H -.spec changed.-> B
```

## 7. Database ERD (resources + users + favorites)
```mermaid
erDiagram
  USERS ||--o{ RESOURCES : "owns"
  USERS ||--o{ FAVORITES : "saves"
  RESOURCES ||--o{ FAVORITES : "is saved in"
  USERS {
    uuid id PK
    text email
    text display_name
  }
  RESOURCES {
    uuid id PK
    text name
    text category
    text neighborhood
    text_array tags
    uuid owner_id FK
  }
  FAVORITES {
    uuid user_id FK
    uuid resource_id FK
    timestamptz created_at
  }
```

## 8. Login flow (Supabase Auth + Express)
```mermaid
sequenceDiagram
  participant U as User
  participant R as React
  participant A as Supabase Auth
  participant E as Express
  U->>R: enter email
  R->>A: signInWithOtp(email)
  A-->>U: magic link email
  U->>R: clicks link
  R->>A: session created
  A-->>R: access_token
  R->>E: POST /api/resources + Bearer token
  E->>A: getUser(token)
  A-->>E: user.id
  E->>E: owner_id = req.user.userId
  E-->>R: 201 Created
```

## 9. Deploy pipeline
```mermaid
flowchart LR
  Code[Edit in Codespaces] --> Commit[git commit] --> Push[git push]
  Push --> GH[GitHub]
  GH --> CI[GitHub Actions<br/>lint + tests]
  CI --> Render[Render deploy]
  CI --> Vercel[Vercel deploy]
  Render --> Live((Live app))
  Vercel --> Live
```

## 10. Choosing your AI build tool
```mermaid
flowchart TD
  S{What do you need?} -->|Clickable prototype today| P[Bolt.new / Lovable / v0]
  S -->|Real codebase I own| C{Laptop strong enough<br/>for a desktop IDE?}
  C -- no --> CS[Codespaces + Copilot Free<br/>or Gemini CLI in the terminal]
  C -- yes --> IDE[Cursor / Antigravity / Kiro / VS Code + Copilot]
  S -->|Structured planning first| K[Kiro or GitHub Spec Kit]
  S -->|Just learning| L[freeCodeCamp + MDN + this starter]
```

## 11. Post-sprint 30-day roadmap
```mermaid
gantt
  title Keep building after the sprint
  dateFormat  YYYY-MM-DD
  section Week 1
  Move off Replit + README         :a1, 2026-11-16, 5d
  section Week 2
  5 user interviews                :a2, after a1, 5d
  Rewrite spec from feedback       :a3, after a2, 2d
  section Week 3
  Build top 2 tasks                :a4, after a3, 5d
  section Week 4
  Deploy + share + demo video      :a5, after a4, 5d
```

## 12. User journey (fill in for your app)
```mermaid
journey
  title Finding a food pantry
  section Discover
    Hears about app at church: 3: Resident
    Opens link on phone: 4: Resident
  section Use
    Searches food near Pilsen: 4: Resident
    Asks AI if open Saturday: 5: Resident
  section Outcome
    Gets directions: 5: Resident
    Shares with neighbor: 5: Resident
```

---

**Other diagram tools:** [Excalidraw](https://excalidraw.com) (hand-drawn whiteboard), [tldraw](https://www.tldraw.com), [draw.io](https://app.diagrams.net), [dbdiagram.io](https://dbdiagram.io) (database ERDs), [Eraser](https://www.eraser.io) (AI diagrams).
