import { currentUser } from "@clerk/nextjs/server";
import {
  createChatWithInitialMessages,
  getOnboardingChatOrNullIfNonExistent,
  getUser,
} from "@/lib/database/supabase";
import { NextResponse } from "next/server";
import { getAIChatMessages } from "@/lib/ai/chat";
import { onboardingOpenner } from "@/lib/ai/prompts";
import { createAIMessage, generateUUID } from "@/lib/utils";
import { DatabaseMessage } from "@/models/message";

export async function GET(req: Request) {
  const clerkUser = await currentUser();
  if (!clerkUser) {
    return new Response("Unauthorized", { status: 401 });
  }

  const user = await getUser(clerkUser.id);

  try {
    const existingChats = await getOnboardingChatOrNullIfNonExistent(user!.id!);

    if (!existingChats) {
      return NextResponse.json({ exists: false });
    }

    // Get messages from the existing chat
    const messages = await getAIChatMessages(existingChats.id, user!.id!);

    return NextResponse.json({
      exists: true,
      chatId: existingChats.id,
      messages: messages,
    });
  } catch (error) {
    console.error("Error managing onboarding chat:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}

export async function POST(req: Request) {
  const clerkUser = await currentUser();
  if (!clerkUser) {
    return new Response("Unauthorized", { status: 401 });
  }

  const user = await getUser(clerkUser.id);
  if (!user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const onboardingOpennerMessage = createAIMessage(
    onboardingOpenner,
    "assistant"
  );

  const initialMessages = [onboardingOpennerMessage];

  try {
    const chatId = generateUUID();
    // Create new onboarding chat with initial message
    await createChatWithInitialMessages(
      user.id!,
      chatId,
      "onboarding",
      initialMessages
    );

    return NextResponse.json({
      chatId,
      messages: initialMessages,
    });
  } catch (error) {
    console.error("Error creating onboarding chat:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
