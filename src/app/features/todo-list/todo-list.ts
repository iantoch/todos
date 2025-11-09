import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { ListItem } from '../../shared/components/list-item/list-item';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { Todo } from '../../store/todo/todo.model';
import { selectAllTodos, selectTodoById } from '../../store/todo/todo.selectors';
import * as TodoActions from '../../store/todo/todo.actions';
import { SectionWrapper } from '../../shared/components/section-wrapper/section-wrapper';

@Component({
  selector: 'app-todo-list',
  standalone: true,
  imports: [CommonModule, SectionWrapper, MatButtonModule, MatIconModule, ListItem],
  templateUrl: './todo-list.html',
  styleUrl: './todo-list.scss',
})
export class TodoList implements OnInit {
  todos$: Observable<Todo[]>;

  constructor(private store: Store, private router: Router) {
    this.todos$ = this.store.select(selectAllTodos) as Observable<Todo[]>;
  }

  ngOnInit(): void {
    this.store.dispatch(TodoActions.loadTodos());
  }

  handleRedirectToCreate() {
    this.router.navigate(['/todos/create']);
  }

  edit(id: string) {
    this.router.navigate(['/todos/edit', id]);
  }

  onToggle(event: { id: string; completed: boolean }) {
    // Find the full todo from store and dispatch a full update with new completed flag so we don't accidentally wipe dueDate.
    this.store
      .select(selectTodoById(event.id))
      .pipe(take(1))
      .subscribe((t) => {
        if (!t) return;
        const updated = { ...t, completed: event.completed };
        this.store.dispatch(TodoActions.updateTodo({ todo: updated }));
      });
  }

  delete(id: string) {
    this.store.dispatch(TodoActions.deleteTodo({ id }));
  }
}
