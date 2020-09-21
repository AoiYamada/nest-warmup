import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions } from 'typeorm';
import { CreateTodoDTO } from './dto/create-todo.dto';
import { UpdateTodoDTO } from './dto/update-todo.dto';
import { Todo } from './todo.entity';
import { TodoRepository } from './todo.repository';

@Injectable()
// Note: seems useless here but it is useful when the business logic require to manipulate multiple tables
export class TodoService {
  constructor(
    // TODO: nest doc examples inject entity directly, and others use repository layer, see if it is useful
    @InjectRepository(TodoRepository)
    private todoRepository: TodoRepository,
  ) {}

  async create(payload: CreateTodoDTO): Promise<{ id: number }> {
    const todo = this.todoRepository.create(payload);
    return this.todoRepository.save(todo);
  }

  async get(id: number): Promise<Todo | undefined> {
    return this.todoRepository.findOne(id);
  }

  async list(filters: FindManyOptions): Promise<Todo[]> {
    return this.todoRepository.find(filters);
  }

  async update(id: number, payload: UpdateTodoDTO): Promise<Todo | undefined> {
    await this.todoRepository.update(id, payload);
    return this.todoRepository.findOne(id);
  }

  async delete(id: number): Promise<void> {
    await this.todoRepository.softDelete(id);
  }

  // TODO: endpoint for restore softDeleted item
  // async restore(id: number): Promise<void> {
  //   await this.todoRepository.restore(id);
  // }
}
