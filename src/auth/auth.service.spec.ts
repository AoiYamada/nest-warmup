import { Test, TestingModule } from '@nestjs/testing';
import * as bcrypt from 'bcrypt';
import { UserEntity } from 'src/user/user.entity';
import { UserRepository } from 'src/user/user.repository';
import { UserService } from 'src/user/user.service';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService, UserService, UserRepository],
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
    expect(result).toEqual(user);
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
