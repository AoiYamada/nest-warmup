import {
  Controller,
  Request,
  Post,
  UseGuards,
  Body,
  BadRequestException,
  InternalServerErrorException,
  Get,
} from '@nestjs/common';
import { Request as IRequest } from 'express';
import { CreateUserDto } from 'src/user/dto';
import { UserService } from 'src/user/user.service';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { LocalAuthGuard } from './local-auth.guard';
import { PermissionsGuard } from './permissions.guard';
import { RequirePermissions } from './require-permissions.decorator';

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
  ): Promise<{ accessToken: string; refreshToken: string }> {
    return this.authService.issueToken(
      user as { id: number; username: string; permissions: string[] },
    );
  }

  // TODO: remove this, test JWT endpoint
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  // TODO: remove this, test JWT endpoint
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Get('refresh')
  @RequirePermissions('refresh')
  get(@Request() req) {
    return ['nothing'];
  }
}
