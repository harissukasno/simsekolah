import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole, UserStatus } from './users.entity';

describe('UsersService', () => {
  let service: UsersService;
  let usersRepository: Repository<User>;

  const mockUserRepository = {
    findOne: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
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
});