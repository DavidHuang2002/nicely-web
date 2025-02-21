"use client";

import { motion } from "framer-motion";
import { ShieldIcon } from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { SettingsDialog } from "./settings-dialog";

interface PrivacyNoticeProps {
  className?: string;
}

export function PrivacyNotice({ className }: PrivacyNoticeProps) {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <>
      <motion.div
        className={cn("max-w-2xl mx-auto", className)}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
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
              purpose. Conversations remain confidential, just like therapy, and
              are never used to train our models.
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

      <SettingsDialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen} />
    </>
  );
}
