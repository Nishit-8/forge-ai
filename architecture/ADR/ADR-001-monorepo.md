# ADR-001 — Monorepo
Status: Accepted

ForgeAI uses a workspace-based monorepo because web, API, domain, infrastructure, Mastra, tests and docs evolve together.

Benefits: shared types, one dependency graph, simpler local development, explicit package boundaries.

Tradeoff: requires package dependency discipline as the system grows.
