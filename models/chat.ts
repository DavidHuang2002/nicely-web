import { z } from "zod";
import { DatabaseMessageSchema } from "./message";

export const ChatTypeEnum = z.enum(["untangle", "self_care", "session_notes"]);

export const ChatSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  type: ChatTypeEnum,
  title: z.string().optional(),
  messages: z.array(DatabaseMessageSchema).optional(),
  is_archived: z.boolean().default(false),
  created_at: z.date().default(() => new Date()),
  updated_at: z.date().default(() => new Date()),
});

export type Chat = z.infer<typeof ChatSchema>;
