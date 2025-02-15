import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { getUserSessionSummaries, getUserOrThrow } from "@/lib/database/supabase";
import { processVoiceNote } from "@/lib/ai/session-summary";

export async function GET() {
  try {
    const clerkUser = await currentUser();
    
    if (!clerkUser) {
      return new Response("Unauthorized", { status: 401 });
    }

    const user = await getUserOrThrow(clerkUser.id);

    const sessionSummaries = await getUserSessionSummaries(user.id!);
    
    return NextResponse.json(sessionSummaries);
  } catch (error) {
    console.error("Error fetching session summaries:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
} 

export async function POST(req: Request) {
  try {
    const clerkUser = await currentUser();
    if (!clerkUser) {
      return new Response("Unauthorized", { status: 401 });
    }

    // get user
    const user = await getUserOrThrow(clerkUser.id);
    
    const { text } = await req.json();
    if (!text) {
      return NextResponse.json(
        { error: "Text is required" },
        { status: 400 }
      );
    }

    const sessionSummary = await processVoiceNote(text, user.id!);

    return NextResponse.json({
      success: true,
      sessionSummaryId: sessionSummary.id,
    });
  } catch (error) {
    console.error("Error processing voice note:", error);
    return NextResponse.json(
      { error: "Failed to process voice note" },
      { status: 500 }
    );
  }
} 