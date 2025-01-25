import { streamText, tool } from "ai";
import { openai } from "@ai-sdk/openai";
import { currentUser, User } from "@clerk/nextjs/server";
import {
  addUserIfNotExists,
  getUser,
  updateUser,
  saveMessage,
  createChat,
  getChat,
  createChatWithInitialMessages,
} from "@/lib/database/supabase";
import { generateUUID } from "@/lib/utils";
import { z } from "zod";
import { COMPLETE_ONBOARDING_TOOL_NAME } from "@/models/constants";
import { extractAndStoreInsights } from "@/lib/ai/RAG";
import { therapistPrompt } from "@/lib/ai/prompts";
import { makeUntangleSystemPrompt } from "@/lib/ai/RAG";

// TODO: how to get text as we are streaming and detect if it starts with "[completed]"
export async function POST(req: Request) {
  const { messages, chatId } = await req.json();

  console.log("Processing untangle chat:", chatId);

  const user = await currentUser();
  const clerkId = user!.id;
  // get the user from database
  const userFromDb = await getUser(clerkId);

  if (!user || !chatId) {
    return new Response("Unauthorized or missing chatId", { status: 401 });
  }

  if (!userFromDb) {
    return new Response("User not found", { status: 404 });
  }

  const userId = userFromDb.id!;

  try {
    const chat = await getChat(chatId);
    if (!chat) {
      await createChatWithInitialMessages(userId, chatId, "untangle", messages);
    } else {
      // If chat exists, just save the last message
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.role === "user") {
        await saveMessage(chatId, lastMessage);
      }
    }

    const result = streamText({
      model: openai("gpt-4o"),
      system: await makeUntangleSystemPrompt(messages, userId),
      messages,
      onFinish: async (completion) => {
        await saveMessage(chatId, {
          id: generateUUID(),
          role: "assistant",
          content: completion.text,
          created_at: new Date(),
          promptTokens: completion.usage.promptTokens,
          completionTokens: completion.usage.completionTokens,
          totalTokens: completion.usage.totalTokens,
        });
      },
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error("Error in untangle chat:", error);
    return new Response(JSON.stringify({ error: "Failed to process chat" }), {
      status: 500,
    });
  }
}
