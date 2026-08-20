import { applicationConfig } from "@forgeai/config";
import { Agent } from "@mastra/core/agent";

export const smokeTestAgent = new Agent({
  id: "forgeai-smoke-test",
  name: "ForgeAI Smoke Test",
  instructions: `
    You are a minimal ForgeAI runtime smoke-test agent.
    Answer the user's request conciesly.
    Do not use tools, memory, or external context.
    `,
  model: applicationConfig.ai.model
})
