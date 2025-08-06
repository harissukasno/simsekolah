import { IsNotEmpty, IsString, IsDateString, IsOptional, IsEnum, IsInt, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { AbsensiSiswaStatus, AbsensiGuruStatus } from './absensi.entity'; // Assuming you define this enum in absensi.entity.ts

export interface AbsensiStatistikResponse {
  summary: {
    total_siswa: number;
    total_hari_efektif: number;
    persentase_kehadiran_keseluruhan: number;
    trend_mingguan: number; // persentase naik/turun dari minggu sebelumnya
  };
  
  breakdown_status: {
    hadir: { count: number; percentage: number };
    izin: { count: number; percentage: number };
    sakit: { count: number; percentage: number };
    alpha: { count: number; percentage: number };
  };
  
  statistik_per_kelas: Array<{
    kelas_id: number;
    nama_kelas: string;
    total_siswa: number;
    persentase_kehadiran: number;
    ranking: number;
  }>;
  
  statistik_harian: Array<{
    tanggal: string;
    total_siswa_aktif: number;
    hadir: number;
    izin: number;
    sakit: number;
    alpha: number;
    persentase_kehadiran: number;
  }>;
  
  siswa_bermasalah: Array<{
    siswa_id: number;
    nama_siswa: string;
    kelas: string;
    total_alpha: number;
    total_ketidakhadiran: number;
    persentase_kehadiran: number;
    peringatan_level: 'ringan' | 'sedang' | 'berat';
  }>;
  
  pola_keterlambatan: {
    rata_rata_jam_masuk: string;
    jumlah_terlambat: number;
    siswa_paling_sering_terlambat: Array<{
      siswa_id: number;
      nama_siswa: string;
      jumlah_terlambat: number;
    }>;
  };
  
  perbandingan_periode: {
    periode_sekarang: number;
    periode_sebelumnya: number;
    perubahan_persen: number;
    trend: 'naik' | 'turun' | 'stabil';
  };
}

export class CreateAbsensiSiswaDto {
  @IsNotEmpty()
  @IsInt()
  @Type(() => Number)
  readonly siswaId: number;

  @IsNotEmpty()
  @IsDateString()
  readonly tanggal: string;

  @IsNotEmpty()
  @IsEnum(AbsensiSiswaStatus)
  readonly status: AbsensiSiswaStatus;

  @IsOptional()
  @IsString()
  readonly jamMasuk?: string;

  @IsOptional()
  @IsString()
  readonly jamPulang?: string;

  @IsOptional()
  @IsString()
  readonly keterangan?: string;
}

export class CreateAbsensiGuruDto {
  @IsNotEmpty()
  @IsString()
  readonly guruId: number;

  @IsNotEmpty()
  @IsDateString()
  readonly tanggal: string;

  @IsNotEmpty()
  @IsEnum(AbsensiGuruStatus)
  readonly status: AbsensiGuruStatus;

  @IsOptional()
  @IsString()
  readonly jamMasuk?: string;

  @IsOptional()
  @IsString()
  readonly jamPulang?: string;

  @IsOptional()
  @IsString()
  readonly keterangan?: string;
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

export class AbsensiStatistikQueryDto {
  @IsOptional()
  @IsString()
  periode?: 'hari' | 'minggu' | 'bulan' | 'semester' | 'tahun';

  @IsOptional()
  @IsDateString()
  tanggal_mulai?: string;

  @IsOptional()
  @IsDateString()
  tanggal_selesai?: string;

  @IsOptional()
  @IsNumber()
  kelas_id?: number;

  @IsOptional()
  @IsNumber()
  siswa_id?: number;

  @IsOptional()
  @IsString()
  tipe?: 'siswa' | 'guru' | 'kelas' | 'sekolah';

  @IsOptional()
  @IsString()
  tahun_ajaran?: string;

  @IsOptional()
  @IsString()
  semester?: '1' | '2';
}
