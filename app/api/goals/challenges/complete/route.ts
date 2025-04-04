import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { getUserOrThrow } from "@/lib/database/supabase";
import { modifyChallenge } from "@/lib/database/supabase";

export async function POST(req: Request) {
  try {
    // Get the authenticated user
    const clerkUser = await currentUser();
    if (!clerkUser) {
      return new Response("Unauthorized", { status: 401 });
    }

    // Get the user from our database
    const user = await getUserOrThrow(clerkUser.id);
    
    // Get the request body
    const { challengeId, last_completion_date } = await req.json();
    
    // Validate required fields
    if (!challengeId) {
      return NextResponse.json(
        { error: "Challenge ID is required" },
        { status: 400 }
      );
    }

    // Update the challenge in Supabase
    await modifyChallenge(challengeId, user.id!, {
      last_completion_date
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating challenge:", error);
    return NextResponse.json(
      { error: "Failed to update challenge" },
      { status: 500 }
    );
  }
} 