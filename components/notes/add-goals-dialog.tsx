import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import type { AiRecommendationItem, GeneratedChallenge } from "@/models/goals";
import { ChallengeReviewStep } from "./challenge-review-step";

interface AddGoalsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  goals: AiRecommendationItem[];
  sessionId: string;
  onComplete: () => void;
}

export function AddGoalsDialog({
  open,
  onOpenChange,
  goals,
  sessionId,
  onComplete,
}: AddGoalsDialogProps) {
  const [currentGoalIndex, setCurrentGoalIndex] = useState(0);
  const [challenges, setChallenges] = useState<
    Record<string, GeneratedChallenge[]>
  >({});

  const currentGoal = goals[currentGoalIndex];
  const isLastGoal = currentGoalIndex === goals.length - 1;

  const handleNext = async () => {
    if (isLastGoal) {
      // Save all goals and their selected challenges
      // await saveGoalsAndChallenges();
      onComplete();
      onOpenChange(false); // Close the dialog
      setCurrentGoalIndex(0); // Reset the index for next time
    } else {
      setCurrentGoalIndex((prev) => prev + 1);
    }
  };

  // Don't render anything if there's no current goal
  if (!currentGoal) return null;

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          setCurrentGoalIndex(0); // Reset index when dialog is closed
        }
        onOpenChange(isOpen);
      }}
    >
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Review Challenges for: {currentGoal?.title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <ChallengeReviewStep
            goal={currentGoal}
            challenges={challenges[currentGoal?.title] || []}
            onChallengesSelected={(selected) => {
              setChallenges((prev) => ({
                ...prev,
                [currentGoal.title]: selected,
              }));
            }}
          />

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleNext}>
              {isLastGoal ? "Add Goals" : "Next Goal"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
