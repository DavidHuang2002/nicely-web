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
  initialButtonText?: string;
}

export default function InsightChat({
  insight,
  chatId,
  initialButtonText,
}: InsightChatProps) {
  const initialMessage = createAIMessage(
    `I see you want to explore the insight: "${insight?.summary}". This came from the observation: "${insight?.excerpt}". Would you like to discuss this further or share any thoughts about it?`,
    "assistant"
  );

  return (
    <Chat
      initialMessages={[initialMessage]}
      apiRoute="/api/chat/insight"
      chatId={chatId}
      frontEndRoute="/insight"
      initialButtonText="Let's get started!"
    />
  );
}
