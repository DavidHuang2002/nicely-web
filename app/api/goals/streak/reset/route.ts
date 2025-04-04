import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { getUserOrThrow, resetGoalStreak } from "@/lib/database/supabase";

export async function POST(request: Request) {
  try {
    const clerkUser = await currentUser();
    if (!clerkUser) {
      return new Response("Unauthorized", { status: 401 });
    }

    const user = await getUserOrThrow(clerkUser.id);
    const { goalId } = await request.json();
    
    if (!goalId) {
      return NextResponse.json(
        { error: "Goal ID is required" },
        { status: 400 }
      );
    }

    await resetGoalStreak(goalId, user.id!);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error resetting goal streak:", error);
    return NextResponse.json(
      { error: "Failed to reset goal streak" },
      { status: 500 }
    );
  }
} 