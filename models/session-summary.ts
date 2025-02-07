import { z } from "zod";

// Schema for individual insight/learning items
const InsightItemSchema = z.object({
  summary: z.string().min(1).max(500),
  detail: z.string(),
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

// Type inference for the session summary
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
      detail: "The client's response to transition reveals a deeply ingrained pattern where uncertainty activates their inner critic. This pattern likely developed as a protective mechanism during earlier life experiences where change led to negative outcomes. The self-doubt serves as both a shield against potential disappointment and a familiar lens through which to view new challenges. Breaking this pattern requires recognizing these moments of transition as opportunities to practice self-trust rather than defaulting to self-criticism.",
      excerpt: "Therapist: 'Notice how these moments of transition tend to activate your inner critic. This awareness can be a powerful tool for self-compassion.'"
    },
    {
      summary: "Strong foundation in self-awareness",
      detail: "The client demonstrates advanced emotional intelligence in their ability to detect stress responses before they become overwhelming. This skill indicates significant progress in interoceptive awareness and emotional regulation. Their capacity to identify emotional states early provides a crucial window for intervention and self-regulation, representing a fundamental shift from reactive to proactive emotional management. This strength can be leveraged to build greater resilience in other areas of their life.",
      excerpt: "Therapist: 'Your ability to recognize when you're overwhelmed before it becomes overwhelming shows how far you've come in understanding yourself.'"
    }
  ],
  
  client_learnings: [
    {
      summary: "Perfectionism isn't serving my growth",
      detail: "The realization that perfectionism acts as a barrier to authentic growth marks a pivotal shift in self-understanding. This perfectionist tendency stems from equating personal worth with achievement, creating an unsustainable cycle of exhaustion and self-judgment. The insight that growth requires embracing imperfection and vulnerability opens new possibilities for self-acceptance and more sustainable personal development practices.",
      excerpt: "Client: 'I realized I've been setting impossible standards for myself during this transition, when what I really need is patience and understanding.'"
    },
    {
      summary: "Small steps lead to big changes",
      detail: "Breaking down overwhelming challenges into manageable steps represents a fundamental shift from all-or-nothing thinking to a more sustainable approach to change. This strategy not only makes progress more achievable but also builds self-efficacy through consistent small wins. The focus on incremental progress helps maintain momentum while reducing the anxiety associated with large-scale changes.",
      excerpt: "Client: 'Breaking down the transition into smaller steps makes it feel less overwhelming. I can focus on one day at a time.'"
    }
  ],
  
  recommendations: [
    {
      summary: "Practice daily mindfulness check-ins",
      detail: "Morning mindfulness check-ins serve multiple therapeutic purposes: they establish a proactive approach to emotional regulation, create space for intentional self-reflection, and build self-trust through consistent self-attention. This practice helps identify emotional patterns early, allowing for more effective intervention before stress accumulates. The timing is crucial as morning check-ins set an intentional tone for the day and establish a foundation of self-awareness.",
      excerpt: "Therapist: 'Try taking 5 minutes each morning to check in with yourself. How are you feeling about the day ahead? What support do you need?'"
    },
    {
      summary: "Journal about wins, no matter how small",
      detail: "Documenting small achievements counteracts the brain's negativity bias and builds evidence against self-critical beliefs. This practice rewires neural pathways to better recognize and reinforce progress, shifting focus from perceived failures to actual growth. Regular acknowledgment of small wins builds resilience by creating a more balanced narrative of personal capability and progress, especially valuable during periods of significant change.",
      excerpt: "Client: 'I'll start noting down small achievements to remind myself that progress isn't always visible in big moments.'"
    }
  ],
  
  created_at: new Date("2024-03-15T10:00:00Z"),
  updated_at: new Date("2024-03-15T10:00:00Z")
};