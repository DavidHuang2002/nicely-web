// app/api/transcriptions/[transcriptionId]/route.ts
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { getTranscriptionById, updateTranscriptionStatus } from "@/lib/database/supabase";
import { getTranscriptionStatus } from "@/lib/aws/transcribe";
import { GetTranscriptionJobCommandOutput } from "@aws-sdk/client-transcribe";

export async function GET(
  req: Request,
  { params }: { params: { transcriptionId: string } }
) {
  try {
    const user = await currentUser();
    if (!user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const transcription = await getTranscriptionById(params.transcriptionId);
    if (!transcription) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    // If still processing, check AWS status
    if (transcription.status === "transcribing" && transcription.transcription_job_name) {
      const awsStatus = await getTranscriptionStatus(transcription.transcription_job_name);

      if (!awsStatus) {
        return NextResponse.json({ error: "Failed to get transcription status" }, { status: 500 });
      }
      
      if (awsStatus.TranscriptionJobStatus === "COMPLETED") {
        // Get the transcription text from the output location
        // Update database status
        await updateTranscriptionStatus(transcription.id, {
          status: "completed",
          transcription_text: awsStatus.Transcript?.TranscriptFileUri || "",
        });
        
        transcription.status = "completed";
        transcription.transcription_text = awsStatus.Transcript?.TranscriptFileUri || "";
      } else if (awsStatus.TranscriptionJobStatus === "FAILED") {
        await updateTranscriptionStatus(transcription.id, {
          status: "failed"
        });
        transcription.status = "failed";
      }
    }

    return NextResponse.json(transcription);
  } catch (error) {
    console.error("Error checking transcription status:", error);
    return NextResponse.json(
      { error: "Failed to check status" },
      { status: 500 }
    );
  }
}