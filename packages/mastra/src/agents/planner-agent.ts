import { applicationConfig } from "@forgeai/config";
import { Agent } from "@mastra/core/agent";
import { askUserTool, submitPlanTool } from "@mastra/core/tools";
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

When the user's objective is ambiguous and an important piece of information
is required to create a useful plan, use askUserTool to ask the user for
clarification instead of guessing.

Only ask a clarification question when the missing information materially
changes the plan.

Prefer a concise question that requests only the information needed to
continue planning.

Once you have enough information:

1. Produce the structured engineering plan.
2. Submit the plan for human approval using submitPlanTool.
3. Do not proceed with implementation until the plan is approved.

If the plan is rejected with feedback, revise the plan according to the
feedback and submit the revised plan for approval again.

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
  tools: {
    askUserTool,
    submitPlanTool,
  },
});

export async function generatePlan(objective: string): Promise<PlanOutput> {
  const response = await plannerAgent.generate(objective, {
    prepareStep: ({ stepNumber }) => {
      if (stepNumber === 0) {
        return {
          model: applicationConfig.ai.model,
        };
      }

      return {
        model: applicationConfig.ai.structuringModel,
      };
    },
    structuredOutput: {
      schema: planOutputSchema,
      model: applicationConfig.ai.structuringModel,
      errorStrategy: "strict",
      jsonPromptInjection: true,
    },
  });

  return response.object;
}
