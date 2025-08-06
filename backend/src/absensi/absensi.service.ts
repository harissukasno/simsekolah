import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AbsensiSiswa, AbsensiGuru, AbsensiKelas } from './absensi.entity';
import { CreateAbsensiSiswaDto, CreateAbsensiGuruDto, CreateAbsensiKelasDto, AbsensiStatistikQueryDto, AbsensiStatistikResponse } from './absensi.dto';

@Injectable()
export class AbsensiService {
    constructor(
        @InjectRepository(AbsensiSiswa)
        private absensiSiswaRepository: Repository<AbsensiSiswa>,
        @InjectRepository(AbsensiGuru)
        private absensiGuruRepository: Repository<AbsensiGuru>,
        @InjectRepository(AbsensiKelas)
        private absensiKelasRepository: Repository<AbsensiKelas>,
    ) {}

    async findAllAbsensiSiswa(): Promise<AbsensiSiswa[]> {
        return this.absensiSiswaRepository.find();
    }

    async createAbsensiSiswa(createAbsensiSiswaDto: CreateAbsensiSiswaDto): Promise<AbsensiSiswa> {
        const newAbsensiSiswa = this.absensiSiswaRepository.create(createAbsensiSiswaDto);
        return this.absensiSiswaRepository.save(newAbsensiSiswa);
    }

    async findAllAbsensiGuru(): Promise<AbsensiGuru[]> {
        return this.absensiGuruRepository.find();
    }

    async createAbsensiGuru(createAbsensiGuruDto: CreateAbsensiGuruDto): Promise<AbsensiGuru> {
        const newAbsensiGuru = this.absensiGuruRepository.create(createAbsensiGuruDto);
        return this.absensiGuruRepository.save(newAbsensiGuru);
    }

    async findAbsensiKelasById(kelasId: string): Promise<AbsensiKelas[]> {
        const absensiKelas = await this.absensiKelasRepository.find({ where: { jadwalMengajarId: parseInt(kelasId, 10) } });
        if (!absensiKelas) {
            throw new NotFoundException(`Absensi for Kelas with ID ${kelasId} not found`);
        }
        return absensiKelas;
    }

    async createAbsensiKelas(kelasId: string, createAbsensiKelasDto: CreateAbsensiKelasDto): Promise<AbsensiKelas> {
        const newAbsensiKelas = this.absensiKelasRepository.create({
            ...createAbsensiKelasDto,
            jadwalMengajarId: parseInt(kelasId, 10),
        });
        return this.absensiKelasRepository.save(newAbsensiKelas);
    }

    async getAbsensiStatistik(
      query: AbsensiStatistikQueryDto,
      user: any
    ): Promise<AbsensiStatistikResponse> {
      
      // 1. VALIDASI & SETUP PARAMETER
      const { 
        periode = 'bulan',
        tanggal_mulai,
        tanggal_selesai,
        kelas_id,
        siswa_id,
        tipe = 'sekolah',
        tahun_ajaran,
        semester 
      } = query;

      // Tentukan range tanggal berdasarkan periode
      const dateRange = this.getDateRange(periode, tanggal_mulai, tanggal_selesai);
      
      // Role-based filter
      const roleFilter = this.getRoleBasedFilter(user, kelas_id, siswa_id);

      // 2. QUERY SUMMARY DATA
      const summary = await this.getSummaryStatistik(dateRange, roleFilter);
      
      // 3. BREAKDOWN STATUS ABSENSI
      const breakdownStatus = await this.getBreakdownStatus(dateRange, roleFilter);
      
      // 4. STATISTIK PER KELAS
      const statistikPerKelas = await this.getStatistikPerKelas(dateRange, roleFilter);
      
      // 5. STATISTIK HARIAN
      const statistikHarian = await this.getStatistikHarian(dateRange, roleFilter);
      
      // 6. SISWA BERMASALAH
      const siswaBermasalah = await this.getSiswaBermasalah(dateRange, roleFilter);
      
      // 7. POLA KETERLAMBATAN
      const polaKeterlambatan = await this.getPolaKeterlambatan(dateRange, roleFilter);
      
      // 8. PERBANDINGAN PERIODE
      const perbandinganPeriode = await this.getPerbandinganPeriode(periode, dateRange, roleFilter);

      return {
        summary,
        breakdown_status: breakdownStatus,
        statistik_per_kelas: statistikPerKelas,
        statistik_harian: statistikHarian,
        siswa_bermasalah: siswaBermasalah,
        pola_keterlambatan: polaKeterlambatan,
        perbandingan_periode: perbandinganPeriode
      };
    }

    private getDateRange(periode: string, tanggal_mulai?: string, tanggal_selesai?: string) {
      const now = new Date();
      let startDate: Date;
      let endDate: Date = new Date(now);

      if (tanggal_mulai && tanggal_selesai) {
        startDate = new Date(tanggal_mulai);
        endDate = new Date(tanggal_selesai);
      } else {
        switch (periode) {
          case 'hari':
            startDate = new Date(now);
            startDate.setHours(0, 0, 0, 0);
            endDate.setHours(23, 59, 59, 999);
            break;
          
          case 'minggu':
            startDate = new Date(now);
            startDate.setDate(now.getDate() - now.getDay()); // Mulai dari Minggu
            startDate.setHours(0, 0, 0, 0);
            break;
          
          case 'bulan':
            startDate = new Date(now.getFullYear(), now.getMonth(), 1);
            break;
          
          case 'semester':
            // Asumsi: Semester 1 (Jul-Des), Semester 2 (Jan-Jun)
            const currentMonth = now.getMonth();
            if (currentMonth >= 6) { // Semester 1
              startDate = new Date(now.getFullYear(), 6, 1); // Juli
            } else { // Semester 2
              startDate = new Date(now.getFullYear(), 0, 1); // Januari
            }
            break;
          
          case 'tahun':
            startDate = new Date(now.getFullYear(), 0, 1); // 1 Januari
            break;
          
          default:
            startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        }
      }

      return { startDate, endDate };
    }

    private getRoleBasedFilter(user: any, kelas_id?: number, siswa_id?: number) {
      const filter: any = {};

      switch (user.role) {
        case 'siswa':
          filter.siswa_id = user.siswa?.id;
          break;
        
        case 'guru':
          // Guru hanya bisa lihat kelas yang diajar
          if (user.guru?.wali_kelas_id) {
            filter.kelas_id = user.guru.wali_kelas_id;
          }
          break;
        
        case 'bp_bk':
        case 'kesiswaan':
        case 'super_admin':
          // Bisa filter berdasarkan parameter
          if (kelas_id) filter.kelas_id = kelas_id;
          if (siswa_id) filter.siswa_id = siswa_id;
          break;
        
        default:
          if (kelas_id) filter.kelas_id = kelas_id;
          if (siswa_id) filter.siswa_id = siswa_id;
      }

      return filter;
    }

    private async getSummaryStatistik(dateRange: any, roleFilter: any) {
      const { startDate, endDate } = dateRange;

      // Query total siswa aktif
      const totalSiswaQuery = this.absensiSiswaRepository
        .createQueryBuilder('siswa')
        .where('siswa.status = :status', { status: 'aktif' });

      if (roleFilter.kelas_id) {
        totalSiswaQuery.andWhere('siswa.kelas_id = :kelas_id', { kelas_id: roleFilter.kelas_id });
      }
      if (roleFilter.siswa_id) {
        totalSiswaQuery.andWhere('siswa.id = :siswa_id', { siswa_id: roleFilter.siswa_id });
      }

      const totalSiswa = await totalSiswaQuery.getCount();

      // Query total hari efektif (tidak termasuk weekend)
      const totalHariEfektif = this.calculateWorkingDays(startDate, endDate);

      // Query total kehadiran
      const absensiQuery = this.absensiSiswaRepository
        .createQueryBuilder('absensi')
        .leftJoin('absensi.siswa', 'siswa')
        .where('absensi.tanggal BETWEEN :startDate AND :endDate', { startDate, endDate });

      if (roleFilter.kelas_id) {
        absensiQuery.andWhere('siswa.kelas_id = :kelas_id', { kelas_id: roleFilter.kelas_id });
      }
      if (roleFilter.siswa_id) {
        absensiQuery.andWhere('absensi.siswa_id = :siswa_id', { siswa_id: roleFilter.siswa_id });
      }

      const [totalAbsensi, totalHadir] = await Promise.all([
        absensiQuery.getCount(),
        absensiQuery.clone().andWhere('absensi.status = :status', { status: 'hadir' }).getCount()
      ]);

      const persentaseKehadiran = totalAbsensi > 0 ? (totalHadir / totalAbsensi) * 100 : 0;

      // Trend mingguan (perbandingan dengan minggu sebelumnya)
      const lastWeekStart = new Date(startDate);
      lastWeekStart.setDate(lastWeekStart.getDate() - 7);
      const lastWeekEnd = new Date(endDate);
      lastWeekEnd.setDate(lastWeekEnd.getDate() - 7);

      const lastWeekData = await this.absensiSiswaRepository
        .createQueryBuilder('absensi')
        .leftJoin('absensi.siswa', 'siswa')
        .where('absensi.tanggal BETWEEN :lastWeekStart AND :lastWeekEnd', { lastWeekStart, lastWeekEnd })
        .getCount();

      const trendMingguan = lastWeekData > 0 ? ((totalAbsensi - lastWeekData) / lastWeekData) * 100 : 0;

      return {
        total_siswa: totalSiswa,
        total_hari_efektif: totalHariEfektif,
        persentase_kehadiran_keseluruhan: Math.round(persentaseKehadiran * 100) / 100,
        trend_mingguan: Math.round(trendMingguan * 100) / 100
      };
    }

    private async getBreakdownStatus(dateRange: any, roleFilter: any) {
      const { startDate, endDate } = dateRange;

      const statusQuery = this.absensiSiswaRepository
        .createQueryBuilder('absensi')
        .leftJoin('absensi.siswa', 'siswa')
        .select('absensi.status', 'status')
        .addSelect('COUNT(*)', 'count')
        .where('absensi.tanggal BETWEEN :startDate AND :endDate', { startDate, endDate })
        .groupBy('absensi.status');

      if (roleFilter.kelas_id) {
        statusQuery.andWhere('siswa.kelas_id = :kelas_id', { kelas_id: roleFilter.kelas_id });
      }
      if (roleFilter.siswa_id) {
        statusQuery.andWhere('absensi.siswa_id = :siswa_id', { siswa_id: roleFilter.siswa_id });
      }

      const results = await statusQuery.getRawMany();
      const totalCount = results.reduce((sum, item) => sum + parseInt(item.count), 0);

      const breakdown = {
        hadir: { count: 0, percentage: 0 },
        izin: { count: 0, percentage: 0 },
        sakit: { count: 0, percentage: 0 },
        alpha: { count: 0, percentage: 0 }
      };

      results.forEach(result => {
        const count = parseInt(result.count);
        const percentage = totalCount > 0 ? (count / totalCount) * 100 : 0;
        
        breakdown[result.status] = {
          count,
          percentage: Math.round(percentage * 100) / 100
        };
      });

      return breakdown;
    }

    private async getStatistikPerKelas(dateRange: any, roleFilter: any) {
      const { startDate, endDate } = dateRange;

      const kelasQuery = this.absensiKelasRepository
        .createQueryBuilder('kelas')
        .leftJoin('kelas.siswa', 'siswa')
        .leftJoin('siswa.absensi', 'absensi', 
          'absensi.tanggal BETWEEN :startDate AND :endDate', { startDate, endDate })
        .select('kelas.id', 'kelas_id')
        .addSelect('kelas.nama_kelas', 'nama_kelas')
        .addSelect('COUNT(DISTINCT siswa.id)', 'total_siswa')
        .addSelect('COUNT(CASE WHEN absensi.status = \'hadir\' THEN 1 END)', 'total_hadir')
        .addSelect('COUNT(absensi.id)', 'total_absensi')
        .where('siswa.status = :status', { status: 'aktif' })
        .groupBy('kelas.id')
        .addGroupBy('kelas.nama_kelas');

      if (roleFilter.kelas_id) {
        kelasQuery.andWhere('kelas.id = :kelas_id', { kelas_id: roleFilter.kelas_id });
      }

      const results = await kelasQuery.getRawMany();

      return results.map((result, index) => {
        const totalAbsensi = parseInt(result.total_absensi);
        const totalHadir = parseInt(result.total_hadir);
        const persentaseKehadiran = totalAbsensi > 0 ? (totalHadir / totalAbsensi) * 100 : 0;

        return {
          kelas_id: parseInt(result.kelas_id),
          nama_kelas: result.nama_kelas,
          total_siswa: parseInt(result.total_siswa),
          persentase_kehadiran: Math.round(persentaseKehadiran * 100) / 100,
          ranking: index + 1 // Will be sorted later
        };
      }).sort((a, b) => b.persentase_kehadiran - a.persentase_kehadiran)
        .map((item, index) => ({ ...item, ranking: index + 1 }));
    }

    private async getStatistikHarian(dateRange: any, roleFilter: any) {
      const { startDate, endDate } = dateRange;

      const hariQuery = this.absensiSiswaRepository
        .createQueryBuilder('absensi')
        .leftJoin('absensi.siswa', 'siswa')
        .select('DATE(absensi.tanggal)', 'tanggal')
        .addSelect('COUNT(DISTINCT absensi.siswa_id)', 'total_siswa_aktif')
        .addSelect('COUNT(CASE WHEN absensi.status = \'hadir\' THEN 1 END)', 'hadir')
        .addSelect('COUNT(CASE WHEN absensi.status = \'izin\' THEN 1 END)', 'izin')
        .addSelect('COUNT(CASE WHEN absensi.status = \'sakit\' THEN 1 END)', 'sakit')
        .addSelect('COUNT(CASE WHEN absensi.status = \'alpha\' THEN 1 END)', 'alpha')
        .where('absensi.tanggal BETWEEN :startDate AND :endDate', { startDate, endDate })
        .groupBy('DATE(absensi.tanggal)')
        .orderBy('DATE(absensi.tanggal)', 'ASC');

      if (roleFilter.kelas_id) {
        hariQuery.andWhere('siswa.kelas_id = :kelas_id', { kelas_id: roleFilter.kelas_id });
      }
      if (roleFilter.siswa_id) {
        hariQuery.andWhere('absensi.siswa_id = :siswa_id', { siswa_id: roleFilter.siswa_id });
      }

      const results = await hariQuery.getRawMany();

      return results.map(result => {
        const totalSiswaAktif = parseInt(result.total_siswa_aktif);
        const hadir = parseInt(result.hadir);
        const persentaseKehadiran = totalSiswaAktif > 0 ? (hadir / totalSiswaAktif) * 100 : 0;

        return {
          tanggal: result.tanggal,
          total_siswa_aktif: totalSiswaAktif,
          hadir: hadir,
          izin: parseInt(result.izin),
          sakit: parseInt(result.sakit),
          alpha: parseInt(result.alpha),
          persentase_kehadiran: Math.round(persentaseKehadiran * 100) / 100
        };
      });
    }

    private async getSiswaBermasalah(dateRange: any, roleFilter: any) {
      const { startDate, endDate } = dateRange;

      const siswaQuery = this.absensiSiswaRepository
        .createQueryBuilder('absensi')
        .leftJoin('absensi.siswa', 'siswa')
        .leftJoin('siswa.kelas', 'kelas')
        .select('siswa.id', 'siswa_id')
        .addSelect('siswa.nama_lengkap', 'nama_siswa')
        .addSelect('kelas.nama_kelas', 'kelas')
        .addSelect('COUNT(CASE WHEN absensi.status = \'alpha\' THEN 1 END)', 'total_alpha')
        .addSelect('COUNT(CASE WHEN absensi.status != \'hadir\' THEN 1 END)', 'total_ketidakhadiran')
        .addSelect('COUNT(absensi.id)', 'total_absensi')
        .where('absensi.tanggal BETWEEN :startDate AND :endDate', { startDate, endDate })
        .groupBy('siswa.id')
        .addGroupBy('siswa.nama_lengkap')
        .addGroupBy('kelas.nama_kelas')
        .having('COUNT(CASE WHEN absensi.status = \'alpha\' THEN 1 END) > 0')
        .orderBy('COUNT(CASE WHEN absensi.status = \'alpha\' THEN 1 END)', 'DESC');

      if (roleFilter.kelas_id) {
        siswaQuery.andWhere('siswa.kelas_id = :kelas_id', { kelas_id: roleFilter.kelas_id });
      }
      if (roleFilter.siswa_id) {
        siswaQuery.andWhere('siswa.id = :siswa_id', { siswa_id: roleFilter.siswa_id });
      }

      const results = await siswaQuery.getRawMany();

      return results.map(result => {
        const totalAbsensi = parseInt(result.total_absensi);
        const totalKetidakhadiran = parseInt(result.total_ketidakhadiran);
        const totalAlpha = parseInt(result.total_alpha);
        const persentaseKehadiran = totalAbsensi > 0 ? 
          ((totalAbsensi - totalKetidakhadiran) / totalAbsensi) * 100 : 0;

        // Tentukan level peringatan berdasarkan alpha dan persentase kehadiran
        let peringatanLevel: 'ringan' | 'sedang' | 'berat';
        if (totalAlpha >= 10 || persentaseKehadiran < 70) {
          peringatanLevel = 'berat';
        } else if (totalAlpha >= 5 || persentaseKehadiran < 80) {
          peringatanLevel = 'sedang';
        } else {
          peringatanLevel = 'ringan';
        }

        return {
          siswa_id: parseInt(result.siswa_id),
          nama_siswa: result.nama_siswa,
          kelas: result.kelas,
          total_alpha: totalAlpha,
          total_ketidakhadiran: totalKetidakhadiran,
          persentase_kehadiran: Math.round(persentaseKehadiran * 100) / 100,
          peringatan_level: peringatanLevel
        };
      }).slice(0, 20); // Limit 20 siswa bermasalah teratas
    }

    private async getPolaKeterlambatan(dateRange: any, roleFilter: any) {
      const { startDate, endDate } = dateRange;

      // Query rata-rata jam masuk
      const avgJamMasukQuery = this.absensiSiswaRepository
        .createQueryBuilder('absensi')
        .leftJoin('absensi.siswa', 'siswa')
        .select('AVG(TIME_TO_SEC(absensi.jam_masuk))', 'avg_seconds')
        .where('absensi.tanggal BETWEEN :startDate AND :endDate', { startDate, endDate })
        .andWhere('absensi.jam_masuk IS NOT NULL')
        .andWhere('absensi.status = :status', { status: 'hadir' });

      if (roleFilter.kelas_id) {
        avgJamMasukQuery.andWhere('siswa.kelas_id = :kelas_id', { kelas_id: roleFilter.kelas_id });
      }

      const avgResult = await avgJamMasukQuery.getRawOne();
      const avgSeconds = parseInt(avgResult?.avg_seconds || 0);
      const rataRataJamMasuk = this.secondsToTime(avgSeconds);

      // Query jumlah terlambat (asumsi terlambat jika masuk > 07:30)
      const terlambatQuery = this.absensiSiswaRepository
        .createQueryBuilder('absensi')
        .leftJoin('absensi.siswa', 'siswa')
        .where('absensi.tanggal BETWEEN :startDate AND :endDate', { startDate, endDate })
        .andWhere('absensi.jam_masuk > :batas_terlambat', { batas_terlambat: '07:30:00' })
        .andWhere('absensi.status = :status', { status: 'hadir' });

      if (roleFilter.kelas_id) {
        terlambatQuery.andWhere('siswa.kelas_id = :kelas_id', { kelas_id: roleFilter.kelas_id });
      }

      const jumlahTerlambat = await terlambatQuery.getCount();

      // Query siswa paling sering terlambat
      const siswaTerlambatQuery = this.absensiSiswaRepository
        .createQueryBuilder('absensi')
        .leftJoin('absensi.siswa', 'siswa')
        .select('siswa.id', 'siswa_id')
        .addSelect('siswa.nama_lengkap', 'nama_siswa')
        .addSelect('COUNT(*)', 'jumlah_terlambat')
        .where('absensi.tanggal BETWEEN :startDate AND :endDate', { startDate, endDate })
        .andWhere('absensi.jam_masuk > :batas_terlambat', { batas_terlambat: '07:30:00' })
        .andWhere('absensi.status = :status', { status: 'hadir' })
        .groupBy('siswa.id')
        .addGroupBy('siswa.nama_lengkap')
        .orderBy('COUNT(*)', 'DESC')
        .limit(10);

      if (roleFilter.kelas_id) {
        siswaTerlambatQuery.andWhere('siswa.kelas_id = :kelas_id', { kelas_id: roleFilter.kelas_id });
      }

      const siswaTerlambat = await siswaTerlambatQuery.getRawMany();

      return {
        rata_rata_jam_masuk: rataRataJamMasuk,
        jumlah_terlambat: jumlahTerlambat,
        siswa_paling_sering_terlambat: siswaTerlambat.map(item => ({
          siswa_id: parseInt(item.siswa_id),
          nama_siswa: item.nama_siswa,
          jumlah_terlambat: parseInt(item.jumlah_terlambat)
        }))
      };
    }

    private async getPerbandinganPeriode(periode: string, dateRange: any, roleFilter: any) {
      const { startDate, endDate } = dateRange;

      // Hitung periode sebelumnya
      const periodeBefore = this.getPreviousPeriod(periode, startDate, endDate);

      const [currentPeriod, previousPeriod] = await Promise.all([
        this.getKehadiranByPeriod(startDate, endDate, roleFilter),
        this.getKehadiranByPeriod(periodeBefore.startDate, periodeBefore.endDate, roleFilter)
      ]);

      const perubahanPersen = previousPeriod > 0 ? 
        ((currentPeriod - previousPeriod) / previousPeriod) * 100 : 0;

      let trend: 'naik' | 'turun' | 'stabil';
      if (Math.abs(perubahanPersen) < 2) {
        trend = 'stabil';
      } else if (perubahanPersen > 0) {
        trend = 'naik';
      } else {
        trend = 'turun';
      }

      return {
        periode_sekarang: Math.round(currentPeriod * 100) / 100,
        periode_sebelumnya: Math.round(previousPeriod * 100) / 100,
        perubahan_persen: Math.round(perubahanPersen * 100) / 100,
        trend
      };
    }

    private calculateWorkingDays(startDate: Date, endDate: Date): number {
      let count = 0;
      const current = new Date(startDate);
      
      while (current <= endDate) {
        const dayOfWeek = current.getDay();
        if (dayOfWeek !== 0 && dayOfWeek !== 6) { // Tidak Minggu (0) dan Sabtu (6)
          count++;
        }
        current.setDate(current.getDate() + 1);
      }
      
      return count;
    }

    private secondsToTime(seconds: number): string {
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    }

    private getPreviousPeriod(periode: string, startDate: Date, endDate: Date) {
      const duration = endDate.getTime() - startDate.getTime();
      const previousEndDate = new Date(startDate.getTime() - 1);
      const previousStartDate = new Date(previousEndDate.getTime() - duration);
      
      return { startDate: previousStartDate, endDate: previousEndDate };
    }

    private async getKehadiranByPeriod(startDate: Date, endDate: Date, roleFilter: any) {
      const query = this.absensiSiswaRepository
        .createQueryBuilder('absensi')
        .leftJoin('absensi.siswa', 'siswa')
        .select('COUNT(CASE WHEN absensi.status = \'hadir\' THEN 1 END)', 'hadir')
        .addSelect('COUNT(*)', 'total')
        .where('absensi.tanggal BETWEEN :startDate AND :endDate', { startDate, endDate });

      if (roleFilter.kelas_id) {
        query.andWhere('siswa.kelas_id = :kelas_id', { kelas_id: roleFilter.kelas_id });
      }
      if (roleFilter.siswa_id) {
        query.andWhere('absensi.siswa_id = :siswa_id', { siswa_id: roleFilter.siswa_id });
      }

      const result = await query.getRawOne();
      const hadir = parseInt(result?.hadir || 0);
      const total = parseInt(result?.total || 0);
      
      return total > 0 ? (hadir / total) * 100 : 0;
    }
}