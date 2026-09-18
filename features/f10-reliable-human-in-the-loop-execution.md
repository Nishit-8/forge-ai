# Reliable Human-in-the-Loop Execution

> **Feature:** F10  | **Status:** Product specification / Staff Engineer baseline  
> **Audience:** Business Analyst, Product, Engineering, QA, UI  
> **Development:** Feature → requirement → architecture → Mastra → API → backend → UI → persistence/external systems → testing → E2E

## 1. Business Analyst Feature Overview
### Business capability
ForgeAI will make approval and suspension reliable across delays.
### Business problem
Human decisions can happen long after a workflow reaches a gate, so state must survive restarts and retries.
### Why this feature exists
Human decisions can happen long after a workflow reaches a gate, so state must survive restarts and retries. The feature converts this need into a defined product capability with an observable user outcome.
### Capability added
**Durable human interaction.**
### Primary user journey
1. User enters the feature from the relevant ForgeAI screen.
2. User supplies required business input/context.
3. API validates input and resolves authorization/request context.
4. Server executes deterministic rules and, where required, Mastra.
5. Result/state is persisted or returned through the application API.
6. UI shows progress, result and actionable errors.
### Business outcome
Start an execution, reach approval, leave, return later, approve/reject, and verify correct resumption. through the normal ForgeAI application path rather than as a standalone Mastra experiment.

## 2. Scope
### In scope
- Primary journey and business rules.
- API validation, authorization and stable error mapping.
- Domain/application service behavior.
- Required Mastra capability: **suspend/resume, persistent runs, idempotent resume**.
- Required persistence/external integration.
- Ready, loading, success, empty/error UI states as applicable.
- Unit, integration and E2E verification.
### Out of scope
- Future dependent features.
- Hypothetical generic abstractions.
- React access to Gemini, Mastra internals, databases or credentials.
- LLM use where deterministic code is sufficient.

## 3. Functional Requirements
1. The feature has a defined UI/API entry point.
2. Client input is validated at the API boundary.
3. Business rules remain in server-side application/domain code.
4. AI behavior is encapsulated behind the required Mastra capability.
5. Required durable state is persisted.
6. Runtime/provider errors are mapped to stable application errors.
7. UI exposes enough status/result information to understand what happened.
8. Consequential writes/external actions have an explicit authorization path.
9. Repeatable side effects are idempotent where applicable.
10. AI receives only the minimum required context.

## 4. Product Acceptance Criteria
- **Given** valid input, **when** the primary action completes, **then** the documented business outcome is produced.
- **Given** invalid input, **when** submitted, **then** it is rejected without an invalid side effect.
- **Given** a downstream/AI failure, **when** it occurs, **then** the user sees an actionable error and state remains consistent.
- **Given** persistence is required, **when** the user reloads, **then** expected state remains available.
- **Given** AI is required, **when** it runs, **then** deterministic work remains outside the model and unnecessary context is not sent.

## 5. System Wire Diagram
~~~text
┌──────────────────────────────┐
│ React Web UI                 │
│ Reliable Human-in-the-Loop │
└──────────────┬───────────────┘
               │ HTTP / SSE
               ▼
┌──────────────────────────────┐
│ Application API              │
│ validation • auth • errors   │
└──────────────┬───────────────┘
               ▼
┌──────────────────────────────┐
│ Domain / Application Service │
└──────────┬───────────┬───────┘
           │           │
           ▼           ▼
┌────────────────┐ ┌──────────────────────┐
│ DB / Adapters  │ │ Mastra Runtime       │
│ persistence    │ │ suspend/resume, pe │
└────────────────┘ └──────────┬───────────┘
                              ▼
                       Gemini / External
~~~
**Boundary rule:** React handles interaction/rendering; API handles validation/auth/error mapping; Domain handles business rules; Mastra handles AI reasoning/orchestration; Infrastructure handles persistence/external adapters.

## 6. Staff Engineer Architecture Approval
~~~text
User intent → React → Application API
                         ├─ validation/auth/context
                         ↓
                  Domain/Application Service
                    ├─ deterministic rules
                    ├─ repositories/adapters
                    └─ Mastra capability
                         ↓
                  Gemini / external systems
                         ↓
                    Stable API result
                         ↓
                        React
~~~
**Engineering decisions**
- React is never the AI, DB or credential boundary.
- API is the product contract boundary.
- Domain owns business rules; Mastra does not replace them.
- Infrastructure owns persistence/external adapters.
- Mastra is used only where reasoning/orchestration adds product value.
- Start with the smallest vertical slice; do not pre-build future abstractions.

**Approval checklist**
- [x] Business problem explicit
- [x] User capability explicit
- [x] System boundaries explicit
- [x] Mastra purpose explicit
- [x] Failure behavior testable
- [x] E2E path defined
- [x] Future scope separated

## 7. Mastra Learning Objective
**Concepts:** suspend/resume, persistent runs, idempotent resume
Use: **Concept → Problem → Why we need it → Where implemented → What I learn**.
The concept is learned through this feature's real application path unless explicitly documented as a prerequisite experiment.

## 8. API / Backend Expectations
The API exposes a **product-level contract**, not a raw Mastra API proxy.
- Validate input.
- Resolve identity/request context.
- Call application/domain services.
- Invoke Mastra only behind the server boundary.
- Persist through repositories/adapters.
- Map failures to stable API responses.
- Emit correlation/observability data where needed.
Endpoint names/payloads must be reconciled with the repository's current API contracts before implementation.

## 9. UI Wireframe
~~~text
┌────────────────────────────────────────────────┐
│ ForgeAI  | Reliable Human-in-the-Loop Execu │
├────────────────────────────────────────────────┤
│ Project / context                              │
│ User input / current state                     │
│ ┌────────────────────────────────────────────┐ │
│ │ Start an execution, reach approval, leave, │ │
│ └────────────────────────────────────────────┘ │
│ Status: ○ Ready  ◌ Running  ✓ Complete        │
│ [Primary Action]      [Back / Cancel]          │
│ Result / activity / error details              │
└────────────────────────────────────────────────┘
~~~
Wireframes describe behavior/state, not final visual styling.

## 10. E2E Test Scenarios — What I Do / What I Expect / Problem Solved
| # | What I do | What I expect | Problem / risk validated |
|---|---|---|---|
| 1 | Start an execution, reach approval, leave, return later, approve/reject, and verify correct resumption. | Primary result is produced and shown in UI. | Main business problem is solved end-to-end. |
| 2 | Refresh or leave and return | Required state remains consistent with server state. | Prevents UI-only state from being mistaken for product state. |
| 3 | Submit invalid/incomplete input | Controlled validation error; no invalid side effect. | Protects business boundary. |
| 4 | Simulate AI/downstream failure | Actionable error; durable state remains consistent. | Validates resilience and error mapping. |
| 5 | Repeat the same action | Idempotent result or explicit duplicate rejection. | Prevents duplicate work/side effects. |
| 6 | Complete through React → API, not direct Mastra | Full path succeeds. | Proves this is a real ForgeAI capability, not an isolated learning exercise. |

## 11. Test Strategy
- **Unit:** business rules, validation, transformations, idempotency and deterministic errors; no Gemini.
- **Integration:** API → application/domain → repository/Mastra boundary with controlled dependencies.
- **E2E:** real React → API primary journey plus the most important failure/authorization/recovery path.
- **AI smoke:** small explicit Gemini integration test separate from ordinary tests; keep prompts/context bounded for the free tier.

## 12. Non-Functional Requirements
- Strict TypeScript; never use any to bypass design errors.
- Stable API errors and clear loading/error states.
- No provider credentials in browser code.
- Observability for AI/long-running execution.
- Idempotency for repeatable side effects where applicable.
- Bounded context/token usage.
- Accessible and understandable UI states.

## 13. Dependencies
**Product:** prerequisite domain capabilities must exist before AI orchestration.  
**Mastra:** Phase 6 — HITL and Durable Suspension.  
**Architecture:** React → API → Domain → Infrastructure, with Mastra as the AI runtime boundary.  
**External:** Gemini/storage/external adapter only where required.

## 14. Definition of Done
- [ ] Business behavior implemented.
- [ ] Product-level API contract implemented.
- [ ] Domain/application logic separated from transport/UI.
- [ ] Required Mastra capability integrated for a documented reason.
- [ ] Persistence/external integration complete where required.
- [ ] UI implements documented journey and states.
- [ ] Unit, integration and primary E2E tests pass.
- [ ] Failure/recovery test passes where applicable.
- [ ] No React → Gemini/Mastra/DB direct access.
- [ ] Gemini usage remains bounded.
- [ ] Implementation step is runnable, verifiable and independently understandable.

## 15. Implementation Governance
This document is the **product and engineering contract**. Historical phase documents remain the Mastra learning reference, not the implementation roadmap.
Before coding, inspect the current repository and identify conflicts between feature spec, ADRs, architecture and code. If a conflict exists, stop and resolve it before implementation.
Implement the smallest useful vertical slice first, then expand one implementation step at a time.
