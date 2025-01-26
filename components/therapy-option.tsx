"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

interface TherapyOptionProps {
  title: string;
  description: string;
  icon: ReactNode;
  href: string;
  disabled?: boolean;
}

export const TherapyOption = ({
  title,
  description,
  icon,
  href,
  disabled = false,
}: TherapyOptionProps) => {
  const content = (
    <motion.div
      className={cn(
        "rounded-xl p-6 bg-muted transition-colors cursor-pointer flex flex-col gap-4 h-full",
        disabled
          ? "opacity-50 cursor-not-allowed hover:bg-muted"
          : "hover:bg-accent"
      )}
      whileHover={disabled ? {} : { scale: 1.02 }}
      whileTap={disabled ? {} : { scale: 0.98 }}
    >
      <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center">
        {icon}
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-lg">{title}</h3>
          {disabled &&
            !href.includes("self-care") &&
            !href.includes("notes") && (
              <span className="text-xs text-muted-foreground">
                Complete setup first
              </span>
            )}
          {disabled &&
            (href.includes("self-care") || href.includes("notes")) && (
              <span className="text-xs text-muted-foreground">
                (Coming Soon)
              </span>
            )}
        </div>
        <p className="text-muted-foreground text-sm">{description}</p>
      </div>
    </motion.div>
  );

  if (disabled) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div>{content}</div>
          </TooltipTrigger>
          <TooltipContent>
            <p>
              {href.includes("self-care") || href.includes("notes")
                ? "This feature is coming soon!"
                : "Complete the quick setup to unlock this feature"}
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return <Link href={href}>{content}</Link>;
};
