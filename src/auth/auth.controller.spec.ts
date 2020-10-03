import { Test, TestingModule } from '@nestjs/testing';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LocalStrategy } from './passport';
import { UserRepository } from 'src/user/user.repository';
import { UserService } from 'src/user/user.service';
import appConfig from 'src/config/app.config';
import jwtConfig from 'src/config/jwt.config';
import { RedisService } from 'src/lib/redis-service';

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
      providers: [
        AuthService,
        UserService,
        UserRepository,
        LocalStrategy,
        {
          provide: RedisService,
          useValue: {
            getClient: jest.fn(),
          },
        },
      ],
      controllers: [AuthController],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
