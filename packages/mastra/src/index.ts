import { Mastra } from '@mastra/core';
import { smokeTestAgent } from './agents/smoke-test-agent.js';
import { applicationConfig } from '@forgeai/config';
import { createForgeAiAgent } from './agents/forgeai-agent.js';
import type { ProjectService, TaskService } from '@forgeai/domain';
import { createProjectOverviewWorkflow } from './workflows/project-overview-workflow.js';
import { plannerAgent } from './agents/planner-agent.js';

process.env.GOOGLE_GENERATIVE_AI_API_KEY ??=
  applicationConfig.ai.googleApiKey;

export { smokeTestAgent };

export function createMastra(projectService: ProjectService, taskService: TaskService) {
  const forgeaiAgent = createForgeAiAgent(projectService, taskService);

  const projectOverviewWorkflow = createProjectOverviewWorkflow(
    projectService,
    taskService,
  );

  return new Mastra({
    agents: {
      smokeTestAgent,
      forgeaiAgent,
      plannerAgent
    },
    workflows: {
      projectOverviewWorkflow
    }
  });
}
