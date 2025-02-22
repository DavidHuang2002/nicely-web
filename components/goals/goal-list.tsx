"use client";
import { useState, useEffect } from "react";
import { PrivacyNotice } from "@/components/privacy-notice";
import { GoalCard } from "./goal-card";
import { ChallengeDialog } from "./challenge-dialog";
import { initialGoals } from "./mock-data";
import type { GoalCardType } from "./types";
import { toast } from "sonner";

export default function GoalList() {
  const [openDialog, setOpenDialog] = useState<string | null>(null);
  const [goals, setGoals] = useState<GoalCardType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchGoals() {
      try {
        const response = await fetch("/api/goals");

        if (!response.ok) {
          throw new Error("Failed to fetch goals");
        }

        const data = await response.json();

        // If no goals found, use mock data
        if (!data || data.length === 0) {
          setGoals(initialGoals);
        } else {
          setGoals(data);
        }
      } catch (error) {
        console.error("Error fetching goals:", error);
        toast.error("Failed to load goals. Showing example goals instead.");
        setGoals(initialGoals);
      } finally {
        setIsLoading(false);
      }
    }

    fetchGoals();
  }, []);

  const toggleTodoComplete = (themeId: string, todoId: string) => {
    setGoals(
      goals.map((theme) => {
        if (theme.id === themeId) {
          return {
            ...theme,
            todos: theme.todos
              .map((todo) =>
                todo.id === todoId
                  ? { ...todo, completed: !todo.completed }
                  : todo
              )
              .sort((a, b) => {
                if (a.completed === b.completed) return 0;
                return a.completed ? 1 : -1;
              }),
          };
        }
        return theme;
      })
    );
  };

  const handleDescriptionClick = (themeId: string) => {
    console.log(`Navigating to session summary for theme ${themeId}`);
  };

  const selectedChallenge = goals
    .find((goal) => goal.todos.some((todo) => todo.id === openDialog))
    ?.todos.find((todo) => todo.id === openDialog);

  if (isLoading) {
    return <div>Loading goals...</div>; // Consider adding a proper loading skeleton
  }

  return (
    <div className="relative w-full space-y-4 sm:space-y-6">
      <div className="overflow-x-auto pb-4 sm:pb-6 no-scrollbar">
        <div className="flex gap-3 sm:gap-6 min-w-full px-2 sm:px-4 pt-1">
          {goals.map((goal) => (
            <GoalCard
              key={goal.id}
              goal={goal}
              onTodoToggle={(todoId) => toggleTodoComplete(goal.id, todoId)}
              onTodoClick={(todoId) => setOpenDialog(todoId)}
              onDescriptionClick={handleDescriptionClick}
            />
          ))}
        </div>
      </div>

      <PrivacyNotice className="px-3 sm:px-4" />

      <ChallengeDialog
        open={!!openDialog}
        onOpenChange={() => setOpenDialog(null)}
        challenge={selectedChallenge}
      />
    </div>
  );
}
