export interface TodoItemType {
  id: string;
  title: string;
  description: string;
  relevance: string;
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