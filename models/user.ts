import { z } from "zod";

export const TherapyFrequencyEnum = z.enum([
  "weekly",
  "biweekly",
  "monthly",
  "other",
]);

export const UserSchema = z.object({
  id: z.string().uuid().optional(),
  clerk_id: z.string(),
  preferred_name: z.string().nullable().optional(),
  therapy_frequency: TherapyFrequencyEnum.nullable().optional(),
  onboarding_completed: z.boolean().default(false),
  created_at: z.date().optional(),
  updated_at: z.date().optional(),
});

export type User = z.infer<typeof UserSchema>;
