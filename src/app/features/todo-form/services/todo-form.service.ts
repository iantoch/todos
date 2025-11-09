import { inject, Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Todo } from '../../../store/todo/todo.model';

@Injectable({
  providedIn: 'root',
})
export class TodoFormService {
  private fb = inject(FormBuilder);

  buildForm() {
    return this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      dueDate: [null, [Validators.required]],
    });
  }

  patchForm(form: FormGroup, todo: Todo) {
    form.patchValue({
      title: todo.title,
      description: todo.description,
      dueDate: todo.dueDate,
    });
  }

  generateDataForTodo(form: FormGroup): Todo {
    return {
      id: crypto.randomUUID(),
      ...form.value,
      completed: false,
      createdAt: new Date(),
      dueDate: form.value.dueDate,
    };
  }
}
