import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

const breathingMessages = [
  "Take a deep breath...",
  "Clear your mind...",
  "Find your center...",
  "Be present...",
  "Relax your shoulders...",
];

export function LoadingBreather() {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % breathingMessages.length);
    }, 4000); // Change message every 4 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100dvh-52px)] gap-8">
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="relative"
      >
        <div className="absolute inset-0 rounded-full bg-primary/10 animate-ping" />
        <div className="relative size-32 rounded-full bg-primary/20 flex items-center justify-center">
          <div className="size-24 rounded-full bg-primary/30" />
        </div>
      </motion.div>

      <AnimatePresence mode="wait">
        <motion.p
          key={messageIndex}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="text-xl text-muted-foreground"
        >
          {breathingMessages[messageIndex]}
        </motion.p>
      </AnimatePresence>
    </div>
  );
}
