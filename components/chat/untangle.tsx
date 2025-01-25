"use client";

import { createMessage, generateUUID } from "@/lib/utils";
import { Chat } from "./basic";
import { Message } from "ai";
import { useEffect, useState } from "react";

export const untangleOpenner =
  "Hey, it's good to see you here. 😊 What's been on your mind lately? You can share whatever feels right—I'm here to listen and help make sense of things together.";

const untangleOpennerMessage = createMessage(untangleOpenner, "assistant");

export default function UntangleChat({
  chatId,
  initialMessages,
}: {
  chatId?: string;
  initialMessages?: Message[];
}) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchMessages() {
      if (!chatId) {
        setMessages([untangleOpennerMessage]);
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/chat/${chatId}/messages`);
        if (!response.ok) {
          throw new Error("Failed to fetch messages");
        }
        const fetchedMessages = await response.json();
        setMessages(
          fetchedMessages.length > 0
            ? fetchedMessages
            : [untangleOpennerMessage]
        );
      } catch (error) {
        console.error("Error fetching messages:", error);
        setMessages([untangleOpennerMessage]);
      } finally {
        setIsLoading(false);
      }
    }

    fetchMessages();
  }, [chatId]);

  if (isLoading) {
    return <div>Loading...</div>; // You might want to replace this with a proper loading component
  }

  return (
    <Chat
      initialMessages={messages}
      apiRoute="/api/chat/untangle"
      chatId={chatId}
      frontEndRoute="/untangle"
    />
  );
}
