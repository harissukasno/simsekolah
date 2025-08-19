import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';

export enum TipeUjian {
  ULANGAN_HARIAN = 'ulangan_harian',
  UTS = 'uts',
  UAS = 'uas',
}

export enum UjianStatus {
  DRAFT = 'draft',
  AKTIF = 'aktif',
  SELESAI = 'selesai',
}

@Entity('ujian')
export class Ujian {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50, unique: true, nullable: false })
  kode_ujian: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  nama_ujian: string;

  @Column({ type: 'int', nullable: true })
  mata_pelajaran_id: number;

  @Column({ type: 'int', nullable: true })
  guru_id: number;

  @Column({ type: 'int', nullable: true })
  kelas_id: number;

  @Column({ type: 'enum', enum: TipeUjian, nullable: false })
  tipe_ujian: TipeUjian;

  @Column({ type: 'datetime', nullable: false })
  tanggal_mulai: Date;

  @Column({ type: 'datetime', nullable: false })
  tanggal_selesai: Date;

  @Column({ type: 'int', nullable: false })
  durasi_menit: number;

  @Column({ type: 'int', nullable: false })
  jumlah_soal: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  token_ujian: string;

  @Column({ type: 'enum', enum: UjianStatus, default: UjianStatus.DRAFT })
  status: UjianStatus;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;  
}