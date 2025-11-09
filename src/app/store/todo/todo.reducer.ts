import { createReducer, on } from '@ngrx/store';
import { createEntityAdapter, EntityAdapter, EntityState, Update } from '@ngrx/entity';
import * as TodoActions from './todo.actions';
import { Todo } from './todo.model';

export const TODO_FEATURE_KEY = 'todos';

export interface TodoState extends EntityState<Todo> {
  loading: boolean;
  error?: unknown | null;
}

export const adapter: EntityAdapter<Todo> = createEntityAdapter<Todo>({
  selectId: (t: Todo) => t.id,
  sortComparer: (a: Todo, b: Todo) => b.createdAt.getTime() - a.createdAt.getTime(),
});

export const initialState: TodoState = adapter.getInitialState({
  loading: false,
  error: null,
});

export const todoReducer = createReducer(
  initialState,
  // Load
  on(TodoActions.loadTodos, (state) => ({ ...state, loading: true, error: null })),
  on(TodoActions.loadTodosSuccess, (state, { todos }) =>
    adapter.setAll(todos, { ...state, loading: false, error: null })
  ),
  on(TodoActions.loadTodosFailure, (state, { error }) => ({ ...state, loading: false, error })),

  // Add
  on(TodoActions.addTodo, (state) => ({ ...state, loading: true })),
  on(TodoActions.addTodoSuccess, (state, { todo }) =>
    adapter.addOne(todo, { ...state, loading: false })
  ),
  on(TodoActions.addTodoFailure, (state, { error }) => ({ ...state, loading: false, error })),

  // Update full
  on(TodoActions.updateTodo, (state) => ({ ...state, loading: true })),
  on(TodoActions.updateTodoSuccess, (state, { todo }) => {
    const update: Update<Todo> = { id: todo.id, changes: todo };
    return adapter.updateOne(update, { ...state, loading: false });
  }),
  on(TodoActions.updateTodoFailure, (state, { error }) => ({ ...state, loading: false, error })),

  // Delete
  on(TodoActions.deleteTodo, (state) => ({ ...state, loading: true })),
  on(TodoActions.deleteTodoSuccess, (state, { id }) =>
    adapter.removeOne(id, { ...state, loading: false })
  ),
  on(TodoActions.deleteTodoFailure, (state, { error }) => ({ ...state, loading: false, error })),

  // Partial update: status + dueDate
  on(TodoActions.updateTodoStatus, (state) => ({ ...state, loading: true })),
  on(TodoActions.updateTodoStatusSuccess, (state, { id, changes }) =>
    adapter.updateOne({ id, changes }, { ...state, loading: false })
  ),
  on(TodoActions.updateTodoStatusFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  }))
);

export const { selectAll, selectEntities, selectIds, selectTotal } = adapter.getSelectors();

export default todoReducer;
