import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { getUserOrThrow } from "@/lib/database/supabase";
import { saveGoalWithChallenges } from "@/lib/services/goals";

export async function POST(req: Request) {
  try {
    const clerkUser = await currentUser();
    if (!clerkUser) {
      return new Response("Unauthorized", { status: 401 });
    }

    const user = await getUserOrThrow(clerkUser.id);
    
    const { title, description, sessionId, challenges } = await req.json();
    
    if (!title || !description || !sessionId || !challenges) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const result = await saveGoalWithChallenges({
      title,
      description,
      sessionId,
      challenges,
      userId: user.id!,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error saving goal:", error);
    return NextResponse.json(
      { error: "Failed to save goal" },
      { status: 500 }
    );
  }
} 