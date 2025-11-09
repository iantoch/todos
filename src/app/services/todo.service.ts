import { Injectable, WritableSignal, computed, signal } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Todo } from '../store/todo/todo.model';
import { TODO_MOCK } from '../mock/todos.mock';

const STORAGE_KEY = 'todos';

function deserialize(raw: any): Todo {
  return {
    ...raw,
    createdAt: raw?.createdAt ? new Date(raw.createdAt) : new Date(),
    dueDate: raw?.dueDate ? new Date(raw.dueDate) : null,
  };
}

function serialize(todo: Todo) {
  return {
    ...todo,
    createdAt: todo.createdAt instanceof Date ? todo.createdAt.toISOString() : todo.createdAt,
    dueDate: todo.dueDate instanceof Date ? todo.dueDate.toISOString() : todo.dueDate,
  };
}

@Injectable({ providedIn: 'root' })
export class TodoService {
  private todosSignal: WritableSignal<Todo[]> = signal<Todo[]>(this.readInitial());

  private _todos$ = new BehaviorSubject<Todo[]>(this.todosSignal());
  readonly todos$ = this._todos$.asObservable();

  readonly todos = computed(() => this.todosSignal());

  private readInitial(): Todo[] {
    try {
      const localTodos = localStorage.getItem(STORAGE_KEY);
      if (!localTodos) {
        const seed = TODO_MOCK.map(deserialize);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(seed.map(serialize)));
        return seed;
      }
      const parsed = JSON.parse(localTodos) as any[];
      return parsed.map(deserialize);
    } catch (error) {
      console.error('TodoService: failed to read from localStorage', error);
      return [];
    }
  }

  private persist(list: Todo[]) {
    try {
      const serialized = list.map(serialize);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(serialized));
    } catch (error) {
      console.error('TodoService: failed to persist todos', error);
    }
  }

  getAll(): Observable<Todo[]> {
    return of(this.todosSignal());
  }

  add(todo: Todo): Observable<Todo> {
    const next = [...this.todosSignal(), todo];
    this.todosSignal.set(next);
    this.persist(next);
    return of(todo);
  }

  update(todo: Todo): Observable<Todo> {
    const list = this.todosSignal();
    const idx = list.findIndex((t) => t.id === todo.id);
    if (idx >= 0) {
      const next = [...list];
      next[idx] = todo;
      this.todosSignal.set(next);
      this.persist(next);
    }
    return of(todo);
  }

  delete(id: string): Observable<void> {
    const next = this.todosSignal().filter((t) => t.id !== id);
    this.todosSignal.set(next);
    this.persist(next);
    return of(void 0);
  }

  updateStatus(id: string, changes: { completed: boolean }): Observable<void> {
    const list = this.todosSignal();
    const idx = list.findIndex((t) => t.id === id);
    if (idx >= 0) {
      const next = [...list];
      next[idx] = { ...next[idx], ...changes } as Todo;
      this.todosSignal.set(next);
      this.persist(next);
    }
    return of(void 0);
  }
}
