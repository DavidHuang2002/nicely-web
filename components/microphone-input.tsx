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
  LoaderIcon,
} from "./icons";
import { WaveformVisualizer } from "./waveform-visualizer";

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
  const [stream, setStream] = useState<MediaStream | undefined>();
  const [isTranscribing, setIsTranscribing] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const MAX_RECORDING_DURATION = 200; // Maximum recording duration in seconds

  useEffect(() => {
    const initializeRecorder = async () => {
      try {
        const audioStream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        setStream(audioStream);
        const audioContext = new (window.AudioContext ||
          (window as any).webkitAudioContext)();
        const recorder = new Recorder(audioContext);
        await recorder.init(audioStream);
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
        setStream(undefined);
      }
    };
  }, []);

  const startRecordingTimer = () => {
    // Clear any existing timer
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    // Set new timer
    timerRef.current = setTimeout(() => {
      // check if recording is in progress
      if (recorderRef.current) {
        pauseRecording();
        toast.info(
          "Maximum recording duration reached. You can continue by clicking resume."
        );
      }
    }, MAX_RECORDING_DURATION * 1000);
  };

  const startRecording = async () => {
    if (!recorderRef.current) {
      toast.error("Microphone not initialized");
      return;
    }

    try {
      await recorderRef.current.start();
      setIsRecording(true);
      setIsPaused(false);
      toast.info(
        `Recording started. (Maximum duration: ${MAX_RECORDING_DURATION} seconds.)`
      );

      startRecordingTimer();
    } catch (error) {
      console.error("Error starting recording:", error);
      toast.error("Failed to start recording");
    }
  };

  const pauseRecording = async () => {
    if (!recorderRef.current) return;

    // Clear recording timer
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    try {
      const { blob } = await recorderRef.current.stop();
      setIsRecording(false);
      setIsPaused(true);
      setIsTranscribing(true);

      // Add toast notification for transcription in progress
      toast.loading("Transcribing your message...", {
        id: "transcription-toast",
      });

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
      toast.success("Recording transcribed", {
        id: "transcription-toast",
      });
    } catch (error) {
      console.error("Error pausing recording:", error);
      toast.error("Failed to pause recording", {
        id: "transcription-toast",
      });
    } finally {
      setIsTranscribing(false);
    }
  };

  const resumeRecording = async () => {
    if (!recorderRef.current) return;

    try {
      await recorderRef.current.start();
      setIsPaused(false);
      setIsRecording(true);
      toast.info(
        `Recording resumed. (Maximum duration: ${MAX_RECORDING_DURATION} seconds.)`
      );

      startRecordingTimer();
    } catch (error) {
      console.error("Error resuming recording:", error);
      toast.error("Failed to resume recording");
    }
  };

  const stopAndSend = async () => {
    if (!recorderRef.current) return;

    // Clear recording timer
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    try {
      if (isRecording) {
        const { blob } = await recorderRef.current.stop();
        setIsRecording(false);
        setIsPaused(false);
        setRecordingDuration(0);
        setIsTranscribing(true);

        // Add toast notification for transcription in progress
        toast.loading("Transcribing your message...", {
          id: "transcription-toast",
        });

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
        const newInput = input + (input ? " " : "") + text;

        // Update the input state for UI consistency
        setInput(newInput);

        // Use append to send the message
        await append({
          role: "user",
          content: newInput,
        });

        toast.success("Message sent!", {
          id: "transcription-toast",
        });
      } else if (input) {
        // If we're not recording but have input (from previous transcription), just send it
        await append({
          role: "user",
          content: input,
        });
        toast.success("Message sent!");
      }

      // clear the input
      setInput("");
    } catch (error) {
      console.error("Error stopping recording:", error);
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
                pauseRecording();
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
            onClick={stopAndSend}
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
          onClick={stopAndSend}
          className="rounded-full p-6 h-fit bg-primary hover:bg-primary/90"
          disabled={isTranscribing}
        >
          <SendIcon size={24} />
        </Button>
      )}
    </div>
  );
}
