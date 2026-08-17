# ForgeAI — Complete Phase Roadmap

This is the complete implementation roadmap. No phase is intentionally omitted.

## Phase 0 — Foundation

0.1. Repository / Monorepo Initialization
0.2. React Application Shell
0.3. API Application Shell
0.4. Domain + Shared Types
0.5. LibSQL / Database
0.6. Project Repository + Service
0.7. Task Repository + Service
0.8. Project / Task API
0.9. RequestContext + Request IDs
0.10. Mastra Runtime Initialization
0.11. Gemini Configuration
0.12. AI Smoke Test
0.13. Error Handling
0.14. Testing Foundation
0.15. Phase 0 Review / Architecture Checkpoint

## Phase 1 — Agent Foundation

1.1. Agent Boundary
1.2. Instructions and Model Configuration
1.3. First Engineering Tool
1.4. Tool Schema and Validation
1.5. Multiple Tools
1.6. Tool Execution Context
1.7. Agent API Endpoint
1.8. Agent UI
1.9. Agent Testing
1.10. Phase 1 Review

## Phase 2 — Tool Orchestration

2.1. Tool Selection
2.2. Tool Result Transformation
2.3. toModelOutput
2.4. Tool Hooks
2.5. Built-in Tools
2.6. Workflow as Tool
2.7. Tool Filtering
2.8. Tool Search
2.9. Tool Error Handling
2.10. Tool Observability
2.11. Phase 2 Review

## Phase 3 — Planning and Structured Output

3.1. Planner Agent
3.2. Plan Output Schema
3.3. Structured Output Validation
3.4. Structured Output Error Strategy
3.5. JSON Prompt Injection Safety
3.6. Separate Structuring Model
3.7. prepareStep
3.8. askUserTool
3.9. Plan Approval
3.10. Task Tracking
3.11. Plan-to-Task Persistence
3.12. Phase 3 Review

## Phase 4 — First Durable Workflow

4.1. Workflow Creation
4.2. Workflow Registration
4.3. Workflow Steps
4.4. Initial State and State Schema
4.5. Sequential Control Flow
4.6. Agent as Step
4.7. Agent generate/stream
4.8. Tool as Step
4.9. Tool Input Mapping
4.10. Workflow Output
4.11. Workflow Result Status
4.12. Workflow Streaming
4.13. RequestContext in Workflows
4.14. Phase 4 Review

## Phase 5 — Advanced Workflow Control

5.1. Parallel Control Flow
5.2. Conditional Branching
5.3. Input Data Mapping
5.4. Looping
5.5. Do-Until
5.6. Do-While
5.7. Foreach
5.8. Foreach Concurrency
5.9. Result Aggregation
5.10. Nested Workflows
5.11. Nested Workflows in Foreach
5.12. Dynamic Workflow Definitions
5.13. Dynamic Registration
5.14. Dynamic Mapping
5.15. Dynamic Replacement
5.16. Workflow Cloning
5.17. Workflow Referencing
5.18. Phase 5 Review

## Phase 6 — Human-in-the-Loop and Durable Suspension

6.1. Pre-execution Approval
6.2. requireApproval
6.3. requireToolApproval
6.4. Human Approval UI
6.5. Human Rejection
6.6. suspend()
6.7. Resume by Run ID
6.8. resume() / resumeStream()
6.9. Persistent Suspended Runs
6.10. listSuspendedRuns
6.11. Automatic Tool Resumption
6.12. Supervisor Approval Propagation
6.13. Multi-turn Human Input
6.14. Sequential Human Approvals
6.15. bail()
6.16. Suspended Run Recovery
6.17. Phase 6 Review

## Phase 7 — Workflow Reliability and Debugging

7.1. Snapshot Execution State
7.2. Snapshot Persistence
7.3. Snapshot Metadata
7.4. Resume Data
7.5. Snapshot Serializability
7.6. Snapshot Size Management
7.7. Snapshot Retrieval
7.8. Snapshot Monitoring
7.9. Workflow Suspension Recovery
7.10. Resume by Step ID
7.11. Resume Type Safety
7.12. Failed Workflow Recovery
7.13. Step Result Inspection
7.14. getStepResult
7.15. Early Workflow Exit
7.16. Workflow Error Handling
7.17. onFinish
7.18. onError
7.19. Callback Error Isolation
7.20. Retry Policies
7.21. Step-level Retries
7.22. Conditional Error Branching
7.23. timeTravel
7.24. timeTravelStream
7.25. Time Travel Validation
7.26. Nested Time Travel
7.27. Time Travel with Snapshots
7.28. Step Debugging
7.29. Phase 7 Review

## Phase 8 — Processors and Guardrails

8.1. Processor Pipeline Foundation
8.2. Input Processors
8.3. UnicodeNormalizer
8.4. PromptInjectionDetector
8.5. LanguageDetector
8.6. Input Guardrails
8.7. Output Processors
8.8. BatchPartsProcessor
8.9. SystemPromptScrubber
8.10. ModerationProcessor
8.11. PIIDetector
8.12. CostGuardProcessor
8.13. Processor Strategies
8.14. onViolation
8.15. Tripwire
8.16. Parallel Guardrails
8.17. Fast Guardrail Model
8.18. Processor Execution Order
8.19. Memory Processors
8.20. errorProcessors
8.21. RequestContext in Processors
8.22. Per-call Processor Overrides
8.23. Custom Processor
8.24. Processor Interface
8.25. processInput
8.26. processInputStep
8.27. processLLMRequest
8.28. processLLMResponse
8.29. processOutputResult
8.30. processOutputStream
8.31. processOutputStep
8.32. prepareStep Callback
8.33. Processor State
8.34. Stream Processing
8.35. Data Stream Parts
8.36. processDataParts
8.37. Output Validation
8.38. Processor Retry Mechanism
8.39. maxProcessorRetries
8.40. processAPIError
8.41. StreamErrorRetryProcessor
8.42. Violation Callbacks
8.43. Abort
8.44. Tripwire Chunks
8.45. Processor Workflows
8.46. Parallel Processor Execution
8.47. Conditional Processor Execution
8.48. TokenLimiter
8.49. ToolCallFilter
8.50. ToolSearchProcessor
8.51. ProviderHistoryCompat
8.52. Phase 8 Review

## Phase 9 — Memory

9.1. Message History
9.2. Memory Persistence
9.3. Memory Processors
9.4. Thread and Resource Scope
9.5. Working Memory Foundation
9.6. Structured Working Memory
9.7. Working Memory Schemas
9.8. Replace Semantics
9.9. Merge Semantics
9.10. Deep Merge and Array Rules
9.11. Programmatic Working Memory Updates
9.12. Read-only Working Memory
9.13. Semantic Recall
9.14. Embedding Model
9.15. Local FastEmbed
9.16. Vector Store
9.17. Message Embeddings
9.18. Vector Search
9.19. Recall topK and Ranges
9.20. Metadata Filtering
9.21. Thread vs Resource Recall
9.22. Recall Tool
9.23. Chronological Recall
9.24. Recall Pagination
9.25. Cross-thread Recall
9.26. Memory-aware Agent
9.27. Attachment Memory
9.28. Attachment Storage
9.29. Observational Memory Foundation
9.30. Observer
9.31. Reflector
9.32. Observation Thresholds
9.33. Reflection Thresholds
9.34. Token Budgets
9.35. Async Buffering
9.36. Idle Activation
9.37. Provider-change Activation
9.38. Temporal Gap Markers
9.39. Prompt Cache Friendly Memory
9.40. Observation Context Optimization
9.41. Background Observer
9.42. Background Reflector
9.43. Memory Compression
9.44. Memory Migration
9.45. Lazy Observation
9.46. Memory Visualization
9.47. Multi-user Memory
9.48. Speaker Identity
9.49. Identity-aware Messages
9.50. Participant Persistence
9.51. Shared Threads
9.52. Shared Resource Memory
9.53. Role-aware Instructions
9.54. Identity Security
9.55. Memory Layer Composition
9.56. Memory Cost Optimization
9.57. Memory Latency Optimization
9.58. Long-session Scalability
9.59. Phase 9 Review

## Phase 10 — Cost, Context, and Response Optimization

10.1. Response Cache Foundation
10.2. Cache Key Design
10.3. Cache Hit Handling
10.4. Cache Busting
10.5. Tenant Cache Scoping
10.6. Custom Cache Backend
10.7. Cache State
10.8. Token Limiter
10.9. Context Reduction
10.10. Tool Result Reduction
10.11. ToolCallFilter
10.12. ToolSearchProcessor
10.13. Provider History Compatibility
10.14. Token Estimation
10.15. Token Counting Cache
10.16. Caller-supplied Token Estimates
10.17. Token-tiered Model Selection
10.18. ModelByInputTokens
10.19. Prompt Caching
10.20. Memory Context Optimization
10.21. LLM Usage Dashboard
10.22. Gemini Budget Guard
10.23. Phase 10 Review

## Phase 11 — Code Mode

11.1. Code Mode Motivation
11.2. createCodeMode
11.3. Code Mode Sandbox
11.4. external_* Tools
11.5. Tool Scoping
11.6. Code Mode Transports
11.7. QuickJS Code Mode
11.8. Isolated VM Code Mode
11.9. Remote Sandbox Adapter
11.10. Multi-tool Computation
11.11. Tool Result Aggregation
11.12. Parallel Tool Execution
11.13. Security Boundary
11.14. Context Reduction
11.15. Code Mode Planning
11.16. Structured Results
11.17. Code Mode Observability
11.18. Code Mode Failure Handling
11.19. Phase 11 Review

## Phase 12 — Background Tasks and Long-running Execution

12.1. Background Task Manager
12.2. Long-running Tool
12.3. Tool-level Background Configuration
12.4. Agent-level Background Configuration
12.5. Per-call Background Override
12.6. Background Resolution Order
12.7. Concurrency
12.8. Backpressure
12.9. Timeouts
12.10. Retries
12.11. Progress Streaming
12.12. Lifecycle Events
12.13. untilIdle
12.14. Continuations
12.15. Background Subagents
12.16. Subagent Background Inheritance
12.17. Task Suspension
12.18. Task Resumption
12.19. Task Cancellation
12.20. Lifecycle Callbacks
12.21. Task Event Filtering
12.22. Task State Lookup
12.23. Background Task UI
12.24. Phase 12 Review

## Phase 13 — Harness, Sessions, Modes, and Permissions

13.1. AgentController / Harness Boundary
13.2. Shared Runtime Host
13.3. Sessions
13.4. Session Isolation
13.5. Session Lifecycle
13.6. Thread Lifecycle
13.7. Persistent Conversations
13.8. Session State
13.9. Session State Persistence
13.10. resourceId
13.11. Thread Binding
13.12. Thread Switching
13.13. Assistant Mode
13.14. Planner Mode
13.15. Investigator Mode
13.16. Executor Mode
13.17. Reviewer Mode
13.18. Mode-specific Instructions
13.19. Mode-specific Tools
13.20. Tool Visibility
13.21. Tool Allowlists
13.22. Model Switching
13.23. Thread-scoped Model Selection
13.24. Tool Approval Policies
13.25. Permission Categories
13.26. Tool Permissions
13.27. Subagent Definitions
13.28. Constrained Subagent Tools
13.29. Forked Subagents
13.30. Chat Channel Adapter Boundary
13.31. Channel Sessions
13.32. Channel Resource Mapping
13.33. Session Event Subscriptions
13.34. Display State
13.35. Stale Approval Handling
13.36. Phase 13 Review

## Phase 14 — Goals and Autonomous Objectives

14.1. Goal Model
14.2. Durable Objective
14.3. Thread-scoped Objective
14.4. Goal Persistence
14.5. Goal State Signals
14.6. Goal Budget
14.7. Goal Iterations
14.8. Goal Evaluation
14.9. LLM-as-Judge
14.10. Goal Scoring
14.11. Evaluation Feedback
14.12. Objective Lifecycle
14.13. Active Duration
14.14. Goal Dashboard
14.15. Goal Cancellation
14.16. Phase 14 Review

## Phase 15 — Signals and Event-driven Agents

15.1. Signal Model
15.2. Reactive Signals
15.3. System-reminder Signals
15.4. Transient Signals
15.5. Custom Stream Events
15.6. Message Metadata
15.7. sendMessage
15.8. queueMessage
15.9. sendSignal
15.10. Active-thread Delivery
15.11. Idle-thread Delivery
15.12. Signal Persistence
15.13. Signal Attributes
15.14. XML Signal Tags
15.15. State Signals
15.16. Durable State Lanes
15.17. State Snapshots
15.18. State Deltas
15.19. State Signal Deduplication
15.20. computeStateSignal
15.21. Notification Inbox
15.22. Notification Policies
15.23. Notification Summaries
15.24. Notification Deduplication
15.25. Notification Coalescing
15.26. Notification Lifecycle
15.27. Inbox Tool
15.28. Distributed Signals
15.29. Pub/Sub
15.30. Distributed Leasing
15.31. Redis Streams Adapter
15.32. Serverless Delivery Adapter
15.33. SSE Subscriptions
15.34. SSE Heartbeats
15.35. Signal Provider Interface
15.36. External Event Ingestion
15.37. Webhook Provider
15.38. Polling Provider
15.39. Provider Lifecycle
15.40. Provider Notifications
15.41. Durable Provider Subscriptions
15.42. Provider Processors
15.43. Provider Tools
15.44. GitHub Channel Integration
15.45. Phase 15 Review

## Phase 16 — Scheduling

16.1. Scheduled Workflow
16.2. schedule API
16.3. Cron Scheduling
16.4. Schedule Timezone
16.5. Schedule Input Data
16.6. Schedule Initial State
16.7. Schedule RequestContext
16.8. Schedule Metadata
16.9. Multiple Schedules
16.10. Schedule IDs
16.11. Schedule Management UI
16.12. Schedule Trigger History
16.13. Schedule Status Monitoring
16.14. Pause Schedule
16.15. Resume Schedule
16.16. Durable Schedule Pausing
16.17. Schedule Idempotency
16.18. Schedule Redeployment
16.19. Configuration Diffing
16.20. Schedule Row Persistence
16.21. Schedule Deletion
16.22. Schedule Permissions
16.23. Built-in Scheduler
16.24. Scheduler Tick Loop
16.25. Scheduler Claiming
16.26. In-process PubSub
16.27. Long-lived Deployment
16.28. Dedicated Scheduler Worker
16.29. Serverless Scheduling Adapter
16.30. Inngest Workflow Adapter
16.31. Inngest Cron Scheduling
16.32. Phase 16 Review

## Phase 17 — Multi-user Collaboration and Shared Memory

17.1. Multi-user Sessions
17.2. Shared Thread
17.3. Shared Resource
17.4. Authenticated Speaker Identity
17.5. Server-side Identity Tagging
17.6. Speaker Identity Tags
17.7. author_id
17.8. author_name
17.9. functional_role
17.10. Identity-aware Memory
17.11. Per-user Fact Extraction
17.12. Speaker-aware Observations
17.13. Speaker-aware Recall
17.14. Participant Persistence
17.15. Structured Participants
17.16. Thread-scoped Participant Memory
17.17. Role-aware Agent Instructions
17.18. Impersonation Prevention
17.19. Collaborative Documents
17.20. Group Chat
17.21. Multi-stakeholder Review
17.22. Shared Working Memory
17.23. Shared Observational Memory
17.24. Conversation-scoped Resources
17.25. Conversation-level Memory
17.26. Verbatim Attribution
17.27. Long-running Multi-user Threads
17.28. Phase 17 Review

## Phase 18 — Production Hardening

18.1. Configuration Hardening
18.2. Secrets Management
18.3. Authentication Boundary
18.4. Authorization
18.5. Tenant Isolation
18.6. Tool Permission Enforcement
18.7. Approval Security
18.8. Prompt Injection Defense Review
18.9. PII Handling Review
18.10. Cache Isolation Review
18.11. Memory Isolation Review
18.12. Database Indexing
18.13. Vector Index Optimization
18.14. HNSW / IVFFlat Evaluation
18.15. Storage Scaling
18.16. Background Worker Scaling
18.17. Signal Distribution
18.18. Scheduler Scaling
18.19. Observability
18.20. Structured Logging
18.21. Metrics
18.22. Tracing
18.23. Failure Alerting
18.24. Cost Monitoring
18.25. Load Testing
18.26. Recovery Testing
18.27. Security Testing
18.28. Dependency Updates
18.29. Architecture Review
18.30. Production Readiness Review

