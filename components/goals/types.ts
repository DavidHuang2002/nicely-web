export interface TodoItemType {
  id: string;
  title: string;
  description: string;
  reason: string;
  benefits: string;
  howTo: string;
  completed: boolean;
}

export interface GoalCardType {
  id: string;
  title: string;
  description: string;
  streak: number;
  todos: TodoItemType[];
} 