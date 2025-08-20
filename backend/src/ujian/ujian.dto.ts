import { IsNotEmpty, IsString, IsNumber, IsDateString, IsOptional, IsEnum } from 'class-validator';

export enum JenisUjian {
  UTS = 'UTS',
  UAS = 'UAS',
  HARIAN = 'HARIAN',
  LAINNYA = 'LAINNYA',
}

export enum StatusUjian {
  AKTIF = 'aktif',
  NONAKTIF = 'nonaktif',
  SELESAI = 'selesai',
}

export class CreateUjianDto {
  @IsNotEmpty()
  @IsString()
  kode_ujian: string;

  @IsNotEmpty()
  @IsString()
  nama_ujian: string;

  @IsNotEmpty()
  @IsNumber()
  mata_pelajaran_id: number;

  @IsNotEmpty()
  @IsNumber()
  guru_id: number;

  @IsNotEmpty()
  @IsDateString()
  tanggal_mulai: Date;

  @IsNotEmpty()
  @IsDateString()
  tanggal_selesai: Date;

  @IsNotEmpty()
  @IsNumber()
  durasi_menit: number;

  @IsNotEmpty()
  @IsNumber()
  jumlah_soal: number;
    
  @IsOptional()
  @IsEnum(JenisUjian)
  jenis_ujian: JenisUjian;

  @IsOptional()
  @IsEnum(StatusUjian)
  status: StatusUjian;
}