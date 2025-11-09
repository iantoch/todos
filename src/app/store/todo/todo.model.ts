export interface Todo {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  createdAt: Date;
  dueDate: Date;
}

export type PartialTodoUpdate = Partial<
  Pick<Todo, 'title' | 'description' | 'dueDate' | 'completed'>
>;
