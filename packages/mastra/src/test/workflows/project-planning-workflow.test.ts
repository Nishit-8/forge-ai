import { describe, it } from "node:test";
import assert from "node:assert/strict";

import { createProjectPlanningWorkflow } from "../../workflows/project-planning-workflow.js";

describe("Project Planning Workflow", () => {
  it("creates the workflow with the expected identity", () => {
    const workflow = createProjectPlanningWorkflow();

    assert.equal(workflow.id, "project-planning-workflow");
  });
});
