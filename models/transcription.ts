import { z } from "zod";

export const TranscriptionStatusEnum = z.enum([
  "pending",
  "processing",
  "transcribing",
  "completed",
  "extracting_summary",
  "failed",
]);

// Base schema with common fields
const TranscriptionBaseSchema = z.object({
  user_id: z.string(),
  s3_key: z.string(),
  status: TranscriptionStatusEnum,
  transcription_job_name: z.string().nullable(),
  transcription_text: z.string().nullable(),
});

// Schema for creating a new transcription
export const CreateTranscriptionSchema = TranscriptionBaseSchema;

// Full schema including database-generated fields
export const TranscriptionSchema = TranscriptionBaseSchema.extend({
  id: z.string().uuid(),
  created_at: z.string().or(z.date()).transform((val) => new Date(val)),
  updated_at: z.string().or(z.date()).transform((val) => new Date(val)),
});

// Type inference
export type CreateTranscription = z.infer<typeof CreateTranscriptionSchema>;
export type Transcription = z.infer<typeof TranscriptionSchema>;
