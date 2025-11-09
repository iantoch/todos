import { Todo } from '../store/todo/todo.model';

const now = Date.now();
const today = new Date();

export const TODO_MOCK: Todo[] = [
  {
    id: 'seed-1',
    title: 'Buy groceries',
    description: 'Milk, eggs, bread, and fresh fruit. Also pick up some snacks for the weekend.',
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
    description: 'Take the car for its scheduled maintenance. Check tire pressure and oil level.',
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
