"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Button } from "./ui/button";
import { MicrophoneIcon, LoaderIcon } from "./icons";
import { ReactNode } from "react";

interface RecordingButtonProps {
  isRecording: boolean;
  isTranscribing: boolean;
  onStartRecording: () => void;
  children?: ReactNode;
  className?: string;
}

export function RecordingButton({
  isRecording,
  isTranscribing,
  onStartRecording,
  children,
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
          {children}
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
