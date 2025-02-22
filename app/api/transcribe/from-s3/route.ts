import { GetObjectCommand } from "@aws-sdk/client-s3";
import { deleteFileFromS3, s3Client } from "@/lib/aws/s3";
import { transcribeAudioFile } from "@/lib/services/transcription";

export async function POST(req: Request) {
  try {
    const { s3Key } = await req.json();
    
    // Get file from S3
    const command = new GetObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: s3Key,
    });
    
    const response = await s3Client.send(command);
    const arrayBuffer = await response.Body?.transformToByteArray();
    
    if (!arrayBuffer) {
      throw new Error("Failed to get file from S3");
    }

    // Convert to File object
    const blob = new Blob([arrayBuffer], { type: "audio/mp3" });
    const file = new File([blob], s3Key.split("/").pop() || "audio.mp3", { 
      type: "audio/mp3" 
    });

    // Use existing transcription service
    const text = await transcribeAudioFile(file);

    // Cleanup: Delete file from S3
    await deleteFileFromS3(s3Key);

    return new Response(JSON.stringify({ text }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("S3 transcription error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to transcribe audio from S3" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
} 