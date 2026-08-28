import { config as loadDotEnv } from "dotenv";
import path from "node:path";
import { fileURLToPath } from 'node:url';

const currentFilePath = fileURLToPath(import.meta.url);
const currentDirectory = path.dirname(currentFilePath);
const envPath = path.resolve(currentDirectory, "../../../.env");

loadDotEnv({
  path: envPath,
});

export function getRequiredEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}
