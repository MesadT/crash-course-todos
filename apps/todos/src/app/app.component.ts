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

@Component({
  selector: 'cct-root',
  template: `
    <h1>Todo List</h1>
    <input
      type="search"
      placeholder="Suchen..."
      [formControl]="searchTerm"
    />
    <br />
    <label>
      <input
        type="checkbox"
        [formControl]="showDone"
      />
      Erledigte Todos anzeigen
    </label>
    <br />
    <br />
    <cct-todo-item
      *ngFor="let todo of (displayTodos$ | async)"
      [todo]="todo"
      (resolveTodo)="onResolve(todo, $event)"
      (deleteTodo)="onDelete(todo)"
    ></cct-todo-item>
    <br />
    <cct-todo-input (createTodo)="onCreate($event)"></cct-todo-input>
  `,
  styles: [],
})
export class AppComponent {
  private static nextId = 0;
  private readonly todos$ = new BehaviorSubject<Todo[]>([
    { id: AppComponent.nextId++, title: 'Mittagessen', done: true },
    { id: AppComponent.nextId++, title: 'Tutorial beenden' },
    { id: AppComponent.nextId++, title: 'Feierabend' },
  ]);

  public readonly searchTerm = new FormControl('');
  private readonly searchTerm$ = this.searchTerm.valueChanges.pipe(
    startWith(this.searchTerm.value),
    map((searchTerm) => searchTerm.trim().toLowerCase())
  );

  public readonly showDone = new FormControl(true);
  private readonly showDone$ = this.showDone.valueChanges.pipe(
    startWith(this.showDone.value)
  );

  public readonly displayTodos$: Observable<Todo[]> = combineLatest([
    this.todos$,
    this.showDone$,
    this.searchTerm$,
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

  public onCreate(todo: Omit<Todo, 'id'>) {
    const todos = this.todos$.getValue();
    todos.push({ id: AppComponent.nextId++, ...todo });
    this.todos$.next(todos);
  }

  public onResolve(todo: Todo, isDone: boolean) {
    let todos = this.todos$.getValue();
    todos = todos.map((_todo) => {
      if (_todo.id === todo.id) {
        return { ...todo, done: isDone };
      }
      return _todo;
    });
    this.todos$.next(todos);
  }

  public onDelete(todo: Todo) {
    let todos = this.todos$.getValue();
    todos = todos.filter((_todo) => _todo.id !== todo.id);
    this.todos$.next(todos);
  }
}
