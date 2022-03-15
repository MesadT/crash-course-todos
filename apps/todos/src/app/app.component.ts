import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import {
  BehaviorSubject,
  combineLatest,
  map,
  Observable,
  startWith,
} from 'rxjs';
import { Todo } from './todo';
import {TodosService} from "./todos.service";

@Component({
  selector: 'cct-root',
  template: `
    <h1>Todo List</h1>
    <input
      type="search"
      placeholder="Suchen..."
      [formControl]="searchTerm"
    />
    <br/>
    <label>
      <input
        type="checkbox"
        [formControl]="showDone"
      />
      Erledigte Todos anzeigen
    </label>
    <br/>
    <br/>
    <cct-todo-item
      *ngFor="let todo of (todos$ | async)"
      [todo]="todo"
      (resolveTodo)="onResolve(todo, $event)"
      (deleteTodo)="onDelete(todo)"
    ></cct-todo-item>
    <br/>
    <cct-todo-input (createTodo)="onCreate($event)"></cct-todo-input>
  `,
  styles: [],
})
export class AppComponent {
  public readonly searchTerm = new FormControl('');
  private readonly searchTerm$ = this.searchTerm.valueChanges.pipe(
    startWith(this.searchTerm.value),
    map((searchTerm) => searchTerm.trim().toLowerCase())
  );

  public readonly showDone = new FormControl(true);
  private readonly showDone$ = this.showDone.valueChanges.pipe(
    startWith(this.showDone.value)
  );

  public readonly todos$: Observable<Todo[]> = combineLatest([
    this.todoService.todos$,
    this.showDone$,
    this.searchTerm$
  ]).pipe(
    map(([todos, showDone, searchTerm]) => {
      let _todos = todos;

      if (!showDone) {
        _todos = _todos.filter((todo) => !todo.done);
      }

      if (searchTerm.length > 2) {
        _todos = _todos.filter((todo) =>
          todo.title.toLowerCase().includes(searchTerm)
        );
      }

      return _todos;
    })
  );

  constructor(private readonly todoService: TodosService) {

  }

  public onCreate(todo: Omit<Todo, 'id'>) {
  this.todoService.create(todo)
  }

  public onResolve(todo: Todo, isDone: boolean) {
   this.todoService.markAsDone(todo, isDone)
  }

  public onDelete(todo: Todo) {
    this.todoService.delete(todo)
  }
}
