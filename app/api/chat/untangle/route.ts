import { streamText, tool } from "ai";
import { openai } from "@ai-sdk/openai";
import { currentUser, User } from "@clerk/nextjs/server";
import {
  addUserIfNotExists,
  getUser,
  updateUser,
} from "@/lib/database/supabase";
import { z } from "zod";
import { COMPLETE_ONBOARDING_TOOL_NAME } from "@/models/constants";
import { extractAndStoreInsights } from "@/lib/ai/RAG";
import { therapistPrompt } from "@/lib/ai/prompts";
import { makeUntangleSystemPrompt } from "@/lib/ai/RAG";

// TODO: how to get text as we are streaming and detect if it starts with "[completed]"
export async function POST(req: Request) {
  const { messages } = await req.json();

  const user = await currentUser();

  if (!user) {
    return new Response("Unauthorized", { status: 401 });
  }

  await addUserIfNotExists(user.id);

  const result = streamText({
    model: openai("gpt-4o"),
    system: await makeUntangleSystemPrompt(messages, user.id),
    messages,
  });

  return result.toDataStreamResponse();
}
