import { generateObject } from "ai";
import { openai } from "@ai-sdk/openai";
import {
  GeneratedReflectionPointSchema,
  GeneratedReflectionPointsSchema,
  StoredReflectionPoint,
  type GeneratedReflectionPoints,
  ReflectionTypeEnum,
} from "../../models/reflection";
import { embedReflection, embedText } from "./embeddings";
import { upsertReflection } from "../database/qdrant";
import { Message } from "ai";
import { makeReflectionPrompt } from "./prompts";
import { convertMessagesToStr } from "./utils";
import { z } from "zod";
import { searchReflections } from "../database/qdrant";
import { getUser, getUserOrThrow } from "../database/supabase";
import { therapistPrompt } from "./prompts";

export async function extractAndStoreInsights(
  messages: Message[],
  userId: string
): Promise<void> {
  try {
    // Convert messages to conversation string
    const conversation = convertMessagesToStr(messages);

    // Generate reflections using the prompt template
    const { object: reflections }: { object: GeneratedReflectionPoints } =
      await generateObject({
        model: openai("gpt-4o"),
        output: "array",
        schema: GeneratedReflectionPointSchema,
        prompt: makeReflectionPrompt(conversation),
      });

    // Process each reflection point
    for (const reflection of reflections) {
      const storedReflection: StoredReflectionPoint = {
        ...reflection,
        user_id: userId,
        timestamp: Date.now(),
      };

      // Generate embedding for the reflection summary
      const embedding = await embedReflection(storedReflection);

      // Store reflection and embedding in Qdrant
      await upsertReflection(storedReflection, embedding);
    }

    console.log(`Successfully processed ${reflections.length} insights`);
  } catch (error) {
    console.error("Error in extractAndStoreInsights:", error);
    throw error;
  }
}

export const retrieveTopUserProfileReflections = async (
  query: number[],
  userId: string,
  topN: number,
  filterType: "all" | z.infer<typeof ReflectionTypeEnum>
) => {
  try {
    const searchResults = await searchReflections(query, userId, topN, filterType);
    
    // Transform results to include only necessary information
    return searchResults.map((result) => ({
      reflection: result.payload as StoredReflectionPoint,
      score: result.score,
    }));
  } catch (error) {
    console.error("Error in retrieveTopUserProfileReflections:", error);
    throw error;
  }
};
export const makeUntangleSystemPrompt = async (
  messages: Message[],
  userId: string
): Promise<string> => {
  const lastMessage = messages[messages.length - 1];
  const lastMessageContent = lastMessage.content;
  const queryEmbedding = await embedText(lastMessageContent);

  const topUserProfilePoints = await retrieveTopUserProfileReflections(
    queryEmbedding,
    userId,
    5,
    "all"
  );

  const topUserProfilePointsString = topUserProfilePoints
    .map((point) => JSON.stringify(point))
    .join("\n");

  // const mostRecentUserGoal = await searchRecentGoalReflections(userId, 1);

  // const mostRecentUserGoalString = mostRecentUserGoal.map((point) => JSON.stringify(point)).join("\n");

  // get the user's basic information
  const user = await getUserOrThrow(userId);
  const userBasicInformation = `
   Preferred name: ${user?.preferred_name}
   `;

  const untangleTask =
    "You goal to help user untangle their thoughts and feelings. Here are some of user's past thoughts and feelings:";
  return `
   Your role:
   ${therapistPrompt}

   Your task:
   ${untangleTask}

   User's past thoughts and feelings:
   ${topUserProfilePointsString}

   user's basic information:
   ${userBasicInformation}
   `;
};
