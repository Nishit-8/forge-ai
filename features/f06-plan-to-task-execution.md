# F06 — Plan-to-Task Execution

## Purpose
Turn an approved plan into persistent project tasks through controlled execution.

This is a product feature specification, not an isolated Mastra API exercise.

## Product Outcome
A user can complete the capability through ForgeAI's supported product surface. The implementation connects the UI, Application API, application/domain services, Mastra where genuinely required, persistence or external systems, and the resulting product state.

## Scope
### In scope
- Complete user journey.
- API validation and product-level contracts.
- Required application/domain logic and persistence.
- Required Mastra integration.
- Error handling, authorization, observability and tests.
- End-to-end verification.

### Out of scope
- Unrelated refactors.
- Speculative future infrastructure.
- Direct React access to Gemini, Mastra internals or repositories.
- Mastra capabilities without a concrete product reason.
- Features later in the dependency order.

## End-to-End Flow
```text
React → Application API → Application/Domain Services
     → Mastra Runtime (when required)
     → Gemini + Storage + External Services
     → API response/stream → React
```

React must not construct prompts, create Mastra agents/workflows, query repositories, or call Gemini directly.

## Mastra Learning Objectives
Phase 3 and Phase 4.

Use: **Concept → Problem → Why we need it → Where implemented → What I learn.**

## Functional Requirements
1. Define the primary user action and successful outcome.
2. Define ForgeAI-owned state transitions.
3. Validate external input and structured AI output.
4. Keep deterministic decisions in TypeScript.
5. Use an LLM only where reasoning/generation adds value.
6. Map runtime/provider failures to stable application errors.
7. Persist state when work must survive a request/process boundary.
8. Make long-running work observable and recoverable.

## API Requirements
Define exact HTTP method, route, request/response schemas, status codes, error codes, streaming semantics, authorization and idempotency rules where applicable. React must use this boundary.

## UI Requirements
Provide initial, loading/progress, success, empty, validation-error, permission-error, runtime-failure and recovery states where applicable. Display product concepts rather than raw Mastra objects except on explicit workflow/debugging surfaces.

## Data & Persistence
Add persistence only when required. New data must have clear ownership, repository/service boundaries, migrations, real access-path indexes, and user/session/tenant scoping where applicable.

## Gemini / Cost Constraints
- Prefer deterministic code.
- Keep prompts and retrieved context small.
- Do not put Gemini calls in normal unit tests.
- Isolate AI integration tests.
- Cache repeatable results where appropriate.
- Track useful usage/cost information.

## Error & Recovery
Define behavior for invalid input, missing resources, authorization failures, AI/provider failures, tool failures, persistence failures, timeout, cancellation, partial completion, and process restart for durable work.

## Security
Treat user input, model output, tool arguments and external events as untrusted where appropriate. Enforce authorization server-side. Never log or persist secrets.

## Observability
Correlate request, user/session, project/resource, workflow/run/task and external operation where applicable. Avoid secrets and unnecessary sensitive content.

## Testing
### Unit
Deterministic business logic, validation, mapping, state transitions and error behavior.

### Integration
API → application/domain service → repository/runtime boundaries and persistence.

### E2E
Start from the supported UI, exercise the real API boundary, and verify resulting product state. Include an important failure/recovery path when applicable.

### AI
Keep Gemini-consuming verification isolated from ordinary unit tests.

## Dependencies
Follow the dependency order in `features/README.md`. Inspect the current repository and relevant phase/architecture documents before implementation. If a prerequisite is incomplete, stop rather than silently implementing it.

## Definition of Done
- [ ] User journey works end to end.
- [ ] API contract is implemented and validated.
- [ ] Domain/application boundaries remain clean.
- [ ] Required Mastra concepts are deliberate and understood.
- [ ] Required persistence/migrations are complete.
- [ ] Error/recovery behavior is verified.
- [ ] UI states are complete where applicable.
- [ ] Unit/integration tests pass.
- [ ] E2E behavior is verified.
- [ ] Gemini-consuming tests are isolated.
- [ ] Significant architecture decisions have an ADR.

## Implementation Rules
- One implementation step at a time.
- Inspect actual repository files before modifying them.
- Never use `any` to hide TypeScript problems.
- Do not introduce future Mastra concepts without a documented dependency.
- Do not refactor unrelated code.
- Avoid premature abstraction.
