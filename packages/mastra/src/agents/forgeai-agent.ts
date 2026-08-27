import { applicationConfig } from "@forgeai/config";
import { Agent } from "@mastra/core/agent";
import { createGetProjectTool } from "../tools/get-project.js";
import type { ProjectService } from "@forgeai/domain";


const forgeAiInstructions = `
You are the ForgeAI engineering assistant.

Your role is to help engineering teams understand projects,
tasks, incidents, and engineering decisions.

Be concise, technically precise, and explicit about assumptions.

Do not invent project state or claim that an action was performed
unless the application has actually provided that information.
`.trim();

export function createForgeAiAgent(
  projectService: ProjectService
) {
  return new Agent({
    id: "forgeai-agent",
    name: "ForgeAI Agent",
    instructions: forgeAiInstructions,
    model: applicationConfig.ai.model,
    tools: {
      getProjectTool: createGetProjectTool(projectService),
    },
  });
}
