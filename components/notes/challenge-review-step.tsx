import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronDown, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import type { AiRecommendationItem, GeneratedChallenge } from "@/models/goals";
import { toast } from "sonner";

interface ChallengeReviewStepProps {
  goal: AiRecommendationItem;
  challenges: GeneratedChallenge[];
  selectedChallenges: GeneratedChallenge[];
  onChallengesSelected: (challenges: GeneratedChallenge[]) => void;
  isGenerating: boolean;
}

export function ChallengeReviewStep({
  goal,
  challenges,
  selectedChallenges,
  onChallengesSelected,
  isGenerating,
}: ChallengeReviewStepProps) {
  const [expandedChallenge, setExpandedChallenge] = useState<string | null>(
    null
  );

  if (isGenerating) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <p className="text-muted-foreground ml-2">
          Generating personalized challenges...
        </p>
      </div>
    );
  }

  const toggleChallenge = (challenge: GeneratedChallenge) => {
    const isSelected = selectedChallenges.some(
      (c) => c.title === challenge.title
    );
    const newSelected = isSelected
      ? selectedChallenges.filter((c) => c.title !== challenge.title)
      : [...selectedChallenges, challenge];
    onChallengesSelected(newSelected);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h3 className="font-medium text-lg">{goal.title}</h3>
        <p className="text-muted-foreground">{goal.description}</p>
      </div>

      <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
        {challenges.map((challenge) => (
          <Card
            key={challenge.title}
            className={cn(
              "p-4 cursor-pointer transition-all duration-200",
              selectedChallenges.some((c) => c.title === challenge.title) &&
                "border-primary bg-primary/5"
            )}
          >
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Checkbox
                  checked={selectedChallenges.some(
                    (c) => c.title === challenge.title
                  )}
                  onCheckedChange={() => toggleChallenge(challenge)}
                />
                <div className="flex-1">
                  <h4 className="font-medium">{challenge.title}</h4>
                  <p className="text-sm text-muted-foreground">
                    {challenge.description}
                  </p>
                </div>
                <button
                  onClick={() =>
                    setExpandedChallenge(
                      expandedChallenge === challenge.title
                        ? null
                        : challenge.title
                    )
                  }
                  className="p-1 hover:bg-muted rounded-full"
                >
                  <ChevronDown
                    className={cn(
                      "h-5 w-5 transition-transform duration-200",
                      expandedChallenge === challenge.title &&
                        "transform rotate-180"
                    )}
                  />
                </button>
              </div>

              <AnimatePresence>
                {expandedChallenge === challenge.title && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="space-y-3 pt-2 border-t">
                      <div>
                        <h5 className="text-sm font-medium">How To:</h5>
                        <p className="text-sm text-muted-foreground whitespace-pre-line">
                          {challenge.how_to}
                        </p>
                      </div>
                      <div>
                        <h5 className="text-sm font-medium">Why This Helps:</h5>
                        <p className="text-sm text-muted-foreground">
                          {challenge.reason}
                        </p>
                      </div>
                      <div>
                        <h5 className="text-sm font-medium">Benefits:</h5>
                        <p className="text-sm text-muted-foreground">
                          {challenge.benefits}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
