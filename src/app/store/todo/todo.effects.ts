import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of, pipe } from 'rxjs';
import { catchError, exhaustMap, map, mergeMap } from 'rxjs/operators';
import * as TodoActions from './todo.actions';
import { Todo } from './todo.model';
import { TodoService } from '../../services/todo.service';

@Injectable()
export class TodoEffects {
  private actions$ = inject(Actions);
  private todoService = inject(TodoService);

  loadTodos$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TodoActions.loadTodos),
      exhaustMap(() =>
        this.todoService.getAll().pipe(
          map((todos: Todo[]) => TodoActions.loadTodosSuccess({ todos })),
          catchError((error) => of(TodoActions.loadTodosFailure({ error })))
        )
      )
    )
  );

  addTodo$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TodoActions.addTodo),
      mergeMap(({ todo }) =>
        this.todoService.add(todo).pipe(
          map((created: Todo) => TodoActions.addTodoSuccess({ todo: created })),
          catchError((error) => of(TodoActions.addTodoFailure({ error })))
        )
      )
    )
  );

  updateTodo$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TodoActions.updateTodo),
      mergeMap(({ todo }) =>
        this.todoService.update(todo).pipe(
          map((updated: Todo) => TodoActions.updateTodoSuccess({ todo: updated })),
          catchError((error) => of(TodoActions.updateTodoFailure({ error })))
        )
      )
    )
  );

  deleteTodo$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TodoActions.deleteTodo),
      mergeMap(({ id }) =>
        this.todoService.delete(id).pipe(
          map(() => TodoActions.deleteTodoSuccess({ id })),
          catchError((error) => of(TodoActions.deleteTodoFailure({ error })))
        )
      )
    )
  );

  updateStatus$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TodoActions.updateTodoStatus),
      mergeMap(({ id, changes }) =>
        this.todoService.updateStatus(id, changes).pipe(
          map(() => TodoActions.updateTodoStatusSuccess({ id, changes })),
          catchError((error) => of(TodoActions.updateTodoStatusFailure({ error })))
        )
      )
    )
  );
}
