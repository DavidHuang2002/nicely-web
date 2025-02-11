"use client";

import { Chat } from "../chat/basic";
import { createAIMessage } from "@/lib/utils";
import { useState } from "react";
import { Message } from "ai";
import { LoadingBreather } from "../chat/loading";

interface InsightChatProps {
  insight?: {
    summary: string;
    excerpt: string;
    detail: string;
  };
  chatId?: string;
}

const replaceClientWithYou = (message: string | undefined) => {
  if (!message) return "";
  return message.replace("Client", "You");
};

export default function InsightChat({
  insight,
  chatId,
}: InsightChatProps) {
  const initialButtonOptions = [
    "Help me reflect on this",
    "Give me an exercise to work on this",
    "How can I apply this insight?",
  ];
  
  const initialMessage = createAIMessage(
    `I see you want to explore the insight: "${
      insight?.summary
    }". This came from the observation: "${replaceClientWithYou(
      insight?.excerpt
    )}"
    How would you like to explore this insight further?`,
    "assistant"
  );

  return (
    <Chat
      initialMessages={[initialMessage]}
      apiRoute="/api/chat/insight"
      chatId={chatId}
      frontEndRoute="/insight"
      initialButtonOptions={initialButtonOptions}
    />
  );
}
