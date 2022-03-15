import { Component, EventEmitter, Output } from '@angular/core';
import { Todo } from '../todo';

@Component({
  selector: 'cct-todo-input',
  template: `
    <input
      type="text"
      placeholder="Was gibt's zu tun?"
      [(ngModel)]="todoTitle"
      (keydown.enter)="onSubmit()"
    />
  `,
  styles: [],
})
export class TodoInputComponent {
  public todoTitle = '';

  @Output()
  public readonly createTodo = new EventEmitter<Omit<Todo, 'id'>>();

  public onSubmit() {
    const title = this.todoTitle.trim();
    if (title.length === 0) {
      return;
    }

    this.createTodo.emit({ title });

    this.todoTitle = '';
  }
}
