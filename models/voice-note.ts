import { z } from "zod";

// Base schema with common fields
const VoiceNoteBaseSchema = z.object({
  user_id: z.string().uuid(),
  text: z.string(),
});

// Schema for creating a new voice note
export const CreateVoiceNoteSchema = VoiceNoteBaseSchema;

// Full schema including database-generated fields
export const VoiceNoteSchema = VoiceNoteBaseSchema.extend({
  id: z.string().uuid(),
  created_at: z.string().or(z.date()).transform((val) => new Date(val)),
  updated_at: z.string().or(z.date()).transform((val) => new Date(val)),
});

// Type inference
export type CreateVoiceNote = z.infer<typeof CreateVoiceNoteSchema>;
export type VoiceNote = z.infer<typeof VoiceNoteSchema>;
