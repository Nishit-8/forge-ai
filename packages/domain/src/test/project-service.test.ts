import test from "node:test";
import assert from "node:assert/strict";

import { ProjectService } from "../project-service.js";
import type {
  CreateProjectInput,
  Project,
  ProjectRepository,
  UpdateProjectInput,
} from "../index.js";

function createProject(): Project {
  const now = new Date();

  return {
    id: "project-1",
    name: "Test Project",
    description: "Test description",
    status: "active",
    createdAt: now,
    updatedAt: now,
  };
}

class FakeProjectRepository implements ProjectRepository {
  private project: Project | null = createProject();

  async findAll(): Promise<Project[]> {
    return this.project ? [this.project] : [];
  }

  async findById(id: string): Promise<Project | null> {
    return this.project?.id === id ? this.project : null;
  }

  async create(input: CreateProjectInput): Promise<Project> {
    this.project = {
      ...createProject(),
      name: input.name,
      description: input.description,
    };

    return this.project;
  }

  async update(
    id: string,
    input: UpdateProjectInput,
  ): Promise<Project | null> {
    if (!this.project || this.project.id !== id) {
      return null;
    }

    this.project = {
      ...this.project,
      name: input.name ?? this.project.name,
      description: input.description ?? this.project.description,
      status: input.status ?? this.project.status,
      updatedAt: new Date(),
    };

    return this.project;
  }
}

test("ProjectService lists projects through the repository", async () => {
  const repository = new FakeProjectRepository();
  const service = new ProjectService(repository);

  const projects = await service.listProjects();

  assert.equal(projects.length, 1);
  assert.equal(projects[0]?.id, "project-1");
});

test("ProjectService returns a project by id", async () => {
  const repository = new FakeProjectRepository();
  const service = new ProjectService(repository);

  const project = await service.getProject("project-1");

  assert.equal(project?.id, "project-1");
});

test("ProjectService returns null for an unknown project", async () => {
  const repository = new FakeProjectRepository();
  const service = new ProjectService(repository);

  const project = await service.getProject("does-not-exist");

  assert.equal(project, null);
});
