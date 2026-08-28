import type { TaskService } from "@forgeai/domain";
import { createTool } from "@mastra/core/tools";
import { z } from "zod";

export function createListProjectTasksTool(taskService: TaskService) {
  return createTool({
    id: "list-project-tasks",
    description: "List all tasks brlonging to a ForgeAI project. use this when you need to inspect the tasks for as specific prject",
    inputSchema: z.object({
      projectId: z.uuid().describe("The UUID of the project whose tasks to retrieve")
    }),
    requestContextSchema: z.object({
      requestId: z.string(),
    }),
    execute: async ({ projectId }, { requestContext }) => {
      const requestId = requestContext?.get("requestId");

      console.log(
        `[tool:list-projects] requestId=${requestId ?? "unknown"}`,
      );

      return taskService.listByProject(projectId);
    }
  })
}
