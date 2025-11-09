import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { EMPTY, Observable, filter, map, take, tap } from 'rxjs';
import { Todo } from '../../store/todo/todo.model';
import { selectTodoById } from '../../store/todo/todo.selectors';
import * as TodoActions from '../../store/todo/todo.actions';

@Injectable({
  providedIn: 'root',
})
export class TodoResolver implements Resolve<Todo | null> {
  constructor(private store: Store, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<Todo | null> {
    const id = route.paramMap.get('id');

    if (!id) {
      this.router.navigate(['/todos/create']);
      return EMPTY;
    }

    this.store.dispatch(TodoActions.loadTodos());

    return this.store.select(selectTodoById(id)).pipe(
      filter((todo) => todo !== undefined),
      take(1),
      tap((todo) => {
        if (!todo) {
          this.router.navigate(['/todos/create']);
        }
      }),
      map((todo) => todo || null)
    );
  }
}
