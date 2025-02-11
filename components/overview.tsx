"use client";

import { motion } from "framer-motion";
import { HeartIcon, NotebookIcon, SparklesIcon } from "./icons";
import { TherapyOption } from "./therapy-option";
import { Button } from "./ui/button";

export const Overview = ({
  onboardingCompleted = false,
  onStartOnboarding,
}: {
  onboardingCompleted?: boolean;
  onStartOnboarding?: () => void;
}) => {
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

      {!onboardingCompleted && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-12 text-center"
        >
          <div className="bg-primary/5 rounded-xl p-6 max-w-xl mx-auto">
            <h3 className="text-lg font-medium mb-3">👋 Welcome to Nicely!</h3>
            <p className="text-muted-foreground mb-4">
              Let&apos;s get to know each other better so I can provide
              personalized support for your therapy journey.
            </p>
            <Button onClick={onStartOnboarding} size="lg">
              Start Quick Setup
            </Button>
          </div>
        </motion.div>
      )}

      <div className="grid md:grid-cols-3 gap-6">
        <TherapyOption
          title="Session Notes"
          description="Reflect on your therapy sessions and track your progress over time"
          icon={<NotebookIcon size={24} />}
          href="/notes"
          disabled={!onboardingCompleted}
        />
        <TherapyOption
          title="Between-session Thoughts"
          description="Work through complex feelings with an AI companion trained in therapeutic techniques"
          icon={<SparklesIcon size={24} />}
          href="/untangle"
          disabled={!onboardingCompleted}
        />
        <TherapyOption
          title="Daily Self-Care"
          description="Build healthy habits and maintain your well-being with personalized guidance"
          icon={<HeartIcon size={24} />}
          href="/chat/self-care"
          disabled={true}
        />
      </div>
    </motion.div>
  );
};
