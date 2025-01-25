import { z } from "zod";

export const MessageRoleEnum = z.enum(["user", "assistant", "system", "tool"]);

export const ToolInvocationSchema = z.object({
  toolName: z.string(),
  toolCallId: z.string(),
  state: z.enum(["start", "result"]),
  args: z.record(z.any()).optional(),
  result: z.any().optional(),
});

export const MessageSchema = z.object({
  id: z.string().uuid(),
  role: MessageRoleEnum,
  content: z.union([z.string(), z.record(z.any())]),
  toolInvocations: z.array(ToolInvocationSchema).optional(),
  // metadata is used to store additional information about the message
  metadata: z.record(z.any()).optional(),
  created_at: z.date().default(() => new Date()),
  promptTokens: z.number().optional(),
  completionTokens: z.number().optional(),
  totalTokens: z.number().optional(),
});

export type Message = z.infer<typeof MessageSchema>;
export type ToolInvocation = z.infer<typeof ToolInvocationSchema>;
