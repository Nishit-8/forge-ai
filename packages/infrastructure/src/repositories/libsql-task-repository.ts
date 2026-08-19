import type { Client } from "@libsql/client";

import type {
  Task,
  CreateTaskInput,
  UpdateTaskInput,
  TaskStatus,
  TaskPriority,
} from "@forgeai/domain";

import type { TaskRepository } from "@forgeai/domain";

export class LibSQLTaskRepository implements TaskRepository {
  constructor(private readonly client: Client) {}

  async findByProjectId(projectId: string): Promise<Task[]> {
    const result = await this.client.execute({
      sql: `
        SELECT
          id,
          project_id,
          title,
          description,
          status,
          priority,
          created_at,
          updated_at
        FROM tasks
        WHERE project_id = ?
        ORDER BY created_at ASC
      `,
      args: [projectId],
    });

    return result.rows.map((row) => this.mapRow(row));
  }

  async findById(id: string): Promise<Task | null> {
    const result = await this.client.execute({
      sql: `
        SELECT
          id,
          project_id,
          title,
          description,
          status,
          priority,
          created_at,
          updated_at
        FROM tasks
        WHERE id = ?
        LIMIT 1
      `,
      args: [id],
    });

    const row = result.rows[0];

    return row ? this.mapRow(row) : null;
  }

  async create(input: CreateTaskInput): Promise<Task> {
    const id = crypto.randomUUID();
    const now = new Date().toISOString();

    await this.client.execute({
      sql: `
        INSERT INTO tasks (
          id,
          project_id,
          title,
          description,
          status,
          priority,
          created_at,
          updated_at
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `,
      args: [
        id,
        input.projectId,
        input.title,
        input.description ?? "",
        input.status,
        input.priority,
        now,
        now,
      ],
    });

    const task = await this.findById(id);

    if (!task) {
      throw new Error("Task could not be created");
    }

    return task;
  }

  async update(
    id: string,
    input: UpdateTaskInput,
  ): Promise<Task | null> {
    const existing = await this.findById(id);

    if (!existing) {
      return null;
    }

    const updatedAt = new Date().toISOString();

    await this.client.execute({
      sql: `
        UPDATE tasks
        SET
          title = ?,
          description = ?,
          status = ?,
          priority = ?,
          updated_at = ?
        WHERE id = ?
      `,
      args: [
        input.title ?? existing.title,
        input.description ?? existing.description,
        input.status ?? existing.status,
        input.priority ?? existing.priority,
        updatedAt,
        id,
      ],
    });

    return this.findById(id);
  }

  private mapRow(row: Record<string, unknown>): Task {
    return {
      id: String(row.id),
      projectId: String(row.project_id),
      title: String(row.title),
      description: String(row.description ?? ""),
      status: row.status as TaskStatus,
      priority: row.priority as TaskPriority,
      createdAt: String(row.created_at),
      updatedAt: String(row.updated_at),
    };
  }
}
