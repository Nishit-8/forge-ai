import test from "node:test";
import assert from "node:assert/strict";

import { TaskService } from "../task-service.js";
import type {
  CreateTaskInput,
  Task,
  TaskRepository,
  UpdateTaskInput,
} from "../index.js";

function createTask(): Task {
  const now = new Date();

  return {
    id: "task-1",
    projectId: "project-1",
    title: "Test task",
    description: "Test description",
    status: "todo",
    priority: "medium",
    createdAt: now,
    updatedAt: now,
  };
}

class FakeTaskRepository implements TaskRepository {
  private task: Task | null = createTask();

  async findByProjectId(projectId: string): Promise<Task[]> {
    return this.task?.projectId === projectId
      ? [this.task]
      : [];
  }

  async findById(id: string): Promise<Task | null> {
    return this.task?.id === id ? this.task : null;
  }

  async create(input: CreateTaskInput): Promise<Task> {
    this.task = {
      ...createTask(),
      projectId: input.projectId,
      title: input.title,
      description: input.description ?? "",
      priority: input.priority,
    };

    return this.task;
  }

  async update(
    id: string,
    input: UpdateTaskInput,
  ): Promise<Task | null> {
    if (!this.task || this.task.id !== id) {
      return null;
    }

    this.task = {
      ...this.task,
      title: input.title ?? this.task.title,
      description: input.description ?? this.task.description,
      status: input.status ?? this.task.status,
      priority: input.priority ?? this.task.priority,
      updatedAt: new Date(),
    };

    return this.task;
  }
}

test("TaskService lists tasks for a project", async () => {
  const repository = new FakeTaskRepository();
  const service = new TaskService(repository);

  const tasks = await service.listByProject("project-1");

  assert.equal(tasks.length, 1);
  assert.equal(tasks[0]?.projectId, "project-1");
});

test("TaskService returns a task by id", async () => {
  const repository = new FakeTaskRepository();
  const service = new TaskService(repository);

  const task = await service.getById("task-1");

  assert.equal(task?.id, "task-1");
});

test("TaskService returns null for an unknown task", async () => {
  const repository = new FakeTaskRepository();
  const service = new TaskService(repository);

  const task = await service.getById("does-not-exist");

  assert.equal(task, null);
});

test("TaskService persists plan steps as tasks", async () => {
  const repository = new FakeTaskRepository();
  const service = new TaskService(repository);

  const tasks = await service.createFromPlan("project-1", [
    {
      title: "Inspect the repository",
      description: "Review the existing architecture before implementation.",
    },
    {
      title: "Implement the feature",
      description: "Add the requested functionality.",
    },
  ]);

  assert.equal(tasks.length, 2);
  assert.equal(tasks[0]?.projectId, "project-1");
  assert.equal(tasks[0]?.title, "Inspect the repository");
  assert.equal(
    tasks[0]?.description,
    "Review the existing architecture before implementation.",
  );
  assert.equal(tasks[0]?.priority, "medium");

  assert.equal(tasks[1]?.title, "Implement the feature");
  assert.equal(tasks[1]?.description, "Add the requested functionality.");
});
