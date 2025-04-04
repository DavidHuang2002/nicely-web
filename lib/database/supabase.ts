import { createClient } from "@supabase/supabase-js";
import { User, UserSchema } from "@/models/user";
import { Chat, ChatSchema, ChatTypeEnum } from "@/models/chat";
import { DatabaseMessage, DatabaseMessageSchema } from "@/models/message";
import { z } from "zod";
import { CreateTranscriptionSchema, Transcription, TranscriptionSchema } from "@/models/transcription";
import { CreateSessionSummarySchema, SessionSummary, SessionSummarySchema } from "@/models/session-summary";
import { CreateVoiceNoteSchema, VoiceNoteSchema, VoiceNote, CreateVoiceNote } from "@/models/voice-note";
import { GeneratedChallenge } from "@/models/goals";
import { Goal, GoalSchema } from "@/models/goals";
import { Challenge, ChallengeSchema } from "@/models/goals";
import { CreateReminderSettings, ReminderSettings, ReminderSettingsSchema } from "@/models/reminder-settings";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_KEY!
);

export async function addUserIfNotExists(clerkId: string): Promise<string> {
  try {
    // Check if user exists
    const existingUser = await getUser(clerkId);

    if (!existingUser) {
      // Create new user with basic info
      const newUser = UserSchema.parse({
        clerk_id: clerkId,
        onboarding_completed: false,
      });

      const { data: insertedUser, error } = await supabase
        .from("users")
        .insert([newUser])
        .select()
        .single();

      if (error) throw error;
      if (!insertedUser) throw new Error("Failed to create user");
      
      return insertedUser.id;
    } else {
      console.log("User already exists. user ID:", existingUser.id);
      return existingUser.id!;
    }
  } catch (error) {
    console.error("Error in addUserIfNotExists:", error);
    throw error;
  }
}

export async function getUser(clerkId: string): Promise<User | null> {
  const { data: user } = (await supabase
    .from("users")
    .select()
    .eq("clerk_id", clerkId)
    .single()) as { data: User | null };

  return user;
}

// throw error if user not found
export async function getUserOrThrow(clerkId: string): Promise<User> {
  const user = await getUser(clerkId);
  if (!user) {
    throw new Error(`User not found for clerkId: ${clerkId}`);
  }
  return user;
}

export async function getUserById(userId: string): Promise<User | null> {
  const { data: user } = (await supabase
    .from("users")
    .select()
    .eq("id", userId)
    .single()) as { data: User | null };
  return user;
}

export async function getUsersById(userIds: string[]): Promise<User[]> {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .in("id", userIds);
  return data || [];
}

export async function updateUser(
  clerkId: string,
  data: Partial<User>
): Promise<void> {
  const { error } = await supabase
    .from("users")
    .update(data)
    .eq("clerk_id", clerkId);
  if (error) {
    console.error("Error in updateUser:", error);
    throw error;
  }
}

export async function saveMessage(
  chatId: string,
  message: DatabaseMessage
): Promise<void> {
  //
  if (message.content == "") {
    return;
  }

  const { error } = await supabase.from("messages").insert({
    chat_id: chatId,
    role: message.role,
    content: message.content,
    tool_invocations: message.toolInvocations,
    metadata: message.metadata,
  });

  if (error) {
    console.error("Error saving message:", error);
    throw error;
  }
}

export async function getChatMessagesFromDB(
  chatId: string,
  userId: string
): Promise<DatabaseMessage[]> {
  // make sure the user has access to the chat
  const chat = await getChat(chatId);
  if (!chat || chat.user_id !== userId) {
    throw new Error("User does not have access to this chat");
  }

  const { data: messages, error } = await supabase
    .from("messages")
    .select("*")
    .eq("chat_id", chatId)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Error fetching messages:", error);
    throw error;
  }

  return messages;
}

export const getChat = async (chatId: string): Promise<Chat | null> => {
  const { data: chat, error } = await supabase
    .from("chats")
    .select("*")
    .eq("id", chatId)
    .single();
  return chat;
};

export const getOnboardingChatOrNullIfNonExistent = async (
  userId: string
): Promise<Chat | null> => {
  const { data: chats, error } = await supabase
    .from("chats")
    .select("*")
    .eq("user_id", userId)
    .eq("type", "onboarding");

  if (error) {
    console.error("Error fetching onboarding chat:", error);
    throw error;
  }

  // Return first chat or null if none exists
  return chats.length > 0 ? chats[0] : null;
};

export async function createChat(
  userId: string,
  chatId: string,
  type: z.infer<typeof ChatTypeEnum>
): Promise<void> {
  console.log("User ID:", userId);
  console.log("Chat ID:", chatId);
  console.log("Type:", type);

  const newChat = ChatSchema.parse({
    id: chatId,
    user_id: userId,
    type,
    title: `New ${type} Chat`,
  });

  try {
    const { error } = await supabase.from("chats").insert(newChat);

    if (error) {
      console.error("Error in createChat:", error);
      throw error;
    }

    console.log("Created chat:", chatId);
  } catch (error) {
    console.error("Error in createChat:", error);
    throw error;
  }
}

export const createChatWithInitialMessages = async (
  userId: string,
  chatId: string,
  type: z.infer<typeof ChatTypeEnum>,
  initialMessages?: DatabaseMessage[]
): Promise<void> => {
  await createChat(userId, chatId, type);
  if (initialMessages) {
    for (const message of initialMessages) {
      await saveMessage(chatId, message);
    }
  }
};

export async function createTranscriptionRecord({
  userId,
  s3Key,
  status,
}: {
  userId: string;
  s3Key: string;
  status: Transcription["status"];
}): Promise<Transcription> {
  const newTranscription = CreateTranscriptionSchema.parse({
    user_id: userId,
    s3_key: s3Key,
    status,
    transcription_job_name: null,
    transcription_text: null,
  });

  const { data, error } = await supabase
    .from("transcriptions")
    .insert(newTranscription)
    .select()
    .single();

  if (error) throw error;
  
  // Parse the response data through our schema
  return TranscriptionSchema.parse(data);
}

export async function updateTranscriptionStatus(
  id: string,
  update: Partial<Omit<Transcription, "id" | "user_id" | "created_at">>
): Promise<void> {
  const updateData = {
    ...update,
    updated_at: new Date(),
  };

  const { error } = await supabase
    .from("transcriptions")
    .update(updateData)
    .eq("id", id);

  if (error) throw error;
}

export async function getTranscriptionById(
  id: string
): Promise<Transcription | null> {
  const { data, error } = await supabase
    .from("transcriptions")
    .select()
    .eq("id", id)
    .single();

  if (error) throw error;
  return data ? TranscriptionSchema.parse(data) : null;
}

export async function getUserTranscriptions(
  userId: string
): Promise<Transcription[]> {
  const { data, error } = await supabase
    .from("transcriptions")
    .select()
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data.map((record) => TranscriptionSchema.parse(record));
}

export async function createSessionSummary(
  summary: z.infer<typeof CreateSessionSummarySchema>
): Promise<SessionSummary> {
  const { data, error } = await supabase
    .from("session_summaries")
    .insert(summary)
    .select()
    .single();

  if (error) throw error;
  return SessionSummarySchema.parse(data);
}

export async function getSessionSummaryById(
  id: string
): Promise<SessionSummary | null> {
  const { data, error } = await supabase
    .from("session_summaries")
    .select()
    .eq("id", id)
    .single();

  if (error) throw error;
  return data ? SessionSummarySchema.parse(data) : null;
}

export async function getUserSessionSummaries(
  userId: string
): Promise<SessionSummary[]> {
  const { data, error } = await supabase
    .from("session_summaries")
    .select()
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data.map((record) => SessionSummarySchema.parse(record));
}

export async function getTranscriptionSessionSummary(
  transcriptionId: string
): Promise<SessionSummary | null> {
  const { data, error } = await supabase
    .from("session_summaries")
    .select()
    .eq("transcription_id", transcriptionId)
    .single();

  if (error) throw error;
  return data ? SessionSummarySchema.parse(data) : null;
}

export async function updateSessionSummary(
  id: string,
  update: Partial<Omit<SessionSummary, "id" | "user_id" | "transcription_id" | "created_at">>
): Promise<void> {
  const updateData = {
    ...update,
    updated_at: new Date(),
  };

  const { error } = await supabase
    .from("session_summaries")
    .update(updateData)
    .eq("id", id);

  if (error) throw error;
}

export async function deleteSessionSummaryInDB(id: string): Promise<void> {
  const { error } = await supabase
    .from("session_summaries")
    .delete()
    .eq("id", id);
  if (error) throw error;
}

export async function archiveTranscription(id: string): Promise<void> {
  const { error } = await supabase
    .from("transcriptions")
    .update({ status: "archived" })
    .eq("id", id);
  if (error) throw error;
}

export async function createVoiceNote(
  data: CreateVoiceNote
): Promise<VoiceNote> {
  const { data: voiceNote, error } = await supabase
    .from("voice_notes")
    .insert(data)
    .select()
    .single();

  if (error) throw error;
  return VoiceNoteSchema.parse(voiceNote);
}

export async function getVoiceNoteById(id: string): Promise<VoiceNote | null> {
  const { data, error } = await supabase
    .from("voice_notes")
    .select()
    .eq("id", id)
    .single();

  if (error) throw error;
  return data ? VoiceNoteSchema.parse(data) : null;
}

export async function createGoal(goalData: {
  userId: string;
  sessionId: string;
  title: string;
  description: string;
}): Promise<{ id: string }> {
  const { data, error } = await supabase
    .from("goals")
    .insert({
      user_id: goalData.userId,
      session_note_id: goalData.sessionId,
      title: goalData.title,
      description: goalData.description,
    })
    .select("id")
    .single();

  if (error) throw error;
  return data;
}

export async function createChallenges(challenges: {
  goalId: string;
  challenges: GeneratedChallenge[];
}): Promise<void> {
  const challengesWithGoalId = challenges.challenges.map(challenge => ({
    goal_id: challenges.goalId,
    title: challenge.title,
    description: challenge.description,
    how_to: challenge.how_to,
    reason: challenge.reason,
    benefits: challenge.benefits,
    last_completion_date: null,
  }));

  const { error } = await supabase
    .from("challenges")
    .insert(challengesWithGoalId);

  if (error) throw error;
}

export async function getUserGoals(userId: string): Promise<Goal[]> {
  const { data, error } = await supabase
    .from("goals")
    .select()
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data.map(goal => GoalSchema.parse(goal));
}

export async function getGoalChallenges(goalId: string): Promise<Challenge[]> {
  const { data, error } = await supabase
    .from("challenges")
    .select()
    .eq("goal_id", goalId)
    .order("created_at", { ascending: true });

  if (error) throw error;
  return data.map(challenge => ChallengeSchema.parse(challenge));
}

export async function getReminderSettings(userId: string): Promise<ReminderSettings | null> {
  const { data, error } = await supabase
    .from("reminder_settings")
    .select("*")
    .eq("user_id", userId)
    .single();

  // If no data found, return null (don't treat as error)
  if (error?.code === 'PGRST116') { // This is Postgrest's "not found" code
    return null;
  }

  // For other types of errors, we should still throw
  if (error) {
    console.error("Error fetching reminder settings:", error);
    throw error;
  }

  return data ? ReminderSettingsSchema.parse(data) : null;
}

export async function upsertReminderSettings(
  settings: CreateReminderSettings
): Promise<ReminderSettings> {
  const { data, error } = await supabase
    .from("reminder_settings")
    .upsert(settings)
    .select()
    .single();

  if (error) {
    console.error("Error upserting reminder settings:", error);
    throw error;
  }

  return ReminderSettingsSchema.parse(data);
}

/**
 * Gets reminder settings that match the current time within a specified window
 * 
 * @param referenceTime The reference time to check against
 * @param timeWindowMinutes Time window in minutes before/after the reference time
 * @returns Array of reminder settings with matching times (includes user_id)
 */
export async function getActiveReminderSettingsByTime(
  referenceTime: Date, 
  timeWindowMinutes: number
): Promise<ReminderSettings[]> {
  try {
    // Format hours/minutes for easier comparison
    const currentHour = referenceTime.getUTCHours();
    const currentMinute = referenceTime.getUTCMinutes();
    
    // Query all enabled reminder settings
    const { data, error } = await supabase
      .from("reminder_settings")
      .select("*")
      .eq("enabled", true);
    
    if (error) {
      console.error("Error fetching reminder settings:", error);
      throw error;
    }
    
    if (!data || data.length === 0) {
      return [];
    }
    
    // Parse the data through our schema
    const reminderSettings = data.map(item => ReminderSettingsSchema.parse(item));
    
    // Filter settings whose time matches our window, accounting for timezone
    return reminderSettings.filter(settings => {
      try {
        // Parse the time from the settings
        const [settingsHour, settingsMinute] = settings.time.split(':').map(Number);
        
        // Create date objects for comparison (in UTC)
        const settingsTimeInUTC = new Date();
        settingsTimeInUTC.setUTCHours(settingsHour, settingsMinute, 0, 0);
        
        // Adjust for the user's timezone
        // This is a simplification - proper timezone math would be more complex
        const timezoneDiffMinutes = getTimezoneOffsetInMinutes(settings.timezone);
        
        // Calculate the effective reminder time in UTC
        const adjustedTime = new Date(settingsTimeInUTC);
        adjustedTime.setUTCMinutes(adjustedTime.getUTCMinutes() - timezoneDiffMinutes);
        
        // Calculate time difference in minutes
        const timeDiffMinutes = Math.abs(
          (adjustedTime.getUTCHours() * 60 + adjustedTime.getUTCMinutes()) - 
          (currentHour * 60 + currentMinute)
        );
        
        // Check if the time is within our window
        return timeDiffMinutes <= timeWindowMinutes;
      } catch (e) {
        console.error(`Error processing reminder time for user ${settings.user_id}:`, e);
        return false;
      }
    });
  } catch (error) {
    console.error("Error in getActiveReminderSettingsByTime:", error);
    throw error;
  }
}

  export async function modifyChallenge(
  challengeId: string,
  userId: string,
  update: {
    last_completion_date: string | null;
  }
): Promise<void> {
  try {
    // First verify that the user has access to this challenge
    const { data: challenge, error: challengeError } = await supabase
      .from("challenges")
      .select("id, goal_id")
      .eq("id", challengeId)
      .single();

    if (challengeError || !challenge) {
      throw new Error("Challenge not found");
    }

    // Verify the goal belongs to the user
    const { data: goal, error: goalError } = await supabase
      .from("goals")
      .select("id, user_id")
      .eq("id", challenge.goal_id)
      .single();

    if (goalError || !goal) {
      throw new Error("Goal not found");
    }

    if (goal.user_id !== userId) {
      throw new Error("Unauthorized: User does not own this goal");
    }

    // Update the challenge with the new data
    const { error } = await supabase
      .from("challenges")
      .update({
        last_completion_date: update.last_completion_date,
        updated_at: new Date().toISOString(),
      })
      .eq("id", challengeId);

    if (error) {
      throw error;
    }
  } catch (error) {
    console.error("Error modifying challenge:", error);
    throw error;
  }
}

/**
 * Helper function to get timezone offset in minutes
 * 
 * @param timezone IANA timezone string
 * @returns Offset in minutes
 */
function getTimezoneOffsetInMinutes(timezone: string): number {
  try {
    // Current time in UTC and in the target timezone
    const now = new Date();
    
    // Get timezone offset for the specified timezone
    // This is a simplification - for production use a proper timezone library
    const timeInTargetTz = new Date(now.toLocaleString('en-US', { timeZone: timezone }));
    const timeInUTC = new Date(now.toLocaleString('en-US', { timeZone: 'UTC' }));
    
    // Return difference in minutes
    return (timeInTargetTz.getTime() - timeInUTC.getTime()) / (1000 * 60);
  } catch (e) {
    console.error(`Error calculating timezone offset for ${timezone}:`, e);
    return 0; // Default to no offset in case of error
  }
}

export async function updateChallengeStreak(
  goalId: string,
  userId: string,
  increment: boolean
): Promise<void> {
  try {
    // First verify that the goal exists and belongs to the user
    const { data: goal, error: goalError } = await supabase
      .from("goals")
      .select("id, user_id, streak")
      .eq("id", goalId)
      .single();

    if (goalError || !goal) {
      throw new Error("Goal not found");
    }

    if (goal.user_id !== userId) {
      throw new Error("Unauthorized: User does not own this goal");
    }

    // Get all challenges for this goal with their completion dates
    const { data: challenges, error: challengesError } = await supabase
      .from("challenges")
      .select("last_completion_date")
      .eq("goal_id", goalId);

    if (challengesError) {
      throw challengesError;
    }

    const now = new Date();

    // Count how many challenges are completed within the last 24 hours
    const completedChallengesIn24Hours = challenges.filter(challenge => {
      if (!challenge.last_completion_date) return false;
      const completionDate = new Date(challenge.last_completion_date);
      const hoursSinceCompletion = (now.getTime() - completionDate.getTime()) / (1000 * 60 * 60);
      return hoursSinceCompletion <= 24;
    }).length;

    // If we're incrementing (completing a challenge)
    if (increment) {
      // If this is the first completion in 24 hours, increment the streak
      if (completedChallengesIn24Hours === 0) {
        const { error } = await supabase
          .from("goals")
          .update({
            streak: goal.streak + 1,
            updated_at: now.toISOString(),
          })
          .eq("id", goalId);

        if (error) {
          throw error;
        }
      }
      // If there are already completions within 24 hours, do nothing
    } else {
      // If we're decrementing (uncompleting a challenge)
      // Only decrement if this was the last completed challenge in the 24-hour period
      if (completedChallengesIn24Hours <= 1) {
        const { error } = await supabase
          .from("goals")
          .update({
            streak: Math.max(0, goal.streak - 1), // Ensure streak doesn't go below 0
            updated_at: now.toISOString(),
          })
          .eq("id", goalId);

        if (error) {
          throw error;
        }
      }
      // If there are other completed challenges within 24 hours, do nothing
    }
  } catch (error) {
    console.error("Error updating goal streak:", error);
    throw error;
  }
}

export async function resetGoalStreak(
  goalId: string,
  userId: string
): Promise<void> {
  try {
    // First verify that the goal exists and belongs to the user
    const { data: goal, error: goalError } = await supabase
      .from("goals")
      .select("id, user_id")
      .eq("id", goalId)
      .single();

    if (goalError || !goal) {
      throw new Error("Goal not found");
    }

    if (goal.user_id !== userId) {
      throw new Error("Unauthorized: User does not own this goal");
    }

    // Reset the streak to 0
    const { error } = await supabase
      .from("goals")
      .update({
        streak: 0,
        updated_at: new Date().toISOString(),
      })
      .eq("id", goalId);

    if (error) {
      throw error;
    }
  } catch (error) {
    console.error("Error resetting goal streak:", error);
    throw error;
  }
}
