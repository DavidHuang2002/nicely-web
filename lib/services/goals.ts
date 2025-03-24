import { generateObject } from "ai";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";
import { GeneratedChallenge, GeneratedChallengeSchema } from "@/models/goals";
import { getSessionSummaryById, createGoal, createChallenges, getUserGoals, getGoalChallenges } from "@/lib/database/supabase";
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
    // First create the goal
    const { id: goalId } = await createGoal({
      userId: goalData.userId,
      sessionId: goalData.sessionId,
      title: goalData.title,
      description: goalData.description,
    });

    // Then create all challenges for this goal
    await createChallenges({
      goalId,
      challenges: goalData.challenges,
    });

    // Save to database
    return {
      success: true,
      goalId,
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
    const now = new Date();
    
    // Get challenges for each goal
    const goalsWithChallenges = await Promise.all(
      goals.map(async (goal) => {
        const challenges = await getGoalChallenges(goal.id);
        return {
          ...goal,
          todos: challenges.map(challenge => {
            // Calculate if challenge is completed (within 24 hours)
            const isCompletedWithin24Hours = challenge.last_completion_date 
              ? (now.getTime() - new Date(challenge.last_completion_date).getTime()) / (1000 * 60 * 60) <= 24
              : false;

            return {
              id: challenge.id, 
              title: challenge.title,
              description: challenge.description,
              how_to: challenge.how_to,
              reason: challenge.reason,
              benefits: challenge.benefits,
              last_completion_date: challenge.last_completion_date,  // Include this field
              completed: isCompletedWithin24Hours  // Calculate based on last_completion_date
            };
          })
        };
      })
    );

    return goalsWithChallenges;
  } catch (error) {
    console.error("Error fetching goals with challenges:", error);
    throw error;
  }
}
