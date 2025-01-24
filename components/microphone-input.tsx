"use client";

import type { ChatRequestOptions, CreateMessage, Message } from "ai";
import { motion } from "framer-motion";
import type React from "react";
import {
  useRef,
  useState,
  useEffect,
  useCallback,
  type Dispatch,
  type SetStateAction,
} from "react";
import { toast } from "sonner";
import { useWindowSize } from "usehooks-ts";

import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { MicrophoneIcon, StopIcon } from "./icons"; // We'll add this icon

export function MicrophoneInput({
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
}) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);

  const startRecording = () => {
    setIsRecording(true);
    toast.info("Recording started...");
  };

  const stopRecording = () => {
    setIsRecording(false);
    setRecordingDuration(0);
    const transcribedText = "This is a placeholder for transcribed text.";
    setInput(input + (input ? " " : "") + transcribedText);
    toast.success("Recording transcribed");
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingDuration((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isRecording]);

  return (
    <div className="relative">
      <Button
        type="button"
        onClick={isRecording ? stopRecording : startRecording}
        className={cn(
          "rounded-full p-6 h-fit transition-all duration-200",
          isRecording
            ? "bg-destructive hover:bg-destructive/90"
            : "bg-primary hover:bg-primary/90"
        )}
      >
        <motion.div
          animate={isRecording ? { scale: [1, 1.2, 1] } : {}}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          {isRecording ? <StopIcon size={24} /> : <MicrophoneIcon size={24} />}
        </motion.div>
      </Button>
      {isRecording && (
        <div className="absolute top-[-2rem] text-sm text-muted-foreground">
          Recording: {recordingDuration}s
        </div>
      )}
    </div>
  );
}
