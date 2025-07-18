import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule} from '@nestjs/jwt';
import { UsersModule } from '../users/users.module';

@Module({
    imports: [UsersModule, JwtModule.register({
        secret: process.env.JWT_SECRET || 'defaultSecretKey',
        signOptions: { expiresIn: '1h' }, // Token expiration time
    })],
    controllers: [AuthController],
    providers: [AuthService],
    exports: [],
})
export class AuthModule {}
