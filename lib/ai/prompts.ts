export const onboardingFinishedMessageContent: string = `You’re all set! 🎉

Thank you for sharing and trusting me with your thoughts. 💛 Now that I’ve gotten to know you better, I’m ready to give you personalized support tailored to your needs.

Let me take you to the home page, where we can:

- Work through your emotions together if you’re feeling down.
- Do daily self-care inspired by your therapy insights.
- Add notes about your latest therapy session to stay on track.

Whatever you need, I’m here to help—let’s take this journey one step at a time. 😊`;

export const makeReflectionPrompt = (conversation: string) => {
  return `You are analyzing a conversation as an experienced therapist with deep insight into human behavior. Your task is to extract key elements that will help guide extremely personalized therapy and form the basis for future therapeutic insights and interventions.

Review the conversation and create a memory reflection following these rules:

1. **Focus on Therapeutic Relevance**  
   - Only include information that will meaningfully guide future therapeutic conversations.

2. **Four Categories**  
   - Each item must have a "type" among: "goal", "struggle", "insight", or "next_step".  
   - Choose the category that best represents the point’s function in therapy.

3. **Context Tags**  
   - Provide 2-4 keywords that capture the emotional, behavioral, or thematic essence of the point.  
   - Examples: ["self_esteem", "relationship_conflict", "perfectionism"], ["grief", "coping_skills"].  
   - Avoid broad or generic tags like ["therapy", "session", "conversation"].

4. **Concise Summary**  
   - Write a single-sentence summary that pinpoints the essence of the user’s statement.  
   - Example: "Feels anxious about an upcoming job interview due to fear of failure."

5. **Original Quote**  
   - Include a short direct quote from the user that prompted you to create this entry.  
   - This helps preserve the user’s own words and context.

6. **Importance Field**  
   - Assign an **importance** value (1–5) to each point based on its perceived significance to the user’s overall therapeutic progress.  
   - Use the following scale:
     - 1: Minor or situational  
     - 2: Relevant but not critical  
     - 3: Moderately important  
     - 4: Significant to therapeutic focus  
     - 5: Central or highly impactful issue  

7. **Maintain Therapeutic Utility**  
   - Ensure each entry is actionable or reflective enough to be revisited in later sessions.  
   - Capture emotional tone, motivation, or specific details relevant to therapeutic progress.

**Do not** include any text outside of this JSON array.
**Do not** add any additional fields.
**Do not** include any text outside of this JSON array.
**Do not** add any additional fields.

Here is the prior conversation:

${conversation}`;
};
