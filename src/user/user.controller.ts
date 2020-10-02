import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Query,
} from '@nestjs/common';
import { Pagination } from 'src/lib/limit-offset-paginate';
import { Like } from 'typeorm';
import { UpdateUserDto, ListUserDto } from './dto';
import { UserEntity } from './user.entity';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // TODO: should be accessible by superuser only
  // TODO: implement GET /users/me to retrieve user data of the logged-in user
  @Get(':id')
  async get(@Param('id') id: number): Promise<UserEntity> {
    const result = await this.userService.get(id);

    if (!result) {
      throw new NotFoundException(`User[${id}] not found`);
    }

    return result;
  }

  // TODO: should be accessible by superuser only
  @Get()
  async list(
    @Query() { page = 1, limit = 10, ...filters }: ListUserDto,
  ): Promise<Pagination<UserEntity>> {
    return this.userService.list(
      {
        page,
        limit,
        route: '/users',
      },
      {
        where: [
          {
            ...(filters.username && {
              username: Like(`%${filters.username}%`),
            }),
            ...(filters.email && { email: Like(`%${filters.email}%`) }),
          },
        ],
      },
    );
  }

  // TODO: should be accessible by superuser only
  // TODO: implement Patch /users/me to update user data of the logged-in user
  @Patch(':id')
  async patch(
    @Param('id') id: number,
    @Body() payload: UpdateUserDto,
  ): Promise<UserEntity> {
    const result = await this.userService.update(id, payload);

    if (!result) {
      throw new NotFoundException(`User[${id}] not found`);
    }

    return result;
  }

  // TODO: should be accessible by superuser only
  @Delete(':id')
  async delete(@Param('id') id: number): Promise<void> {
    return this.userService.delete(id);
  }
}
