import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";
import {Todo} from "./todo";

@Injectable({
  providedIn: 'root'
})
export class TodosService {
  private static nextId = 0;
  private readonly _todos$ = new BehaviorSubject<Todo[]>([
    { id: TodosService.nextId++, title: 'Mittagessen', done: true },
    { id: TodosService.nextId++, title: 'Tutorial beenden' },
    { id: TodosService.nextId++, title: 'Feierabend' },
  ]);

  public readonly todos$: Observable<Todo[]> = this._todos$.asObservable()

  public create(todo: Omit<Todo, 'id'>):void {
    const todos = this._todos$.getValue();
    todos.push({ id: TodosService.nextId++, ...todo });
    this._todos$.next(todos);
  }

  public markAsDone(todo: Todo, isDone: boolean = true): void{
    let todos = this._todos$.getValue();
    todos = todos.map((_todo) => {
      if (_todo.id === todo.id) {
        return { ...todo, done: isDone };
      }
      return _todo;
    });
    this._todos$.next(todos);
  }

  public delete(todo: Todo):void {
    let todos = this._todos$.getValue();
    todos = todos.filter((_todo) => _todo.id !== todo.id);
    this._todos$.next(todos);
  }
}
