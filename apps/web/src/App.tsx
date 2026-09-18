import { useEffect, useState, type SyntheticEvent } from "react";

interface Project {
  id: string;
  name: string;
  description: string;
  status: "active" | "completed" | "archived";
  createdAt: string;
  updatedAt: string;
}

interface ProjectResponse {
  error?: string;
}

type ProjectState =
  | { status: "loading" }
  | { status: "success"; projects: Project[] }
  | { status: "error"; message: string };

function App() {
  const [projectState, setProjectState] = useState<ProjectState>({
    status: "loading",
  });

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [formError, setFormError] = useState("");

  async function loadProjects(): Promise<void> {
    setProjectState({ status: "loading" });

    try {
      const response = await fetch("/api/projects");

      const body = (await response.json()) as Project[] | ProjectResponse;

      if (!response.ok) {
        const errorBody = body as ProjectResponse;

        throw new Error(
          errorBody.error ?? "Failed to load projects",
        );
      }

      setProjectState({
        status: "success",
        projects: body as Project[],
      });
    } catch (error) {
      setProjectState({
        status: "error",
        message:
          error instanceof Error
            ? error.message
            : "Failed to load projects",
      });
    }
  }

  useEffect(() => {
    void loadProjects();
  }, []);

  async function createProject(
    event: SyntheticEvent<HTMLFormElement>,
  ): Promise<void> {
    event.preventDefault();

    const trimmedName = name.trim();
    const trimmedDescription = description.trim();

    if (!trimmedName) {
      setFormError("Project name is required.");
      return;
    }

    setFormError("");
    setIsCreating(true);

    try {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          name: trimmedName,
          description: trimmedDescription,
        }),
      });

      const body = (await response.json()) as Project | ProjectResponse;

      if (!response.ok) {
        const errorBody = body as ProjectResponse;

        throw new Error(
          errorBody.error ?? "Failed to create project",
        );
      }

      const createdProject = body as Project;

      setProjectState((currentState) => {
        if (currentState.status !== "success") {
          return {
            status: "success",
            projects: [createdProject],
          };
        }

        return {
          status: "success",
          projects: [
            ...currentState.projects,
            createdProject,
          ],
        };
      });

      setName("");
      setDescription("");
    } catch (error) {
      setFormError(
        error instanceof Error
          ? error.message
          : "Failed to create project",
      );
    } finally {
      setIsCreating(false);
    }
  }

  return (
    <main>
      <section className="project-card" aria-labelledby="project-title">
        <header className="project-header">
          <div>
            <p className="eyebrow">ForgeAI</p>
            <h1 id="project-title">Projects</h1>
            <p className="subtitle">
              Create and manage the projects that power your engineering
              workspace.
            </p>
          </div>

          <span className="status-badge">Project Management</span>
        </header>

        <form onSubmit={createProject} className="project-form">
          <div>
            <label htmlFor="project-name">Project name</label>

            <input
              id="project-name"
              name="name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="e.g. ForgeAI"
              maxLength={200}
              disabled={isCreating}
            />
          </div>

          <div>
            <label htmlFor="project-description">
              Description
            </label>

            <textarea
              id="project-description"
              name="description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="What are you building?"
              rows={4}
              maxLength={1000}
              disabled={isCreating}
            />
          </div>

          {formError && (
            <div className="response error" role="alert">
              {formError}
            </div>
          )}

          <div className="form-actions">
            <button
              type="submit"
              disabled={isCreating}
            >
              {isCreating ? "Creating..." : "Create project"}
            </button>
          </div>
        </form>

        <section
          className="projects-section"
          aria-labelledby="projects-heading"
        >
          <div className="section-header">
            <h2 id="projects-heading">Your projects</h2>

            <button
              type="button"
              className="secondary-button"
              onClick={() => void loadProjects()}
              disabled={projectState.status === "loading"}
            >
              Refresh
            </button>
          </div>

          {projectState.status === "loading" && (
            <div className="empty-state" role="status">
              Loading projects...
            </div>
          )}

          {projectState.status === "error" && (
            <div className="response error" role="alert">
              <strong>Unable to load projects</strong>
              <p>{projectState.message}</p>

              <button
                type="button"
                onClick={() => void loadProjects()}
              >
                Try again
              </button>
            </div>
          )}

          {projectState.status === "success" &&
            projectState.projects.length === 0 && (
              <div className="empty-state">
                <strong>No projects yet</strong>
                <p>
                  Create your first project using the form above.
                </p>
              </div>
            )}

          {projectState.status === "success" &&
            projectState.projects.length > 0 && (
              <div className="project-list">
                {projectState.projects.map((project) => (
                  <article
                    className="project-item"
                    key={project.id}
                  >
                    <div>
                      <h3>{project.name}</h3>

                      {project.description && (
                        <p>{project.description}</p>
                      )}
                    </div>

                    <span className="project-status">
                      {project.status}
                    </span>
                  </article>
                ))}
              </div>
            )}
        </section>
      </section>
    </main>
  );
}

export default App;
