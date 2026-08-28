import { createTool } from "@mastra/core/tools";
import { z } from "zod";

import type { ProjectService } from "@forgeai/domain";

export function createGetProjectTool(projectService: ProjectService) {
  return createTool({
    id: "get-project",
    description: "Retrieve a ForgeAI project by its ID. Use this when you need details about a specific project.",

    inputSchema: z.object({
      projectId: z.uuid().describe("The UUID of the project to retrieve"),
    }),

    requestContextSchema: z.object({
      requestId: z.string()
    }),

    execute: async ({ projectId }, { requestContext }) => {
      const requestId = requestContext?.get("requestId");

      console.log(
        `[tool:get-project] requestId=${requestId ?? "unknown"}`,
      );
      
      return projectService.getProject(projectId);
    },
  });
}
