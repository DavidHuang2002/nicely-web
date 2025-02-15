"use client";

import type { ChatRequestOptions, CreateMessage, Message } from "ai";
import { motion } from "framer-motion";
import type React from "react";
import { useState, type Dispatch, type SetStateAction } from "react";
import { toast } from "sonner";
import { useRecorder } from "@/hooks/use-recorder";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import {
  MicrophoneIcon,
  StopIcon,
  PauseIcon,
  PlayIcon,
  SendIcon,
  LoaderIcon,
} from "./icons";
import { WaveformVisualizer } from "./waveform-visualizer";
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
    <div className="relative flex gap-2 items-center">
      {isRecording || isPaused ? (
        <div className="relative flex items-center gap-2 bg-primary rounded-full p-2 pr-4 w-[300px] overflow-hidden">
          {isTranscribing && (
            <LoaderIcon
              size={24}
              className="text-primary-foreground animate-spin"
            />
          )}
          <Button
            type="button"
            onClick={() => {
              if (isRecording) {
                handlePauseRecording();
              } else if (isPaused) {
                resumeRecording();
              }
            }}
            variant="ghost"
            className="rounded-full p-2 h-fit hover:bg-primary/90"
            disabled={isTranscribing}
          >
            <motion.div
              animate={isRecording ? { scale: [1, 1.2, 1] } : {}}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              {isRecording ? (
                <PauseIcon size={20} className="text-primary-foreground" />
              ) : (
                <PlayIcon size={20} className="text-primary-foreground" />
              )}
            </motion.div>
          </Button>

          <div className="flex-1">
            <WaveformVisualizer isRecording={isRecording} stream={stream} />
          </div>

          <Button
            type="button"
            onClick={handleStopAndSend}
            variant="ghost"
            className="rounded-full p-2 h-fit hover:bg-primary/90"
            disabled={isTranscribing}
          >
            <SendIcon size={20} className="text-primary-foreground" />
          </Button>
        </div>
      ) : (
        <Button
          type="button"
          onClick={startRecording}
          className="rounded-full p-6 h-fit bg-primary hover:bg-primary/90"
          disabled={isTranscribing}
        >
          <MicrophoneIcon size={24} />
        </Button>
      )}

      {!isRecording && !isPaused && input && (
        <Button
          type="button"
          onClick={handleStopAndSend}
          className="rounded-full p-6 h-fit bg-primary hover:bg-primary/90"
          disabled={isTranscribing}
        >
          <SendIcon size={24} />
        </Button>
      )}
    </div>
  );
}
