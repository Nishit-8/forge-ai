import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { database } from "./client.js";

const currentDirectory = path.dirname(fileURLToPath(import.meta.url));
const migrationsDirectory = path.resolve(currentDirectory, '../../migrations');

async function ensureMigrationsTable(): Promise<void> {
  await database.execute(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      version TEXT PRIMARY KEY NOT NULL,
      applied_at TEXT NOT NULL
    )
  `);
}

async function getAppliedMigrations(): Promise<Set<string>> {
  const result = await database.execute("SELECT version FROM schema_migrations");

  return new Set(
    result.rows.map(row => String(row.version))
  );
}

async function runMigrations(): Promise<void> {
  await ensureMigrationsTable();

  const appliedMigrations = await getAppliedMigrations();

  const migrationFiles = (await readdir(migrationsDirectory))
    .filter((file) => file.endsWith(".sql"))
    .sort();

  for (const migrationFile of migrationFiles) {
    const version = migrationFile.split("_")[0];

    if (appliedMigrations.has(version)) {
      continue;
    }

    const migrationPath = path.join(
      migrationsDirectory,
      migrationFile
    );

    const sql = await readFile(migrationPath, "utf-8");

    await database.batch([sql], "write");

    await database.execute({
      sql: `
        INSERT INTO schema_migrations (version, applied_at)
        VALUES (?, ?)
      `,
      args: [version, new Date().toISOString()],
    });

    console.log(`Applied migration: ${migrationFile}`);
  }
}

try {
  await runMigrations();
  console.log("Database migrations completed");

}
finally {
  database.close();
}
