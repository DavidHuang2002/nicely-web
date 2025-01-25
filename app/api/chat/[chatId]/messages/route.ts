import { NextResponse } from "next/server";
import { getChatMessages, getUser } from "@/lib/database/supabase";
import { currentUser } from "@clerk/nextjs/server";
import { convertDbMessagesToAiMessages } from "@/lib/utils";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ chatId: string }> }
) {
  const chatId = (await params).chatId;

  const clerkUser = await currentUser();
  if (!clerkUser) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  // get userId from user
  const user = await getUser(clerkUser.id);
  if (!user) {
    return new NextResponse("User not found", { status: 404 });
  }

  const userId = user.id!;

  try {
    const dbMessages = await getChatMessages(chatId, userId);
    const aiMessages = convertDbMessagesToAiMessages(dbMessages);
    return NextResponse.json(aiMessages);
  } catch (error) {
    console.error("Error fetching chat messages:", error);
    return new NextResponse("Failed to fetch chat messages", { status: 500 });
  }
}
