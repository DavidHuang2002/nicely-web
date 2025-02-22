import { GoalCardType } from "./types";

export const initialGoals: GoalCardType[] = [
    {
      id: "1",
      title: "Managing Anxiety and Stress",
      description:
        '"My heart races before meetings and I cannot focus, wishing for better tools to handle these moments."',
      streak: 3,
      todos: [
        {
          id: "t1",
          title: "Progressive Muscle Relaxation",
          description:
            "A systematic technique to reduce physical tension and break the anxiety cycle by tensing and relaxing different muscle groups.",
          howTo:
            "1. Find a quiet, comfortable place to sit or lie down\n2. Start with your toes, tense them for 5 seconds\n3. Release and notice the feeling of relaxation for 10 seconds\n4. Move up through each muscle group (feet, legs, abdomen, arms, face)\n5. Practice for 10-15 minutes total",
          relevance:
            "During our last session, you mentioned experiencing physical tension, especially in your shoulders and jaw. This technique will help you recognize and release tension before it builds up.",
          benefits:
            "Reduces muscle tension, lowers overall stress levels, improves body awareness, and provides a practical tool for managing anxiety in the moment.",
          completed: false,
        },
        {
          id: "t2",
          title: "3-3-3 Grounding Exercise",
          description:
            "A quick mindfulness technique to break anxiety spirals by engaging your senses and returning to the present moment.",
          howTo:
            "1. Name 3 things you can see\n2. Name 3 things you can hear\n3. Move 3 parts of your body\n4. Take a deep breath after each step\n5. Notice how you feel more centered",
          relevance:
            "You've described feeling overwhelmed in meetings and social situations. This quick exercise can help you regain focus without others noticing.",
          benefits:
            "Interrupts anxiety cycles, brings attention to the present moment, can be done anywhere without drawing attention, and helps regain mental clarity.",
          completed: false,
        },
        {
          id: "t3",
          title: "Worry Time Scheduling",
          description:
            "Designate specific times for addressing worries to prevent them from consuming your entire day.",
          howTo:
            "1. Set aside 15-20 minutes daily at a consistent time\n2. When worries arise, note them down\n3. During worry time, review and problem-solve\n4. Outside worry time, remind yourself to postpone worrying\n5. Keep a small notebook for capturing thoughts",
          relevance:
            "We discussed how racing thoughts affect your sleep and productivity. This structured approach helps contain worry without suppressing it.",
          benefits:
            "Reduces the impact of worry on daily life, improves productivity, better sleep quality, and develops healthier worry management habits.",
          completed: false,
        },
      ],
    },
    {
      id: "2",
      title: "Building Self-Compassion",
      description:
        '"When others make mistakes I understand, but with myself I am too harsh."',
      streak: 5,
      todos: [
        {
          id: "t4",
          title: "Self-Compassion Letter Writing",
          description:
            "Write a letter to yourself from the perspective of a caring friend, addressing a current challenge or self-criticism.",
          howTo:
            "1. Choose a specific situation causing self-criticism\n2. Write as if you're addressing a dear friend\n3. Acknowledge the pain or difficulty\n4. Offer understanding and kindness\n5. Suggest gentle ways forward",
          relevance:
            "Your inner critic has been particularly loud lately, especially regarding work performance. This exercise helps develop a more balanced, compassionate inner voice.",
          benefits:
            "Reduces harsh self-judgment, develops emotional resilience, improves self-worth, and creates healthier self-talk patterns.",
          completed: false,
        },
        {
          id: "t5",
          title: "Daily Compassion Break",
          description:
            "Take brief moments throughout the day to practice the three components of self-compassion: mindfulness, common humanity, and self-kindness.",
          howTo:
            "1. Notice when you're struggling (mindfulness)\n2. Remember others also face similar challenges (common humanity)\n3. Offer yourself a kind phrase or gesture\n4. Take three deep breaths\n5. Continue your day with gentleness",
          relevance:
            "This builds on our discussions about feeling isolated in your struggles. The practice helps you feel more connected while building self-compassion.",
          benefits:
            "Increases emotional resilience, reduces feelings of isolation, improves stress management, and builds a more positive relationship with yourself.",
          completed: true,
        },
      ],
    },
    {
      id: "3",
      title: "Improving Sleep Habits",
      description:
        '"My body feels tired but my mind refuses to quiet down at night."',
      streak: 2,
      todos: [
        {
          id: "t6",
          title: "Evening Wind-Down Routine",
          description:
            "Create a calming pre-sleep routine to signal your body it's time to rest.",
          howTo:
            "1. Start 1 hour before bedtime\n2. Dim lights and reduce blue light exposure\n3. Do gentle stretching or reading\n4. Practice 5 minutes of deep breathing\n5. Keep your bedroom cool and dark",
          relevance:
            "Your sleep patterns have been irregular, affecting your daily energy. This structured routine will help regulate your circadian rhythm.",
          benefits:
            "Improves sleep quality, reduces time to fall asleep, increases daytime energy, and helps maintain consistent sleep schedule.",
          completed: false,
        },
        {
          id: "t7",
          title: "Sleep Thought Journal",
          description:
            "Address nighttime worry patterns by logging thoughts before bed.",
          howTo:
            "1. Keep a journal by your bed\n2. Write down any worrying thoughts\n3. Note potential solutions or next steps\n4. Close the journal as a symbol of setting aside concerns\n5. Focus on restful breathing",
          relevance:
            "Night-time anxiety has been disrupting your sleep. This technique helps clear your mind before bed.",
          benefits:
            "Reduces bedtime anxiety, prevents racing thoughts, improves sleep quality, and provides action steps for tomorrow.",
          completed: true,
        },
      ],
    },
    {
      id: "4",
      title: "Building Healthy Boundaries",
      description:
        '"I keep saying yes to everything, even while feeling overwhelmed."',
      streak: 4,
      todos: [
        {
          id: "t8",
          title: "Boundary Check-In Practice",
          description:
            "Regular assessment of your emotional and physical boundaries in different situations.",
          howTo:
            "1. Identify situations where you feel drained\n2. Notice physical and emotional responses\n3. Write down your ideal boundaries\n4. Practice saying no when needed\n5. Validate your right to have boundaries",
          relevance:
            "You've mentioned feeling overwhelmed by others' demands. This practice helps you recognize and honor your limits.",
          benefits:
            "Increases self-respect, reduces emotional exhaustion, improves relationships, and enhances work-life balance.",
          completed: false,
        },
        {
          id: "t9",
          title: "Assertive Communication Script",
          description:
            "Develop and practice clear, assertive responses for common boundary challenges.",
          howTo:
            "1. Identify a boundary situation\n2. Write out your feelings and needs\n3. Create a clear, firm response\n4. Practice delivery in a mirror\n5. Use 'I' statements and stay calm",
          relevance:
            "This builds on our discussion about difficulty saying no to extra work projects.",
          benefits:
            "Improves confidence in setting boundaries, reduces anxiety about confrontation, maintains professional relationships.",
          completed: false,
        },
      ],
    },
    {
      id: "5",
      title: "Processing Grief and Loss",
      description:
        '"The memories still feel fresh, as if everything happened just yesterday."',
      streak: 7,
      todos: [
        {
          id: "t10",
          title: "Memory Journal Practice",
          description:
            "Create a safe space to explore and honor memories of your loss.",
          howTo:
            "1. Set aside quiet time each day\n2. Write about a specific memory\n3. Express associated emotions freely\n4. Include photos or mementos if helpful\n5. Close with a gratitude statement",
          relevance:
            "As we've discussed your recent loss, this provides a structured way to process emotions and preserve memories.",
          benefits:
            "Facilitates healthy grieving, preserves important memories, reduces emotional suppression, promotes healing.",
          completed: true,
        },
        {
          id: "t11",
          title: "Grief Check-In Meditation",
          description:
            "A gentle meditation practice for acknowledging and sitting with grief emotions.",
          howTo:
            "1. Find a quiet, comfortable space\n2. Focus on your breath for 2 minutes\n3. Notice any emotions present\n4. Allow feelings without judgment\n5. Close with self-compassion phrase",
          relevance:
            "This helps address the waves of grief you've described experiencing throughout the day.",
          benefits:
            "Develops emotional awareness, reduces anxiety about grief, builds resilience, promotes self-compassion.",
          completed: false,
        },
      ],
    },
  ]