import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ResourceService } from 'src/common/resource.service';
import { CreateUserDTO, UpdateUserDTO } from './dto';
import { UserEntity } from './user.entity';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService extends ResourceService<
  UserEntity,
  CreateUserDTO,
  UpdateUserDTO
> {
  constructor(
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository,
  ) {
    super(userRepository);
  }
}
