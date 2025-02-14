"use client";

import { motion } from "framer-motion";
import { HeartIcon, NotebookIcon, SparklesIcon, ShieldIcon } from "./icons";
import { TherapyOption } from "./therapy-option";
import { Button } from "./ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { useState } from "react";
import { SettingsDialog } from "./settings-dialog";

export const Overview = ({
  onboardingCompleted = false,
  onStartOnboarding,
}: {
  onboardingCompleted?: boolean;
  onStartOnboarding?: () => void;
}) => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <>
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
              <h3 className="text-lg font-medium mb-3">
                👋 Welcome to Nicely!
              </h3>
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
            // disabled={!onboardingCompleted}
          />
          <TherapyOption
            title="Between-session Thoughts"
            description="Work through complex feelings with an AI companion trained in therapeutic techniques"
            icon={<SparklesIcon size={24} />}
            href="/untangle"
            // disabled={!onboardingCompleted}
          />
          <TherapyOption
            title="Daily Self-Care"
            description="Build healthy habits and maintain your well-being with personalized guidance"
            icon={<HeartIcon size={24} />}
            href="/chat/self-care"
            disabled={true}
          />
        </div>

        <motion.div
          className="mt-8 max-w-2xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <div className="relative">
            <div className="relative px-5 py-4 rounded-xl border border-primary/5 bg-muted/30">
              <div className="flex items-center gap-2 mb-2">
                <ShieldIcon className="h-4 w-4 text-primary/50" />
                <h3 className="text-sm font-medium text-muted-foreground">
                  Your Privacy is Our Priority
                </h3>
              </div>
              <p className="text-xs text-muted-foreground/80 leading-relaxed">
                We never share or sell your information beyond our app&apos;s
                purpose. Conversations remain confidential, just like therapy,
                and are never used to train our models.
              </p>
              <Button
                variant="link"
                className="text-xs text-primary/50 hover:text-primary mt-1 h-auto p-0"
                onClick={() => setIsSettingsOpen(true)}
              >
                View Privacy Settings →
              </Button>
            </div>
          </div>
        </motion.div>
      </motion.div>
      <SettingsDialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen} />
    </>
  );
};
