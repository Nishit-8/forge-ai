import { createTool } from "@mastra/core/tools";
import { z } from "zod";

import type { ProjectService } from "@forgeai/domain";

export function createGetProjectTool(projectService: ProjectService) {
  return createTool({
    id: "get-project",

    description:
      "Retrieve a ForgeAI project by its ID. Use this when you need details about a specific project.",

    inputSchema: z.object({
      projectId: z.uuid().describe("The UUID of the project to retrieve"),
    }),

    outputSchema: z.union([
      z.object({
        id: z.uuid(),
        name: z.string(),
        description: z.string(),
        status: z.enum(["active", "completed", "archived"]),
        createdAt: z.date(),
        updatedAt: z.date(),
      }),
      z.object({
        found: z.literal(false),
        projectId: z.uuid(),
      }),
    ]),

    requestContextSchema: z.object({
      requestId: z.string(),
    }),

    execute: async ({ projectId }, { requestContext }) => {
      const requestId = requestContext?.get("requestId");

      console.log(
        `[tool:get-project] requestId=${requestId ?? "unknown"}`,
      );

      try {
        const project = await projectService.getProject(projectId);

        if (!project) {
          return {
            found: false as const,
            projectId,
          };
        }

        return project;
      } catch (error) {
        console.error(
          `[tool:get-project] failed requestId=${requestId ?? "unknown"}`,
          error,
        );

        throw new Error("Unable to retrieve the project right now.");
      }
    },

    transform: {
      display: {
        output: ({ output }) => {
          if (!output) return;

          if (!("name" in output)) {
            return {
              found: false,
              projectId: output.projectId,
            };
          }

          return {
            id: output.id,
            name: output.name,
            status: output.status,
          };
        },
      },

      transcript: {
        output: ({ output }) => {
          if (!output) {
            return output;
          }

          if (!("name" in output)) {
            return {
              found: false,
              projectId: output.projectId,
            };
          }

          return {
            id: output.id,
            name: output.name,
            status: output.status,
          };
        },
      },
    },

    toModelOutput: (output) => {
      if (!("name" in output)) {
        return {
          type: "content",
          value: [
            {
              type: "text",
              text: `Project "${output.projectId}" was not found.`,
            },
          ],
        };
      }

      return {
        type: "content",
        value: [
          {
            type: "text",
            text: `Project "${output.name}" is ${output.status}.`,
          },
        ],
      };
    },
  });
}
