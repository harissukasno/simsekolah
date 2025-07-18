import { Module } from '@nestjs/common';
import { GuruService } from './guru.service';
import { GuruController } from './guru.controller';

@Module({
  providers: [GuruService],
  controllers: [GuruController]
})
export class GuruModule {}
