import { createClient } from "@supabase/supabase-js";
import { User, UserSchema } from "@/models/user";
import { Chat, ChatSchema, ChatTypeEnum } from "@/models/chat";
import { DatabaseMessage, DatabaseMessageSchema } from "@/models/message";
import { z } from "zod";
import { CreateTranscriptionSchema, Transcription, TranscriptionSchema } from "@/models/transcription";
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_KEY!
);

export async function addUserIfNotExists(clerkId: string): Promise<void> {
  try {
    // Check if user exists
    const existingUser = await getUser(clerkId);

    if (!existingUser) {
      // Create new user with basic info
      const newUser = UserSchema.parse({
        clerk_id: clerkId,
        onboarding_completed: false,
      });

      await supabase.from("users").insert([newUser]);
    } else {
      console.log("User already exists. user ID:", existingUser.id);
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
