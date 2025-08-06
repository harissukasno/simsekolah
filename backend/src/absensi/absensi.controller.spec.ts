import { Test, TestingModule } from '@nestjs/testing';
import { AbsensiController } from './absensi.controller';
import { AbsensiService } from './absensi.service';
import { AuthGuard } from '../auth/auth.guard'; // Assuming JwtAuthGuard is here
import { RolesGuard } from '../auth/roles.guard'; // Assuming RolesGuard is here
import { CreateAbsensiSiswaDto, CreateAbsensiGuruDto, CreateAbsensiKelasDto, AbsensiStatistikQueryDto, AbsensiStatistikResponse } from './absensi.dto';
import { AbsensiSiswaStatus, AbsensiGuruStatus } from './absensi.entity';

describe('AbsensiController', () => {
  let controller: AbsensiController;
  let service: AbsensiService;

  const mockAbsensiService = {
    findAllAbsensiSiswa: jest.fn(),
    createAbsensiSiswa: jest.fn(),
    findAllAbsensiGuru: jest.fn(),
    createAbsensiGuru: jest.fn(),
    findAbsensiKelasById: jest.fn(),
    createAbsensiKelas: jest.fn(),
    getAbsensiStatistik: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AbsensiController],
      providers: [
        {
          provide: AbsensiService,
          useValue: mockAbsensiService,
        },
      ],
    })
    .overrideGuard(AuthGuard)
    .useValue({ canActivate: jest.fn().mockReturnValue(true) }) // mock AuthGuard
    .overrideGuard(RolesGuard)
    .useValue({ canActivate: jest.fn().mockReturnValue(true) }) // mock RolesGuard
    .compile();

    controller = module.get<AbsensiController>(AbsensiController);
    service = module.get<AbsensiService>(AbsensiService);
    jest.clearAllMocks(); // Clear mocks before each test
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAllAbsensiSiswa', () => {
    it('should return an array of AbsensiSiswa', async () => {
      const result = [{ id: 1, siswaId: 1, tanggal: new Date(), status: AbsensiSiswaStatus.HADIR }];
      mockAbsensiService.findAllAbsensiSiswa.mockResolvedValue(result);
      expect(await controller.findAllAbsensiSiswa()).toBe(result);
      expect(service.findAllAbsensiSiswa).toHaveBeenCalled();
    });
  });

  describe('createAbsensiSiswa', () => {
    it('should create a new AbsensiSiswa record', async () => {
      const createDto: CreateAbsensiSiswaDto = {
        siswaId: 1,
        tanggal: '2023-01-01',
        status: AbsensiSiswaStatus.HADIR,
      };
      const result = { id: 1, ...createDto, tanggal: new Date(createDto.tanggal) };
      mockAbsensiService.createAbsensiSiswa.mockResolvedValue(result);
      expect(await controller.createAbsensiSiswa(createDto)).toBe(result);
      expect(service.createAbsensiSiswa).toHaveBeenCalledWith(createDto);
    });
  });

  describe('findAllAbsensiGuru', () => {
    it('should return an array of AbsensiGuru', async () => {
      const result = [{ id: 1, guruId: 1, tanggal: new Date(), status: AbsensiGuruStatus.HADIR }];
      mockAbsensiService.findAllAbsensiGuru.mockResolvedValue(result);
      expect(await controller.findAllAbsensiGuru()).toBe(result);
      expect(service.findAllAbsensiGuru).toHaveBeenCalled();
    });
  });

  describe('createAbsensiGuru', () => {
    it('should create a new AbsensiGuru record', async () => {
      const createDto: CreateAbsensiGuruDto = {
        guruId: 1,
        tanggal: '2023-01-01',
        status: AbsensiGuruStatus.HADIR,
      };
      const result = { id: 1, ...createDto, tanggal: new Date(createDto.tanggal) };
      mockAbsensiService.createAbsensiGuru.mockResolvedValue(result);
      expect(await controller.createAbsensiGuru(createDto)).toBe(result);
      expect(service.createAbsensiGuru).toHaveBeenCalledWith(createDto);
    });
  });

  describe('findAbsensiKelasById', () => {
    it('should return an array of AbsensiKelas for a given ID', async () => {
      const kelasId = '1';
      const result = [{ id: 1, jadwalMengajarId: 1, siswaId: 1, tanggal: new Date(), status: 'hadir' }];
      mockAbsensiService.findAbsensiKelasById.mockResolvedValue(result);
      expect(await controller.findAbsensiKelasById(kelasId)).toBe(result);
      expect(service.findAbsensiKelasById).toHaveBeenCalledWith(kelasId);
    });
  });

  describe('createAbsensiKelas', () => {
    it('should create a new AbsensiKelas record', async () => {
      const kelasId = '1';
      const createDto: CreateAbsensiKelasDto = {
        kelasId: '1',
        tanggal: '2023-01-01',
        status: 'hadir',
      };
      const result = { id: 1, jadwalMengajarId: parseInt(kelasId, 10), ...createDto, tanggal: new Date(createDto.tanggal) };
      mockAbsensiService.createAbsensiKelas.mockResolvedValue(result);
      expect(await controller.createAbsensiKelas(kelasId, createDto)).toBe(result);
      expect(service.createAbsensiKelas).toHaveBeenCalledWith(kelasId, createDto);
    });
  });

  describe('getStatistikAbsensi', () => {
    it('should return absensi statistics', async () => {
      const mockQuery: AbsensiStatistikQueryDto = { periode: 'bulan' };
      const mockUser = { role: 'super_admin' }; // Mock user object
      const result: AbsensiStatistikResponse = {
        summary: { total_siswa: 100, total_hari_efektif: 20, persentase_kehadiran_keseluruhan: 90, trend_mingguan: 5 },
        breakdown_status: { hadir: { count: 90, percentage: 90 }, izin: { count: 5, percentage: 5 }, sakit: { count: 3, percentage: 3 }, alpha: { count: 2, percentage: 2 } },
        statistik_per_kelas: [],
        statistik_harian: [],
        siswa_bermasalah: [],
        pola_keterlambatan: { rata_rata_jam_masuk: '08:00', jumlah_terlambat: 0, siswa_paling_sering_terlambat: [] },
        perbandingan_periode: { periode_sekarang: 90, periode_sebelumnya: 85, perubahan_persen: 5, trend: 'naik' }
      };
      mockAbsensiService.getAbsensiStatistik.mockResolvedValue(result);
      expect(await controller.getStatistikAbsensi(mockQuery, mockUser)).toBe(result);
      expect(service.getAbsensiStatistik).toHaveBeenCalledWith(mockQuery, mockUser);
    });
  });
});
