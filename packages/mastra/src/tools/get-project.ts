import { createTool } from "@mastra/core/tools";
import { z } from "zod";

import type { ProjectService } from "@forgeai/domain";

export function createGetProjectTool(projectService: ProjectService) {
  return createTool({
    id: "get-project",
    description: "Retrieve a ForgeAI project by its project ID",

    inputSchema: z.object({
      projectId: z.string(),
    }),

    execute: async ({ projectId }) => {
      return projectService.getProject(projectId);
    },
  });
}
