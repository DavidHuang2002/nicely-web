import type { GeneratedChallenge } from "@/models/goals";

// Helper function to generate mock challenges for a goal
export const generateMockChallengesForGoal = async (goalTitle: string): Promise<GeneratedChallenge[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  // Reference the mock goals data structure from:
  // components/goals/mock-data.ts lines 1-49 for anxiety challenges
  // lines 124-154 for boundary challenges
  // lines 158-189 for grief challenges

  const mockChallenges: GeneratedChallenge[] = [
    {
      title: "5-Minute Uncertainty Journal",
        description: "Daily practice of acknowledging and sitting with uncertain thoughts without trying to resolve them.",
        howTo: "1. Set a timer for 5 minutes\n2. Write down current uncertainties\n3. Notice physical sensations\n4. Label thoughts as 'uncertainty stories'\n5. Close by writing 'These are just thoughts'",
        reason: "Your mind seeks immediate answers to feel safe, but learning to sit with uncertainty builds emotional resilience.",
        benefits: "Reduces anxiety around uncertainty, builds tolerance for ambiguity, lessens the urge for constant control.",
      },
      {
        title: "Maybe Practice",
        description: "Reframe anxious predictions by adding 'maybe' to create space for multiple possibilities.",
        howTo: "1. Notice when you make a prediction\n2. Add 'maybe' before it\n3. Generate two alternative maybes\n4. Remind yourself all are possible\n5. Notice the shift in tension",
        reason: "You often get stuck in certainty about negative outcomes. This creates flexibility in your thinking.",
        benefits: "Reduces black-and-white thinking, eases anxiety about the future, increases cognitive flexibility.",
      },
      {
        title: "Evidence Collection",
        description: "Gather daily evidence that challenges your inner critic's narrative.",
        howTo: "1. Set 3 phone reminders throughout the day\n2. At each reminder, note one thing you did well\n3. Include small wins and efforts\n4. Review at bedtime\n5. Notice patterns of capability",
        reason: "Your inner critic has old, biased data. This builds a more accurate dataset of your worth.",
        benefits: "Builds self-trust, challenges negative self-talk, creates evidence-based confidence.",
    },
      {
      title: "Permission to Rest Timer",
      description: "Scheduled mini-breaks that reframe rest as essential, not earned.",
      howTo: "1. Set timer for 25 minutes of work\n2. Take 5-minute rest regardless of progress\n3. Notice resistance to breaking\n4. Rest without checking phone\n5. Return with fresh perspective",
      reason: "You've internalized that rest must be earned. This practice challenges that belief system.",
      benefits: "Improves productivity, reduces burnout, challenges perfectionism, builds sustainable work patterns.",
    },
  ];

  return mockChallenges;
};    