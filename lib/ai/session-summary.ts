import { generateObject } from "ai";
import { openai } from "@ai-sdk/openai";
import { 
  GeneratedSessionSummarySchema, 
  type GeneratedSessionSummary,
  type SessionSummary
} from "@/models/session-summary";
import { createSessionSummary, createVoiceNote } from "@/lib/database/supabase";
import { makeSessionSummaryPrompt } from "./prompts";
import { mergeSummaries, splitTextIntoChunks } from "./utils";

// chunkszie in characters for summarizing from long transcripts
const CHUNK_SIZE = 10000;
export const getCommonMetaData = (userId: string): { user_id: string; session_date: Date } => {
  return {
    user_id: userId,
    session_date: new Date(),
  };
}



export async function summarizeFromTranscript(
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
      const generatedSummary = await generateSummary(chunk, false);

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
      ...getCommonMetaData(userId),
      transcription_id: transcriptionId,
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

export async function summarizeFromVoiceNote(
  voiceNoteText: string,
  voiceNoteId: string,
  userId: string
): Promise<SessionSummary> {
  const generatedSummary = await generateSummary(voiceNoteText, true);

  const summaryWithMetadata = {
    ...generatedSummary,
    ...getCommonMetaData(userId),
    voice_note_id: voiceNoteId,
  };

  const sessionSummary = await createSessionSummary(summaryWithMetadata);
  console.log(`Successfully processed session summary for voice note ${voiceNoteId}`);
  return sessionSummary;
} 

export async function generateSummary(
  text: string,
  isVoiceNote: boolean,
): Promise<GeneratedSessionSummary> {
  const prompt = makeSessionSummaryPrompt(text, isVoiceNote);

  const { object: generatedSummary } = await generateObject({
    model: openai("gpt-4o"),
    schema: GeneratedSessionSummarySchema,
    prompt,
  });

  return generatedSummary;
}

// save the voice note to the database and then summarize it
export async function processVoiceNote(
  voiceNoteText: string,
  userId: string
): Promise<SessionSummary> {
  const voiceNote = await createVoiceNote({
    text: voiceNoteText,
    user_id: userId,
  });

  return summarizeFromVoiceNote(voiceNoteText, voiceNote.id, userId);
}