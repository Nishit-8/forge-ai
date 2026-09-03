import { z } from "zod";

export const planStepSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
});

export const planOutputSchema = z.object({
  objective: z.string().min(1),
  summary: z.string().min(1),
  assumptions: z.array(z.string()),
  steps: z.array(planStepSchema).min(1),
});

export type PlanStep = z.infer<typeof planStepSchema>;

export type PlanOutput = z.infer<typeof planOutputSchema>;
