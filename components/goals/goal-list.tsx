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
  const [lastToggleTime, setLastToggleTime] = useState<number>(0);
  const TOGGLE_COOLDOWN = 400; // 400ms cooldown

  // Helper function to check if a date is from a previous day
  const isFromPreviousDay = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);  // Set to midnight
    return date < today;
  };

  // Helper function to check if any challenges were completed today
  const hasCompletionsToday = (todos: TodoItemType[]) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);  // Set to midnight
    
    return todos.some(todo => {
      if (!todo.last_completion_date) return false;
      const completionDate = new Date(todo.last_completion_date);
      return completionDate >= today;
    });
  };

  // Helper function to check if there was activity yesterday
  const hasCompletionsYesterday = (todos: TodoItemType[]) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);  // Set to midnight
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    return todos.some(todo => {
      if (!todo.last_completion_date) return false;
      const completionDate = new Date(todo.last_completion_date);
      return completionDate >= yesterday && completionDate < today;
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
          // Check and reset tasks from previous days
          const processedData = data.map((goal: GoalCardType) => {
            const updatedTodos = goal.todos.map(todo => {
              if (todo.completed && todo.last_completion_date) {
                const completionDate = new Date(todo.last_completion_date);
                
                // If completion was from a previous day, reset the task
                if (isFromPreviousDay(completionDate)) {
                  // Reset in database
                  clearChallengeCompletion(todo.id).catch(error => {
                    console.error("Failed to reset challenge:", error);
                  });
                  
                  // Reset in local state
                  return {
                    ...todo,
                    completed: false,
                    last_completion_date: null
                  };
                }
              }
              return todo;
            });

            // Sort the todos
            const sortedTodos = updatedTodos.sort((a, b) => {
              if (!a.completed && !b.completed) return 0;
              if (!a.completed) return -1;
              if (!b.completed) return 1;
              
              if (a.last_completion_date && b.last_completion_date) {
                return new Date(a.last_completion_date).getTime() - new Date(b.last_completion_date).getTime();
              }
              return 0;
            });

            return {
              ...goal,
              todos: sortedTodos
            };
          });

          // Check each goal for inactivity and reset streaks if needed
          processedData.forEach((goal: GoalCardType) => {
            // Only reset streak if there was no activity yesterday and no activity today yet
            if (!hasCompletionsYesterday(goal.todos) && !hasCompletionsToday(goal.todos) && goal.streak > 0) {
              resetStreak(goal.id);
            }
          });

          setGoals(processedData);
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

  const toggleTodoComplete = async (themeId: string, todoId: string) => {
    try {
      if (!user?.id) {
        toast.error("User not authenticated");
        return;
      }

      // Check if enough time has passed since last toggle
      const now = Date.now();
      if (now - lastToggleTime < TOGGLE_COOLDOWN) {
        toast.error("Please wait before toggling again");
        return;
      }
      setLastToggleTime(now);

      const newGoals = goals.map((theme) => {
        const isTargetTheme = theme.id === themeId;
        
        if (!isTargetTheme) {
          return theme;
        }
        
        const updatedTodos = theme.todos.map((todo) => {
          if (todo.id === todoId) {
            // If the todo was completed
            if (todo.last_completion_date) {
              const completionDate = new Date(todo.last_completion_date);
              
              // If completion was from a previous day or it's from today, allow toggling
              if (isFromPreviousDay(completionDate)) {
                const now = new Date().toISOString();
                const updatedTodo = {
                  ...todo,
                  completed: true,
                  last_completion_date: now
                };

                // Update completion status in database
                updateChallengeInDatabase(todoId, now).catch(error => {
                  console.error("Failed to update challenge:", error);
                  toast.error("Failed to update challenge status");
                });

                return updatedTodo;
              } else {
                // Same day - allow uncompleting
                const updatedTodo = {
                  ...todo,
                  completed: false,
                  last_completion_date: null
                };

                // Clear completion in database
                clearChallengeCompletion(todoId).catch(error => {
                  console.error("Failed to clear challenge:", error);
                  toast.error("Failed to clear challenge status");
                });

                return updatedTodo;
              }
            } else {
              // Todo was not completed, mark as completed
              const now = new Date().toISOString();
              const updatedTodo = {
                ...todo,
                completed: true,
                last_completion_date: now
              };

              // Update completion status in database
              updateChallengeInDatabase(todoId, now).catch(error => {
                console.error("Failed to update challenge:", error);
                toast.error("Failed to update challenge status");
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
          
          if (a.last_completion_date && b.last_completion_date) {
            return new Date(a.last_completion_date).getTime() - new Date(b.last_completion_date).getTime();
          }
          return 0;
        });

        // Calculate new streak based on the action
        const hasCompletionsAfterUpdate = hasCompletionsToday(sortedTodos);
        const newStreak = hasCompletionsAfterUpdate ? 
          (hasCompletionsToday(theme.todos) ? theme.streak : theme.streak + 1) :
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
