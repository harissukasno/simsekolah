import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule} from '@nestjs/jwt';
import { UsersModule } from '../users/users.module';
import { jwtConstants } from './constant';

@Module({
    imports: [UsersModule, JwtModule.register({
        global: true,
        secret: jwtConstants.secret ,
        signOptions: { expiresIn: '1h' }, // Token expiration time
    })],
    controllers: [AuthController],
    providers: [AuthService],
    exports: [],
})
export class AuthModule {}
