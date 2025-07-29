import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './users.entity';
import { CreateUserDto } from './users.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
    ) {}

    async findOneByUsername(username: string): Promise<User | null> {
        return this.usersRepository.findOne({ where: { username } });
    }

    async findOneById(id: number): Promise<User | null> {
        return this.usersRepository.findOne({ where: { id } });
    }

    async save(user: User): Promise<User> {
        return this.usersRepository.save(user);
    }

    async create(createUserDto: CreateUserDto): Promise<User> {
        createUserDto.password_hash = await bcrypt.hash(createUserDto.password_hash, 10);
        const user = this.usersRepository.create({
            ...createUserDto,
            role: createUserDto.role as any, // Cast to any to satisfy DeepPartial<UserRole>
        });
        return this.usersRepository.save(user);
    }
}
