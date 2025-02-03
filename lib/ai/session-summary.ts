import { generateObject } from "ai";
import { openai } from "@ai-sdk/openai";
import { 
  GeneratedSessionSummarySchema, 
  type GeneratedSessionSummary,
  type SessionSummary
} from "@/models/session-summary";
import { createSessionSummary } from "@/lib/database/supabase";
import { makeSessionSummaryPrompt } from "./prompts";

export async function extractAndStoreSummary(
  transcriptionText: string,
  transcriptionId: string,
  userId: string
): Promise<SessionSummary> {
  try {
    // Generate session summary using the OpenAI
    const { object: generatedSummary }: { object: GeneratedSessionSummary } =
      await generateObject({
        model: openai("gpt-4"),
        schema: GeneratedSessionSummarySchema,
        prompt: makeSessionSummaryPrompt(transcriptionText),
      });

    // Add required fields for database storage
    const summaryWithMetadata = {
      ...generatedSummary,
      user_id: userId,
      transcription_id: transcriptionId,
    };

    // Store in Supabase
    const sessionSummary = await createSessionSummary(summaryWithMetadata);

    console.log(`Successfully processed session summary for transcription ${transcriptionId}`);

    return sessionSummary;
  } catch (error) {
    console.error("Error in extractAndStoreSummary:", error);
    throw error;
  }
}
