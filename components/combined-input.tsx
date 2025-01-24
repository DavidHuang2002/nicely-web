import { ChatRequestOptions, CreateMessage, Message } from "ai";
import { Dispatch, SetStateAction, useState } from "react";
import { MicrophoneInput } from "./microphone-input";
import { MultimodalInput } from "./multimodal-input";
import { Button } from "./ui/button";
import { KeyboardIcon, MicrophoneIcon } from "./icons";
import { cn } from "@/lib/utils";

export function CombinedInput({
  chatId,
  input,
  setInput,
  isLoading,
  stop,
  messages,
  setMessages,
  append,
  handleSubmit,
  className,
  isOnboardingStart = false,
}: {
  chatId: string;
  input: string;
  setInput: (value: string) => void;
  isLoading: boolean;
  stop: () => void;
  messages: Array<Message>;
  setMessages: Dispatch<SetStateAction<Array<Message>>>;
  append: (
    message: Message | CreateMessage,
    chatRequestOptions?: ChatRequestOptions
  ) => Promise<string | null | undefined>;
  handleSubmit: (
    event?: {
      preventDefault?: () => void;
    },
    chatRequestOptions?: ChatRequestOptions
  ) => void;
  className?: string;
  isOnboardingStart?: boolean;
}) {
  const [inputMode, setInputMode] = useState<"microphone" | "keyboard">(
    "microphone"
  );

  return (
    <div className="relative w-full">
      <div className="flex flex-col items-center gap-4 w-full">
        {/* Input Mode Switcher */}
        <div className="flex items-center gap-2 bg-muted rounded-full p-1">
          <Button
            type="button"
            variant={inputMode === "microphone" ? "default" : "ghost"}
            size="sm"
            onClick={() => setInputMode("microphone")}
            className={cn(
              "rounded-full flex items-center gap-2 transition-all",
              inputMode === "microphone" && "shadow-sm"
            )}
          >
            <MicrophoneIcon size={16} />
            <span className="text-sm">Voice</span>
          </Button>
          <Button
            type="button"
            variant={inputMode === "keyboard" ? "default" : "ghost"}
            size="sm"
            onClick={() => setInputMode("keyboard")}
            className={cn(
              "rounded-full flex items-center gap-2 transition-all",
              inputMode === "keyboard" && "shadow-sm"
            )}
          >
            <KeyboardIcon size={16} />
            <span className="text-sm">Type</span>
          </Button>
        </div>

        {/* Input Components */}
        <div className={cn("w-full", className)}>
          {inputMode === "microphone" ? (
            <div className="flex justify-center w-full">
              <MicrophoneInput
                chatId={chatId}
                input={input}
                setInput={setInput}
                handleSubmit={handleSubmit}
                isLoading={isLoading}
                stop={stop}
                messages={messages}
                setMessages={setMessages}
                append={append}
              />
            </div>
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
              isOnboardingStart={isOnboardingStart}
            />
          )}
        </div>
      </div>
    </div>
  );
}
