import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { getUserSessionSummaries, getUser } from "@/lib/database/supabase";

export async function GET() {
  try {
    const clerkUser = await currentUser();
    
    if (!clerkUser) {
      return new Response("Unauthorized", { status: 401 });
    }

    const user = await getUser(clerkUser.id);

    if (!user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const sessionSummaries = await getUserSessionSummaries(user.id!);
    
    return NextResponse.json(sessionSummaries);
  } catch (error) {
    console.error("Error fetching session summaries:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
} 