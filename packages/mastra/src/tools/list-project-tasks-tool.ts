import type { TaskService } from "@forgeai/domain";
import { createTool } from "@mastra/core/tools";
import { z } from "zod";

export function createListProjectTasksTool(taskService: TaskService) {
  return createTool({
    id: "list-project-tasks",
    description:
      "List all tasks belonging to a ForgeAI project. Use this when you need to inspect the tasks for a specific project.",
    inputSchema: z.object({
      projectId: z
        .uuid()
        .describe("The UUID of the project whose tasks to retrieve"),
    }),
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
    requestContextSchema: z.object({
      requestId: z.string(),
    }),
    execute: async ({ projectId }, { requestContext }) => {
      const requestId = requestContext?.get("requestId");

      console.log(
        `[tool:list-project-tasks] requestId=${requestId ?? "unknown"}`,
      );

      return taskService.listByProject(projectId);
    },
  });
}
