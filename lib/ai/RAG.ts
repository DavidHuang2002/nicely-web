import { generateObject } from "ai";
import { openai } from "@ai-sdk/openai";
import {
  GeneratedReflectionPointSchema,
  GeneratedReflectionPointsSchema,
  StoredReflectionPoint,
  type GeneratedReflectionPoints,
} from "../../models/reflection";
import { embedReflection, embedText } from "./embeddings";
import { upsertReflection } from "../database/qdrant";
import { Message } from "ai";
import { makeReflectionPrompt } from "./prompts";
import { convertMessagesToStr } from "./utils";

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
