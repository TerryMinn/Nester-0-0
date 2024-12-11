import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { QueryParamsDto } from '../../common/decorator/QueryParam.decorator';
import { Representation } from '../../common/helper/representation.helper';
import { Response } from 'express';

jest.mock('../../common/helper/representation.helper'); // Mock Representation class

describe('UserController', () => {
  let userController: UserController;
  let userService: UserService;

  const mockUserService = {
    getAll: jest.fn(),
  };

  const mockResponse = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  } as unknown as Response;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    userController = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(userController).toBeDefined();
  });

  describe('getAll', () => {
    it('should return data with Representation helper', async () => {
      const query: QueryParamsDto = { limit: 10, page: 1 };
      const serviceResult = {
        data: [{ id: 1, name: 'John Doe' }],
        totalCount: 1,
      };
      mockUserService.getAll.mockResolvedValue(serviceResult);

      await userController.getAll(query, mockResponse);

      expect(mockUserService.getAll).toHaveBeenCalledWith(query);
      expect(Representation).toHaveBeenCalledWith(
        'Success',
        serviceResult.data,
        mockResponse,
        serviceResult.totalCount,
        query.limit,
      );
      expect(Representation.prototype.send).toHaveBeenCalled();
    });

    it('should handle errors gracefully', async () => {
      const query: QueryParamsDto = { limit: 10, page: 1 };
      mockUserService.getAll.mockRejectedValue(new Error('Some error'));

      await expect(
        userController.getAll(query, mockResponse),
      ).resolves.toBeUndefined();

      // You can also verify logs or other error-handling mechanisms here.
    });
  });
});
