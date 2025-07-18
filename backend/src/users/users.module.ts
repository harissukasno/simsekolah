import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from './users.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([User]), // Import User entity for TypeORM        
    ],
    controllers: [UsersController],
    providers: [UsersService],
    exports: [UsersService], // Export UsersService for use in other modules
})
export class UsersModule {}
