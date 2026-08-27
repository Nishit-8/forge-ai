import { applicationConfig } from "@forgeai/config";
import { Agent } from "@mastra/core/agent";

export const forgeaiAgent = new Agent({
  id: 'forgeai-agent',
  name: 'ForgeAI Agent',
  instructions: 'You are the ForgeAI angineering agent',
  model: applicationConfig.ai.model
})
