import { Controller, Post, Body, HttpCode, HttpStatus, UseGuards, Request, Get, Put } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './auth.dto';
import { AuthGuard } from './auth.guard';
import { ChangePasswordDto } from './auth.dto';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @HttpCode(HttpStatus.OK)
    @Post('login')
    signIn(@Body() signInDto: LoginDto) {
        return this.authService.signIn(signInDto.username, signInDto.password_hash);
    }

    @UseGuards(AuthGuard)
    @Post('logout')
    async logout(@Request() req) {
        // Invalidate the token or session on the server side if necessary
        // For JWT, typically, logout is handled client-side by removing the token.
        // However, you might want to blacklist tokens or clear refresh tokens here.
        return { message: 'Logged out successfully' };
    }

    @UseGuards(AuthGuard)
    @Get('profile')
    getProfile(@Request() req) {
        return req.user;
    }

    @UseGuards(AuthGuard)
    @Put('profile')
    async updateProfile(@Request() req, @Body() updateData: Partial<any>) { // Use a DTO for updateData
        return this.authService.updateProfile(req.user.userId, updateData);
    }

    @UseGuards(AuthGuard)
    @Post('change-password')
    async changePassword(@Request() req, @Body() changePasswordDto: ChangePasswordDto) {
        await this.authService.changePassword(req.user.userId, changePasswordDto.oldPassword, changePasswordDto.newPassword);
        return { message: 'Password changed successfully' };
    }

    @UseGuards(AuthGuard)
    @Post('refresh')
    async refreshToken(@Request() req) {
        // This endpoint would typically take a refresh token and return a new access token.
        // For simplicity, this example just returns the current user's profile,
        // but you would implement your refresh logic here.
        return req.user;
    }
}