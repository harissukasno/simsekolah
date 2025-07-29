import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole, UserStatus } from './users.entity';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './users.dto';

// Mock the bcrypt module
jest.mock('bcrypt', () => ({
  hash: jest.fn((password, salt) => Promise.resolve(`hashed_${password}_${salt}`)),
}));

describe('UsersService', () => {
  let service: UsersService;
  let usersRepository: Repository<User>;

  // Mock data for testing
  const mockUser: User = {
    id: 1,
    username: 'testuser',
    email: 'test@example.com',
    password_hash: 'hashed_password_10',
    role: UserRole.GURU, // Assuming UserRole is an enum
    status: UserStatus.ACTIVE,
    created_at: new Date(),
    updated_at: new Date(),
  };

  const baseCreateUserDto: CreateUserDto = {
    username: 'newuser',
    email: 'new@example.com',
    password_hash: 'plainpassword',
    role: UserRole.ADMIN_WEB, // Example role
  };

  const mockUserRepository = {
    findOne: jest.fn(),
    save: jest.fn(),
    create: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks(); // ⬅️ PENTING untuk mereset call count sebelum test berikutnya

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    usersRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOneByUsername', () => {
    it('should return a user if found by username', async () => {
      const user = new User();
      user.id = 1;
      user.username = 'testuser';
      user.email = 'test@example.com';
      user.password_hash = 'hashedpassword';
      user.role = UserRole.SISWA;
      user.status = UserStatus.ACTIVE;

      mockUserRepository.findOne.mockResolvedValue(user);

      const result = await service.findOneByUsername('testuser');
      expect(result).toEqual(user);
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({ where: { username: 'testuser' } });
    });

    it('should return null if user not found by username', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      const result = await service.findOneByUsername('nonexistent');
      expect(result).toBeNull();
    });
  });

  describe('findOneById', () => {
    it('should return a user if found by id', async () => {
      const user = new User();
      user.id = 1;
      user.username = 'testuser';
      user.email = 'test@example.com';
      user.password_hash = 'hashedpassword';
      user.role = UserRole.SISWA;
      user.status = UserStatus.ACTIVE;
      mockUserRepository.findOne.mockResolvedValue(user);

      const result = await service.findOneById(1);
      expect(result).toEqual(user);
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    });
    it('should return null if user not found by id', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      const result = await service.findOneById(999);
      expect(result).toBeNull();
    });
  });
  describe('save', () => {
    it('should save and return the user', async () => {
      const user = new User();
      user.id = 1;
      user.username = 'testuser';
      user.email = 'test@example.com';
      user.password_hash = 'hashedpassword';
      user.role = UserRole.SISWA;
      user.status = UserStatus.ACTIVE;

      mockUserRepository.save.mockResolvedValue(user);

      const result = await service.save(user);
      expect(result).toEqual(user);
      expect(mockUserRepository.save).toHaveBeenCalledWith(user);
    });
  });

  describe('create', () => {
    it('should successfully create a user and hash the password', async () => {
      // Use a fresh copy of the DTO for this test
      const createUserDto = { ...baseCreateUserDto };

      // Mock the bcrypt hash function to return a predictable value
      (bcrypt.hash as jest.Mock).mockImplementationOnce((password, salt) =>
        Promise.resolve(`hashed_${password}_${salt}`)
      );

      // Define the expected hashed password based on the mock
      const expectedHashedPassword = `hashed_${createUserDto.password_hash}_10`;

      // Define the user object that `usersRepository.create` is expected to receive
      const userEntityToCreate = {
        ...createUserDto,
        password_hash: expectedHashedPassword,
        role: createUserDto.role,
      };

      // Mock repository methods
      mockUserRepository.create.mockReturnValue(mockUser); // `create` returns an entity instance
      mockUserRepository.save.mockResolvedValue(mockUser); // `save` returns the saved entity

      const result = await service.create(createUserDto);

      // Assertions
      expect(bcrypt.hash).toHaveBeenCalledWith(baseCreateUserDto.password_hash, 10); // Check with original plain password
      expect(mockUserRepository.create).toHaveBeenCalledWith(userEntityToCreate);
      expect(mockUserRepository.save).toHaveBeenCalledWith(mockUser);
      expect(result).toEqual(mockUser);
    });

    it('should return the saved user object', async () => {
      jest.spyOn(usersRepository, 'create').mockReturnValue(mockUser);
      jest.spyOn(usersRepository, 'save').mockResolvedValue(mockUser);

      const result = await service.create(baseCreateUserDto);
      expect(result).toEqual(mockUser);
    });

    it('should call bcrypt.hash with the correct password and salt rounds', async () => {
      // Use a fresh copy of the DTO for this test
      const createUserDto = { ...baseCreateUserDto };

      // Ensure bcrypt.hash returns a predictable value for this test
      (bcrypt.hash as jest.Mock).mockImplementationOnce((password, salt) =>
        Promise.resolve(`hashed_${password}_${salt}`)
      );

      // Mock repository methods to allow the service method to run
      mockUserRepository.create.mockReturnValue(mockUser);
      mockUserRepository.save.mockResolvedValue(mockUser);

      await service.create(createUserDto);

      expect(bcrypt.hash).toHaveBeenCalledTimes(1);
      // Expect it to be called with the original plain password from the fresh DTO
      expect(bcrypt.hash).toHaveBeenCalledWith(baseCreateUserDto.password_hash, 10);
    });

    it('should call usersRepository.create with the hashed password and correct role', async () => {
      // Use a fresh copy of the DTO for this test
      const createUserDto = { ...baseCreateUserDto };

      // Ensure bcrypt.hash returns a predictable value for this test
      (bcrypt.hash as jest.Mock).mockImplementationOnce((password, salt) =>
        Promise.resolve(`hashed_${password}_${salt}`)
      );
      const expectedHashedPassword = `hashed_${createUserDto.password_hash}_10`;

      const createdUserEntity = {
        ...mockUser, // Start with mockUser structure
        password_hash: expectedHashedPassword, // Override with the expected hashed password
        username: createUserDto.username,
        email: createUserDto.email,
        role: createUserDto.role,
      };

      mockUserRepository.create.mockReturnValue(createdUserEntity);
      mockUserRepository.save.mockResolvedValue(mockUser); // save still returns mockUser

      await service.create(createUserDto);

      expect(mockUserRepository.create).toHaveBeenCalledTimes(1);
      // Expect create to be called with the DTO data including the correctly hashed password
      expect(mockUserRepository.create).toHaveBeenCalledWith({
        ...createUserDto,
        password_hash: expectedHashedPassword,
        role: createUserDto.role,
      });
    });

    it('should call usersRepository.save with the created user entity', async () => {
      const createdUserEntity = { ...mockUser, password_hash: `hashed_${baseCreateUserDto.password_hash}_10` }; // Simulate the entity returned by .create()
      jest.spyOn(usersRepository, 'create').mockReturnValue(createdUserEntity);
      jest.spyOn(usersRepository, 'save').mockResolvedValue(mockUser);

      await service.create(baseCreateUserDto);
      expect(usersRepository.save).toHaveBeenCalledTimes(1);
      expect(usersRepository.save).toHaveBeenCalledWith(createdUserEntity);
    });
  });
});