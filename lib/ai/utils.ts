import { Message } from "ai";
import { openai } from "@ai-sdk/openai";
import {
  GeneratedSessionSummarySchema,
  type GeneratedSessionSummary,
} from "@/models/session-summary";
import { generateObject } from "ai";

export const convertMessagesToStr = (messages: Message[]) => {
  return messages
    .map((msg) => `${msg.role}: ${msg.content}`)
    .join("\n");
};

export function splitTextIntoChunks(text: string, maxChunkSize: number): string[] {
  const chunks: string[] = [];
  const sentences = text.split(/(?<=[.!?])\s+/);
  let currentChunk = '';

  for (const sentence of sentences) {
    if ((currentChunk + sentence).length > maxChunkSize) {
      if (currentChunk) chunks.push(currentChunk.trim());
      currentChunk = sentence;
    } else {
      currentChunk += (currentChunk ? ' ' : '') + sentence;
    }
  }

  console.log("split into ", chunks.length, " chunks");

  if (currentChunk) chunks.push(currentChunk.trim());
  return chunks;
}

export async function mergeSummaries(summaries: GeneratedSessionSummary[]): Promise<GeneratedSessionSummary> {
  const mergePrompt = `Combine these session summaries into a single coherent summary, maintaining the most important insights and removing duplicates:

    ${JSON.stringify(summaries, null, 2)}`;

  const { object: mergedSummary } = await generateObject({
    model: openai("gpt-4o"),
    schema: GeneratedSessionSummarySchema,
    prompt: mergePrompt,
  });

  return mergedSummary;
}

  