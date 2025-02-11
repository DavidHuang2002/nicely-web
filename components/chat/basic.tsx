"use client";

import { PreviewMessage, ThinkingMessage } from "@/components/message";
import { MultimodalInput } from "@/components/multimodal-input";
import { useScrollToBottom } from "@/hooks/use-scroll-to-bottom";
import { Message, useChat } from "ai/react";
import { toast } from "sonner";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { COMPLETE_ONBOARDING_TOOL_NAME } from "@/models/constants";
import { createAIMessage, generateUUID } from "@/lib/utils";
import { onboardingFinishedMessageContent } from "@/lib/ai/prompts";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CombinedInput } from "../combined-input";
import { ChatRequestOptions, CreateMessage } from "ai";
import { InitialOptionsButtons } from "./initial-options-buttons";

const onboardingFinishedMessage: Message = createAIMessage(
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
  frontEndRoute,
  chatId,
  initialButtonOptions,
}: {
  initialMessages?: Array<Message>;
  apiRoute?: string;
  isOnboarding?: boolean;
  chatId?: string;
  frontEndRoute?: string;
  initialButtonOptions?: Array<string>;
}) {
  chatId = chatId || (generateUUID() as string);

  const [isCompleted, setIsCompleted] = useState(false);
  const router = useRouter();

  const {
    messages,
    setMessages,
    handleSubmit: aiSDKHandleSubmit,
    input,
    setInput,
    append: aiSDKAppend,
    isLoading,
    stop,
  } = useChat({
    api: apiRoute,
    maxSteps: 4,
    initialMessages,
    // TODO: for some reason when passed in an id, the chat messages are not showing
    // up in front end
    // id: chatId,
    body: {
      chatId,
    },
    onFinish: (message) => {
      console.log("message", message);
      if (chatCompletedToolIsCalled(message)) {
        console.log("chat completed tool is called");
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

  const jumpToNewChatRouteIfNeeded = () => {
    if (frontEndRoute) {
      console.log("pushing to new route", frontEndRoute, chatId);
      window.history.replaceState({}, "", `${frontEndRoute}/${chatId}`);
    }
  };

  const customHandleSubmit = async (
    event?: {
      preventDefault?: () => void;
    },
    chatRequestOptions?: ChatRequestOptions
  ) => {
    jumpToNewChatRouteIfNeeded();
    await aiSDKHandleSubmit(event, chatRequestOptions);
  };

  const customAppend = async (
    message: Message | CreateMessage,
    chatRequestOptions?: ChatRequestOptions
  ) => {
    jumpToNewChatRouteIfNeeded();
    return await aiSDKAppend(message, chatRequestOptions);
  };

  const [messagesContainerRef, messagesEndRef] =
    useScrollToBottom<HTMLDivElement>();

  return (
    <div className="flex flex-col min-w-0 h-[calc(100dvh-52px)] bg-background">
      <div
        ref={messagesContainerRef}
        className="flex flex-col min-w-0 gap-6 flex-1 overflow-y-auto pt-4"
      >
        {/* TODO: have a overview for specifc type of chat */}
        {/* {messages.length === 0 && <Overview />} */}

        {messages.map((message, index) => (
          <PreviewMessage
            key={message.id}
            chatId={chatId!}
            message={message}
            isLoading={isLoading && messages.length - 1 === index}
          />
        ))}

        {isLoading &&
          messages.length > 0 &&
          // because we are not displaying tool invocations, so we also want to display thinking
          // for the message after it
          (messages[messages.length - 1].role === "user" ||
            messages[messages.length - 1].toolInvocations) && (
            <ThinkingMessage />
          )}

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
        ) : messages.length === 1 &&
          (initialButtonOptions?.length || isOnboarding) ? (
          <InitialOptionsButtons
            options={initialButtonOptions || ["Let's get started!"]}
            customAppend={customAppend}
          />
        ) : (
          <CombinedInput
            chatId={chatId}
            input={input}
            setInput={setInput}
            handleSubmit={customHandleSubmit}
            isLoading={isLoading}
            stop={stop}
            messages={messages}
            setMessages={setMessages}
            append={customAppend}
          />
        )}
      </form>
    </div>
  );
}
