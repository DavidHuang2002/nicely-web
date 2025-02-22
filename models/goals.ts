import { z } from "zod";
export const AiRecommendationItemSchema = z.object({
  title: z.string().min(1).max(100),
  description: z.string().min(1).max(1000),
});

// Schema for challenges that can be AI-generated
const ChallengeBaseSchema = z.object({
  title: z.string().min(1).max(100),
  description: z.string().min(1).max(500),
  how_to: z.string().min(1).max(1000),
  reason: z.string().min(1).max(500),
  benefits: z.string().min(1).max(500),
});

// Schema for AI to generate challenges
export const GeneratedChallengeSchema = ChallengeBaseSchema;

// Full challenge schema including database fields
export const ChallengeSchema = ChallengeBaseSchema.extend({
  id: z.string().uuid(),
  goal_id: z.string().uuid(),
  created_at: z.string().or(z.date()).transform((val) => new Date(val)),
  updated_at: z.string().or(z.date()).transform((val) => new Date(val)),
});

// Base goal schema
const GoalBaseSchema = AiRecommendationItemSchema.extend({
  user_id: z.string().uuid(),
  streak: z.number().default(0),
  last_completion_date: z.string().or(z.date()).nullable().optional(),
  session_note_id: z.string().uuid().nullable().optional(),
});

// Full goal schema including database fields
export const GoalSchema = GoalBaseSchema.extend({
  id: z.string().uuid(),
  created_at: z.string().or(z.date()).transform((val) => new Date(val)),
  updated_at: z.string().or(z.date()).transform((val) => new Date(val)),
});

// Simple schema for challenge completion tracking
export const ChallengeCompletionSchema = z.object({
  id: z.string().uuid(),
  challenge_id: z.string().uuid(),
  user_id: z.string().uuid(),
  completed_at: z.string().or(z.date()).transform((val) => new Date(val)),
});

// Type exports
export type GeneratedChallenge = z.infer<typeof GeneratedChallengeSchema>;
export type Challenge = z.infer<typeof ChallengeSchema>;
export type Goal = z.infer<typeof GoalSchema>;
export type ChallengeCompletion = z.infer<typeof ChallengeCompletionSchema>; 
export type AiRecommendationItem = z.infer<typeof AiRecommendationItemSchema>;

export const GeneratedChallengesArraySchema = z.array(GeneratedChallengeSchema);
export type GeneratedChallengesArray = z.infer<typeof GeneratedChallengesArraySchema>;