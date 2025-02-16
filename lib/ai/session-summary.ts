import { generateObject } from "ai";
import { openai } from "@ai-sdk/openai";
import { 
  GeneratedSessionSummarySchema, 
  type GeneratedSessionSummary,
  type SessionSummary
} from "@/models/session-summary";
import { createSessionSummary, createVoiceNote, getSessionSummaryById, getVoiceNoteById } from "@/lib/database/supabase";
import { makeSessionSummaryPrompt } from "./prompts";
import { mergeSummaries, splitTextIntoChunks } from "./utils";
import { deleteTranscriptionFromS3 } from "../aws/s3";
import { 
  deleteSessionSummaryInDB, 
  archiveTranscription,
  getTranscriptionById 
} from "../database/supabase";

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

export async function deleteSessionSummary(sessionId: string): Promise<void> {
  try {
    // First get the session summary to check if it has a transcription
    const sessionSummary = await getSessionSummaryById(sessionId);
    if (!sessionSummary) {
      throw new Error("Session summary not found");
    }

    // If there's a transcription, delete it and its S3 file
    if (sessionSummary.transcription_id) {
      const transcription = await getTranscriptionById(sessionSummary.transcription_id);
      
      if (transcription) {
        // Delete the S3 file if it exists
        if (transcription.s3_key) {
          await deleteTranscriptionFromS3(transcription.s3_key);
        }
        
        // Delete the transcription record
        await archiveTranscription(transcription.id);
      }
    }

    // Finally delete the session summary
    await deleteSessionSummaryInDB(sessionId);
  } catch (error) {
    console.error("Error in deleteSessionSummary:", error);
    throw error;
  }
}

export async function regenerateSessionSummary(sessionId: string): Promise<SessionSummary> {
  try {
    // Get existing session summary
    const existingSessionSummary = await getSessionSummaryById(sessionId);
    if (!existingSessionSummary) {
      throw new Error("Session summary not found");
    }

    let newSummary: SessionSummary;

    // Handle transcription-based summary
    if (existingSessionSummary.transcription_id) {
      const transcription = await getTranscriptionById(existingSessionSummary.transcription_id);
      if (!transcription?.transcription_text) {
        throw new Error("Original transcription text not found");
      }

      newSummary = await summarizeFromTranscript(
        transcription.transcription_text,
        transcription.id,
        existingSessionSummary.user_id
      );
    } 
    // Handle voice note-based summary
    else if (existingSessionSummary.voice_note_id) {
      const voiceNote = await getVoiceNoteById(existingSessionSummary.voice_note_id);
      if (!voiceNote?.text) {
        throw new Error("Original voice note text not found");
      }

      newSummary = await summarizeFromVoiceNote(
        voiceNote.text,
        voiceNote.id,
        existingSessionSummary.user_id
      );
    } else {
      throw new Error("Session summary has no associated transcription or voice note");
    }

    // Delete the old summary
    await deleteSessionSummaryInDB(sessionId);

    return newSummary;
  } catch (error) {
    console.error("Error in regenerateSessionSummary:", error);
    throw error;
  }
}