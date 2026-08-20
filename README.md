# ForgeAI

ForgeAI is a production-style AI Engineering Workspace built primarily as a hands-on Mastra learning project.

## Architecture

```text
React
  ↓
Application API
  ↓
Mastra Runtime
  ↓
Gemini + Storage + External Services
```

## Development

ForgeAI is implemented one small step at a time. Each step must be runnable, verifiable, explainable, and independently committable.

See `DEVELOPMENT_PROTOCOL.md` and `phases/phase-0/README.md` for the implementation protocol and roadmap.

### High-level Diagram

```text
                    ┌──────────────┐
                    │   apps/web   │
                    │    React     │
                    └──────┬───────┘
                           │ HTTP
                           ▼
                    ┌──────────────┐
                    │   apps/api   │
                    │ Node / HTTP  │
                    └──────┬───────┘
                           │
             ┌─────────────┼─────────────┐
             ▼             ▼             ▼
       ┌──────────┐  ┌──────────┐  ┌──────────┐
       │  domain  │  │  infra   │  │  mastra  │
       └──────────┘  └──────────┘  └────┬─────┘
                                         │
                                    ┌────▼─────┐
                                    │  config  │
                                    └──────────┘
