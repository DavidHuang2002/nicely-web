import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { getUserOrThrow } from "@/lib/database/supabase";
import { regenerateSessionSummary } from "@/lib/ai/session-summary";

export async function POST(
  req: Request,
  { params }: { params: { sessionId: string } }
) {
  try {
    const clerkUser = await currentUser();
    if (!clerkUser) {
      return new Response("Unauthorized", { status: 401 });
    }

    const newSummary = await regenerateSessionSummary(params.sessionId);

    return NextResponse.json({ 
      success: true,
      sessionSummaryId: newSummary.id 
    });
  } catch (error) {
    console.error("Error regenerating summary:", error);
    return NextResponse.json(
      { error: "Failed to regenerate summary" },
      { status: 500 }
    );
  }
} 