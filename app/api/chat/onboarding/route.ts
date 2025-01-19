import { streamText, tool } from "ai";
import { openai } from "@ai-sdk/openai";
import { currentUser, User } from "@clerk/nextjs/server";
import { addUserIfNotExists, getUser, updateUser } from "@/lib/database/supabase";
import { z } from "zod";
import { COMPLETE_ONBOARDING_TOOL_NAME } from "@/models/constants";
import { extractAndStoreInsights } from "@/lib/ai/RAG";

const systemPrompt = `
  You are a compassionate, friendly, and fun therapy companion helping with onboarding. 
  Guide the user through the following steps:
  
  1. Gather basic information:
     - What user would like to be called
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

  After each step, reflect your understanding of the user's response back to them and ask any clarifying questions if you have any (but not too many). If not, move on to the next step.

  After the user confirmed the last step, thank them and call the completeOnboarding tool to finish the process.
`;

const testPrompt = `
  ask about an recent user's experience
  then repeat it back to the user for confirmation
  at last, call the completeOnboarding tool to finish the process.
`;

const handleOnboardingFinished = (user: User) => {
  updateUser(user.id, { onboarding_completed: true });
};

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
    system: systemPrompt,
    messages,
    tools: {
      [COMPLETE_ONBOARDING_TOOL_NAME]: tool({
        description: "Complete the onboarding process",
        // @ts-ignore: seem like there is a bug in the types
        parameters: z.object({}),
        execute: async () => {
          handleOnboardingFinished(user);
          await extractAndStoreInsights(messages);
          return { completed: true };
        },
      }),

      "saveNameAndFrequency": tool({
        description: "Save the user's name and therapy frequency",
        parameters: z.object({
          preferredName: z.string().describe("The user's preferred name"),
          therapyFrequency: z.enum(["weekly", "biweekly", "monthly", "other"]).describe("The user's therapy frequency"),
        }),   

        execute: async ({ preferredName, therapyFrequency }) => {
          await updateUser(user.id, { preferred_name: preferredName, therapy_frequency: therapyFrequency }); 
          return { completed: true };
        },
      }),
    },
  });

  console.log("onboarding completed");

  return result.toDataStreamResponse();
}

// TODO: this is a test endpoint to check if the onboarding is completed
export async function GET(req: Request) {
  const clerkUser = await currentUser();
  if (!clerkUser) {
    return new Response("Unauthorized", { status: 401 });
  }

  let onboardingCompleted = false; 
  const user = await getUser(clerkUser.id);
  if (user) {
    onboardingCompleted = user.onboarding_completed;
  }

  return new Response(JSON.stringify({
    onboardingCompleted,
  }));
}

