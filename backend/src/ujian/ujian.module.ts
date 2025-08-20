import { Module } from '@nestjs/common';
import { UjianController } from './ujian.controller';
import { UjianService } from './ujian.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ujian } from './ujian.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Ujian]), // Import Ujian entity for TypeORM
  ],
  controllers: [UjianController],
  providers: [UjianService],
  exports: [UjianService], // Export UjianService for use in other modules
})
export class UjianModule {}
