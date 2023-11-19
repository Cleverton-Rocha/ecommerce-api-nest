import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { UserPayload } from './models/UserPayload';
import { UserToken } from './models/UserToken';
import * as bcrypt from 'bcrypt';

const accessToken: UserToken = {
  access_token: 'mockAccessToken',
};

describe('AuthService', () => {
  let authService: AuthService;
  let jwtService: JwtService;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        UserService,
        JwtService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            login: jest.fn(),
            validateUser: jest.fn(),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
    expect(jwtService).toBeDefined();
  });

  describe('login', () => {
    it('Should create a valid JWT token with the correct payload and return it', () => {
      const mockUser: User = {
        id: 1,
        email: 'mock@email.com',
        password: undefined,
        name: 'mock user',
      };

      const mockPayload: UserPayload = {
        sub: mockUser.id,
        email: mockUser.email,
        name: mockUser.name,
      };

      jest.spyOn(jwtService, 'sign').mockReturnValue(accessToken.access_token);

      const result = authService.login(mockUser);

      expect(result.access_token).toBe(accessToken.access_token);
      expect(jwtService.sign).toHaveBeenCalledTimes(1);
      expect(jwtService.sign).toHaveBeenCalledWith(mockPayload);
    });
  });

  describe('validateUser', () => {
    it('Should return a user with a undefined password if email and password are valid', async () => {
      const mockUser: User = {
        id: 1,
        email: 'mock@email.com',
        password: 'Hashed password',
        name: 'mock user',
      };

      const mockLoginUser = {
        email: 'mock@email.com',
        password: 'password',
      };

      jest.spyOn(userService, 'findByEmail').mockResolvedValue(mockUser);

      jest
        .spyOn(bcrypt, 'compare')
        .mockImplementation(() => Promise.resolve(true));

      const result = await authService.validateUser(
        mockLoginUser.email,
        mockLoginUser.password,
      );

      expect(userService.findByEmail).toHaveBeenCalledTimes(1);
      expect(userService.findByEmail).toHaveBeenCalledWith(mockLoginUser.email);

      expect(bcrypt.compare).toHaveBeenCalledTimes(1);
      expect(bcrypt.compare).toHaveBeenCalledWith(
        mockLoginUser.password,
        mockUser.password,
      );

      expect(result).toEqual({
        id: 1,
        email: 'mock@email.com',
        password: undefined,
        name: 'mock user',
      });
    });
    it('should throw an error if email or password is incorrect', async () => {
      jest.spyOn(userService, 'findByEmail').mockResolvedValue(null);
      jest
        .spyOn(bcrypt, 'compare')
        .mockImplementation(() => Promise.resolve(false));

      await expect(
        authService.validateUser('mock@email.com', 'password'),
      ).rejects.toThrow('Email address or password provided is incorrect');
    });
  });
});
