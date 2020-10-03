import { ConfigModule, ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { JwtModule } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserEntity } from 'src/user/user.entity';
import { UserRepository } from 'src/user/user.repository';
import { UserService } from 'src/user/user.service';
import { AuthService } from './auth.service';
import appConfig from 'src/config/app.config';
import jwtConfig from 'src/config/jwt.config';
import { RedisService } from 'src/lib/redis-service';

describe('AuthService', () => {
  let service: AuthService;
  let userService: UserService;

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
        {
          provide: RedisService,
          useValue: {
            getClient: jest.fn(),
          },
        },
      ],
    }).compile();

    service = await module.resolve(AuthService);
    userService = await module.resolve(UserService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('validateUser should return user if password matches', async () => {
    const username = 'tester';
    const password = 'MyPassword';
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new UserEntity();

    user.id = 1;
    user.username = username;
    user.password = hashedPassword;

    const userServiceSpy = {
      getByUsername: jest
        .spyOn(userService, 'getByUsername')
        .mockImplementation(async () => user),
    };

    const userEntitySpy = {
      verifyPassword: jest.spyOn(user, 'verifyPassword'),
    };

    const result = await service.validateUser(username, password);

    expect(userServiceSpy.getByUsername).toHaveBeenLastCalledWith(username);
    expect(userEntitySpy.verifyPassword).toHaveBeenLastCalledWith(password);
    expect(result).toEqual({
      id: user.id,
      username: user.username,
      permissions: [],
    });
  });

  it('validateUser should return null if password does not match', async () => {
    const username = 'tester';
    const password = 'MyPassword';

    const user = new UserEntity();

    user.username = username;
    user.password = password;

    const userServiceSpy = {
      getByUsername: jest
        .spyOn(userService, 'getByUsername')
        .mockImplementation(async () => user),
    };

    const userEntitySpy = {
      verifyPassword: jest.spyOn(user, 'verifyPassword'),
    };

    const result = await service.validateUser(username, password);

    expect(userServiceSpy.getByUsername).toHaveBeenLastCalledWith(username);
    expect(userEntitySpy.verifyPassword).toHaveBeenLastCalledWith(password);
    expect(result).toEqual(null);
  });

  it('validateUser should return null if user does not exist', async () => {
    const username = 'tester';
    const password = 'MyPassword';

    const userServiceSpy = {
      getByUsername: jest
        .spyOn(userService, 'getByUsername')
        .mockImplementation(async () => undefined),
    };

    const result = await service.validateUser(username, password);

    expect(userServiceSpy.getByUsername).toHaveBeenLastCalledWith(username);
    expect(result).toEqual(null);
  });
});
