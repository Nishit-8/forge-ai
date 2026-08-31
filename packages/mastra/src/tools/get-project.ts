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

    outputSchema: z.object({
      id: z.uuid(),
      name: z.string(),
      description: z.string(),
      status: z.enum(["active", "completed", "archived"]),
      createdAt: z.date(),
      updatedAt: z.date(),
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

    transform: {
      display: {
        output: ({ output }) => {
          if (!output) return;

          return {
            id: output.id,
            name: output.name,
            status: output.status
          }
        }
      },
      transcript: {
        output: ({ output }) => {
          if (!output) {
            return output;
          }

          return {
            id: output.id,
            name: output.name,
            status: output.status,
          };
        },
      },
    }
  });
}
