"use client";

import { Button } from "@/components/ui/button";
import { SignInButton } from "@clerk/nextjs";
import { motion } from "framer-motion";
import { HeartIcon, SparklesIcon, NotebookIcon } from "@/components/icons";

export function LandingPageContent() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-primary/5">
      <div className="flex flex-col items-center justify-center min-h-screen px-4 py-8 md:py-12 gap-8 md:gap-12">
        {/* Hero Section */}
        <motion.div
          className="text-center space-y-4 md:space-y-6 max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent leading-tight">
            Your journey to well-being continues beyond the couch
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed px-4 md:px-0">
            Meet Nicely, your AI companion that helps you sustain therapy&apos;s
            peace and clarity.
          </p>
        </motion.div>

        {/* Features Section */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 max-w-4xl mx-auto px-4 md:px-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <FeatureCard
            icon={<SparklesIcon size={24} />}
            title="Untangle Emotions"
            description="Make sense of your emotions, one step at a time"
          />
          <FeatureCard
            icon={<HeartIcon size={24} />}
            title="Daily Self-Care"
            description="Self-care that adapts to your journey and grows with you"
          />
          <FeatureCard
            icon={<NotebookIcon size={24} />}
            title="Session Notes"
            description="Easily revisit and build on your therapy discoveries"
          />
        </motion.div>

        {/* CTA Section */}
        <motion.div
          className="text-center px-4"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          <SignInButton mode="modal" signUpForceRedirectUrl="/sign-in-success">
            <Button
              size="lg"
              className="px-6 py-6 text-base md:text-lg rounded-full w-full md:w-auto md:px-8"
            >
              Join now
            </Button>
          </SignInButton>
          <p className="mt-4 text-sm text-muted-foreground">
            Your safe space for emotional growth and self-discovery
          </p>
        </motion.div>
      </div>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col items-center text-center p-4 md:p-6 rounded-2xl bg-card/50 backdrop-blur-sm border border-primary/10 hover:border-primary/20 transition-colors">
      <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground text-sm md:text-base">
        {description}
      </p>
    </div>
  );
}
