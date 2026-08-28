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
    execute: async ({ projectId }) => {
      return taskService.listByProject(projectId);
    }
  })
}
