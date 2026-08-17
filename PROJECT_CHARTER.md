# ForgeAI — Project Charter

## Mission

ForgeAI is a production-style AI Engineering Workspace built primarily as a hands-on Mastra learning project.

The application is intentionally allowed to grow large. Architecture is driven by real engineering problems rather than artificially inserting Mastra features.

## Learning Rule

For every Mastra concept:

**Concept → Problem → Why we need it → Where implemented → What I learn**

We implement one step at a time. Each step must be runnable, verifiable, explainable, and independently committable.

## Product Vision

ForgeAI allows engineering teams to:
- manage projects and tasks
- investigate incidents
- generate and approve plans
- delegate work to specialized agents
- execute controlled engineering actions
- run durable workflows
- inspect and replay execution
- maintain long-term project memory
- run background work
- react to events and schedules
- collaborate with humans and agents

## Primary Architecture

```text
React
  ↓
Application API
  ↓
Mastra Runtime
  ├── Agents
  ├── Workflows
  ├── Tools
  ├── Memory
  ├── Processors
  ├── Harness
  ├── Background Tasks
  ├── Signals
  └── Schedules
  ↓
Gemini + Storage + External Services
```

## Gemini Free-Tier Rules

- Prefer deterministic code where possible.
- Keep prompts concise.
- Keep retrieved context small.
- Do not run Gemini in ordinary unit tests.
- Isolate AI smoke/integration tests.
- Cache repeatable responses.
- Track LLM calls and approximate token usage.
- Use model calls only where reasoning/generation is actually needed.

## Engineering Standards

Each implementation step documents:
1. What we're building
2. Why we're building it this way
3. Architecture impact
4. Exact files/folders
5. Exact commands
6. Code
7. Staff Engineer reasoning
8. SOLID/design-pattern callouts
9. Tradeoffs
10. Verification
11. What not to do
12. Git checkpoint

## Source of Truth

Architecture decisions live in `architecture/ADR/`.

Phase specifications live under `phases/`.

UI/API requirements live under `requirements/`.

Mastra learning notes live under `learning/`.
