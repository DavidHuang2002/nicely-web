import { z } from "zod";

// Define the reflection type enum
export const ReflectionTypeEnum = z.enum(["goal", "struggle", "insight", "next_step"]);

// Define the importance level with specific validation
const ImportanceLevel = z
  .number()
  .int()
  .min(1)
  .max(5)
  .describe("Importance value between 1-5 indicating therapeutic significance");

// Define context tags array with size validation
const ContextTags = z
  .array(z.string())
  .min(2)
  .max(4)
  .refine(
    (tags) => {
      const invalidTags = ["therapy", "session", "conversation"];
      return !tags.some((tag) => invalidTags.includes(tag.toLowerCase()));
    },
    {
      message:
        "Context tags cannot include generic terms like 'therapy', 'session', or 'conversation'",
    }
  );

// Main ReflectionPoint schema
export const GeneratedReflectionPointSchema = z.object({
  type: ReflectionTypeEnum,
  context_tags: ContextTags,
  summary: z
    .string()
    .min(1)
    .max(200)
    .describe("Single-sentence summary of the therapeutic point"),
  original_quote: z
    .string()
    .min(1)
    .describe("Direct quote from the user's conversation"),
  importance: ImportanceLevel,
  // user_id: z
  //   .string()
  //   .uuid()
  //   .describe("UUID of the user who owns this reflection"),
});

// the actual stored reflection point will have the user_id
export const StoredReflectionPointSchema =
  GeneratedReflectionPointSchema.extend({
    user_id: z
      .string()
      .uuid()
      .describe("UUID of the user who owns this reflection"),
    timestamp: z.number().describe("Unix timestamp in milliseconds"),
  });

// Schema for an array of reflection points
export const GeneratedReflectionPointsSchema = z.array(
  GeneratedReflectionPointSchema
);

// Type inference
export type GeneratedReflectionPoint = z.infer<
  typeof GeneratedReflectionPointSchema
>;
export type GeneratedReflectionPoints = z.infer<
  typeof GeneratedReflectionPointsSchema
>;
export type StoredReflectionPoint = z.infer<typeof StoredReflectionPointSchema>;

export const validateReflections = (
  jsonString: string
): GeneratedReflectionPoints => {
  try {
    const parsed = JSON.parse(jsonString);
    return GeneratedReflectionPointsSchema.parse(parsed);
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      throw new Error(`Invalid reflection format: ${error.message}`);
    }
    throw new Error(`Failed to parse JSON: ${error.message}`);
  }
};
