import { Mastra } from '@mastra/core';
import { smokeTestAgent } from './agents/smoke-test-agent.js';
import { applicationConfig } from '@forgeai/config';

process.env.GOOGLE_GENERATIVE_AI_API_KEY ??=
  applicationConfig.ai.googleApiKey;

export { smokeTestAgent };

export const mastra = new Mastra({
  agents: {
    smokeTestAgent
  }
});
