import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { v4 as uuid } from 'uuid';
import { UserEntity } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';
import { RedisService } from 'src/lib/redis-service';

@Injectable()
export class AuthService {
  private readonly refreshTokenExpiresIn: number;
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) // private readonly redisService: RedisService,
  {
    this.refreshTokenExpiresIn = configService.get<number>(
      'jwt.REFRESH_TOKEN_EXPIRE_TIME',
    );
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
    id: sub,
    username,
    permissions,
  }: {
    id: number;
    username: string;
    permissions: string[];
  }): Promise<{ accessToken: string; refreshToken: string }> {
    const accessToken = this.jwtService.sign({ sub, username, permissions });
    const refreshToken = this.jwtService.sign(
      { sub, username, permissions: ['refresh'] },
      { expiresIn: this.refreshTokenExpiresIn },
    );

    return {
      accessToken,
      refreshToken,
    };
  }
}
