import { createStep, createWorkflow } from "@mastra/core/workflows";
import { z } from "zod";

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

const finalizePlanningRequestStep = createStep({
  id: "finalize-planning-request",
  description:
    "Finalize the prepared project planning request after the preparation step completes.",
  inputSchema: projectPlanningStepOutputSchema,
  outputSchema: projectPlanningStepOutputSchema,
  execute: async ({ inputData }) => {
    if (!inputData) {
      throw new Error("Prepared planning request is required");
    }

    return {
      projectId: inputData.projectId,
      request: inputData.request.replace(/\s+/g, " "),
    };
  },
});

const projectPlanningOutputSchema = projectPlanningStepOutputSchema;

export function createProjectPlanningWorkflow() {
  return createWorkflow({
    id: "project-planning-workflow",
    description:
      "Defines the workflow boundary for planning work within a ForgeAI project.",
    inputSchema: projectPlanningInputSchema,
    stateSchema: projectPlanningStateSchema,
    outputSchema: projectPlanningOutputSchema,
  })
    .then(projectPlanningStep)
    .then(finalizePlanningRequestStep)
    .commit();
}
