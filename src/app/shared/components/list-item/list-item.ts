import { Component, input, output } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Todo } from '../../../store/todo/todo.model';

@Component({
  selector: 'app-list-item',
  standalone: true,
  imports: [CommonModule, MatCheckboxModule, MatIconModule, MatButtonModule, DatePipe],
  templateUrl: './list-item.html',
  styleUrl: './list-item.scss',
})
export class ListItem {
  todo = input<Todo>({} as Todo);

  edit = output<string>();
  delete = output<string>();
  toggle = output<{ id: string; completed: boolean }>();

  onEdit(): void {
    this.edit.emit(this.todo().id);
  }

  onDelete(): void {
    this.delete.emit(this.todo().id);
  }

  onToggle(checked: boolean): void {
    this.toggle.emit({ id: this.todo().id, completed: checked });
  }

  isDueDay(): boolean {
    const today = new Date();
    const due = this.todo().dueDate;
    return (
      due.getFullYear() === today.getFullYear() &&
      due.getMonth() === today.getMonth() &&
      due.getDate() === today.getDate()
    );
  }

  get stateClass(): string {
    if (this.todo().completed) return 'state-completed';
    if (this.isDueDay()) return 'state-due-today';
    return 'state-upcoming';
  }
}
