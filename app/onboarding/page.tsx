"use client";
import { Chat } from "@/components/chat";
import type { Message } from "ai";

const onboardingMessages: Message[] = [
  {
    id: "1",
    role: "assistant",
    content:
      "Hi! I am Nic, your therapy assistant. I'm here to help you get started. First, could you tell me what brings you here today?",
  },
];

export default function Page() {
  return <Chat initialMessages={onboardingMessages} />;
}
