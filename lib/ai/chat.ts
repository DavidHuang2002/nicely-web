import { Message } from "ai";
import { getChatMessagesFromDB } from "../database/supabase";
import { convertDbMessagesToAiMessages, createAIMessage } from "../utils";
import { DatabaseMessage } from "@/models/message";

export const getAIChatMessages = async (
  chatId: string,
  userId: string
): Promise<Message[]> => {
  const messages = await getChatMessagesFromDB(chatId, userId); // get messages from db
  const aiMessages = convertDbMessagesToAiMessages(messages); // convert to ai messages
  return aiMessages;
};

