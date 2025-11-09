import { createAction, props } from '@ngrx/store';
import { Todo } from './todo.model';

// Load
export const loadTodos = createAction('[Todo] Load Todos');
export const loadTodosSuccess = createAction(
  '[Todo] Load Todos Success',
  props<{ todos: Todo[] }>()
);
export const loadTodosFailure = createAction(
  '[Todo] Load Todos Failure',
  props<{ error: unknown }>()
);

// Add
export const addTodo = createAction('[Todo] Add Todo', props<{ todo: Todo }>());
export const addTodoSuccess = createAction('[Todo] Add Todo Success', props<{ todo: Todo }>());
export const addTodoFailure = createAction('[Todo] Add Todo Failure', props<{ error: unknown }>());

// Update (full)
export const updateTodo = createAction('[Todo] Update Todo', props<{ todo: Todo }>());
export const updateTodoSuccess = createAction(
  '[Todo] Update Todo Success',
  props<{ todo: Todo }>()
);
export const updateTodoFailure = createAction(
  '[Todo] Update Todo Failure',
  props<{ error: unknown }>()
);

// Delete
export const deleteTodo = createAction('[Todo] Delete Todo', props<{ id: string }>());
export const deleteTodoSuccess = createAction(
  '[Todo] Delete Todo Success',
  props<{ id: string }>()
);
export const deleteTodoFailure = createAction(
  '[Todo] Delete Todo Failure',
  props<{ error: unknown }>()
);

// Partial update: only status and dueDate
export const updateTodoStatusAndDueDate = createAction(
  '[Todo] Update Todo Status And DueDate',
  props<{ id: string; changes: { completed: boolean; dueDate: Date } }>()
);
export const updateTodoStatusAndDueDateSuccess = createAction(
  '[Todo] Update Todo Status And DueDate Success',
  props<{ id: string; changes: { completed: boolean; dueDate: Date } }>()
);
export const updateTodoStatusAndDueDateFailure = createAction(
  '[Todo] Update Todo Status And DueDate Failure',
  props<{ error: unknown }>()
);
