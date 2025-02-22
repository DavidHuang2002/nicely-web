import { GetObjectCommand } from "@aws-sdk/client-s3";
import { deleteFileFromS3 } from "@/lib/aws/s3";
import { transcribeFromS3 } from "@/lib/services/transcription";

export async function POST(req: Request) {
  try {
    const { s3Key } = await req.json();
    
    // Use the helper function that handles File creation
    const text = await transcribeFromS3(s3Key);

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