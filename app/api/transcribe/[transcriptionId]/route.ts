// app/api/transcriptions/[transcriptionId]/route.ts
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { getTranscriptionById, updateTranscriptionStatus } from "@/lib/database/supabase";
import { formatTranscriptionText, getTranscriptionStatus } from "@/lib/aws/transcribe";
import { GetTranscriptionJobCommandOutput } from "@aws-sdk/client-transcribe";
import { extractAndStoreSummary } from "@/lib/ai/session-summary";



export async function GET(
  req: Request,
  { params }: { params: Promise<{ transcriptionId: string }> }
) {
  try {
    const transcriptionId = (await params).transcriptionId;
    
    const user = await currentUser();
    if (!user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const transcription = await getTranscriptionById(transcriptionId);
    
    if (!transcription) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    console.log("check transcription status - transcription: ", transcription.transcription_job_name);

    // If still processing, check AWS status
    if (transcription.status === "transcribing" && transcription.transcription_job_name) {
      const awsStatus = await getTranscriptionStatus(transcription.transcription_job_name);

      if (!awsStatus) {
        return NextResponse.json({ error: "Failed to get transcription status" }, { status: 500 });
      }
      
      if (awsStatus.TranscriptionJobStatus === "COMPLETED") {
        // Get the transcription URI
        const transcriptFileUri = awsStatus.Transcript?.TranscriptFileUri;
        console.log("check transcription status - completed: Found transcript file URI: ", transcriptFileUri);
        
        if (transcriptFileUri) {
          // Format the transcription text
          const formattedText = await formatTranscriptionText(transcriptFileUri);
          
          console.log("check transcription status - completed: Formatted text: ", formattedText);

          // Update transcription status
          await updateTranscriptionStatus(transcription.id, {
            status: "extracting_summary",
            transcription_text: formattedText,
          });

          // Extract and store session summary
          const sessionSummary = await extractAndStoreSummary(
            formattedText,
            transcription.id,
            transcription.user_id
          );

          // Update transcription status
          await updateTranscriptionStatus(transcription.id, {
            status: "completed",
          });
          
          transcription.status = "completed";
          transcription.transcription_text = formattedText;

          return NextResponse.json({
            status: transcription.status,
            sessionSummaryId: sessionSummary.id,
          }); 
        }
      } else if (awsStatus.TranscriptionJobStatus === "FAILED") {
        await updateTranscriptionStatus(transcription.id, {
          status: "failed"
        });
        transcription.status = "failed";
      }
    }

    return NextResponse.json({
      status: transcription.status,
    });
  } catch (error) {
    console.error("Error checking transcription status:", error);
    return NextResponse.json(
      { error: "Failed to check status" },
      { status: 500 }
    );
  }
}