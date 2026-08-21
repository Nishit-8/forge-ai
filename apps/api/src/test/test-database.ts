import { createClient, type Client } from "@libsql/client";

export async function createTestDatabase(): Promise<Client> {
  const client = createClient({
    url: ":memory:",
  });

  await client.batch(
    [
      `
        CREATE TABLE projects (
          id TEXT PRIMARY KEY NOT NULL,
          name TEXT NOT NULL,
          description TEXT NOT NULL DEFAULT '',
          status TEXT NOT NULL,
          created_at TEXT NOT NULL,
          updated_at TEXT NOT NULL
        )
      `,
      `
        CREATE TABLE tasks (
          id TEXT PRIMARY KEY NOT NULL,
          project_id TEXT NOT NULL,
          title TEXT NOT NULL,
          description TEXT NOT NULL DEFAULT '',
          status TEXT NOT NULL,
          priority TEXT NOT NULL,
          created_at TEXT NOT NULL,
          updated_at TEXT NOT NULL,
          FOREIGN KEY (project_id) REFERENCES projects(id)
        )
      `,
    ],
    "write",
  );

  return client;
}
