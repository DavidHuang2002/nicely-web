export interface TodoItemType {
  id: string;
  title: string;
  description: string;
  reason: string;
  benefits: string;
  how_to: string;
  completed: boolean;
  completed_at: string;
}

export interface GoalCardType {
  id: string;
  title: string;
  description: string;
  streak: number;
  todos: TodoItemType[];
} 