import type { ProjectService, TaskService } from "@forgeai/domain";
import { createStep, createWorkflow } from "@mastra/core/workflows";
import { z } from "zod";

const projectSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  description: z.string(),
  status: z.enum(["active", "completed", "archived"]),
  createdAt: z.date(),
  updatedAt: z.date(),
});

const taskSchema = z.object({
  id: z.uuid(),
  projectId: z.uuid(),
  title: z.string(),
  description: z.string(),
  status: z.enum(["todo", "in_progress", "completed"]),
  createdAt: z.date(),
  updatedAt: z.date(),
});

const projectOverviewSchema = z.object({
  project: projectSchema,
  tasks: z.array(taskSchema),
  taskCount: z.number(),
});

export function createProjectOverviewWorkflow(
  projectService: ProjectService,
  taskService: TaskService,
) {
  const projectOverviewStep = createStep({
    id: "build-project-overview",
    description:
      "Retrieve a ForgeAI project and all of its tasks as one deterministic operation.",
    inputSchema: z.object({
      projectId: z.uuid(),
    }),
    outputSchema: projectOverviewSchema,
    execute: async ({ inputData }) => {
      if (!inputData) {
        throw new Error("Workflow input data is required");
      }

      const project = await projectService.getProject(inputData.projectId);
      const tasks = await taskService.listByProject(inputData.projectId);

      return {
        project,
        tasks,
        taskCount: tasks.length,
      };
    },
  });

  return createWorkflow({
    id: "project-overview-workflow",
    description:
      "Retrieve a ForgeAI project together with its tasks as one deterministic workflow capability.",
    inputSchema: z.object({
      projectId: z.uuid().describe("The UUID of the project to inspect"),
    }),
    outputSchema: projectOverviewSchema,
  })
    .then(projectOverviewStep)
    .commit();
}
