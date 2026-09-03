import { describe, it } from "node:test";
import assert from "node:assert/strict";

import { planOutputSchema } from "../../agents/planner-output-schema.js";

describe("Plan Output Schema", () => {
  it("accepts a valid plan", () => {
    const result = planOutputSchema.safeParse({
      objective: "Add structured planning to ForgeAI",
      summary: "Introduce a planner that returns validated engineering plans.",
      assumptions: ["The planner runs inside the Mastra runtime."],
      steps: [
        {
          id: "step-1",
          title: "Define the planner contract",
          description: "Create the structured output schema.",
        },
      ],
    });

    assert.equal(result.success, true);
  });

  it("rejects an empty objective", () => {
    const result = planOutputSchema.safeParse({
      objective: "",
      summary: "Introduce a planner.",
      assumptions: [],
      steps: [
        {
          id: "step-1",
          title: "Define the planner contract",
          description: "Create the structured output schema.",
        },
      ],
    });

    assert.equal(result.success, false);
  });

  it("rejects a plan without steps", () => {
    const result = planOutputSchema.safeParse({
      objective: "Add structured planning to ForgeAI",
      summary: "Introduce a planner.",
      assumptions: [],
      steps: [],
    });

    assert.equal(result.success, false);
  });

  it("rejects a plan step with an empty title", () => {
    const result = planOutputSchema.safeParse({
      objective: "Add structured planning to ForgeAI",
      summary: "Introduce a planner.",
      assumptions: [],
      steps: [
        {
          id: "step-1",
          title: "",
          description: "Create the structured output schema.",
        },
      ],
    });

    assert.equal(result.success, false);
  });
});
