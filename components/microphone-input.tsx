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
import Recorder from "recorder-js";

import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import {
  MicrophoneIcon,
  StopIcon,
  PauseIcon,
  PlayIcon,
  SendIcon,
} from "./icons";

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
  const [isPaused, setIsPaused] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const recorderRef = useRef<any>(null);

  useEffect(() => {
    const initializeRecorder = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        const audioContext = new (window.AudioContext ||
          (window as any).webkitAudioContext)();
        const recorder = new Recorder(audioContext);
        await recorder.init(stream);
        recorderRef.current = recorder;
      } catch (error) {
        console.error("Error initializing recorder:", error);
        toast.error("Failed to access microphone");
      }
    };

    initializeRecorder();

    return () => {
      if (recorderRef.current) {
        recorderRef.current.stream
          .getTracks()
          .forEach((track: MediaStreamTrack) => track.stop());
      }
    };
  }, []);

  const startRecording = async () => {
    if (!recorderRef.current) {
      toast.error("Microphone not initialized");
      return;
    }

    try {
      await recorderRef.current.start();
      setIsRecording(true);
      setIsPaused(false);
      toast.info("Recording started...");
    } catch (error) {
      console.error("Error starting recording:", error);
      toast.error("Failed to start recording");
    }
  };

  const pauseRecording = async () => {
    if (!recorderRef.current) return;

    try {
      const { blob } = await recorderRef.current.stop();
      setIsRecording(false);
      setIsPaused(true);

      const formData = new FormData();
      formData.append("audio", blob, "audio.wav");

      const response = await fetch("/api/transcribe", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Transcription failed");
      }

      const { text } = await response.json();
      setInput(input + (input ? " " : "") + text);
      toast.success("Recording transcribed");
    } catch (error) {
      console.error("Error pausing recording:", error);
      toast.error("Failed to pause recording");
    }
  };

  const resumeRecording = async () => {
    if (!recorderRef.current) return;

    try {
      await recorderRef.current.start();
      setIsPaused(false);
      setIsRecording(true);
      toast.info("Recording resumed");
    } catch (error) {
      console.error("Error resuming recording:", error);
      toast.error("Failed to resume recording");
    }
  };

  const stopAndSend = async () => {
    if (!recorderRef.current) return;

    try {
      if (isRecording) {
        const { blob } = await recorderRef.current.stop();
        setIsRecording(false);
        setIsPaused(false);
        setRecordingDuration(0);

        const formData = new FormData();
        formData.append("audio", blob, "audio.wav");

        const response = await fetch("/api/transcribe", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error("Transcription failed");
        }

        const { text } = await response.json();
        setInput(input + (input ? " " : "") + text);
      }

      handleSubmit();
      toast.success("Message sent!");
    } catch (error) {
      console.error("Error stopping recording:", error);
      toast.error("Failed to transcribe audio");
    }
  };

  return (
    <div className="relative flex gap-2 items-center">
      <Button
        type="button"
        onClick={() => {
          if (isRecording) {
            pauseRecording();
          } else if (isPaused) {
            resumeRecording();
          } else {
            startRecording();
          }
        }}
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
          {isRecording ? (
            <PauseIcon size={24} />
          ) : isPaused ? (
            <PlayIcon size={24} />
          ) : (
            <MicrophoneIcon size={24} />
          )}
        </motion.div>
      </Button>

      {(isRecording || isPaused || input) && (
        <Button
          type="button"
          onClick={stopAndSend}
          className="rounded-full p-6 h-fit bg-primary hover:bg-primary/90"
        >
          <SendIcon size={24} />
        </Button>
      )}

      {(isRecording || isPaused) && (
        <div className="absolute top-[-2rem] text-sm text-muted-foreground">
          Recording: {recordingDuration}s {isPaused ? "(Paused)" : ""}
        </div>
      )}
    </div>
  );
}
