import { generateObject } from "ai";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";
import { GeneratedChallenge, GeneratedChallengeSchema } from "@/models/goals";
import { getSessionSummaryById } from "@/lib/database/supabase";
import { makeGoalChallengesPrompt } from "../ai/prompts";

// Schema for array of challenges

export async function generateChallengesForGoal(
  goalTitle: string,
  goalDescription: string,
  sessionId: string
) {
  try {
    // Get session content for context
    const sessionSummary = await getSessionSummaryById(sessionId);
    if (!sessionSummary) {
      throw new Error("Session not found");
    }

    const sessionContent = sessionSummary.full_recap;
    const prompt = makeGoalChallengesPrompt(goalTitle, goalDescription, sessionContent);

    const { object: challenges } = await generateObject({
      model: openai("gpt-4o"),
      output: "array",
      schema: GeneratedChallengeSchema,
      prompt,
    });

    return challenges;
  } catch (error) {
    console.error("Error generating challenges:", error);
    throw error;
  }
}

export async function saveGoalWithChallenges(
  goalData: {
    title: string;
    description: string;
    sessionId: string;
    challenges: GeneratedChallenge[];
    userId: string;
  }
) {
  // TODO: Implement database saving logic
  // This will be implemented once we have the database schema set up
  try {
    // Save to database
    return {
      success: true,
      message: "Goal and challenges saved successfully",
    };
  } catch (error) {
    console.error("Error saving goal and challenges:", error);
    throw error;
  }
}
