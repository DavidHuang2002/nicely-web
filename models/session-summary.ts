import { z } from "zod";

// Schema for individual insight/learning items
const InsightItemSchema = z.object({
  summary: z.string().min(1).max(500),
  excerpt: z.string().min(1).max(1000),
});

// Schema specifically for AI extraction
export const GeneratedSessionSummarySchema = z.object({
  title: z.string().min(1).max(100),
  one_line_summary: z.string().min(1).max(200),
  full_recap: z.string().min(1).max(2000),
  therapist_insights: z.array(InsightItemSchema).min(1).max(5),
  client_learnings: z.array(InsightItemSchema).min(1).max(5),
  recommendations: z.array(InsightItemSchema).min(1).max(5),
});

// Base schema with common fields
const SessionSummaryBaseSchema = GeneratedSessionSummarySchema.extend({
  user_id: z.string().uuid(),
  transcription_id: z.string().uuid(),
  session_date: z.string().or(z.date()).transform((val) => new Date(val)),
});

// Schema for creating a new session summary
export const CreateSessionSummarySchema = SessionSummaryBaseSchema;

// Full schema including database-generated fields
export const SessionSummarySchema = SessionSummaryBaseSchema.extend({
  id: z.string().uuid(),
  created_at: z.string().or(z.date()).transform((val) => new Date(val)),
  updated_at: z.string().or(z.date()).transform((val) => new Date(val)),
});

// Type inference
export type GeneratedSessionSummary = z.infer<typeof GeneratedSessionSummarySchema>;
export type CreateSessionSummary = z.infer<typeof CreateSessionSummarySchema>;
export type SessionSummary = z.infer<typeof SessionSummarySchema>;