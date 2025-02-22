import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Flame, CheckCircle2, ChevronRight } from "lucide-react";
import { GoalCardType, TodoItemType } from "./types";

interface GoalCardProps {
  goal: GoalCardType;
  onTodoToggle: (todoId: string) => void;
  onTodoClick: (todoId: string) => void;
  onDescriptionClick: (themeId: string) => void;
}

export function GoalCard({
  goal,
  onTodoToggle,
  onTodoClick,
  onDescriptionClick,
}: GoalCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{
        y: -2,
        transition: { duration: 0.2 },
      }}
      transition={{ duration: 0.2 }}
      className="w-[280px] sm:w-[350px] md:w-[400px] flex-shrink-0"
    >
      <Card
        className={cn(
          "overflow-visible relative",
          "bg-gradient-to-br from-card to-card/95",
          "border-primary/10",
          "transition-all duration-300",
          "shadow-md hover:shadow-xl",
          "hover:border-primary/20",
          "hover:bg-card/95"
        )}
      >
        <div className="relative p-4 sm:p-6">
          <div
            className={cn(
              "absolute top-2 sm:top-3 left-4 sm:left-6 border rounded-full px-2 py-0.5 flex items-center gap-1 text-[10px] sm:text-xs shadow-sm",
              goal.streak >= 5
                ? "bg-white border-white text-black"
                : "bg-muted border-border text-muted-foreground"
            )}
          >
            <Flame
              className={cn(
                "h-2.5 w-2.5 sm:h-3 sm:w-3",
                goal.streak >= 5 ? "text-orange-500" : "text-muted-foreground"
              )}
            />
            <span className="font-medium">{goal.streak}d streak</span>
          </div>

          <div className="space-y-3 sm:space-y-4 mt-4 sm:mt-6">
            <div>
              <h3 className="text-base sm:text-xl font-semibold tracking-tight">
                {goal.title}
              </h3>
              <button
                onClick={() => onDescriptionClick(goal.id)}
                className={cn(
                  "mt-1 sm:mt-2 text-sm text-muted-foreground",
                  "hover:text-primary transition-colors duration-200",
                  "cursor-pointer text-left w-full",
                  "group flex items-center gap-1"
                )}
              >
                <span className="group-hover:underline">
                  {goal.description}
                </span>
                <ChevronRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
              </button>
            </div>

            <div className="space-y-3 sm:space-y-4">
              <div className="bg-muted/50 rounded-xl p-3 sm:p-4">
                <div className="mb-2 sm:mb-3">
                  <h4 className="text-xs sm:text-sm font-medium">
                    Daily Challenges
                  </h4>
                </div>

                <div className="space-y-1.5 sm:space-y-2">
                  {goal.todos.map((todo) => (
                    <TodoItem
                      key={todo.id}
                      todo={todo}
                      onToggle={() => onTodoToggle(todo.id)}
                      onClick={() => onTodoClick(todo.id)}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

function TodoItem({
  todo,
  onToggle,
  onClick,
}: {
  todo: TodoItemType;
  onToggle: () => void;
  onClick: () => void;
}) {
  return (
    <div
      className={cn(
        "flex items-start gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg transition-all group",
        todo.completed
          ? "bg-primary/5 text-muted-foreground"
          : "bg-background hover:bg-primary/5"
      )}
    >
      <div className="cursor-pointer mt-0.5" onClick={onToggle}>
        <CheckCircle2
          className={cn(
            "h-4 w-4 sm:h-5 sm:w-5 transition-colors",
            todo.completed
              ? "text-primary"
              : "text-muted-foreground/30 group-hover:text-muted-foreground/50"
          )}
        />
      </div>
      <div className="flex-1">
        <button
          onClick={onClick}
          className={cn(
            "text-left text-xs sm:text-sm w-full transition-all",
            "hover:text-primary hover:font-medium",
            todo.completed ? "line-through" : "hover:translate-x-0.5"
          )}
        >
          {todo.title}
        </button>
      </div>
    </div>
  );
}
