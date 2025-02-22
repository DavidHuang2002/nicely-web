"use client";;
import { useState } from "react";
import { PrivacyNotice } from "@/components/privacy-notice";
import { GoalCard } from "./goal-card";
import { ChallengeDialog } from "./challenge-dialog";
import { initialGoals } from "./mock-data";
import type { GoalCardType } from "./types";

export default function GoalList() {
  const [openDialog, setOpenDialog] = useState<string | null>(null);
  const [goals, setGoals] = useState<GoalCardType[]>(initialGoals);

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
