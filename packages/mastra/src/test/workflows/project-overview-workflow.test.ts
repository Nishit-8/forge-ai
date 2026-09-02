import { describe, it } from "node:test";
import assert from "node:assert/strict";

import type {
  Project,
  ProjectService,
  Task,
  TaskService,
} from "@forgeai/domain";

import { createProjectOverviewWorkflow } from "../../workflows/project-overview-workflow.js";

function createProjectServiceStub(): ProjectService {
  return {
    getProject: async (projectId: string): Promise<Project> => ({
      id: projectId,
      name: "ForgeAI",
      description: "AI engineering project",
      status: "active",
      createdAt: new Date("2026-01-01"),
      updatedAt: new Date("2026-01-02"),
    }),
  } as ProjectService;
}

function createTaskServiceStub(): TaskService {
  return {
    listByProject: async (projectId: string): Promise<Task[]> => [
      {
        id: "00000000-0000-0000-0000-000000000001",
        projectId,
        title: "Implement workflow as tool",
        description: "Learn workflow composition",
        status: "completed",
        createdAt: new Date("2026-01-01"),
        updatedAt: new Date("2026-01-02"),
      },
    ],
  } as TaskService;
}

describe("Project Overview Workflow", () => {
  it("creates the workflow with the expected identity", () => {
    const workflow = createProjectOverviewWorkflow(
      createProjectServiceStub(),
      createTaskServiceStub(),
    );

    assert.equal(
      workflow.id,
      "project-overview-workflow",
    );
  });
});
