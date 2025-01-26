import { Chat } from "./basic";
import type { Message } from "ai";
import { useEffect, useState } from "react";
import { LoadingBreather } from "./loading";


export default function OnboardingChat() {
  const [isLoading, setIsLoading] = useState(true);
  const [chatId, setChatId] = useState<string | null>(null);
  const [initialMessages, setInitialMessages] = useState<Message[]>([]);

  useEffect(() => {
    async function initializeChat() {
      try {
        // Check for existing onboarding chat
        const response = await fetch("/api/chat/onboarding/manage");
        const data = await response.json();

        if (data.exists) {
          setChatId(data.chatId);
          setInitialMessages(data.messages);
        } else {
          // Create new onboarding chat
          const createResponse = await fetch("/api/chat/onboarding/manage", {
            method: "POST",
          });
          const createData = await createResponse.json();
          setChatId(createData.chatId);
          setInitialMessages(createData.messages);
        }
      } catch (error) {
        console.error("Error initializing onboarding chat:", error);
      } finally {
        setIsLoading(false);
      }
    }

    initializeChat();
  }, []);

  if (isLoading) {
    return <LoadingBreather />;
  }

  return (
    <Chat
      initialMessages={initialMessages}
      apiRoute="/api/chat/onboarding"
      isOnboarding={true}
      chatId={chatId!}
    />
  );
}
