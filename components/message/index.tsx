"use client";

import type { Message } from "ai";
import { motion } from "framer-motion";

import { Markdown } from "../markdown";
import { PreviewAttachment } from "../preview-attachment";
import { cn } from "@/lib/utils";
import { Weather } from "../weather";
import { TherapistAvatar } from "./therapist-avatar";
import { UserAvatar } from "./user-avatar";

export const PreviewMessage = ({
  message,
}: {
  chatId: string;
  message: Message;
  isLoading: boolean;
}) => {
  return (
    <motion.div
      className="w-full mx-auto max-w-3xl px-4 group/message"
      initial={{ y: 5, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      data-role={message.role}
    >
      <div
        className={cn(
          "flex gap-4",
          message.role === "user" ? "flex-row-reverse" : "flex-row"
        )}
      >
        {message.role === "assistant" ? (
          <TherapistAvatar size={40} />
        ) : (
          <UserAvatar size={40} />
        )}

        <div
          className={cn(
            "flex flex-col gap-2 max-w-[80%]",
            message.role === "user" ? "items-end" : "items-start"
          )}
        >
          <div
            className={cn(
              "rounded-2xl px-4 py-2",
              message.role === "user"
                ? "bg-primary text-primary-foreground"
                : "bg-muted"
            )}
          >
            {message.content && (
              <div className="flex flex-col gap-4">
                <Markdown>{message.content as string}</Markdown>
              </div>
            )}
          </div>

          {message.toolInvocations && message.toolInvocations.length > 0 && (
            <div className="flex flex-col gap-4">
              {message.toolInvocations.map((toolInvocation) => {
                const { toolName, toolCallId, state } = toolInvocation;

                if (state === "result") {
                  const { result } = toolInvocation;

                  return (
                    <div key={toolCallId}>
                      {toolName === "get_current_weather" ? (
                        <Weather weatherAtLocation={result} />
                      ) : (
                        <pre>{JSON.stringify(result, null, 2)}</pre>
                      )}
                    </div>
                  );
                }
                return (
                  <div
                    key={toolCallId}
                    className={cn({
                      skeleton: ["get_current_weather"].includes(toolName),
                    })}
                  >
                    {toolName === "get_current_weather" ? <Weather /> : null}
                  </div>
                );
              })}
            </div>
          )}

          {message.experimental_attachments && (
            <div className="flex flex-row gap-2">
              {message.experimental_attachments.map((attachment) => (
                <PreviewAttachment
                  key={attachment.url}
                  attachment={attachment}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export const ThinkingMessage = () => {
  return (
    <motion.div
      className="w-full mx-auto max-w-3xl px-4 group/message"
      initial={{ y: 5, opacity: 0 }}
      animate={{ y: 0, opacity: 1, transition: { delay: 1 } }}
    >
      <div className="flex gap-4">
        <TherapistAvatar size={40} />
        <div className="flex flex-col gap-2">
          <div className="bg-muted rounded-2xl px-4 py-2">
            <div className="text-muted-foreground">Thinking...</div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
