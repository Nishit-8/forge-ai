import { createStep, createWorkflow } from "@mastra/core/workflows";
import { z } from "zod";

import { plannerAgent } from "../agents/planner-agent.js";

const projectPlanningInputSchema = z.object({
  projectId: z.uuid().describe("The UUID of the project to plan work for"),
  request: z
    .string()
    .min(1)
    .describe("The planning request for the project"),
});

const projectPlanningStateSchema = z.object({
  status: z.enum(["pending", "running"]),
});

const projectPlanningStepOutputSchema = z.object({
  projectId: z.uuid(),
  request: z.string(),
});

const projectPlanningStep = createStep({
  id: "prepare-planning-request",
  description:
    "Prepare the validated project planning request for workflow execution.",
  inputSchema: projectPlanningInputSchema,
  outputSchema: projectPlanningStepOutputSchema,
  execute: async ({ inputData }) => {
    if (!inputData) {
      throw new Error("Workflow input data is required");
    }

    return {
      projectId: inputData.projectId,
      request: inputData.request.trim(),
    };
  },
});

const plannerAgentStep = createStep(plannerAgent);

export function createProjectPlanningWorkflow() {
  return createWorkflow({
    id: "project-planning-workflow",
    description:
      "Defines the workflow boundary for planning work within a ForgeAI project.",
    inputSchema: projectPlanningInputSchema,
    stateSchema: projectPlanningStateSchema,
    outputSchema: z.object({
      text: z.string(),
    }),
  })
    .then(projectPlanningStep)
    .map(async ({ inputData }) => ({
      prompt: inputData.request,
    }))
    .then(plannerAgentStep)
    .commit();
}
