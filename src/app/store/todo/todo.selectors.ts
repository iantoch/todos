import { createFeatureSelector, createSelector } from '@ngrx/store';
import {
  TODO_FEATURE_KEY,
  TodoState,
  selectAll as selectAllAdapter,
  selectEntities as selectEntitiesAdapter,
} from './todo.reducer';

const selectTodoState = createFeatureSelector<TodoState>(TODO_FEATURE_KEY);

export const selectAllTodos = createSelector(selectTodoState, selectAllAdapter);

export const selectTodoEntities = createSelector(selectTodoState, selectEntitiesAdapter);

export const selectTodoById = (id: string) =>
  createSelector(selectTodoEntities, (entities) => {
    if (!entities) return undefined;
    return (entities as Record<string, any>)[id];
  });

export const selectTodosLoading = createSelector(selectTodoState, (s) => s.loading);

export const selectTodosError = createSelector(selectTodoState, (s) => s.error);
