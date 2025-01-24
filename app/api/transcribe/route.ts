import { openai } from "@ai-sdk/openai";
import OpenAI from "openai";

const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25MB in bytes
const openAIClient = new OpenAI();

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const audio = formData.get("audio") as File;

    if (!audio) {
      return new Response("No file provided", { status: 400 });
    }

    // Check file size
    if (audio.size > MAX_FILE_SIZE) {
      return new Response(
        JSON.stringify({
          error: "File size exceeds limit",
          message: "Audio file must be less than 25MB",
        }),
        {
          status: 413,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const transcription = await openAIClient.audio.transcriptions.create({
      file: audio,
      model: "whisper-1",
    });

    return new Response(JSON.stringify({ text: transcription.text }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Transcription error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to transcribe audio" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
