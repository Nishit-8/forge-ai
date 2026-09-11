import { createWorkflow } from "@mastra/core/workflows";
import { z } from "zod";

const projectPlanningInputSchema = z.object({
  projectId: z.uuid().describe("The UUID of the project to plan work for"),
  request: z
    .string()
    .min(1)
    .describe("The planning request for the project"),
});

const projectPlanningOutputSchema = z.object({});

export function createProjectPlanningWorkflow() {
  return createWorkflow({
    id: "project-planning-workflow",
    description:
      "Defines the workflow boundary for planning work within a ForgeAI project.",
    inputSchema: projectPlanningInputSchema,
    outputSchema: projectPlanningOutputSchema,
  }).commit();
}
