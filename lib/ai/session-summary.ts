import { generateObject } from "ai";
import { openai } from "@ai-sdk/openai";
import { 
  GeneratedSessionSummarySchema, 
  type GeneratedSessionSummary,
  type SessionSummary
} from "@/models/session-summary";
import { createSessionSummary } from "@/lib/database/supabase";
import { makeSessionSummaryPrompt } from "./prompts";
import { mergeSummaries, splitTextIntoChunks } from "./utils";

// chunkszie in characters
const CHUNK_SIZE = 10000;
export async function extractAndStoreSummary(
  transcriptionText: string,
  transcriptionId: string,
  userId: string
): Promise<SessionSummary> {
  try {
    // Reduce chunk size to ~10000 characters (roughly 2500 tokens)
    const chunks = splitTextIntoChunks(transcriptionText, CHUNK_SIZE);
    
    // Process each chunk and collect insights
    const chunkSummaries: GeneratedSessionSummary[] = [];
    
    for (const chunk of chunks) {
      const { object: generatedSummary } = await generateObject({
        model: openai("gpt-4o"),
        schema: GeneratedSessionSummarySchema,
        prompt: makeSessionSummaryPrompt(chunk),
      });
      

      console.log("generatedSummary: ", generatedSummary);
      
      chunkSummaries.push(generatedSummary);
      
      // Add a small delay between chunks to respect rate limits
      console.log("sleeping for 1 second");
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    // If we have multiple chunks, merge them
    const finalSummary = chunks.length > 1 
      ? await mergeSummaries(chunkSummaries)
      : chunkSummaries[0];

    // Add required fields for database storage
    const summaryWithMetadata = {
      ...finalSummary,
      user_id: userId,
      transcription_id: transcriptionId,
      session_date: new Date(),
    };
    console.log("summaryWithMetadata: ", summaryWithMetadata);

    // Store in Supabase
    const sessionSummary = await createSessionSummary(summaryWithMetadata);
    console.log(`Successfully processed session summary for transcription ${transcriptionId}`);
    return sessionSummary;
  } catch (error) {
    console.error("Error in extractAndStoreSummary:", error);
    throw error;
  }
}
