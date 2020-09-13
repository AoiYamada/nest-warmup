import { Injectable } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { CreateTodoDTO } from './dto/create-todo.dto';
import { ListTodoDTO } from './dto/list-todo.dto';
import { UpdateTodoDTO } from './dto/update-todo.dto';
import { Todo } from './todo.entity';

@Injectable()
// NOTE: all functions are async here because when we connect it with real db, these operations will be async
export class TodoRepository {
  private todos: Todo[] = [];

  async create(todo: CreateTodoDTO): Promise<{ _id: string }> {
    console.log(todo);
    const _id = uuid();

    this.todos.push({
      _id,
      ...todo,
    });

    return {
      _id,
    };
  }

  async get(_id: string): Promise<Todo | undefined> {
    return this.todos.find(todo => todo._id === _id);
  }

  async list({ page = 0, limit = 10 }: ListTodoDTO): Promise<Todo[]> {
    const offset: number = page * limit;
    const end = offset + limit;

    // Note: list items should not have too much detail infos, eg do not join unecessary table in RDBMS
    return this.todos.slice(offset, end);
  }

  async update(_id: string, payload: UpdateTodoDTO): Promise<Todo | undefined> {
    const targetIdx = this.todos.findIndex(todo => todo._id === _id);

    if (targetIdx < 0) {
      return;
    }

    const targetTodo = this.todos[targetIdx];
    this.todos[targetIdx] = { ...targetTodo, ...payload };

    return this.todos[targetIdx];
  }

  async delete(_id): Promise<void> {
    const targetIdx = this.todos.findIndex(todo => todo._id === _id);

    if (targetIdx < 0) {
      return;
    }

    this.todos.splice(targetIdx, 1);
  }
}
