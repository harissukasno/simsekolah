import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Guru } from '../guru/guru.entity'; // Assuming Guru entity exists
import { Siswa } from '../siswa/siswa.entity'; // Assuming Siswa entity exists

@Entity('absensi_siswa')
export class AbsensiSiswa {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'siswa_id' })
  siswaId: number;

  @ManyToOne(() => Siswa)
  @JoinColumn({ name: 'siswa_id' })
  siswa: Siswa;

  @Column({ type: 'date', nullable: false })
  tanggal: Date;

  @Column({ type: 'enum', enum: ['hadir', 'izin', 'sakit', 'alpha'], nullable: false })
  status: string;

  @Column({ type: 'time', nullable: true, name: 'jam_masuk' })
  jamMasuk: string;

  @Column({ type: 'time', nullable: true, name: 'jam_pulang' })
  jamPulang: string;

  @Column({ type: 'text', nullable: true })
  keterangan: string;

  @Column({ type: 'varchar', length: 45, nullable: true, name: 'ip_address' })
  ipAddress: string;

  @Column({ type: 'varchar', length: 255, nullable: true, name: 'wifi_ssid' })
  wifiSsid: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', name: 'created_at' })
  createdAt: Date;
}


@Entity('absensi_guru')
export class AbsensiGuru {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'guru_id' })
  guruId: number;

  @ManyToOne(() => Guru)
  @JoinColumn({ name: 'guru_id' })
  guru: Guru;

  @Column({ type: 'date', nullable: false })
  tanggal: Date;

  @Column({ type: 'time', nullable: true, name: 'jam_masuk' })
  jamMasuk: string;

  @Column({ type: 'time', nullable: true, name: 'jam_pulang' })
  jamPulang: string;

  @Column({ type: 'enum', enum: ['hadir', 'izin', 'sakit', 'dinas_luar'], nullable: false })
  status: string;

  @Column({ type: 'text', nullable: true })
  keterangan: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', name: 'created_at' })
  createdAt: Date;
}


@Entity('absensi_kelas')
export class AbsensiKelas {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'jadwal_mengajar_id' })
  jadwalMengajarId: number;

  @Column({ name: 'siswa_id' })
  siswaId: number;

  @Column({ type: 'date', nullable: false })
  tanggal: Date;

  @Column({ type: 'enum', enum: ['hadir', 'izin', 'sakit', 'alpha'], nullable: false })
  status: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', name: 'created_at' })
  createdAt: Date;
}
