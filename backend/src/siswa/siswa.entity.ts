import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { User } from '../users/users.entity';
import { Kelas } from '../kelas/kelas.entity';

@Entity('siswa')
export class Siswa {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id', nullable: true })
  userId: number;

  @ManyToOne(() => User, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'varchar', length: 20, unique: true, nullable: false })
  nis: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  nisn: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  nama_lengkap: string;

  @Column({ type: 'enum', enum: ['L', 'P'], nullable: false })
  jenis_kelamin: 'L' | 'P';

  @Column({ type: 'varchar', length: 100, nullable: true })
  tempat_lahir: string;

  @Column({ type: 'date', nullable: true })
  tanggal_lahir: Date;

  @Column({ type: 'varchar', length: 50, nullable: true })
  agama: string;

  @Column({ type: 'text', nullable: true })
  alamat: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  no_telp: string;

  @Column({ name: 'kelas_id', nullable: true })
  kelasId: number;

  @ManyToOne(() => Kelas, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'kelas_id' })
  kelas: Kelas;

  @Column({ type: 'year', nullable: true })
  tahun_masuk: number;

  @Column({
    type: 'enum',
    enum: ['aktif', 'lulus', 'pindah', 'dropout'],
    default: 'aktif',
  })
  status: 'aktif' | 'lulus' | 'pindah' | 'dropout';
    @Column({ type: 'text', nullable: true })
  foto: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}