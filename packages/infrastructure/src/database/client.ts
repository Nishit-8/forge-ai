import { mkdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { createClient } from "@libsql/client";

const infrastructureRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../..",
);

const dataDirectory = path.resolve(
  infrastructureRoot,
  "../../data",
);

mkdirSync(dataDirectory, { recursive: true });

const defaultDatabasePath = path.join(
  dataDirectory,
  "forgeai.db",
);

const databaseUrl =
  process.env.DATABASE_URL ?? `file:${defaultDatabasePath}`;

export const database = createClient({
  url: databaseUrl,
});
