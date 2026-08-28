import { describe, it } from "node:test";
import assert from "node:assert/strict";

import type { ProjectService, TaskService } from "@forgeai/domain";
import { RequestContext } from "@mastra/core/request-context";

import { createForgeAiAgent } from "../../agents/forgeai-agent.js";

function createProjectServiceStub(): ProjectService {
  return {} as ProjectService;
}

function createTaskServiceStub(): TaskService {
  return {} as TaskService;
}

describe("ForgeAI Agent", () => {
  it("creates the ForgeAI agent with the expected identity", () => {
    const projectService = createProjectServiceStub();
    const taskService = createTaskServiceStub();

    const agent = createForgeAiAgent(projectService, taskService);

    assert.equal(agent.id, "forgeai-agent");
    assert.equal(agent.name, "ForgeAI Agent");
  });

  it("registers the expected project and task tools", async () => {
    const projectService = createProjectServiceStub();
    const taskService = createTaskServiceStub();

    const agent = createForgeAiAgent(projectService, taskService);

    const requestContext = new RequestContext();
    requestContext.set("requestId", "test-request");

    const tools = await agent.listTools({
      requestContext,
    });

    assert.deepEqual(
      Object.keys(tools).sort(),
      ["getProjectTool", "listPojectTasksTool"].sort(),
    );
  });
});
