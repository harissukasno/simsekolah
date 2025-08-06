import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Siswa } from './siswa.entity';
import { SiswaController } from './siswa.controller';
import { SiswaService } from './siswa.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([Siswa]), // Import entities related to Siswa here
    ],
    controllers: [SiswaController],
    providers: [SiswaService],
    exports: [],
})
export class SiswaModule {}
