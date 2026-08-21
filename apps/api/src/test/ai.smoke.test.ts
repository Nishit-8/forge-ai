import test from "node:test";
import assert from "node:assert/strict";

test("AI smoke test", async (t) => {
  if (process.env.RUN_AI_TESTS !== "true") {
    t.skip(
      "AI tests disabled. Run with RUN_AI_TESTS=true.",
    );
    return;
  }

  const response = await fetch(
    "http://127.0.0.1:3000/api/ai/test",
    {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        prompt:
          "Reply with exactly: ForgeAI AI smoke test successful.",
      }),
    },
  );

  assert.equal(response.status, 200);

  const body = await response.json() as any;

  assert.ok(body.response);
});
