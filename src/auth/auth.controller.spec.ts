import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserToken } from './models/UserToken';
import { AuthRequest } from './models/AuthRequest';

const accessToken: UserToken = {
  access_token: 'mockAccessToken',
};

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        AuthService,
        {
          provide: AuthService,
          useValue: {
            login: jest.fn().mockResolvedValue(accessToken),
          },
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
    expect(authService).toBeDefined();
  });

  describe('login', () => {
    it('Should return a access token when logged in successfully', async () => {
      const mockUser = { email: 'mock@email.com', password: 'mockPassword' };
      const mockAuthRequest = { user: mockUser };
      const result = await authController.login(mockAuthRequest as AuthRequest);

      expect(result).toEqual(accessToken);
      expect(authService.login).toHaveBeenCalledTimes(1);
      expect(authService.login).toHaveBeenCalledWith(mockUser);
    });

    it('Should return an error if it cannot complete the promise', async () => {
      const mockUser = { email: 'mock@email.com', password: 'mockPassword' };
      const mockAuthRequest = { user: mockUser };

      jest
        .spyOn(authService, 'login')
        .mockRejectedValueOnce(new Error() as never);

      await expect(
        authController.login(mockAuthRequest as AuthRequest),
      ).rejects.toThrow(Error);
    });
  });
});
