import {
  Controller,
  Request,
  Post,
  UseGuards,
  Body,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Request as IRequest } from 'express';
import { CreateUserDto } from 'src/user/dto';
import { UserEntity } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Post('signUp')
  async signUp(@Body() payload: CreateUserDto): Promise<{ id: number }> {
    try {
      const { id } = await this.userService.create(payload);

      return { id };
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new BadRequestException(
          `Username[${payload.username}] or Email[${
            payload.email || ''
          }] has been registered`,
        );
      } else {
        throw new InternalServerErrorException('Register Service Unavailable');
      }
    }
  }

  @UseGuards(LocalAuthGuard)
  @Post('signIn')
  async signIn(
    @Request() { user }: IRequest,
  ): Promise<{ accessToken: string }> {
    return this.authService.signIn(user as UserEntity);
  }
}
