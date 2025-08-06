import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Kelas } from './kelas.entity';
import { KelasController } from './kelas.controller';
import { KelasService } from './kelas.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([Kelas]), // Import entities related to Kelas here
    ],
    controllers: [KelasController],
    providers: [KelasService],
    exports: [],
})
export class KelasModule {}
