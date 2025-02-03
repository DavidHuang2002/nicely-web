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


// ------ an example to be displayed in the frontend -----
export const EXAMPLE_SESSION_ID = "example-session-1";

export const EXAMPLE_SESSION_SUMMARY: SessionSummary = {
  id: EXAMPLE_SESSION_ID,
  user_id: "example-user",
  transcription_id: "example-transcription",
  session_date: new Date("2024-03-15"),
  title: "[Example Note] Finding Balance in Life's Transitions",
  one_line_summary: "Exploring strategies to navigate work changes while maintaining emotional well-being",
  full_recap: "In this session, we discussed the challenges of managing a career transition while maintaining self-care routines. We explored how past experiences with change have shaped current coping mechanisms and identified new strategies for building resilience.",
  
  therapist_insights: [
    {
      summary: "Change triggers old patterns of self-doubt",
      excerpt: "Therapist: 'Notice how these moments of transition tend to activate your inner critic. This awareness can be a powerful tool for self-compassion.'"
    },
    {
      summary: "Strong foundation in self-awareness",
      excerpt: "Therapist: 'Your ability to recognize when you're overwhelmed before it becomes overwhelming shows how far you've come in understanding yourself.'"
    }
  ],
  
  client_learnings: [
    {
      summary: "Perfectionism isn't serving my growth",
      excerpt: "Client: 'I realized I've been setting impossible standards for myself during this transition, when what I really need is patience and understanding.'"
    },
    {
      summary: "Small steps lead to big changes",
      excerpt: "Client: 'Breaking down the transition into smaller steps makes it feel less overwhelming. I can focus on one day at a time.'"
    }
  ],
  
  recommendations: [
    {
      summary: "Practice daily mindfulness check-ins",
      excerpt: "Therapist: 'Try taking 5 minutes each morning to check in with yourself. How are you feeling about the day ahead? What support do you need?'"
    },
    {
      summary: "Journal about wins, no matter how small",
      excerpt: "Client: 'I'll start noting down small achievements to remind myself that progress isn't always visible in big moments.'"
    }
  ],
  
  created_at: new Date("2024-03-15T10:00:00Z"),
  updated_at: new Date("2024-03-15T10:00:00Z")
};