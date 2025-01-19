"use client";

import { PreviewMessage, ThinkingMessage } from "@/components/message";
import { MultimodalInput } from "@/components/multimodal-input";
import { useScrollToBottom } from "@/hooks/use-scroll-to-bottom";
import { Message, useChat } from "ai/react";
import { toast } from "sonner";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { COMPLETE_ONBOARDING_TOOL_NAME } from "@/models/constants";
import { createMessage } from "@/lib/utils";
import { onboardingFinishedMessageContent } from "@/lib/llm/prompts";
import { useRouter } from "next/navigation";
import Link from "next/link";

const onboardingFinishedMessage: Message = createMessage(
  onboardingFinishedMessageContent,
  "assistant"
);

const chatCompletedToolIsCalled = (message: Message) => {
  return message.toolInvocations?.some(
    (tool) => tool.toolName === COMPLETE_ONBOARDING_TOOL_NAME
  );
};

export function Chat({
  initialMessages = [],
  apiRoute = "/api/chat",
  isOnboarding = false,
}: {
  initialMessages?: Array<Message>;
  apiRoute?: string;
  isOnboarding?: boolean;
}) {
  const chatId = "001";
  const [isCompleted, setIsCompleted] = useState(false);
  const router = useRouter();

  const {
    messages,
    setMessages,
    handleSubmit,
    input,
    setInput,
    append,
    isLoading,
    stop,
  } = useChat({
    api: apiRoute,
    maxSteps: 4,
    initialMessages,
    onFinish: (message) => {
      console.log("message", message);
      if (chatCompletedToolIsCalled(message)) {
        // remove the tool call message
        setMessages((prev) => prev.slice(0, -1));

        // add the onboarding finished message
        setIsCompleted(true);
        setMessages((prev) => [...prev, onboardingFinishedMessage]);
      }
    },
    onError: (error) => {
      if (error.message.includes("Too many requests")) {
        toast.error(
          "You are sending too many messages. Please try again later."
        );
      }
    },
  });

  const [messagesContainerRef, messagesEndRef] =
    useScrollToBottom<HTMLDivElement>();

  return (
    <div className="flex flex-col min-w-0 h-[calc(100dvh-52px)] bg-background">
      <div
        ref={messagesContainerRef}
        className="flex flex-col min-w-0 gap-6 flex-1 overflow-y-scroll pt-4"
      >
        {/* TODO: have a overview for specifc type of chat */}
        {/* {messages.length === 0 && <Overview />} */}

        {messages.map((message, index) => (
          <PreviewMessage
            key={message.id}
            chatId={chatId}
            message={message}
            isLoading={isLoading && messages.length - 1 === index}
          />
        ))}

        {isLoading &&
          messages.length > 0 &&
          messages[messages.length - 1].role === "user" && <ThinkingMessage />}

        <div
          ref={messagesEndRef}
          className="shrink-0 min-w-[24px] min-h-[24px]"
        />
      </div>

      <form className="flex mx-auto px-4 bg-background pb-4 md:pb-6 gap-2 w-full md:max-w-3xl">
        {isCompleted ? (
          <Button
            type="button"
            className="w-full"
            onClick={() => router.push("/home")}
          >
            Go to home
          </Button>
        ) : (
          <MultimodalInput
            chatId={chatId}
            input={input}
            setInput={setInput}
            handleSubmit={handleSubmit}
            isLoading={isLoading}
            stop={stop}
            messages={messages}
            setMessages={setMessages}
            append={append}
            isOnboardingStart={messages.length === 1 && isOnboarding}
          />
        )}
      </form>
    </div>
  );
}
