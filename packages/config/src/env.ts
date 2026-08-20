import { config as loadDotEnv } from 'dotenv';

loadDotEnv();

export function getRequiredEnv(name: string): string {
  const value = process.env[name];

  if(!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}
