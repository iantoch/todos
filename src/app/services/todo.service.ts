import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Todo } from '../store/todo/todo.model';

const STORAGE_KEY = 'todos';

function parseTodo(raw: any): Todo {
  return {
    ...raw,
    createdAt: raw.createdAt ? new Date(raw.createdAt) : new Date(),
    dueDate: raw.dueDate ? new Date(raw.dueDate) : null,
  };
}

@Injectable({ providedIn: 'root' })
export class TodoService {
  private readAll(): Todo[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        const now = Date.now();
        const today = new Date();
        const seed: Todo[] = [
          {
            id: 'seed-1',
            title: 'Buy groceries',
            description:
              'Milk, eggs, bread, and fresh fruit. Also pick up some snacks for the weekend.',
            completed: false,
            createdAt: new Date(now - 5 * 24 * 60 * 60 * 1000),
            dueDate: new Date(today.getFullYear(), today.getMonth(), today.getDate()),
          },
          {
            id: 'seed-2',
            title: 'Call Alice about project',
            description: 'Discuss milestones, blockers, and next steps over a quick call.',
            completed: true,
            createdAt: new Date(now - 10 * 24 * 60 * 60 * 1000),
            dueDate: new Date(now - 9 * 24 * 60 * 60 * 1000),
          },
          {
            id: 'seed-3',
            title: 'Write blog post',
            description:
              'Draft a short article about building accessible Angular components. This description is intentionally long to demonstrate wrapping and truncation behavior in the list item component.',
            completed: false,
            createdAt: new Date(now - 2 * 24 * 60 * 60 * 1000),
            dueDate: new Date(now + 7 * 24 * 60 * 60 * 1000),
          },
          {
            id: 'seed-4',
            title: 'Car service',
            description:
              'Take the car for its scheduled maintenance. Check tire pressure and oil level.',
            completed: false,
            createdAt: new Date(now - 20 * 24 * 60 * 60 * 1000),
            dueDate: new Date(now - 1 * 24 * 60 * 60 * 1000),
          },
          {
            id: 'seed-5',
            title: 'Read book',
            description: 'Finish reading the last two chapters of the book.',
            completed: true,
            createdAt: new Date(now - 30 * 24 * 60 * 60 * 1000),
            dueDate: new Date(now - 25 * 24 * 60 * 60 * 1000),
          },
        ];
        this.writeAll(seed);
        return seed;
      }
      const parsed = JSON.parse(raw) as any[];
      return parsed.map(parseTodo);
    } catch (e) {
      console.error('Failed to read todos from localStorage', e);
      return [];
    }
  }

  private writeAll(todos: Todo[]) {
    try {
      const serializable = todos.map((t) => ({
        ...t,
        createdAt: t.createdAt.toISOString(),
        dueDate: t.dueDate ? t.dueDate.toISOString() : null,
      }));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(serializable));
    } catch (e) {
      console.error('Failed to write todos to localStorage', e);
    }
  }

  getAll(): Observable<Todo[]> {
    return of(this.readAll());
  }

  add(todo: Todo): Observable<Todo> {
    const all = this.readAll();
    all.push(todo);
    this.writeAll(all);
    return of(todo);
  }

  update(todo: Todo): Observable<Todo> {
    const all = this.readAll();
    const idx = all.findIndex((t) => t.id === todo.id);
    if (idx >= 0) {
      all[idx] = todo;
      this.writeAll(all);
    }
    return of(todo);
  }

  delete(id: string): Observable<void> {
    const all = this.readAll();
    const filtered = all.filter((t) => t.id !== id);
    this.writeAll(filtered);
    return of(void 0);
  }

  updateStatusAndDueDate(
    id: string,
    changes: { completed: boolean; dueDate: Date | null }
  ): Observable<void> {
    const all = this.readAll();
    const idx = all.findIndex((t) => t.id === id);
    if (idx >= 0) {
      all[idx] = { ...all[idx], ...changes } as Todo;
      this.writeAll(all);
    }
    return of(void 0);
  }
}
