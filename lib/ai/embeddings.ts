import { embed } from "ai";
import { openai } from "@ai-sdk/openai";
import { StoredReflectionPoint } from "@/models/reflection";

export const embedReflection = async (reflection: StoredReflectionPoint): Promise<number[]> => {
  const tagAndSummary = `${reflection.context_tags.join(", ")}: ${reflection.summary}`;
  const embedding = await embedText(tagAndSummary);
  return embedding;
};

export const embedText = async (
  text: string
): Promise<number[]> => {
  const { embedding } = await embed({
    model: openai.embedding("text-embedding-ada-002"),
    value: text,
  });

  return embedding;
};
