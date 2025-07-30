import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LoginDto, ChangePasswordDto } from './auth.dto';
import { UnauthorizedException, BadRequestException } from '@nestjs/common';
import { AuthGuard } from './auth.guard';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  const mockAuthService = {
    signIn: jest.fn(),
    updateProfile: jest.fn(),
    changePassword: jest.fn(),
  };

  // Mock AuthGuard
  // Kita membuat mock yang akan selalu mengembalikan true untuk canActivate
  // Ini memastikan bahwa guard tidak memblokir tes controller.
  const mockAuthGuard = {
    canActivate: jest.fn((context) => true),
  };

  beforeEach(async () => {

    // Reset semua mock sebelum setiap tes
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    })
    // Override AuthGuard dengan mock kita
    // Ini adalah kunci untuk menyelesaikan masalah dependensi JwtService
    .overrideGuard(AuthGuard)
    .useValue(mockAuthGuard)
    .compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  describe('signIn', () => {
    it('should return an access token on successful login', async () => {
      const loginDto: LoginDto = { username: 'testuser', password_hash: 'password123' };
      const expectedToken = { access_token: 'mockAccessToken' };
      mockAuthService.signIn.mockResolvedValue(expectedToken);

      const result = await authController.signIn(loginDto);
      expect(result).toEqual(expectedToken);
      expect(mockAuthService.signIn).toHaveBeenCalledWith(loginDto.username, loginDto.password_hash);
    });

    it('should throw UnauthorizedException on invalid credentials', async () => {
      const loginDto: LoginDto = { username: 'testuser', password_hash: 'wrongpassword' };
      mockAuthService.signIn.mockRejectedValue(new UnauthorizedException('Invalid credentials'));

      await expect(authController.signIn(loginDto)).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('logout', () => {
    it('should return a success message', async () => {
      const req = {};
      const result = await authController.logout(req);
      expect(result).toEqual({ message: 'Logged out successfully' });
    });
  });

  describe('getProfile', () => {
    it('should return the user profile from the request', () => {
      const mockUser = { userId: 1, username: 'testuser' };
      const req = { user: mockUser };
      const result = authController.getProfile(req);
      expect(result).toEqual(mockUser);
    });
  });

  describe('updateProfile', () => {
    it('should update the user profile and return the updated data', async () => {
      const mockUser = { userId: 1, username: 'testuser' };
      const updateData = { email: 'new@example.com' };
      const expectedResult = { userId: 1, username: 'testuser', email: 'new@example.com' };
      mockAuthService.updateProfile.mockResolvedValue(expectedResult);

      const req = { user: mockUser };
      const result = await authController.updateProfile(req, updateData);
      expect(result).toEqual(expectedResult);
      expect(mockAuthService.updateProfile).toHaveBeenCalledWith(mockUser.userId, updateData);
    });

    it('should throw BadRequestException if user not found during update', async () => {
      const mockUser = { userId: 999, username: 'nonexistent' };
      const updateData = { email: 'new@example.com' };
      mockAuthService.updateProfile.mockRejectedValue(new BadRequestException('User not found'));

      const req = { user: mockUser };
      await expect(authController.updateProfile(req, updateData)).rejects.toThrow(BadRequestException);
    });
  });

  describe('changePassword', () => {
    it('should return a success message on successful password change', async () => {
      const mockUser = { userId: 1, username: 'testuser' };
      const changePasswordDto: ChangePasswordDto = { oldPassword: 'oldpassword', newPassword: 'newpassword' };
      mockAuthService.changePassword.mockResolvedValue(undefined);
      const req = { user: mockUser };

      const result = await authController.changePassword(req, changePasswordDto);
      expect(result).toEqual({ message: 'Password changed successfully' });
      expect(mockAuthService.changePassword).toHaveBeenCalledWith(mockUser.userId, changePasswordDto.oldPassword, changePasswordDto.newPassword);
    });
    });
});