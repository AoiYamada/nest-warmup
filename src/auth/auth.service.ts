import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.userService.getByUsername(username);

    if (user && (await user.verifyPassword(password))) {
      return user;
    }

    return null;
  }

  async signIn({ id, username }: { id: number; username: string }) {
    return {
      accessToken: this.jwtService.sign({ username, sub: id }),
    };
  }
}
