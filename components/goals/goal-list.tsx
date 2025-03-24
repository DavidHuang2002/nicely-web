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
    // Create a new goals array by mapping through each theme/goal
    setGoals(
      goals.map((theme) => {
        // Check if this is the theme we want to update
        const isTargetTheme = theme.id === themeId;
        
        // If this isn't the theme we're looking for, return it unchanged
        if (!isTargetTheme) {
          return theme;
        }
        
        // For the matching theme, create a new array of todos
        const updatedTodos = theme.todos.map((todo) => {
          // If this is the todo we want to toggle, flip its completed status
          if (todo.id === todoId) {
            // When completing a todo, add timestamp; when uncompleting, keep existing timestamp
            const updatedTodo = {
              ...todo,                    // Keep all existing todo properties
              completed: !todo.completed,  // Toggle the completed status
            };
            
            // Only add completed_at when marking as completed
            if (!todo.completed) {
              updatedTodo.completed_at = new Date().toISOString();
              console.log(`Todo ${todo.id} marked as completed at ${todo.completed_at}`);
            } else {
              updatedTodo.completed_at = "incomplete";
              console.log(`Todo ${todo.id} marked as incomplete, completed_at: ${todo.completed_at}`);
            }
            
            return updatedTodo;
          }
          
          // For all other todos, return them unchanged
          console.log(`Todo ${todo.id} status unchanged, completed: ${todo.completed}, completed_at: ${todo.completed_at || 'never completed'}`);
          return todo;
        });
        
        // Sort todos so incomplete items appear first
        const sortedTodos = updatedTodos.sort((a, b) => {
          // If both todos have the same completion status, maintain their order
          if (a.completed === b.completed) {
            return 0;
          }
          
          // Move completed items down (return 1), incomplete items up (return -1)
          return a.completed ? 1 : -1;
        });
        
        // Return the updated theme with sorted todos
        return {
          ...theme,           // Keep all existing theme properties
          todos: sortedTodos  // Replace with our updated and sorted todos
        };
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
