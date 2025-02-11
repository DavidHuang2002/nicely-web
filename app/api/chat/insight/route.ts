import { streamText } from "ai";
import { openai } from "@ai-sdk/openai";
import { currentUser } from "@clerk/nextjs/server";
import { makeUntangleSystemPrompt } from "@/lib/ai/RAG";
import { 
  getUserOrThrow, 
  saveMessage, 
  getChat,
  createChatWithInitialMessages,
  getUser 
} from "@/lib/database/supabase";
import { generateUUID } from "@/lib/utils";

export async function POST(req: Request) {
  const { messages, chatId } = await req.json();

  const user = await currentUser();
  const clerkId = user!.id;
  const userFromDb = await getUser(clerkId);

  if (!user || !chatId) {
    return new Response("Unauthorized or missing chatId", { status: 401 });
  }

  if (!userFromDb) {
    return new Response("User not found", { status: 404 });
  }

  const userId = userFromDb.id!;

  try {
    // Check if chat exists and create if it doesn't
    const chat = await getChat(chatId);
    if (!chat) {
      await createChatWithInitialMessages(userId, chatId, "session_notes", messages);
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
    console.error("Error in insight chat:", error);
    return new Response(JSON.stringify({ error: "Failed to process chat" }), {
      status: 500,
    });
  }
} 