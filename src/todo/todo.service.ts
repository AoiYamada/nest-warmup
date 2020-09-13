import { Injectable } from '@nestjs/common';
import { CreateTodoDTO } from './dto/create-todo.dto';
import { ListTodoDTO } from './dto/list-todo.dto';
import { UpdateTodoDTO } from './dto/update-todo.dto';
import { Todo } from './todo.entity';
import { TodoRepository } from './todo.repository';

@Injectable()
// Note: seems useless here but it is useful when the business logic require to manipulate multiple tables
export class TodoService {
  constructor(private readonly todoRepository: TodoRepository) {}

  async create(todo: CreateTodoDTO): Promise<{ _id: string }> {
    return this.todoRepository.create(todo);
  }

  async get(_id: string): Promise<Todo | undefined> {
    return this.todoRepository.get(_id);
  }

  async list(filters: ListTodoDTO): Promise<Todo[]> {
    return this.todoRepository.list(filters);
  }

  async update(_id: string, payload: UpdateTodoDTO): Promise<Todo | undefined> {
    return this.todoRepository.update(_id, payload);
  }

  async delete(_id: string): Promise<void> {
    return this.todoRepository.delete(_id);
  }
}
