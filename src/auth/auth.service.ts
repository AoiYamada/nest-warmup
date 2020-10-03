import { ForbiddenException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { RedisService } from 'src/lib/redis-service';
import { SignInRo } from './ro/sign-in.ro';
import { Ok, Redis } from 'ioredis';

@Injectable()
export class AuthService {
  private readonly refreshTokenExpiresIn: number;
  private readonly redis: Redis;

  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly redisService: RedisService,
  ) {
    this.refreshTokenExpiresIn = configService.get<number>(
      'jwt.REFRESH_TOKEN_EXPIRE_TIME',
    );
    this.redis = this.redisService.getClient('jwt-cache');
  }

  async validateUser(
    username: string,
    password: string,
  ): Promise<{ id: number; username: string; permissions: string[] } | null> {
    const user = await this.userService.getByUsername(username);
    const permissions = [];

    if (user && (await user.verifyPassword(password))) {
      return { id: user.id, username: user.username, permissions };
    }

    return null;
  }

  async issueToken({
    sub,
    username,
    permissions,
  }: {
    sub: number;
    username: string;
    permissions: string[];
  }): Promise<SignInRo> {
    const accessToken = this.jwtService.sign({ sub, username, permissions });
    const refreshToken = this.jwtService.sign(
      { sub, username, permissions: ['refresh'] },
      { expiresIn: this.refreshTokenExpiresIn },
    );

    await this.saveRefreshToken(refreshToken, accessToken);

    return {
      accessToken,
      refreshToken,
    };
  }

  async refreshToken(refreshToken: string) {
    try {
      const { sub, username, permissions } = this.jwtService.decode(
        await this.redis.get(refreshToken),
      ) as {
        sub: number;
        username: string;
        permissions: string[];
      };

      return this.issueToken({ sub, username, permissions });
    } catch (error) {
      Logger.error(error.stack || error.message || error);
      throw new ForbiddenException();
    }
  }

  async saveRefreshToken(
    refreshToken: string,
    accessToken: string,
  ): Promise<Ok | null> {
    return this.redis.set(
      refreshToken,
      accessToken,
      'ex',
      this.refreshTokenExpiresIn + 1, // add extra 1s buffer to process the request
    );
  }
}
