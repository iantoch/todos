import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { SectionWrapper } from '../../shared/components/section-wrapper/section-wrapper';
import { Store } from '@ngrx/store';
import { Todo } from '../../store/todo/todo.model';
import * as TodoActions from '../../store/todo/todo.actions';
import { ActivatedRoute, Router } from '@angular/router';
import { TodoFormService } from './services/todo-form.service';

@Component({
  selector: 'app-todo-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatIconModule,
    SectionWrapper,
  ],
  templateUrl: './todo-form.html',
  styleUrl: './todo-form.scss',
})
export class TodoForm {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private store = inject(Store);
  private todoFormService = inject(TodoFormService);

  todoForm: FormGroup;
  todo: Todo | null = null;
  minDate = new Date();
  editMode = signal(false);
  currentTodo = signal<Todo | null>(null);

  constructor() {
    this.todoForm = this.todoFormService.buildForm();
    this.todo = this.route.snapshot.data['todo'] as Todo | null;

    if (this.todo) {
      this.editMode.set(true);
      this.currentTodo.set(this.todo);
      this.todoFormService.patchForm(this.todoForm, this.todo);
    }
  }

  get titleControl() {
    return this.todoForm.get('title');
  }

  get descriptionControl() {
    return this.todoForm.get('description');
  }

  get dueDateControl() {
    return this.todoForm.get('dueDate');
  }

  onSubmit(): void {
    if (this.todoForm.invalid) return;

    if (this.editMode()) {
      this.handleEdit();
    } else {
      this.handleSave();
    }

    this.todoForm.reset();
    this.router.navigate(['/todos']);
  }

  handleEdit(): void {
    if (!this.currentTodo()) return;

    const updatedTodo: Todo = {
      ...this.currentTodo(),
      ...this.todoForm.value,
    };

    this.store.dispatch(TodoActions.updateTodo({ todo: updatedTodo }));
  }

  handleSave(): void {
    const newTodo: Todo = this.todoFormService.generateDataForTodo(this.todoForm);

    this.store.dispatch(TodoActions.addTodo({ todo: newTodo }));
  }

  handleRedirectBack(): void {
    this.router.navigate(['/todos']);
  }
}
