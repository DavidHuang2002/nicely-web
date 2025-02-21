"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronDown, Plus, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Section } from "./section";

interface RecommendedGoal {
  title: string;
  description: string;
}

interface RecommendedGoalsSectionProps {
  recommendations: RecommendedGoal[];
}

export function RecommendedGoalsSection({
  recommendations,
}: RecommendedGoalsSectionProps) {
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);

  const toggleGoal = (title: string) => {
    setSelectedGoals((prev) =>
      prev.includes(title) ? prev.filter((g) => g !== title) : [...prev, title]
    );
  };

  const selectedCount = selectedGoals.length > 0 && (
    <span className="text-sm text-muted-foreground">
      ({selectedGoals.length} selected)
    </span>
  );

  return (
    <Section
      title="Recommended Goals"
      expandable
      defaultExpanded={true}
      rightElement={selectedCount}
    >
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Select goals to add them to your therapy journey dashboard. These will
          appear as themes to work on and track your progress.
        </p>

        <div className="grid gap-3">
          {recommendations.map((rec) => (
            <Card
              key={rec.title}
              className={cn(
                "p-4 cursor-pointer transition-all duration-200",
                "hover:border-primary/50",
                selectedGoals.includes(rec.title) &&
                  "border-primary bg-primary/5"
              )}
              onClick={() => toggleGoal(rec.title)}
            >
              <div className="flex items-start gap-3">
                <div
                  className={cn(
                    "mt-1 p-1 rounded-full border",
                    selectedGoals.includes(rec.title)
                      ? "border-primary bg-primary text-white"
                      : "border-muted-foreground/30"
                  )}
                >
                  {selectedGoals.includes(rec.title) ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Plus className="h-4 w-4" />
                  )}
                </div>
                <div>
                  <h3 className="font-medium">{rec.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {rec.description}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {selectedGoals.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-end"
          >
            <Button>
              Add {selectedGoals.length} Goal
              {selectedGoals.length !== 1 && "s"} to Dashboard
            </Button>
          </motion.div>
        )}
      </div>
    </Section>
  );
}
