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

    execute: async ({ projectId }) => {
      return projectService.getProject(projectId);
    },
  });
}
