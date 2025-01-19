import { embed } from "ai";
import { openai } from "@ai-sdk/openai";

export const embedText = async (
  text: string
): Promise<number[]> => {
  const { embedding } = await embed({
    model: openai.embedding("text-embedding-ada-002"),
    value: text,
  });

  return embedding;
};
