import { z } from "zod";

export const MessageRoleEnum = z.enum(["user", "assistant", "system", "data"]);

export const ToolInvocationSchema = z.object({
  toolName: z.string(),
  toolCallId: z.string(),
  state: z.string(),
  args: z.record(z.any()).optional(),
  result: z.any().optional(),
});

export const DatabaseMessageSchema = z.object({
  id: z.string().uuid(),
  role: MessageRoleEnum,
  content: z.union([z.string(), z.record(z.any())]),
  toolInvocations: z.array(ToolInvocationSchema).optional(),
  // metadata is used to store additional information about the message
  metadata: z.record(z.any()).optional(),
  created_at: z.date().default(() => new Date()).optional(),
  promptTokens: z.number().optional(),
  completionTokens: z.number().optional(),
  totalTokens: z.number().optional(),
});

export type DatabaseMessage = z.infer<typeof DatabaseMessageSchema>;
export type ToolInvocation = z.infer<typeof ToolInvocationSchema>;
