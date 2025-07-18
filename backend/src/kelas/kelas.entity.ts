import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Guru } from '../guru/guru.entity';

@Entity('kelas')
export class Kelas {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50, nullable: false })
  nama_kelas: string;

  @Column({ type: 'int', nullable: false })
  tingkat: number;

  @Column({ type: 'varchar', length: 100, nullable: true })
  jurusan: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  tahun_ajaran: string;

  @Column({ name: 'wali_kelas_id', nullable: true })
  wali_kelas_id: number;

  @ManyToOne(() => Guru, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'wali_kelas_id' })
  wali_kelas: Guru;

  @Column({ type: 'int', default: 30 })
  kapasitas: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
