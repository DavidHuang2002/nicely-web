import { z } from "zod";

// Define the reflection type enum
const ReflectionTypeEnum = z.enum(["goal", "struggle", "insight", "next_step"]);

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
export const ReflectionPointSchema = z.object({
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
  user_id: z
    .string()
    .uuid()
    .describe("UUID of the user who owns this reflection"),
});

// Schema for an array of reflection points
export const ReflectionPointsSchema = z.array(ReflectionPointSchema);

// Type inference
export type ReflectionPoint = z.infer<typeof ReflectionPointSchema>;
export type ReflectionPoints = z.infer<typeof ReflectionPointsSchema>;

export const validateReflections = (jsonString: string): ReflectionPoints => {
  try {
    const parsed = JSON.parse(jsonString);
    return ReflectionPointsSchema.parse(parsed);
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      throw new Error(`Invalid reflection format: ${error.message}`);
    }
    throw new Error(`Failed to parse JSON: ${error.message}`);
  }
};
