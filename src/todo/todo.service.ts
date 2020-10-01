import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ResourceService } from 'src/common/resource.service';
import { CreateTodoDto, UpdateTodoDto } from './dto';
import { Todo } from './todo.entity';
import { TodoRepository } from './todo.repository';

@Injectable()
// Note: seems useless here but it is useful when the business logic require to manipulate multiple tables
export class TodoService extends ResourceService<
  Todo,
  CreateTodoDto,
  UpdateTodoDto
> {
  constructor(
    // Nest doc examples inject entity directly, and others use repository layer
    // Because it is fucking difficult and lack of doc about how to write the test spec without repository layer
    @InjectRepository(TodoRepository)
    private readonly todoRepository: TodoRepository,
  ) {
    super(todoRepository);
  }
}
