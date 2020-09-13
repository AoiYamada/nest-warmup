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
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreateTodoDTO } from './dto/create-todo.dto';
import { ListTodoDTO } from './dto/list-todo.dto';
import { UpdateTodoDTO } from './dto/update-todo.dto';
import { Todo } from './todo.entity';
import { TodoService } from './todo.service';

@Controller('todo')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Post()
  async create(@Body() payload: CreateTodoDTO): Promise<{ _id: string }> {
    return this.todoService.create(payload);
  }

  @Get(':id')
  async get(@Param('id') _id: string): Promise<Todo> {
    const result = await this.todoService.get(_id);

    if (!result) {
      throw new NotFoundException(`Todo[${_id}] not found`);
    }

    return result;
  }

  @Get()
  async list(@Query() filters: ListTodoDTO): Promise<Todo[]> {
    return this.todoService.list(filters);
  }

  @Patch(':id')
  async patch(
    @Param('id') _id: string,
    @Body() payload: UpdateTodoDTO,
  ): Promise<Todo> {
    const result = await this.todoService.update(_id, payload);

    if (!result) {
      throw new NotFoundException(`Todo[${_id}] not found`);
    }

    return result;
  }

  @Delete(':id')
  async delete(@Param('id') _id: string): Promise<void> {
    return this.todoService.delete(_id);
  }
}
