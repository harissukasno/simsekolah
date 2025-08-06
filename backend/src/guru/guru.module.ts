import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Guru } from './guru.entity';
import { GuruService } from './guru.service';
import { GuruController } from './guru.controller';

@Module({
    imports: [
        TypeOrmModule.forFeature([Guru]), // Import entities related to Guru here
    ],
    controllers: [GuruController],
    providers: [GuruService],
    exports: [],
})
export class GuruModule {}
