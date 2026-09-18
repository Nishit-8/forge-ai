import { createStep, createWorkflow } from "@mastra/core/workflows";
import { z } from "zod";

import type { TaskService } from "@forgeai/domain";

import { plannerAgent } from "../agents/planner-agent.js";

const projectPlanningInputSchema = z.object({
  projectId: z
    .uuid()
    .describe("The UUID of the project to plan work for"),
  request: z
    .string()
    .min(1)
    .describe("The planning request for the project"),
});

const projectPlanningRequestContextSchema = z.object({
  requestId: z.string(),
});

const projectPlanningStateSchema = z.object({
  status: z.enum(["pending", "running"]),
});

const projectPlanningStepOutputSchema = z.object({
  projectId: z.uuid(),
  request: z.string(),
});

const plannerAgentGenerateStepOutputSchema = z.object({
  projectId: z.uuid(),
  text: z.string(),
});

const projectPlanningParallelOutputSchema = z.object({
  "generate-planning-result": plannerAgentGenerateStepOutputSchema,
  "list-project-tasks": z.array(
    z.object({
      id: z.string(),
      projectId: z.string(),
      title: z.string(),
      description: z.string(),
      status: z.enum([
        "todo",
        "in_progress",
        "completed",
        "cancelled",
      ]),
      priority: z.enum(["low", "medium", "high"]),
      createdAt: z.date(),
      updatedAt: z.date(),
    }),
  ),
});

const projectPlanningBranchOutputSchema = z.object({
  planningMode: z.enum(["initial", "existing"]),
  projectId: z.uuid(),
  text: z.string(),
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

const plannerAgentGenerateStep = createStep({
  id: "generate-planning-result",
  description:
    "Generate the project planning result using the ForgeAI planner agent.",
  inputSchema: projectPlanningStepOutputSchema,
  outputSchema: plannerAgentGenerateStepOutputSchema,
  execute: async ({ inputData }) => {
    const result = await plannerAgent.generate(inputData.request);

    return {
      projectId: inputData.projectId,
      text: result.text,
    };
  },
});

export function createProjectPlanningWorkflow(taskService: TaskService) {
  const listProjectTasksStep = createStep({
    id: "list-project-tasks",
    description:
      "Retrieve the current tasks for the project as a parallel planning input.",
    inputSchema: projectPlanningStepOutputSchema,
    outputSchema: z.array(
      z.object({
        id: z.string(),
        projectId: z.uuid(),
        title: z.string(),
        description: z.string(),
        status: z.enum([
          "todo",
          "in_progress",
          "completed",
          "cancelled",
        ]),
        priority: z.enum(["low", "medium", "high"]),
        createdAt: z.date(),
        updatedAt: z.date(),
      }),
    ),
    execute: async ({ inputData }) => {
      if (!inputData) {
        throw new Error("Workflow input data is required");
      }

      return taskService.listByProject(inputData.projectId);
    },
  });

  const existingProjectPlanningStep = createStep({
    id: "existing-project-planning",
    description:
      "Mark the planning request as an update to an existing project.",
    inputSchema: projectPlanningParallelOutputSchema,
    outputSchema: projectPlanningBranchOutputSchema,
    execute: async ({ inputData }) => {
      return {
        planningMode: "existing" as const,
        projectId: inputData["generate-planning-result"].projectId,
        text: inputData["generate-planning-result"].text,
      };
    },
  });

  const initialProjectPlanningStep = createStep({
    id: "initial-project-planning",
    description:
      "Mark the planning request as the initial plan for a project.",
    inputSchema: projectPlanningParallelOutputSchema,
    outputSchema: projectPlanningBranchOutputSchema,
    execute: async ({ inputData }) => {
      return {
        planningMode: "initial" as const,
        projectId: inputData["generate-planning-result"].projectId,
        text: inputData["generate-planning-result"].text,
      };
    },
  });

  return createWorkflow({
    id: "project-planning-workflow",
    description:
      "Defines the workflow boundary for planning work within a ForgeAI project.",
    inputSchema: projectPlanningInputSchema,
    requestContextSchema: projectPlanningRequestContextSchema,
    stateSchema: projectPlanningStateSchema,
    outputSchema: z.object({
      "existing-project-planning":
        projectPlanningBranchOutputSchema.optional(),
      "initial-project-planning":
        projectPlanningBranchOutputSchema.optional(),
    }),
  })
    .then(projectPlanningStep)
    .parallel([
      plannerAgentGenerateStep,
      listProjectTasksStep,
    ])
    .branch([
      [
        async ({ inputData }) =>
          inputData["list-project-tasks"].length > 0,
        existingProjectPlanningStep,
      ],
      [
        async ({ inputData }) =>
          inputData["list-project-tasks"].length === 0,
        initialProjectPlanningStep,
      ],
    ])
    .commit();
}
