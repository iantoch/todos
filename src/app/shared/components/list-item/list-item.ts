import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Todo } from '../../../store/todo/todo.model';

@Component({
  selector: 'app-list-item',
  standalone: true,
  imports: [CommonModule, MatCheckboxModule, MatIconModule, MatButtonModule],
  templateUrl: './list-item.html',
  styleUrl: './list-item.scss',
})
export class ListItem {
  todo = input<Todo>({} as Todo);
  edit = output<string>();
  delete = output<string>();
  toggle = output<{ id: string; completed: boolean }>();

  onEdit(): void {
    if (this.todo()) this.edit.emit(this.todo().id);
  }

  onDelete(): void {
    if (this.todo()) this.delete.emit(this.todo().id);
  }

  onToggle(checked: boolean): void {
    if (this.todo()) this.toggle.emit({ id: this.todo().id, completed: checked });
  }

  get displayDate(): string {
    if (!this.todo()) return '';
    const d = this.todo().completed
      ? (this.todo() as any).completedAt ?? this.todo().createdAt
      : this.todo().dueDate;
    if (!d) return '—';
    try {
      const date = new Date(d);
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = String(date.getFullYear()).slice(-2);
      return `${day}/${month}/${year}`;
    } catch {
      return String(d);
    }
  }

  get stateClass(): string {
    if (!this.todo()) return '';
    if (this.todo().completed) return 'state-completed';
    const today = new Date();
    const dueDateVal = this.todo().dueDate;
    const due = dueDateVal ? new Date(dueDateVal as string | number | Date) : null;
    if (due) {
      if (
        due.getFullYear() === today.getFullYear() &&
        due.getMonth() === today.getMonth() &&
        due.getDate() === today.getDate()
      ) {
        return 'state-due-today';
      }
    }
    return 'state-upcoming';
  }
}
