import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserEntity } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(
    username: string,
    password: string,
  ): Promise<UserEntity | null> {
    const user = await this.userService.getByUsername(username);

    if (user && (await user.verifyPassword(password))) {
      return user;
    }

    return null;
  }

  async signIn({ id, username }: UserEntity) {
    return {
      accessToken: this.jwtService.sign({ username, sub: id }),
    };
  }
}
