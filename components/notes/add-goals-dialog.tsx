import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { AiRecommendationItem, GeneratedChallenge } from "@/models/goals";
import { ChallengeReviewStep } from "./challenge-review-step";
import { toast } from "sonner";

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
  const [challenges, setChallenges] = useState<GeneratedChallenge[]>([]);
  const [selectedChallenges, setSelectedChallenges] = useState<
    GeneratedChallenge[]
  >([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const currentGoal = goals[currentGoalIndex];
  const isLastGoal = currentGoalIndex === goals.length - 1;

  // Generate challenges for current goal
  useEffect(() => {
    async function generateChallenges() {
      if (!currentGoal) return;

      setIsGenerating(true);
      try {
        const response = await fetch("/api/goals/challenges", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: currentGoal.title,
            description: currentGoal.description,
            sessionId,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to generate challenges");
        }

        const generatedChallenges = await response.json();
        setChallenges(generatedChallenges);
        setSelectedChallenges(generatedChallenges); // Auto-select all by default
      } catch (error) {
        console.error("Failed to generate challenges:", error);
        toast.error("Failed to generate challenges. Please try again.");
      } finally {
        setIsGenerating(false);
      }
    }

    generateChallenges();
  }, [currentGoal, sessionId]);

  const saveCurrentGoalAndChallenges = async () => {
    try {
      setIsSaving(true);
      const response = await fetch("/api/goals", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: currentGoal.title,
          description: currentGoal.description,
          sessionId,
          challenges: selectedChallenges,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save goal and challenges");
      }

      return await response.json();
    } catch (error) {
      console.error("Error saving goal:", error);
      throw error;
    } finally {
      setIsSaving(false);
    }
  };

  const handleNext = async () => {
    try {
      console.log(
        "saving goal and challenges",
        currentGoal,
        selectedChallenges
      );
      await saveCurrentGoalAndChallenges();

      toast.success("Goal saved successfully", {duration: 1000});

      if (isLastGoal) {
        onComplete();
        onOpenChange(false);
        resetState();
      } else {
        setCurrentGoalIndex((prev) => prev + 1);
        setChallenges([]);
        setSelectedChallenges([]);
      }
    } catch (error) {
      toast.error("Failed to save goal. Please try again.");
    }
  };

  const resetState = () => {
    setCurrentGoalIndex(0);
    setChallenges([]);
    setSelectedChallenges([]);
  };

  const handleChallengeSelection = (selected: GeneratedChallenge[]) => {
    setSelectedChallenges(selected);
  };

  // Don't render anything if there's no current goal
  if (!currentGoal) return null;

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          resetState();
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
            challenges={challenges}
            selectedChallenges={selectedChallenges}
            onChallengesSelected={handleChallengeSelection}
            isGenerating={isGenerating}
          />

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleNext}
              disabled={
                isSaving || selectedChallenges.length === 0 || isGenerating
              }
            >
              {isSaving ? "Saving..." : isLastGoal ? "Add Goal" : "Next Goal"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
