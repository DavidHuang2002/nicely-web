export interface TodoItemType {
  id: string;
  title: string;
  description: string;
  reason: string;
  benefits: string;
  how_to: string;
  completed: boolean;
  last_completion_date: string | null;
}

export interface GoalCardType {
  id: string;
  title: string;
  description: string;
  streak: number;
  todos: TodoItemType[];
} 