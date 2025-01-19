import { streamText, tool } from "ai";
import { openai } from "@ai-sdk/openai";
import { currentUser } from "@clerk/nextjs/server";
import { addUserIfNotExists } from "@/lib/supabase";
import { z } from "zod";
import { COMPLETE_ONBOARDING_TOOL_NAME } from "@/models/constants";

const systemPrompt = `
  You are a compassionate, friendly, and fun therapy companion helping with onboarding. 
  Guide the user through the following steps:
  
  1. Gather basic information:
     - Name
     - Therapy frequency
  
  2. Discuss therapy goals:
     - Current work in therapy
     - Specific goals (e.g., managing anxiety, improving relationships)
     - Definition of progress or success
  
  3. Explore current challenges:
     - Recent challenges
     - Overwhelming situations or emotions
     - Self-understanding
  
  4. Reflect on the last therapy session:
     - Key takeaways
     - Emotions during and after the session
     - Learnings and action steps
     - Unaddressed topics

  After each step, reflect a summary of the user's response back to them to confirm before moving on to the next step.

  After the user confirmed the last step, thank them and call the completeOnboarding tool to finish the process.
`;

const testPrompt = `
  simply say hello and then call the completeOnboarding tool to finish the process.
`;

// TODO: how to get text as we are streaming and detect if it starts with "[completed]"
export async function POST(req: Request) {
  const { messages } = await req.json();

  const user = await currentUser();
  console.log("onboarding chat for user", user?.id);

  if (!user) {
    return new Response("Unauthorized", { status: 401 });
  }

  await addUserIfNotExists(user.id);

  const result = streamText({
    model: openai("gpt-4o"),
    system: testPrompt,
    messages,
    tools: {
      [COMPLETE_ONBOARDING_TOOL_NAME]: tool({
        description: "Complete the onboarding process",
        // @ts-ignore: seem like there is a bug in the types
        parameters: z.object({}),
        execute: async () => {
          console.log("onboarding completed");
          return { completed: true };
        },
      }),
    },
  });

  return result.toDataStreamResponse();
}
