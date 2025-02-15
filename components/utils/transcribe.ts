import { convertWavToMp3 } from "@/lib/utils";

export async function transcribeAudioBlob(
  blob: Blob,
  currentInput: string = ""
): Promise<string> {
  try {
    // Convert WAV to MP3 before sending
    const mp3Blob = await convertWavToMp3(blob);
    const file = new File([mp3Blob], "recording.mp3", { type: "audio/mp3" });

    const formData = new FormData();
    formData.append("audio", file);

    const response = await fetch("/api/transcribe/direct", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Direct transcription failed");
    }

    const { text } = await response.json();
    return currentInput + (currentInput ? " " : "") + text;
  } catch (error) {
    console.error("Error processing audio:", error);
    throw error;
  }
}
