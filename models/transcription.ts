import { z } from "zod";

export const TranscriptionStatusEnum = z.enum([
  "pending",
  "processing",
  "transcribing",
  "completed",
  "failed",
]);

export const TranscriptionSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string(),
  s3_key: z.string(),
  status: TranscriptionStatusEnum,
  transcription_job_name: z.string().optional(),
  transcription_text: z.string().optional(),
  created_at: z.date(),
  updated_at: z.date(),
});

export type Transcription = z.infer<typeof TranscriptionSchema>;
