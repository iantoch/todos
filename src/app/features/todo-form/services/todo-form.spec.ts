import { TestBed } from '@angular/core/testing';

import { TodoForm } from './todo-form';

describe('TodoForm', () => {
  let service: TodoForm;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TodoForm);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
