import { generateObject } from "ai";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";
import { GeneratedChallenge, GeneratedChallengeSchema } from "@/models/goals";
import { getSessionSummaryById } from "@/lib/database/supabase";
import { makeGoalChallengesPrompt } from "../ai/prompts";
import { getUserGoals, getGoalChallenges } from "@/lib/database/supabase";

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

export async function getUserGoalsWithChallenges(userId: string) {
  try {
    const goals = await getUserGoals(userId);
    
    // Get challenges for each goal
    const goalsWithChallenges = await Promise.all(
      goals.map(async (goal) => {
        const challenges = await getGoalChallenges(goal.id);
        return {
          ...goal,
          todos: challenges.map(challenge => ({
            id: challenge.id, 
            title: challenge.title,
            description: challenge.description,
            how_to: challenge.how_to,
            reason: challenge.reason,
            benefits: challenge.benefits,
            completed: false, // TODO: Implement challenge completion status
          }))
        };
      })
    );

    return goalsWithChallenges;
  } catch (error) {
    console.error("Error fetching goals with challenges:", error);
    throw error;
  }
}
