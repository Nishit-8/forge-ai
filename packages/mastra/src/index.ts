import { Mastra } from '@mastra/core';
import { smokeTestAgent } from './agents/smoke-test-agent.js';
import { applicationConfig } from '@forgeai/config';
import { createForgeAiAgent } from './agents/forgeai-agent.js';
import type { ProjectService } from '@forgeai/domain';

process.env.GOOGLE_GENERATIVE_AI_API_KEY ??=
  applicationConfig.ai.googleApiKey;

export { smokeTestAgent };

export function createMastra(projectService: ProjectService) {
  const forgeaiAgent = createForgeAiAgent(projectService);

  return new Mastra({
    agents: {
      smokeTestAgent,
      forgeaiAgent,
    },
  });
}
