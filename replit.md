# AegisMind X

Multi-agent adversarial decision intelligence platform.

## Status

Imported from Lovable (React + Vite + shadcn/ui frontend) and being extended
with a Node/TypeScript backend for the AegisMind X system.

## Architecture

- **Frontend**: React 18 + Vite + shadcn/ui + Tailwind + react-router-dom +
  TanStack Query, lives in `src/`.
- **Backend**: Express middleware mounted into the Vite dev server via a
  custom Vite plugin (`server/index.ts` → `backendPlugin()`). Both run on
  the same port (5000) — no proxy needed.
- **Shared types**: `shared/types.ts`, exposed to the frontend via the
  `@shared/*` import alias.
- **LLM access**: Replit AI Integrations (OpenAI). No user-managed API
  key. Client in `server/llm.ts` reads `AI_INTEGRATIONS_OPENAI_*` env
  vars (auto-provisioned).

## Modules

| Module | Status | Files |
|---|---|---|
| 1. Multi-agent Debate Engine | Built | `server/agents/`, `server/services/debateEngine.ts` |
| 2. Future Simulation Engine | Not started | `server/services/simulationEngine.ts` (TBD) |
| 3. Cognitive Twin Engine | Partial — twin participates in debate; no persistence yet | inline in debate engine |
| 4. Impact Chain Analyzer | Not started | `server/services/impactAnalyzer.ts` (TBD) |
| 5. Decision Orchestrator | Built (debate-only) | `server/services/orchestrator.ts` |
| 6. Auth & user management | Not started | — |
| 7. API design | Partial: `POST/GET /api/decision*` | `server/routes/decision.ts` |

## API endpoints (current)

- `GET /api/health`
- `POST /api/decision/analyze` — runs the multi-agent debate, returns the
  final decision plus full transcript.
- `GET /api/decision` — lists past decisions (in-memory store).
- `GET /api/decision/:id` — retrieves a past decision.

## Storage

In-memory only (`server/store.ts`). Postgres persistence will be added
when auth + user history modules are built.

## Build & Run

`npm run dev` (already wired to the workflow) starts everything on port
5000.

## Forbidden / things to remember

- Do not modify `package.json` scripts directly.
- Do not modify Vite config in ways that break HMR.
- All LLM calls must go through `server/llm.ts` (uses Replit AI
  Integrations, no API keys in code).
