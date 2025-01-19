import { generateObject } from "ai";
import { openai } from "@ai-sdk/openai";
import {
  ReflectionPointSchema,
  ReflectionPointsSchema,
  type ReflectionPoints,
} from "../../models/reflection";
import { embedText } from "./embeddings";
import { upsertReflection } from "../database/qdrant";
import { Message } from "ai";
import { makeReflectionPrompt } from "./prompts";
import { object, z } from "zod";
import { convertMessagesToStr } from "./utils";

export async function extractAndStoreInsights(
  messages: Message[]
): Promise<void> {
  try {
    // Convert messages to conversation string
    const conversation = convertMessagesToStr(messages);

    // Generate reflections using the prompt template
    const { object: reflections }: { object: ReflectionPoints } = await generateObject({
      model: openai("gpt-4o"),
      output: "array", 
      schema: ReflectionPointSchema,
      prompt: makeReflectionPrompt(conversation),
    });

    // Process each reflection point
    for (const reflection of reflections) {
      // Generate embedding for the reflection summary
      const { embedding } = await embedText(reflection.summary);

      // Store reflection and embedding in Qdrant
      await upsertReflection(reflection, embedding);
    }

    console.log(`Successfully processed ${reflections.length} insights`);
  } catch (error) {
    console.error("Error in extractAndStoreInsights:", error);
    throw error;
  }
}
