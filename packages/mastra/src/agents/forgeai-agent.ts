import { applicationConfig } from "@forgeai/config";
import { Agent } from "@mastra/core/agent";
import { createGetProjectTool } from "../tools/get-project.js";
import type { ProjectService, TaskService } from "@forgeai/domain";
import { createListProjectTasksTool } from "../tools/list-project-tasks-tool.js";
import { webFetchTool } from "@mastra/core/tools";

import { z } from "zod";


const forgeAiInstructions = `
You are the ForgeAI engineering assistant.

Your role is to help engineering teams understand projects,
tasks, incidents, engineering decisions, and technical references.

Be concise, technically precise, and explicit about assumptions.

Use project tools when answering questions about ForgeAI project data.

When the user provides a URL and asks you to inspect or fetch its
contents, use the web fetch tool.

Do not invent project state or claim that an action was performed
unless the application has actually provided that information.
`.trim();

export function createForgeAiAgent(
  projectService: ProjectService,
  taskService: TaskService
) {
  return new Agent({
    id: "forgeai-agent",
    name: "ForgeAI Agent",
    instructions: forgeAiInstructions,
    model: applicationConfig.ai.model,
    requestContextSchema: z.object({
      requestId: z.string(),
    }),
    tools: {
      getProjectTool: createGetProjectTool(projectService),
      listPojectTasksTool: createListProjectTasksTool(taskService),
      webFetchTool
    },
    hooks: {
      beforeToolCall: ({ toolName, input }) => {
        console.log(`[agent:beforeToolCall tool=${toolName}]`, input);
      },
      afterToolCall: ({ toolName, output, error }) => {
        if (error) {
          console.error(`agent:afterToolCall tool=${toolName} failed`, error);
          return;
        }

        console.log(`[agent:afterToolCall] tool=${toolName} ccompleted`, output)
      }
    }
  });
}
