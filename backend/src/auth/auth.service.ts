import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService
    ) {}

    async signIn(username: string, pass: string): Promise<any> {
        const user = await this.usersService.findOneByUsername(username);
        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const isPasswordValid = await bcrypt.compare(pass, user.password_hash);
        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const payload = { username: user.username, sub: user.id, role: user.role };
        return {
            access_token: await this.jwtService.signAsync(payload),
        };
    }

    async updateProfile(userId: number, updateData: Partial<any>): Promise<any> {
        const user = await this.usersService.findOneById(userId);
        if (!user) {
            throw new BadRequestException('User not found');
        }

        // Update allowed fields
        if (updateData.email) {
            user.email = updateData.email;
        }
        // Add other fields that can be updated by the user

        return this.usersService.save(user);
    }

    async changePassword(userId: number, oldPassword: string, newPassword: string): Promise<void> {
        const user = await this.usersService.findOneById(userId);
        if (!user) {
            throw new BadRequestException('User not found');
        }

        const isOldPasswordValid = await bcrypt.compare(oldPassword, user.password_hash);
        if (!isOldPasswordValid) {
            throw new UnauthorizedException('Invalid old password');
        }

        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        user.password_hash = hashedNewPassword;
        await this.usersService.save(user);
    }
}
