import { useState } from "react";

type AiState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; response: string }
  | { status: "error"; message: string };

function App() {
  const [aiState, setAiState] = useState<AiState>({
    status: "idle",
  });

  async function testAiRuntime(): Promise<void> {
    setAiState({ status: "loading" });

    try {
      const response = await fetch("/api/ai/test", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          prompt: "Reply with exactly: ForgeAI AI smoke test successful.",
        }),
      });

      const body = (await response.json()) as {
        response?: string;
        error?: string;
      };

      if (!response.ok) {
        throw new Error(body.error ?? "AI request failed");
      }

      setAiState({
        status: "success",
        response: body.response ?? "",
      });
    } catch (error) {
      setAiState({
        status: "error",
        message:
          error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  return (
    <main>
      <section className="runtime-card">
        <h1>ForgeAI</h1>
        <p className="subtitle">AI Runtime</p>

        <div className="runtime-status">
          <div>
            <span>Mastra</span>
            <strong>✓</strong>
          </div>

          <div>
            <span>Gemini</span>
            <strong>✓</strong>
          </div>
        </div>

        <button
          type="button"
          onClick={testAiRuntime}
          disabled={aiState.status === "loading"}
        >
          {aiState.status === "loading"
            ? "Testing..."
            : "Test AI Request"}
        </button>

        {aiState.status === "success" && (
          <div className="response success">
            <strong>Response</strong>
            <p>{aiState.response}</p>
          </div>
        )}

        {aiState.status === "error" && (
          <div className="response error">
            <strong>Request failed</strong>
            <p>{aiState.message}</p>
          </div>
        )}
      </section>
    </main>
  );
}

export default App;
