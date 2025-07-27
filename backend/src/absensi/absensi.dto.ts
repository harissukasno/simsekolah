import { IsNotEmpty, IsString, IsDateString } from 'class-validator';

export class CreateAbsensiSiswaDto {
  @IsNotEmpty()
  @IsString()
  readonly siswaId: string;

  @IsNotEmpty()
  @IsDateString()
  readonly tanggal: string;

  @IsNotEmpty()
  @IsString()
  readonly status: string; // e.g., 'hadir', 'sakit', 'izin', 'alpha'
}

export class CreateAbsensiGuruDto {
  @IsNotEmpty()
  @IsString()
  readonly siswaId: string;

  @IsNotEmpty()
  @IsDateString()
  readonly tanggal: string;

  @IsNotEmpty()
  @IsString()
  readonly status: string; // e.g., 'hadir', 'sakit', 'izin', 'alpha'
}

export class CreateAbsensiKelasDto{
  @IsNotEmpty()
  @IsString()
  readonly kelasId: string;

  @IsNotEmpty()
  @IsDateString()
  readonly tanggal: string;

  @IsNotEmpty()
  @IsString()
  readonly status: string; // e.g., 'hadir', 'sakit', 'izin', 'alpha'
}