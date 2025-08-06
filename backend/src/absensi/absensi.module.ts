import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AbsensiController } from './absensi.controller';
import { AbsensiService } from './absensi.service';
import { AbsensiSiswa, AbsensiGuru, AbsensiKelas } from './absensi.entity'; // Import your Absensi entities here

@Module({
    imports: [
        TypeOrmModule.forFeature([AbsensiSiswa, AbsensiGuru, AbsensiKelas]), // Import your Absensi entities here
    ],
    controllers: [AbsensiController],
    providers: [AbsensiService],
    exports: [], // Export AbsensiService for use in other modules
})
export class AbsensiModule {}
