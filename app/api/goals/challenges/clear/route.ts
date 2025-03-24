import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { getUserOrThrow } from "@/lib/database/supabase";
import { modifyChallenge } from "@/lib/database/supabase";

export async function POST(req: Request) {
  try {
    const clerkUser = await currentUser();
    if (!clerkUser) {
      return new Response("Unauthorized", { status: 401 });
    }

    const user = await getUserOrThrow(clerkUser.id);
    
    const { challengeId } = await req.json();
    
    if (!challengeId) {
      return NextResponse.json(
        { error: "Challenge ID is required" },
        { status: 400 }
      );
    }

    // Clear the completion date by setting it to null
    await modifyChallenge(challengeId, user.id!, {
      last_completion_date: null
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error clearing challenge completion:", error);
    return NextResponse.json(
      { error: "Failed to clear challenge completion" },
      { status: 500 }
    );
  }
} 