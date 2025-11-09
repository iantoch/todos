import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
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
  todoForm: FormGroup;
  minDate = new Date();

  constructor(private fb: FormBuilder, private store: Store) {
    this.todoForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      dueDate: [null],
    });
  }

  onSubmit(): void {
    if (this.todoForm.valid) {
      const newTodo: Todo = {
        id: crypto.randomUUID(),
        ...this.todoForm.value,
        completed: false,
        createdAt: new Date(),
        dueDate: this.todoForm.value.dueDate,
      };

      this.store.dispatch(TodoActions.addTodo({ todo: newTodo }));
      this.todoForm.reset();
    }
  }
}
