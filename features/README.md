# ForgeAI Feature Specifications

These files define ForgeAI's feature-oriented implementation roadmap. The historical `phases/` roadmap remains the Mastra learning curriculum; this directory is the product implementation map.

## Development Model
**Feature → user problem → architecture → Mastra concepts → API → UI → persistence/external systems → testing → E2E verification.**

Mastra concepts are learned through real product problems rather than isolated API exercises.

## Feature Order
1. F01 — Project & Task Management
2. F02 — AI Project Assistant
3. F03 — AI Tool-Enabled Assistant
4. F04 — AI Project Planner
5. F05 — Plan Review & Human Approval
6. F06 — Plan-to-Task Execution
7. F07 — Intelligent Planning Workflow
8. F08 — Workflow Run Center
9. F09 — Workflow Recovery & Debugging
10. F10 — Reliable Human-in-the-Loop Execution
11. F11 — AI Safety & Guardrails
12. F12 — Persistent AI Conversations
13. F13 — Project Memory & Knowledge
14. F14 — AI Context & Cost Optimization
15. F15 — AI Code Workspace
16. F16 — Background AI Tasks
17. F17 — Assistant Modes
18. F18 — Sessions, Permissions & Tool Access
19. F19 — Goals & Autonomous Objectives
20. F20 — Notifications & AI Event Inbox
21. F21 — Event-Driven ForgeAI
22. F22 — Scheduled AI Workflows
23. F23 — Collaborative AI Projects
24. F24 — Shared Project Memory
25. F25 — GitHub Engineering Integration
26. F26 — Production AI Operations
27. F27 — Security & Production Readiness

## Relationship to Existing Phases
The phase roadmap is retained. Use relevant phase specifications to learn Mastra concepts required by the current feature. A phase does not automatically become a user-facing feature.

## E2E Rule
A feature is not complete merely because a Mastra component works in isolation. When a UI makes sense, completion requires the supported React → API → backend/runtime → persistence/external-system → React path.

## Scope Rule
Feature development remains one implementation step at a time. A feature specification does not authorize future features or unrelated infrastructure.
