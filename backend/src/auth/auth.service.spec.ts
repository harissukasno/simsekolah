import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UnauthorizedException, BadRequestException } from '@nestjs/common';
import { User, UserRole, UserStatus } from '../users/users.entity';

jest.mock('bcrypt', () => ({
  compare: jest.fn(),
  hash: jest.fn(),
}));

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

  const mockUsersService = {
    findOneByUsername: jest.fn(),
    findOneById: jest.fn(),
    save: jest.fn(),
  };

  const mockJwtService = {
    signAsync: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('signIn', () => {
    const mockUser: User = {
      id: 1,
      username: 'testuser',
      email: 'test@example.com',
      password_hash: 'hashedpassword',
      role: UserRole.SISWA,
      status: UserStatus.ACTIVE,
      created_at: new Date(),
      updated_at: new Date(),
    };

    it('should return an access token on successful login', async () => {
      mockUsersService.findOneByUsername.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      mockJwtService.signAsync.mockResolvedValue('mockedAccessToken');
      const result = await authService.signIn('testuser', 'password');
      expect(result).toEqual({ access_token: 'mockedAccessToken' });
      expect(mockUsersService.findOneByUsername).toHaveBeenCalledWith('testuser');
      expect(bcrypt.compare).toHaveBeenCalledWith('password', mockUser.password_hash);
      expect(mockJwtService.signAsync).toHaveBeenCalledWith({
        username: mockUser.username,
        sub: mockUser.id,
        role: mockUser.role,
      });
    });
    it('should throw UnauthorizedException if user not found', async () => {
      mockUsersService.findOneByUsername.mockResolvedValue(null);
      await expect(authService.signIn('nonexistent', 'password')).rejects.toThrow(UnauthorizedException);
    });
    it('should throw UnauthorizedException if password is invalid', async () => {
      mockUsersService.findOneByUsername.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);
      await expect(authService.signIn('testuser', 'wrongpassword')).rejects.toThrow(UnauthorizedException);
    });
  });
  describe('updateProfile', () => {
    it('should update user profile with valid data', async () => {
      const mockUser: User = { id: 1, username: 'testuser', email: 'test@example.com', password_hash: 'hashedpassword', role: UserRole.SISWA, status: UserStatus.ACTIVE, created_at: new Date(), updated_at: new Date() };
      mockUsersService.findOneById.mockResolvedValue(mockUser);
      mockUsersService.save.mockResolvedValue(mockUser);
      const updateData = { email: 'new@example.com' };
      const result = await authService.updateProfile(1, updateData);
      expect(result).toEqual(mockUser);
      expect(mockUsersService.findOneById).toHaveBeenCalledWith(1);
      expect(mockUsersService.save).toHaveBeenCalledWith(expect.objectContaining({ email: 'new@example.com' }));
    }); 
    it('should throw BadRequestException if user not found', async () => {
      mockUsersService.findOneById.mockResolvedValue(null);
      await expect(authService.updateProfile(999, { email: 'new@example.com' })).rejects.toThrow(BadRequestException);
    });
  });
  describe('changePassword', () => {
    it('should change user password with valid old password', async () => {
      const mockUser = { id: 1, password_hash: 'hashedpassword' };

      mockUsersService.findOneById.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true); // penting
      (bcrypt.hash as jest.Mock).mockResolvedValue('newHashedPassword');

      await authService.changePassword(1, 'oldpassword', 'newpassword');

      expect(mockUsersService.findOneById).toHaveBeenCalledWith(1);
      expect(bcrypt.compare).toHaveBeenCalledWith('oldpassword', 'hashedpassword');
      expect(bcrypt.hash).toHaveBeenCalledWith('newpassword', 10);
      expect(mockUsersService.save).toHaveBeenCalledWith(
        expect.objectContaining({ password_hash: 'newHashedPassword' }),
      );
    });
    it('should throw BadRequestException if user not found', async () => {
      mockUsersService.findOneById.mockResolvedValue(null);
      await expect(authService.changePassword(999, 'oldpassword', 'newpassword')).rejects.toThrow(BadRequestException);
    });
    it('should throw UnauthorizedException if old password is invalid', async () => {
      const mockUser: User = { id: 1, username: 'testuser', email: 'test@ example.com', password_hash: 'hashedpassword', role: UserRole.SISWA, status: UserStatus.ACTIVE, created_at: new Date(), updated_at: new Date() };
      mockUsersService.findOneById.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);
      await expect(authService.changePassword(1, 'wrongoldpassword', 'newpassword')).rejects.toThrow(UnauthorizedException);
      expect(mockUsersService.findOneById).toHaveBeenCalledWith(1);
      expect(bcrypt.compare).toHaveBeenCalledWith('wrongoldpassword', mockUser.password_hash);
    });
  });
});