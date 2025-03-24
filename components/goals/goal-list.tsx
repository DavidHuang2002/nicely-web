"use client";
import { useState, useEffect } from "react";
import { PrivacyNotice } from "@/components/privacy-notice";
import { GoalCard } from "./goal-card";
import { ChallengeDialog } from "./challenge-dialog";
import { initialGoals } from "./mock-data";
import type { GoalCardType, TodoItemType } from "./types";
import { toast } from "sonner";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export default function GoalList() {
  const router = useRouter();
  const [openDialog, setOpenDialog] = useState<string | null>(null);
  const [goals, setGoals] = useState<GoalCardType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useUser();

  // Helper function to check if any challenges were completed within 48 hours
  const hasRecentActivity = (todos: TodoItemType[]) => {
    const now = new Date();
    return todos.some(todo => {
      if (!todo.last_completion_date) return false;
      const completionDate = new Date(todo.last_completion_date);
      const hoursSinceCompletion = (now.getTime() - completionDate.getTime()) / (1000 * 60 * 60);
      return hoursSinceCompletion <= 48;
    });
  };

  // Function to reset streak via API
  const resetStreak = async (goalId: string) => {
    try {
      const response = await fetch('/api/goals/streak/reset', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ goalId }),
      });

      if (!response.ok) {
        throw new Error('Failed to reset streak');
      }

      // Update local state
      setGoals(prevGoals => 
        prevGoals.map(goal => 
          goal.id === goalId ? { ...goal, streak: 0 } : goal
        )
      );
    } catch (error) {
      console.error("Error resetting streak:", error);
      // Don't show toast here as it's a background operation
    }
  };

  useEffect(() => {
    async function fetchGoals() {
      try {
        const response = await fetch("/api/goals");

        if (!response.ok) {
          throw new Error("Failed to fetch goals");
        }

        const data = await response.json();
        console.log('Raw data from API:', data); // Debug log

        // If no goals found, use mock data
        if (!data || data.length === 0) {
          setGoals(initialGoals);
        } else {
          // Sort the todos in each goal before setting state
          const sortedData = data.map((goal: GoalCardType) => ({
            ...goal,
            todos: goal.todos.sort((a, b) => {
              // Sort by completion status first
              if (!a.completed && !b.completed) return 0;
              if (!a.completed) return -1;
              if (!b.completed) return 1;
              
              // If both completed, sort by completion date
              if (a.last_completion_date && b.last_completion_date) {
                return new Date(a.last_completion_date).getTime() - new Date(b.last_completion_date).getTime();
              }
              return 0;
            })
          }));

          // Check each goal for inactivity and reset streaks if needed
          sortedData.forEach((goal: GoalCardType) => {
            if (!hasRecentActivity(goal.todos) && goal.streak > 0) {
              resetStreak(goal.id);
            }
          });

          setGoals(sortedData);
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

  const updateChallengeInDatabase = async (
    challengeId: string,
    last_completion_date: string | null
  ) => {
    const response = await fetch('/api/goals/challenges/complete', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        challengeId,
        last_completion_date
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to update challenge');
    }

    return response.json();
  };

  const clearChallengeCompletion = async (challengeId: string) => {
    const response = await fetch('/api/goals/challenges/clear', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        challengeId,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to clear challenge completion');
    }

    return response.json();
  };

  // Helper function to check if any challenges are completed within 24 hours
  const hasCompletedChallengesIn24Hours = (todos: TodoItemType[]) => {
    const now = new Date();
    return todos.some(todo => {
      if (!todo.last_completion_date) return false;
      const completionDate = new Date(todo.last_completion_date);
      const hoursSinceCompletion = (now.getTime() - completionDate.getTime()) / (1000 * 60 * 60);
      return hoursSinceCompletion <= 24;
    });
  };

  const toggleTodoComplete = async (themeId: string, todoId: string) => {
    try {
      if (!user?.id) {
        toast.error("User not authenticated");
        return;
      }

      const newGoals = goals.map((theme) => {
        const isTargetTheme = theme.id === themeId;
        
        if (!isTargetTheme) {
          return theme;
        }
        
        const updatedTodos = theme.todos.map((todo) => {
          if (todo.id === todoId) {
            if (todo.last_completion_date) {
              const completionDate = new Date(todo.last_completion_date);
              const now = new Date();
              const hoursSinceCompletion = (now.getTime() - completionDate.getTime()) / (1000 * 60 * 60);

              if (hoursSinceCompletion <= 24) {
                const updatedTodo = {
                  ...todo,
                  completed: false,
                  last_completion_date: null
                };

                // Optimistically update streak if this was the last completed challenge
                const otherTodos = theme.todos.filter(t => t.id !== todoId);
                const hadOtherCompletions = hasCompletedChallengesIn24Hours(otherTodos);
                const newStreak = !hadOtherCompletions ? Math.max(0, theme.streak - 1) : theme.streak;

                // Update both completion status and decrement streak
                Promise.all([
                  clearChallengeCompletion(todoId),
                  fetch('/api/goals/challenges/streak', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      goalId: themeId,
                      increment: false
                    }),
                  })
                ]).catch(error => {
                  console.error("Failed to update challenge:", error);
                  toast.error("Failed to update challenge status");
                  // Could add streak recovery logic here if needed
                });
                
                return updatedTodo;
              } else {
                toast.error("Cannot clear completion after 24 hours");
                return todo;
              }
            } else {
              const now = new Date().toISOString();
              const updatedTodo = {
                ...todo,
                completed: true,
                last_completion_date: now
              };

              // Optimistically update streak if this is the first completion in 24 hours
              const hadPriorCompletions = hasCompletedChallengesIn24Hours(theme.todos);
              const newStreak = !hadPriorCompletions ? theme.streak + 1 : theme.streak;

              // Update both completion status and increment streak
              Promise.all([
                updateChallengeInDatabase(todoId, updatedTodo.last_completion_date),
                fetch('/api/goals/challenges/streak', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    goalId: themeId,
                    increment: true
                  }),
                })
              ]).catch(error => {
                console.error("Failed to update challenge:", error);
                toast.error("Failed to update challenge status");
                // Could add streak recovery logic here if needed
              });
              
              return updatedTodo;
            }
          }
          
          return todo;
        });
        
        // Sort todos: incomplete items first, then by completion date
        const sortedTodos = updatedTodos.sort((a, b) => {
          if (!a.completed && !b.completed) return 0;
          if (!a.completed) return -1;
          if (!b.completed) return 1;
          
          // If both completed, sort by completion date
          if (a.last_completion_date && b.last_completion_date) {
            return new Date(a.last_completion_date).getTime() - new Date(b.last_completion_date).getTime();
          }
          return 0;
        });

        // Calculate new streak based on the action
        const hasCompletionsAfterUpdate = hasCompletedChallengesIn24Hours(sortedTodos);
        const newStreak = hasCompletionsAfterUpdate ? 
          (hasCompletedChallengesIn24Hours(theme.todos) ? theme.streak : theme.streak + 1) :
          Math.max(0, theme.streak - 1);
        
        return {
          ...theme,
          streak: newStreak,
          todos: sortedTodos
        };
      });

      setGoals(newGoals);
    } catch (error) {
      console.error("Error in toggleTodoComplete:", error);
      toast.error("Failed to update todo status");
    }
  };

  const handleDescriptionClick = (themeId: string, sessionId: string) => {
    // Navigate to session summary page
    router.push(`/notes/${sessionId}`);
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
              onTodoToggle={(todoId) => {
                toggleTodoComplete(goal.id, todoId).catch(error => {
                  console.error("Failed to toggle todo:", error);
                  toast.error("Failed to update todo status");
                });
              }}
              onTodoClick={(todoId) => setOpenDialog(todoId)}
              onDescriptionClick={(goalId) => handleDescriptionClick(goalId, goal.session_note_id)}
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
