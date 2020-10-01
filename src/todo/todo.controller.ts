import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { Pagination } from 'src/utils/limit-offset-paginate';
import { Like } from 'typeorm';
import { CreateTodoDTO } from './dto/create-todo.dto';
import { ListTodoDTO } from './dto/list-todo.dto';
import { UpdateTodoDTO } from './dto/update-todo.dto';
import { Todo } from './todo.entity';
import { TodoService } from './todo.service';

@Controller('todo')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Post()
  async create(@Body() payload: CreateTodoDTO): Promise<{ id: number }> {
    return this.todoService.create(payload);
  }

  @Get(':id')
  async get(@Param('id') id: number): Promise<Todo> {
    const result = await this.todoService.get(id);

    if (!result) {
      throw new NotFoundException(`Todo[${id}] not found`);
    }

    return result;
  }

  @Get()
  async list(
    @Query() { page = 1, limit = 10, ...filters }: ListTodoDTO,
  ): Promise<Pagination<Todo>> {
    return this.todoService.list(
      {
        page,
        limit,
        route: '/todo',
      },
      {
        where: [
          {
            ...(filters.title && { title: Like(`%${filters.title}%`) }),
            ...(filters.content && { content: Like(`%${filters.content}%`) }),
          },
        ],
      },
    );
  }

  @Patch(':id')
  async patch(
    @Param('id') id: number,
    @Body() payload: UpdateTodoDTO,
  ): Promise<Todo> {
    const result = await this.todoService.update(id, payload);

    if (!result) {
      throw new NotFoundException(`Todo[${id}] not found`);
    }

    return result;
  }

  @Delete(':id')
  async delete(@Param('id') id: number): Promise<void> {
    return this.todoService.delete(id);
  }
}
