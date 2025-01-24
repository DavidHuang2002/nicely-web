import { openai } from "@ai-sdk/openai";
import OpenAI from "openai"

const openAIClient = new OpenAI();

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const audio = formData.get("audio") as File;

    if (!audio) {
      return new Response("No file provided", { status: 400 });
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