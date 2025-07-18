import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { User } from '../users/users.entity';

@Entity('guru')
export class Guru {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id', nullable: true })
  userId: number;

  @ManyToOne(() => User, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'varchar', length: 20, unique: true })
  nip: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  nuptk: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  nama_lengkap: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  gelar_depan: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  gelar_belakang: string;

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

  @Column({ type: 'varchar', length: 100, nullable: true })
  email: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  jabatan: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  pendidikan_terakhir: string;

  @Column({ type: 'text', nullable: true })
  foto: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}