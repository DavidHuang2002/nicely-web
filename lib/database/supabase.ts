import { createClient } from "@supabase/supabase-js";
import { User, UserSchema } from "@/models/user";
import { Chat, ChatSchema, ChatTypeEnum } from "@/models/chat";
import { DatabaseMessage, DatabaseMessageSchema } from "@/models/message";
import { z } from "zod";
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

export async function getUser(clerkId: string): Promise<User> {
  const { data: user } = (await supabase
    .from("users")
    .select()
    .eq("clerk_id", clerkId)
    .single()) as { data: User | null };
  if (!user) {
    throw new Error(`User not found for clerkId: ${clerkId}`);
  }
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
