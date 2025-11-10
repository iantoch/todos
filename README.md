# Todos (Angular standalone + NgRx)

A small Todo demonstration app built with Angular 20, standalone components and NgRx for state management. It uses modern Angular primitives (signals in service layer), Angular Material for UI, and persists data to localStorage for a simple, zero-backend experience.

## Quick start

Requirements

- Node.js (^20, recommended v24.11.0).
- npm (bundled with Node) or your preferred package manager.

Install and run:

```powershell
npm install
npm start
```

Open the app at: http://localhost:4200

Run tests:

```powershell
npm test
```

Build for production:

```powershell
npm run build
```

## Project structure (high level)

- `src/app/features` – feature screens (todo list, todo form)
- `src/app/shared/components` – reusable standalone UI components (section wrapper, list item)
- `src/app/store` – NgRx store effects, actions and models
- `src/app/services` – application services (e.g., `TodoService`)
- `src/styles.scss` – global styles

The app uses standalone components and dynamic route loading (loadComponent) where applicable.

## Local persistence

Todos are persisted to `localStorage` under the key `todos`. This provides a simple offline-friendly experience while you experiment with the UI and state management. To reset the app data in your browser, open DevTools → Application → Local Storage and remove the `todos` key.

## Important versions

- Angular core packages: ^20.3.0
- Angular CLI / build: ^20.3.9
- Angular Material: ^20.2.12
- Angular CDK: ^20.2.12
- NgRx (store/effects/entity): ^20.1.0
- rxjs: ~7.8.0
- TypeScript (dev): ~5.9.2

Recommended Node.js

- Node (^20, recommended v24.11.0)

## Notable implementation details

- `TodoService` uses Angular Signals (internal WritableSignal) as the source of truth and exposes a `BehaviorSubject`-backed `todos$` Observable for compatibility with existing template code using `async`.
- The app uses Angular Material components for form controls and buttons.
- UI components are designed mobile-first and include responsive styles for small viewports.

## Scripts

- `npm start` — run the dev server (ng serve)
- `npm test` — run unit tests
- `npm run build` — production build
