import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsOptional,
  IsNumber,
  IsDateString,
} from 'class-validator';

export class CreateSiswaDto {
  @IsOptional()
  @IsNumber()
  userId?: number;

  @IsString()
  @IsNotEmpty()
  nis: string;

  @IsOptional()
  @IsString()
  nisn?: string;

  @IsString()
  @IsNotEmpty()
  nama_lengkap: string;

  @IsEnum(['L', 'P'])
  @IsNotEmpty()
  jenis_kelamin: 'L' | 'P';

  @IsOptional()
  @IsString()
  tempat_lahir?: string;

  @IsOptional()
  @IsDateString()
  tanggal_lahir?: Date;

  @IsOptional()
  @IsString()
  agama?: string;

  @IsOptional()
  @IsString()
  alamat?: string;

  @IsOptional()
  @IsString()
  no_telp?: string;

  @IsOptional()
  @IsNumber()
  kelasId?: number;

  @IsOptional()
  @IsNumber()
  tahun_masuk?: number;

  @IsOptional()
  @IsEnum(['aktif', 'lulus', 'pindah', 'dropout'])
  status?: 'aktif' | 'lulus' | 'pindah' | 'dropout';

  @IsOptional()
  @IsString()
  foto?: string;
}

export class UpdateSiswaDto {
  @IsOptional()
  @IsNumber()
  userId?: number;

  @IsOptional()
  @IsString()
  nis?: string;

  @IsOptional()
  @IsString()
  nisn?: string;

  @IsOptional()
  @IsString()
  nama_lengkap?: string;

  @IsOptional()
  @IsEnum(['L', 'P'])
  jenis_kelamin?: 'L' | 'P';

  @IsOptional()
  @IsString()
  tempat_lahir?: string;

  @IsOptional()
  @IsDateString()
    tanggal_lahir?: Date;
    @IsOptional()
    @IsString()
    agama?: string;
    @IsOptional()
    @IsString()
    alamat?: string;
    @IsOptional()
    @IsString()
    no_telp?: string;
    @IsOptional()
    @IsNumber()
    kelasId?: number;
    @IsOptional()
    @IsNumber()
    tahun_masuk?: number;
    @IsOptional()
    @IsEnum(['aktif', 'lulus', 'pindah', 'dropout'])
    status?: 'aktif' | 'lulus' | 'pindah' | 'dropout';
    @IsOptional()
    @IsString()
    foto?: string;
}


