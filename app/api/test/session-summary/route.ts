import { NextResponse } from "next/server";
import { extractAndStoreSummary } from "@/lib/ai/session-summary";
const SAMPLE_TRANSCRIPT = "sample here"
export async function GET() {
  try {
    const sessionSummary = await extractAndStoreSummary(
      SAMPLE_TRANSCRIPT,
      "test-transcription-id",
      "test-user-id"
    );

    return NextResponse.json({
      success: true,
      data: sessionSummary
    });

  } catch (error) {
    console.error("Error testing session summary:", error);
    return NextResponse.json(
      { 
        error: "Failed to generate session summary",
        details: error instanceof Error ? error.message : "Unknown error"
      }, 
      { status: 500 }
    );
  }
} 