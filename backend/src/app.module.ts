import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { SiswaModule } from './siswa/siswa.module';
import { GuruModule } from './guru/guru.module';
import { KelasModule } from './kelas/kelas.module';
import { AbsensiModule } from './absensi/absensi.module';
import { UjianModule } from './ujian/ujian.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT ?? '3306', 10),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      autoLoadEntities: true,
      synchronize: true,
    }),
    UsersModule, AuthModule, SiswaModule, GuruModule, KelasModule, AbsensiModule, UjianModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
