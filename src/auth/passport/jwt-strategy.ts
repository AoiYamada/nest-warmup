import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('jwt.SECRET'),
    });
  }

  async validate({
    sub: id,
    username,
    permissions = [],
  }: {
    sub: number;
    username: string;
    permissions: string[];
  }) {
    if (!(id && username)) {
      throw new UnauthorizedException();
    }

    return { id, username, permissions };
  }
}
