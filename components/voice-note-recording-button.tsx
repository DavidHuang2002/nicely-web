"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Button } from "./ui/button";
import { MicrophoneIcon, LoaderIcon } from "./icons";
import { Save } from "lucide-react";
import { ReactNode } from "react";

interface RecordingButtonProps {
  isRecording: boolean;
  isTranscribing: boolean;
  onStartRecording: () => void;
  handleStopRecording: () => void;
  className?: string;
}

export function RecordingButton({
  isRecording,
  isTranscribing,
  onStartRecording,
  handleStopRecording,
  className,
}: RecordingButtonProps) {
  return (
    <AnimatePresence mode="wait">
      {isRecording ? (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          className="flex items-center gap-3 bg-primary rounded-full p-2 pr-4 overflow-hidden"
        >
          {isTranscribing ? (
            <LoaderIcon className="w-5 h-5 text-primary-foreground animate-spin" />
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
              <div className="absolute inset-0 bg-primary-foreground/20 rounded-full animate-ping" />
              <MicrophoneIcon
                size={20}
                className="text-primary-foreground relative z-10"
              />
            </motion.div>
          )}
          <Button
            type="button"
            onClick={handleStopRecording}
            variant="ghost"
            className="rounded-full p-2 h-fit hover:bg-primary/90"
            disabled={isTranscribing}
          >
            <Save className="h-5 w-5 text-primary-foreground" />
          </Button> 
        </motion.div>
      ) : (
        <Button
          size="lg"
          onClick={onStartRecording}
          disabled={isTranscribing}
          className={className}
        >
          <MicrophoneIcon className="mr-2 h-5 w-5" />
          Start Recording
        </Button>
      )}
    </AnimatePresence>
  );
}
