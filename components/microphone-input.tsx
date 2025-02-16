"use client";

import type { ChatRequestOptions, CreateMessage, Message } from "ai";
import { motion, AnimatePresence } from "framer-motion";
import type React from "react";
import { useState, type Dispatch, type SetStateAction } from "react";
import { toast } from "sonner";
import { useRecorder } from "@/hooks/use-recorder";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { MicrophoneIcon, SendIcon, LoaderIcon, StopIcon } from "./icons";
import { transcribeAudioBlob } from "@/components/utils/transcribe";
// Size threshold for direct upload vs S3 route (4.5MB)

const MAX_RECORDING_DURATION = 4; // Maximum recording duration in minutes

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
  const {
    isRecording,
    isPaused,
    stream,
    startRecording,
    stopRecording,
    pauseRecording,
    resumeRecording,
  } = useRecorder(MAX_RECORDING_DURATION);
  const [isTranscribing, setIsTranscribing] = useState(false);

  const handlePauseRecording = async () => {
    try {
      setIsTranscribing(true);
      toast.loading("Transcribing your message...", {
        id: "transcription-toast",
      });

      const blob = await pauseRecording();
      if (blob) {
        const transcribedText = await transcribeAudioBlob(blob, input);
        if (transcribedText) {
          setInput(transcribedText);
        }
      }

      toast.success("Recording transcribed", {
        id: "transcription-toast",
      });
    } catch (error) {
      console.error("Error in handlePauseRecording:", error);
      toast.error("Failed to transcribe recording", {
        id: "transcription-toast",
      });
    } finally {
      setIsTranscribing(false);
    }
  };

  const handleStopAndSend = async () => {
    try {
      if (isRecording) {
        setIsTranscribing(true);
        toast.loading("Transcribing your message...", {
          id: "transcription-toast",
        });
        const blob = await stopRecording();
        if (blob) {
          const transcribedText = await transcribeAudioBlob(blob, input);
          if (transcribedText) {
            await append({
              role: "user",
              content: transcribedText,
            });
          }
        }

        toast.success("Message sent!", {
          id: "transcription-toast",
          duration: 500,
        });
      } else if (input) {
        await append({
          role: "user",
          content: input,
        });
      }

      setInput("");
    } catch (error) {
      console.error("Error in handleStopAndSend:", error);
      toast.error("Failed to transcribe audio", {
        id: "transcription-toast",
      });
    } finally {
      setIsTranscribing(false);
    }
  };

  return (
    <div className="relative flex gap-2 items-center justify-center">
      <AnimatePresence mode="wait">
        {isRecording ? (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="flex items-center gap-3 bg-primary/10 backdrop-blur-sm rounded-full p-4"
          >
            {isTranscribing ? (
              <LoaderIcon className="w-6 h-6 text-primary animate-spin" />
            ) : (
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [1, 0.7, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="relative"
              >
                <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping" />
                <MicrophoneIcon
                  size={24}
                  className="text-primary relative z-10"
                />
              </motion.div>
            )}

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleStopAndSend}
                className="rounded-full hover:bg-primary/20"
                disabled={isTranscribing}
              >
                <SendIcon size={20} className="text-primary" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handlePauseRecording}
                className="rounded-full hover:bg-primary/20"
                disabled={isTranscribing}
                type="button"
              >
                <StopIcon size={20} />
              </Button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
          >
            <Button
              onClick={startRecording}
              className="rounded-full p-6 bg-primary/10 hover:bg-primary/20 transition-colors"
              disabled={isTranscribing}
              type="button"
            >
              <MicrophoneIcon size={24} className="text-primary" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {!isRecording && input && (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        >
          <Button
            onClick={handleStopAndSend}
            className="rounded-full p-6 bg-primary/10 hover:bg-primary/20"
            disabled={isTranscribing}
            type="button"
          >
            <SendIcon size={24} className="text-primary" />
          </Button>
        </motion.div>
      )}
    </div>
  );
}
