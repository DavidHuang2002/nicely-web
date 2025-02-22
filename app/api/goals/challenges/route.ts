import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { getUserOrThrow } from "@/lib/database/supabase";
import { generateChallengesForGoal } from "@/lib/services/goals";

export async function POST(req: Request) {
  try {
    const clerkUser = await currentUser();
    if (!clerkUser) {
      return new Response("Unauthorized", { status: 401 });
    }

    const user = await getUserOrThrow(clerkUser.id);
    
    const { title, description, sessionId } = await req.json();
    if (!title || !description || !sessionId) {
      return NextResponse.json(
        { error: "Title, description, and sessionId are required" },
        { status: 400 }
      );
    }

    const challenges = await generateChallengesForGoal(title, description, sessionId);

    return NextResponse.json(challenges);
  } catch (error) {
    console.error("Error generating challenges:", error);
    return NextResponse.json(
      { error: "Failed to generate challenges" },
      { status: 500 }
    );
  }
} 