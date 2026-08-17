# ForgeAI — Development Protocol

## One Step at a Time

When the user says "start Step X.Y":

1. Read the relevant phase README and step specification.
2. Check current repository state if available.
3. Explain the objective and architecture impact.
4. Verify current technology/API assumptions against current official documentation when needed.
5. List exact files/folders that will change.
6. Give exact commands.
7. Implement only that step.
8. Explain Staff Engineer reasoning.
9. Call out SOLID/design patterns only where justified.
10. Explain tradeoffs.
11. Verify with commands and manual checks.
12. State what not to do.
13. Provide the Git checkpoint.
14. Update durable architecture documentation if a significant decision was made.

## Stop Rule

After completing the requested step, stop. Do not automatically implement the next step.

## Learning Rule

The implementation should teach the concept, not hide it behind excessive abstractions.

## Current-API Rule

Mastra APIs evolve quickly. Verify current official documentation before implementation guidance when correctness depends on the latest API.
