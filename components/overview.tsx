"use client";

import { motion } from "framer-motion";
import { HeartIcon, NotebookIcon, SparklesIcon } from "./icons";
import { TherapyOption } from "./therapy-option";
export const Overview = () => {
  return (
    <motion.div
      key="overview"
      className="max-w-4xl mx-auto md:mt-20 px-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Your AI Therapy Companion</h1>
        <p className="text-muted-foreground text-lg">
          Continue your healing journey between sessions
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <TherapyOption
          title="Untangle Emotions"
          description="Work through complex feelings with an AI companion trained in therapeutic techniques"
          icon={<SparklesIcon size={24} />}
          href="/chat/emotions"
        />
        <TherapyOption
          title="Daily Self-Care"
          description="Build healthy habits and maintain your well-being with personalized guidance"
          icon={<HeartIcon size={24} />}
          href="/chat/self-care"
        />
        <TherapyOption
          title="Session Notes"
          description="Reflect on your therapy sessions and track your progress over time"
          icon={<NotebookIcon size={24} />}
          href="/chat/notes"
        />
      </div>
    </motion.div>
  );
};
