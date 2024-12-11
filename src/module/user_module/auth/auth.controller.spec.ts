import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LoginDto } from '../dto/login.dto';
import { CreateUserDto } from '../dto/create-user.dto';
import { Representation } from '../../../common/helper/representation.helper';
import { Response, Request } from 'express';
import DeviceDetector from 'device-detector-js';
import { AuthGuard } from 'src/common/guard/auth.guard';
import { APP_GUARD } from '@nestjs/core';

jest.mock('../../../common/helper/representation.helper');

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  const mockAuthService = {
    login: jest.fn(),
    generateToken: jest.fn(),
    register: jest.fn(),
  };

  const mockResponse = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  } as unknown as Response;

  const mockRequest = {
    headers: { 'user-agent': 'Mozilla/5.0' },
    payload: { id: 1, name: 'Test User' },
  } as unknown as Request;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
        {
          provide: APP_GUARD,
          useClass: AuthGuard,
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  describe('login', () => {
    it('should return login success response', async () => {
      const loginDto: LoginDto = {
        email: 'test@gmail.com',
        password: 'password',
      };
      const user = { id: 1, username: 'test' };
      const tokenResult = { token: 'testToken' };

      mockAuthService.login.mockResolvedValue(user);
      mockAuthService.generateToken.mockResolvedValue(tokenResult);

      const deviceDetector = new DeviceDetector();

      await authController.login(loginDto, mockRequest, mockResponse);

      expect(mockAuthService.login).toHaveBeenCalledWith(loginDto);
      expect(mockAuthService.generateToken).toHaveBeenCalledWith(user, {
        browser: 'Test Browser',
        os: 'Test OS',
        deviceType: 'Desktop',
      });
      expect(Representation).toHaveBeenCalledWith(
        'Login Success Fully',
        tokenResult,
        mockResponse,
      );
      expect(Representation.prototype.sendMutate).toHaveBeenCalled();
    });

    it('should handle unsupported devices', async () => {
      const loginDto: LoginDto = {
        email: 'test@gmail.com',
        password: 'password',
      };
      mockAuthService.login.mockResolvedValue({});

      await expect(
        authController.login(loginDto, mockRequest, mockResponse),
      ).rejects.toThrowError('You are device not supported');
    });
  });

  describe('register', () => {
    it('should return register success response', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test@gmail.com',
        password: 'password',
        name: 'test',
      };
      const result = { id: 1, username: 'test' };

      mockAuthService.register.mockResolvedValue(result);

      await authController.register(createUserDto, mockResponse);

      expect(mockAuthService.register).toHaveBeenCalledWith(createUserDto);
      expect(Representation).toHaveBeenCalledWith(
        'Register Success Fully',
        result,
        mockResponse,
      );
      expect(Representation.prototype.sendMutate).toHaveBeenCalled();
    });
  });

  describe('profile', () => {
    it('should return user profile data', async () => {
      await authController.profile(mockResponse, mockRequest);

      expect(Representation).toHaveBeenCalledWith(
        'Profile Data',
        mockRequest.payload,
        mockResponse,
      );
      expect(Representation.prototype.sendSingle).toHaveBeenCalled();
    });
  });
});
