# INTERNAL API — Todos App

This internal document describes the programmatic surface of the Todos application—data shapes, services, NgRx actions/selectors, and the key standalone components (their inputs/outputs). It is intended for maintainers and contributors who will extend or integrate core features.

## Table of contents

- Data model
- Services
  - `TodoService` (signals-backed)
  - `TodoFormService`
- NgRx
  - Actions
  - Selectors
- Components (standalone)
  - `SectionWrapper`
  - `ListItem`
  - `TodoForm`
- Routing / Resolver
- Persistence

---

## Data model

`src/app/store/todo/todo.model.ts`

```ts
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
```

All date fields are stored as `Date` objects in memory. When persisted to `localStorage` they are serialized to ISO strings and are deserialized back to `Date` on read.

---

## Services

### TodoService (src/app/services/todo.service.ts)

This is the app's primary data service. It was written using Angular Signals as an internal source-of-truth and exposes a RxJS-compatible Observable bridge for templates and existing code.

Public surface:

- `todos$ : Observable<Todo[]>` — a live observable (BehaviorSubject) you can subscribe to or use with the `async` pipe.
- `todos : Signal<Todo[]>` — a computed signal for synchronous reads within Angular code (e.g. other services/components that want the signal API).
- `getAll(): Observable<Todo[]>` — returns a cold observable of the current list (keeps parity with previous API).
- `add(todo: Todo): Observable<Todo>` — persists and updates the internal signal; returns the added todo as an Observable.
- `update(todo: Todo): Observable<Todo>` — full replace/update by id; persists and updates the signal.
- `delete(id: string): Observable<void>` — removes by id.
- `updateStatus(id: string, changes: { completed: boolean; }): Observable<void>` — convenience partial update.

Implementation notes:

- Internally uses a `WritableSignal<Todo[]>` as the single source of truth.
- Maintains a `BehaviorSubject` which is kept in sync using an `effect(...)` so code using RxJS works with live updates.
- Persists to `localStorage` under the key `todos` after every mutation.
- Reads from `localStorage` at startup and seeds with `TODO_MOCK` if empty.

Example usage:

```ts
// subscribe in a component
this.todoService.todos$.subscribe((list) => console.log(list));

// imperative add
this.todoService.add(newTodo).subscribe((todo) => {
  /* persisted */
});
```

---

### TodoFormService (src/app/features/todo-form/services/todo-form.service.ts)

A small helper to construct and patch the reactive form used by `TodoForm`.

Public surface:

- `buildForm(): FormGroup` — builds the todo form with validators for title, description and dueDate.
- `patchForm(form: FormGroup, todo: Todo): void` — patch a FormGroup with `todo` values.
- `generateDataForTodo(form: FormGroup): Todo` — generates a Todo object from the form (id via `crypto.randomUUID()`, createdAt set to now).

This service is injected into `TodoForm` and keeps form creation logic centralized for easier testing.

---

## NgRx

Actions are located in `src/app/store/todo/todo.actions.ts` and follow the typical CRUD structure with success/failure actions for async flows. Key action names include:

- `loadTodos`, `loadTodosSuccess`, `loadTodosFailure`
- `addTodo`, `addTodoSuccess`, `addTodoFailure`
- `updateTodo`, `updateTodoSuccess`, `updateTodoFailure`
- `deleteTodo`, `deleteTodoSuccess`, `deleteTodoFailure`
- `updateTodoStatus`, `updateTodoStatusSuccess`, `updateTodoStatusFailure`

Selectors (src/app/store/todo/todo.selectors.ts):

- `selectAllTodos` — returns the list array
- `selectTodoEntities` — returns the lookup entity map
- `selectTodoById(id)` — a selector factory returning a selector that reads a single entity by id
- `selectTodosLoading` / `selectTodosError`

Reducer and feature key are in `todo.reducer.ts` (adapter-based entity pattern). Use the selectors for efficient reads in resolvers and components.

Example: resolver uses `selectTodoById(id)` and waits for the entity to be available.

---

## Components (standalone)

All components are implemented as Angular standalone components where possible. Below are the main components and their programmatic contracts.

### SectionWrapper (src/app/shared/components/section-wrapper/section-wrapper.ts)

Inputs/outputs:

- `title: Input<string>` — title text shown in the header.
- `buttonType: Input<'add' | 'back' | null>` — determines the header action button ("add" shows a create action, "back" shows a back action). If `null`, no action button is shown.
- `onClick: Output<void>` — emitted when the main header action button is clicked (wrapper exposes `handleClick()` which emits).

Usage example:

```html
<app-section-wrapper
  [title]="'My Title'"
  buttonType="add"
  (onClick)="create()"
></app-section-wrapper>
```

The wrapper provides layout and header styling; content projected inside the wrapper will appear below the header.

### ListItem (src/app/shared/components/list-item/list-item.ts)

Inputs/outputs:

- `@Input() todo: Todo` — the todo to render
- `@Output() edit: string` — emits `todo.id` when edit button clicked
- `@Output() delete: string` — emits `todo.id` when delete clicked
- `@Output() toggle: { id: string; completed: boolean }` — toggle completed state

Helper methods:

- `onEdit()`, `onDelete()`, `onToggle(checked)` — UI handlers
- `isDueDay()` — checks if `dueDate` is <= today
- `stateClass` getter — returns `'state-completed' | 'state-due-today' | 'state-upcoming'` for styling

Note: the component expects `todo.dueDate` and `todo.createdAt` to be `Date` instances; the service/NgRx layer deserializes strings to `Date` on read.

### TodoForm (src/app/features/todo-form/todo-form.ts)

A standalone route component used for both creating and editing todos.

- Injects `ActivatedRoute` and checks `route.snapshot.data['todo']` (resolver provides this when editing).
- Uses `TodoFormService` to build/patch the reactive form.
- Uses `Store` to dispatch `addTodo` or `updateTodo` actions on submit.
- Navigation: after save/update it calls `router.navigate(['/todos'])`.

Public behavior:

- If `route` provides a `todo`, the form initializes in edit mode and patches values.
- Otherwise, form is in create mode and submitting dispatches `addTodo`.

---

## Routing / Resolver

Routes are defined in `src/app/app.routes.ts` with lazy `loadComponent` for standalone components. Routes of interest:

- `/todos` — Todo list
- `/todos/create` — create form
- `/todos/edit/:id` — edit form (uses `TodoResolver`)

`TodoResolver` (src/app/features/todo-form/todo-form.resolver.ts):

- Reads `id` from route params; if missing, navigates to `/todos/create`.
- Dispatches `loadTodos()` to ensure store is populated.
- Selects the todo with `selectTodoById(id)`, filters until available and returns it. If not found, redirects to `/todos/create`.

This pattern ensures the form gets a hydrated `Todo` object when editing (works with NgRx entity selectors).

---

## Persistence

- The app persists todos to `localStorage` under key `todos`.
- On startup the service reads and deserializes dates. If the key is missing it seeds with `TODO_MOCK`.
- All mutating service calls persist after updating the signal.

---
