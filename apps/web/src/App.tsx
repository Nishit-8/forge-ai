import { useState, type SyntheticEvent } from "react";

type AgentState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; response: string }
  | { status: "error"; message: string };

interface AgentResponse {
  response?: string;
  error?: string;
}

function App() {
  const [prompt, setPrompt] = useState("");
  const [agentState, setAgentState] = useState<AgentState>({
    status: "idle",
  });

  async function submitPrompt(
    event: SyntheticEvent<HTMLFormElement>
  ): Promise<void> {
    event.preventDefault();

    const trimmedPrompt = prompt.trim();

    if (!trimmedPrompt) {
      setAgentState({
        status: "error",
        message: "Enter a prompt before sending it to the agent.",
      });
      return;
    }

    setAgentState({ status: "loading" });

    try {
      const response = await fetch("/api/ai/agent", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          prompt: trimmedPrompt,
        }),
      });

      const body = (await response.json()) as AgentResponse;

      if (!response.ok) {
        throw new Error(body.error ?? "Agent request failed");
      }

      setAgentState({
        status: "success",
        response: body.response ?? "",
      });
    } catch (error) {
      setAgentState({
        status: "error",
        message:
          error instanceof Error ? error.message : "Unknown agent error",
      });
    }
  }

  return (
    <main>
      <section className="agent-card" aria-labelledby="agent-title">
        <div className="agent-header">
          <div>
            <p className="eyebrow">ForgeAI</p>
            <h1 id="agent-title">Engineering Agent</h1>
            <p className="subtitle">
              Ask the agent about your projects and tasks.
            </p>
          </div>

          <span className="status-badge">Ready</span>
        </div>

        <form onSubmit={submitPrompt}>
          <label htmlFor="agent-prompt">Prompt</label>

          <textarea
            id="agent-prompt"
            name="prompt"
            value={prompt}
            onChange={(event) => setPrompt(event.target.value)}
            placeholder="Ask ForgeAI something about your engineering work..."
            rows={5}
            maxLength={500}
            disabled={agentState.status === "loading"}
          />

          <div className="prompt-footer">
            <span>{prompt.length}/500</span>

            <button
              type="submit"
              disabled={agentState.status === "loading"}
            >
              {agentState.status === "loading" ? "Thinking..." : "Send"}
            </button>
          </div>
        </form>

        {agentState.status === "success" && (
          <div className="response success" role="status">
            <strong>Agent response</strong>
            <p>{agentState.response}</p>
          </div>
        )}

        {agentState.status === "error" && (
          <div className="response error" role="alert">
            <strong>Request failed</strong>
            <p>{agentState.message}</p>
          </div>
        )}
      </section>
    </main>
  );
}

export default App;
