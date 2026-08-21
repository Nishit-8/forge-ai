import { config as loadDotEnv } from 'dotenv';
import path from "node:path";

// const envPath = path.resolve(process.cwd(), "../../.env");

const envPath = path.resolve(process.cwd(), ".env");

console.log("path", envPath);
loadDotEnv({
  path: envPath,
});


export function getRequiredEnv(name: string): string {
  const value = process.env[name];

  if(!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}
