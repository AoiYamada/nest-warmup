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
import { CreateUserDto } from 'src/user/dto';
import { UserService } from 'src/user/user.service';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './passport/jwt-auth.guard';
import { LocalAuthGuard, PermissionsGuard } from './passport';
import { SignInRo } from './ro/sign-in.ro';
import { AuthUser, RequirePermissions, BearerToken } from './decorator';

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
    @AuthUser() user: { id: number; username: string; permissions: string[] },
    @Body('scopes') scopes: string[],
  ): Promise<SignInRo> {
    return this.authService.issueToken({
      sub: user.id,
      username: user.username,
      permissions: user.permissions,
    });
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Post('refresh')
  @RequirePermissions('refresh')
  async refreshToken(@BearerToken() refreshToken: string): Promise<SignInRo> {
    return this.authService.refreshToken(refreshToken);
  }

  // TODO: remove this, test JWT endpoint
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Get('profile')
  async getProfile(@Request() req) {
    return req.user;
  }
}
