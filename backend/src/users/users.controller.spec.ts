import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { CreateUserDto } from './users.dto'; // Assuming your DTO is in a 'dto' folder
import { User, UserRole, UserStatus } from './users.entity'; // Assuming your User entity

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  // Mock data for testing
  const mockCreateUserDto: CreateUserDto = {
    username: 'testuser',
    email: 'test@example.com',
    password_hash: 'password123',
    role: UserRole.SISWA,// Or whatever your UserRole enum value is
  };

  const mockCreatedUser: User = {
    id: 1,
    username: 'testuser',
    email: 'test@example.com',
    password_hash: 'hashed_password', // Should be hashed by the service
    role: UserRole.KURIKULUM,
    status: UserStatus.ACTIVE,
    created_at: new Date(),
    updated_at: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          // Provide a mock implementation for UsersService
          provide: UsersService,
          useValue: {
            create: jest.fn(), // Mock the create method
          },
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);

    // Clear all mocks before each test to ensure isolation
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call usersService.create with the correct DTO and return the result', async () => {
      // Arrange: Set up the mock service's behavior
      jest.spyOn(service, 'create').mockResolvedValue(mockCreatedUser);

      // Act: Call the controller method
      const result = await controller.create(mockCreateUserDto);

      // Assert: Verify expectations
      expect(service.create).toHaveBeenCalledTimes(1);
      expect(service.create).toHaveBeenCalledWith(mockCreateUserDto);
      expect(result).toEqual(mockCreatedUser);
    });

    it('should handle errors from usersService.create', async () => {
      // Arrange: Simulate an error from the service
      const errorMessage = 'Failed to create user';
      jest.spyOn(service, 'create').mockRejectedValue(new Error(errorMessage));

      // Act & Assert: Expect the controller method to throw the error
      await expect(controller.create(mockCreateUserDto)).rejects.toThrow(errorMessage);
      expect(service.create).toHaveBeenCalledTimes(1);
      expect(service.create).toHaveBeenCalledWith(mockCreateUserDto);
    });
  });
});
