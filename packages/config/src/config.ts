import { getRequiredEnv } from "./env.js";


export const applicationConfig = {
  ai: {
    model: getRequiredEnv('AI_MODEL'),
    googleApiKey: getRequiredEnv('GOOGLE_API_KEY')
  }
} as const;
