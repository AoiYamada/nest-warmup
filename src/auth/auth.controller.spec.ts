import { Test, TestingModule } from '@nestjs/testing';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LocalStrategy } from './local.strategy';
import { UserRepository } from 'src/user/user.repository';
import { UserService } from 'src/user/user.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RedisModule } from 'src/lib/redis-service';
import appConfig from 'src/config/app.config';
import jwtConfig from 'src/config/jwt.config';

describe('AuthController', () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          load: [appConfig, jwtConfig],
        }),
        JwtModule.registerAsync({
          imports: [ConfigModule],
          useFactory: async (configService: ConfigService) => ({
            secret: configService.get('jwt.SECRET'),
            signOptions: {
              expiresIn: configService.get('jwt.TOKEN_EXPIRE_TIME'),
            },
          }),
          inject: [ConfigService],
        }),
      ],
      providers: [AuthService, UserService, UserRepository, LocalStrategy],
      controllers: [AuthController],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
