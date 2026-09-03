import { z } from "zod";

export const planStepSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
});

export const planOutputSchema = z.object({
  objective: z.string(),
  summary: z.string(),
  assumptions: z.array(z.string()),
  steps: z.array(planStepSchema),
});

export type PlanStep = z.infer<typeof planStepSchema>;

export type PlanOutput = z.infer<typeof planOutputSchema>;
