import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ResourceService } from 'src/common/resource.service';
import { CreateUserDto, UpdateUserDto } from './dto';
import { UserEntity } from './user.entity';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService extends ResourceService<
  UserEntity,
  CreateUserDto,
  UpdateUserDto
> {
  constructor(
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository,
  ) {
    super(userRepository);
  }

  async getByUsername(username: string): Promise<UserEntity | undefined> {
    return this.userRepository.findOne({
      where: {
        username,
      },
    });
  }
}
