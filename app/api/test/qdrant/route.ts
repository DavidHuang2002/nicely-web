import {
  initializeCollectionIfNotExist,
  upsertReflection,
} from "@/lib/database/qdrant";
import { embedText } from "@/lib/ai/embeddings";
import { ReflectionPoint } from "@/models/reflection";

export async function POST(req: Request) {
  try {
    // Initialize collection if it doesn't exist
    // await initializeCollection();

    // Sample reflection point
    const sampleReflection: ReflectionPoint = {
      type: "insight",
      summary:
        "Test insight about managing anxiety through breathing exercises",
      context_tags: ["anxiety", "coping_skills", "breathing"],
      original_quote:
        "I found that deep breathing really helps when I'm anxious",
      importance: 4,
      user_id: "4eef9195-42e4-4a0f-b41e-5d0719fa655f",
    };

    // Generate embedding for the reflection summary
    const embedding  = await embedText(sampleReflection.summary);

    // Store in Qdrant
    await upsertReflection(sampleReflection, embedding);

    return new Response(
      JSON.stringify({
        success: true,
        message: "Test reflection stored successfully",
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error in test endpoint:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}
