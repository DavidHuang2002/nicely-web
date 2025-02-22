import { convertWavToMp3 } from "@/lib/utils";

export async function transcribeAudioBlob(
  blob: Blob,
  currentInput: string = ""
): Promise<string> {
  try {
    // Convert WAV to MP3 before sending
    const mp3Blob = await convertWavToMp3(blob);
    const file = new File([mp3Blob], "recording.mp3", { type: "audio/mp3" });

    // If file size is under 4.5MB, use direct transcription
    if (file.size <= 4.5 * 1024 * 1024) {
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
    }

    // For larger files, use S3 upload path
    // Get presigned URL
    const presignedRes = await fetch("/api/uploads/presigned", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
      }),
    });

    const { url, key } = await presignedRes.json();

    // Upload to S3
    await fetch(url, {
      method: "PUT",
      body: file,
      headers: { "Content-Type": file.type },
    });

    console.log("transcribeAudioBlob - upload to s3 complete");

    // Trigger transcription
    const transcribeRes = await fetch("/api/transcribe/from-s3", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ s3Key: key }),
    });

    if (!transcribeRes.ok) {
      throw new Error("S3 transcription failed");
    }

    const { text } = await transcribeRes.json();
    return currentInput + (currentInput ? " " : "") + text;
  } catch (error) {
    console.error("Error processing audio:", error);
    throw error;
  }
}
