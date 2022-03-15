import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Todo } from '../todo';

@Component({
  selector: 'app-todo-item',
  template: `
    <label>
      <input #input type="checkbox" [checked]="todo.done" (change)="onResolve(input.checked)" />
      <span [class.done]="todo.done">{{todo.title}}</span>
      <button (click)="onDelete()">❌</button>
    </label>
  `,
  styles: [
    ':host { display: block; }',
    'label { display: flex; align-items: center; }',
    'span { display: inline-block; width: 25ch; overflow: hidden; white-space: nowrap; text-overflow: ellipsis;}',
    'span.done { font-style: italic; }',
    'button { padding: 0; }',
  ],
})
export class TodoItemComponent {
  @Input()
  public todo: Todo;

  @Output()
  public readonly resolveTodo = new EventEmitter<boolean>();

  @Output()
  public readonly deleteTodo = new EventEmitter<void>();

  public onResolve(isDone: boolean) {
    this.resolveTodo.emit(isDone);
  }

  public onDelete() {
    this.deleteTodo.emit();
  }
}
