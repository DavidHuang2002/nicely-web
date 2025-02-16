import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { deleteSessionSummary } from "@/lib/ai/session-summary";
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  const sessionId = (await params).sessionId;

  try {
    const clerkUser = await currentUser();
    if (!clerkUser) {
      return new Response("Unauthorized", { status: 401 });
    }
  
    await deleteSessionSummary(sessionId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting session:", error);
    return NextResponse.json(
      { error: "Failed to delete session" },
      { status: 500 }
    );
  }
} 