"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface SectionProps {
  title: string;
  children: React.ReactNode;
  expandable?: boolean;
  defaultExpanded?: boolean;
  rightElement?: React.ReactNode;
}

export const Section = ({
  title,
  children,
  expandable = false,
  defaultExpanded = true,
  rightElement,
}: SectionProps) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-primary">{title}</h2>
        <div className="flex items-center gap-2">
          {rightElement}
          {expandable && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="hover:bg-accent/50"
            >
              <ChevronDown
                className={cn(
                  "h-4 w-4 transition-transform duration-200",
                  isExpanded && "rotate-180"
                )}
              />
            </Button>
          )}
        </div>
      </div>

      <AnimatePresence>
        {(!expandable || isExpanded) && (
          <motion.div
            initial={expandable ? { height: 0, opacity: 0 } : undefined}
            animate={{ height: "auto", opacity: 1 }}
            exit={expandable ? { height: 0, opacity: 0 } : undefined}
            transition={{ duration: 0.2 }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
