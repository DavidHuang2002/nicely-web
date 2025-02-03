import { Message } from "ai";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { DatabaseMessage } from "@/models/message";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateUUID(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function sanitizeUIMessages(messages: Array<Message>): Array<Message> {
  const messagesBySanitizedToolInvocations = messages.map((message) => {
    if (message.role !== "assistant") return message;

    if (!message.toolInvocations) return message;

    const toolResultIds: Array<string> = [];

    for (const toolInvocation of message.toolInvocations) {
      if (toolInvocation.state === "result") {
        toolResultIds.push(toolInvocation.toolCallId);
      }
    }

    const sanitizedToolInvocations = message.toolInvocations.filter(
      (toolInvocation) =>
        toolInvocation.state === "result" ||
        toolResultIds.includes(toolInvocation.toolCallId)
    );

    return {
      ...message,
      toolInvocations: sanitizedToolInvocations,
    };
  });

  return messagesBySanitizedToolInvocations.filter(
    (message) =>
      message.content.length > 0 ||
      (message.toolInvocations && message.toolInvocations.length > 0)
  );
}

export function createAIMessage(
  content: string,
  role: "assistant" | "user"
): Message {
  return {
    id: generateUUID(),
    role,
    content,
  };
}

export function convertDbMessageToAiMessage(
  dbMessage: DatabaseMessage
): Message {
  return {
    id: dbMessage.id,
    content: dbMessage.content as string,
    role: dbMessage.role as "assistant" | "user",
    createdAt: dbMessage.created_at,
    // TODO: figure the type of toolInvocations and fix it when necessary
    toolInvocations: (dbMessage.toolInvocations as any[]) || undefined,
  };
}

export function convertDbMessagesToAiMessages(
  dbMessages: DatabaseMessage[]
): Message[] {
  return dbMessages.map(convertDbMessageToAiMessage);
}

export function estimateProcessingTime(audioDurationInSeconds: number): number {
  // Fixed cost of 3 minutes (180 seconds)
  const fixedCost = 180;
  
  // Variable cost: 0.5x the audio duration
  const variableCost = audioDurationInSeconds * 0.1;
  
  // Total time in seconds
  const totalSeconds = fixedCost + variableCost;
  
  // Round up to nearest 5 minutes
  const totalMinutes = Math.ceil(totalSeconds / 60);
  return Math.ceil(totalMinutes / 5) * 5;
}
