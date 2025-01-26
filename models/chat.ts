import { z } from "zod";
import { DatabaseMessageSchema } from "./message";

export const ChatTypeEnum = z.enum([
  "untangle",
  "self_care",
  "session_notes",
  "onboarding",
]);

export const ChatSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  type: ChatTypeEnum,
  title: z.string().optional(),
  messages: z.array(DatabaseMessageSchema).optional(),
  is_archived: z.boolean().default(false),
  created_at: z.date().default(() => new Date()).optional(),
  updated_at: z.date().default(() => new Date()).optional(),
});

export type Chat = z.infer<typeof ChatSchema>;
