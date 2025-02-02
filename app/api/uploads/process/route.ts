import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { startTranscriptionJob } from "@/lib/aws/transcribe";
import {
  createTranscriptionRecord,
  updateTranscriptionStatus,
} from "@/lib/database/supabase";

export async function POST(req: Request) {
  try {
    const user = await currentUser();
    if (!user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const { s3Key } = await req.json();

    // Create a record in the database for tracking
    const transcriptionRecord = await createTranscriptionRecord({
      userId: user.id,
      s3Key,
      status: "processing",
    });

    // Start AWS transcription job
    const jobName = await startTranscriptionJob(s3Key, user.id);

    // Update the record with the job name
    await updateTranscriptionStatus(transcriptionRecord.id, {
      transcription_job_name: jobName,
      status: "transcribing",
    });

    return NextResponse.json({
      message: "Transcription started",
      transcriptionId: transcriptionRecord.id,
    });
  } catch (error) {
    console.error("Error processing upload:", error);
    return NextResponse.json(
      { error: "Failed to process upload" },
      { status: 500 }
    );
  }
}
