import { openai } from "@ai-sdk/openai";
import { currentUser } from "@clerk/nextjs/server";
import { streamText } from "ai";

// Allow streaming responses up to 30 seconds
export const maxDuration = 300;

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: openai("gpt-4o"),
    system: `You are a helpful assistant. Check your knowledge base before answering any questions.
    Only respond to questions using information from tool calls.
    if no relevant information is found in the tool calls, respond, "Sorry, I don't know."`,
    messages,
  });
  
  // get current user
  const user = await currentUser();
  console.log("current user", user);

  return result.toDataStreamResponse();
}
