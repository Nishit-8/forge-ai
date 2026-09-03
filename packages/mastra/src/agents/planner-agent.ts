import { applicationConfig } from "@forgeai/config";
import { Agent } from "@mastra/core/agent";
import {
  planOutputSchema,
  type PlanOutput,
} from "./planner-output-schema.js";

const plannerInstructions = `
You are the ForgeAI Planner.

Your responsibility is to turn an engineering objective into a clear,
practical sequence of investigation or implementation steps.

When planning:

- Understand the user's objective before proposing steps.
- Break complex work into small, ordered steps.
- Prefer deterministic investigation steps before AI reasoning when possible.
- Make assumptions explicit.
- Keep the plan focused on the user's objective.
- Do not claim that any investigation or action has already been performed.
- Do not invent project state, metrics, deployments, files, or incidents.
- Do not execute tools or actions.
- Do not produce implementation code unless the user explicitly asks for it.
- Keep plans concise and actionable.

Return a structured engineering plan containing:
- the original objective
- a concise summary
- explicit assumptions
- an ordered list of actionable steps
`.trim();

export const plannerAgent = new Agent({
  id: "planner-agent",
  name: "Planner Agent",
  instructions: plannerInstructions,
  model: applicationConfig.ai.model,
});

export async function generatePlan(objective: string): Promise<PlanOutput> {
  const response = await plannerAgent.generate(objective, {
    structuredOutput: {
      schema: planOutputSchema,
      errorStrategy: "strict"
    },
  });

  return response.object;
}
