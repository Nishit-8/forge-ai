import { randomUUID } from "node:crypto";

import type {
  CreateProjectInput,
  Project,
  ProjectRepository,
  UpdateProjectInput
} from "@forgeai/domain";

import { database } from "../database/client.js";


interface ProjectRow {
  id: string;
  name: string;
  description: string | null;
  status: Project["status"];
  created_at: string;
  updated_at: string;
}

function mapProjectRow(row: ProjectRow): Project {
  return {
    id: row.id,
    name: row.name,
    description: row.description ?? "",
    status: row.status,
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),
  };
}

export class LibSQLProjectRepository implements ProjectRepository {
  
  async findAll(): Promise<Project[]> {
    const result = await database.execute(`
      SELECT
        id,
        name,
        description,
        status,
        created_at,
        updated_at
      FROM projects
      ORDER BY created_at ASC
    `);

    return result.rows.map((row) =>
      mapProjectRow(row as unknown as ProjectRow),
    );
  }

  async findById(id: string): Promise<Project | null> {
    const result = await database.execute({
      sql: `
        SELECT
          id,
          name,
          description,
          status,
          created_at,
          updated_at
        FROM projects
        WHERE id = ?
      `,
      args: [id],
    });

    const row = result.rows[0];

    if (!row) {
      return null;
    }

    return mapProjectRow(row as unknown as ProjectRow);
  }

  async create(input: CreateProjectInput): Promise<Project> {
    const id = randomUUID();
    const now = new Date();

    await database.execute({
      sql: `
        INSERT INTO projects (
          id,
          name,
          description,
          status,
          created_at,
          updated_at
        )
        VALUES (?, ?, ?, ?, ?, ?)
      `,
      args: [
        id,
        input.name,
        input.description,
        "active",
        now.toISOString(),
        now.toISOString(),
      ],
    });

    return {
      id,
      name: input.name,
      description: input.description,
      status: "active",
      createdAt: now,
      updatedAt: now,
    };
  }

  async update(
    id: string,
    input: UpdateProjectInput,
  ): Promise<Project | null> {
    const existing = await this.findById(id);

    if (!existing) {
      return null;
    }

    const name = input.name ?? existing.name;
    const description = input.description ?? existing.description;
    const status = input.status ?? existing.status;
    const updatedAt = new Date();

    await database.execute({
      sql: `
        UPDATE projects
        SET
          name = ?,
          description = ?,
          status = ?,
          updated_at = ?
        WHERE id = ?
      `,
      args: [
        name,
        description,
        status,
        updatedAt.toISOString(),
        id,
      ],
    });

    return {
      ...existing,
      name,
      description,
      status,
      updatedAt,
    };
  }
}
