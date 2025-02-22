import { transcribeAudioFile } from "@/lib/services/transcription";

export const maxDuration = 120;

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const audio = formData.get("audio") as File;

    if (!audio) {
      return new Response("No file provided", { status: 400 });
    }

    const text = await transcribeAudioFile(audio);

    return new Response(JSON.stringify({ text }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Direct transcription error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to transcribe audio" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}