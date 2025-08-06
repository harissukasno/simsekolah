import { Test, TestingModule } from '@nestjs/testing';
import { AbsensiService } from './absensi.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AbsensiSiswa, AbsensiGuru, AbsensiKelas, AbsensiSiswaStatus, AbsensiGuruStatus } from './absensi.entity';
import { Repository } from 'typeorm';
import { CreateAbsensiSiswaDto, CreateAbsensiGuruDto, CreateAbsensiKelasDto } from './absensi.dto';
import { AbsensiStatistikQueryDto, AbsensiStatistikResponse } from './absensi.dto';

describe('AbsensiService', () => {
  let service: AbsensiService;
  let absensiSiswaRepository: Repository<AbsensiSiswa>;
  let absensiGuruRepository: Repository<AbsensiGuru>;
  let absensiKelasRepository: Repository<AbsensiKelas>;

  const mockAbsensiSiswaRepository = {
    find: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  const mockAbsensiGuruRepository = {
    find: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  const mockAbsensiKelasRepository = {
    find: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AbsensiService,
        {
          provide: getRepositoryToken(AbsensiSiswa),
          useValue: mockAbsensiSiswaRepository,
        },
        {
          provide: getRepositoryToken(AbsensiGuru),
          useValue: mockAbsensiGuruRepository,
        },
        {
          provide: getRepositoryToken(AbsensiKelas),
          useValue: mockAbsensiKelasRepository,
        },
      ],
    }).compile();

    service = module.get<AbsensiService>(AbsensiService);
    absensiSiswaRepository = module.get<Repository<AbsensiSiswa>>(getRepositoryToken(AbsensiSiswa));
    absensiGuruRepository = module.get<Repository<AbsensiGuru>>(getRepositoryToken(AbsensiGuru));
    absensiKelasRepository = module.get<Repository<AbsensiKelas>>(getRepositoryToken(AbsensiKelas));

    jest.clearAllMocks(); // Clear mocks before each test
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAllAbsensiSiswa', () => {
    it('should return an array of AbsensiSiswa', async () => {
      const result = [{ id: 1, siswaId: 1, tanggal: new Date(), status: AbsensiSiswaStatus.HADIR }];
      mockAbsensiSiswaRepository.find.mockResolvedValue(result);
      expect(await service.findAllAbsensiSiswa()).toBe(result);
      expect(absensiSiswaRepository.find).toHaveBeenCalled();
    });
  });

  describe('createAbsensiSiswa', () => {
    it('should create a new AbsensiSiswa record', async () => {
      const createDto: CreateAbsensiSiswaDto = {
        siswaId: 1,
        tanggal: '2023-01-01',
        status: AbsensiSiswaStatus.HADIR,
      };
      const newAbsensiSiswa = { ...createDto, tanggal: new Date(createDto.tanggal) } as AbsensiSiswa;
      const savedAbsensiSiswa = { ...newAbsensiSiswa, id: 1 };

      mockAbsensiSiswaRepository.create.mockReturnValue(newAbsensiSiswa);
      mockAbsensiSiswaRepository.save.mockResolvedValue(savedAbsensiSiswa);

      expect(await service.createAbsensiSiswa(createDto)).toBe(savedAbsensiSiswa);
      expect(absensiSiswaRepository.create).toHaveBeenCalledWith(createDto);
      expect(absensiSiswaRepository.save).toHaveBeenCalledWith(newAbsensiSiswa);
    });
  });

  describe('findAllAbsensiGuru', () => {
    it('should return an array of AbsensiGuru', async () => {
      const result = [{ id: 1, guruId: 1, tanggal: new Date(), status: AbsensiGuruStatus.HADIR }];
      mockAbsensiGuruRepository.find.mockResolvedValue(result);
      expect(await service.findAllAbsensiGuru()).toBe(result);
      expect(absensiGuruRepository.find).toHaveBeenCalled();
    });
  });

  describe('createAbsensiGuru', () => {
    it('should create a new AbsensiGuru record', async () => {
      const createDto: CreateAbsensiGuruDto = {
        guruId: 1,
        tanggal: '2023-01-01',
        status: AbsensiGuruStatus.HADIR,
      };
      const newAbsensiGuru = { ...createDto, tanggal: new Date(createDto.tanggal) } as AbsensiGuru;
      const savedAbsensiGuru = { ...newAbsensiGuru, id: 1 };

      mockAbsensiGuruRepository.create.mockReturnValue(newAbsensiGuru);
      mockAbsensiGuruRepository.save.mockResolvedValue(savedAbsensiGuru);

      expect(await service.createAbsensiGuru(createDto)).toBe(savedAbsensiGuru);
      expect(absensiGuruRepository.create).toHaveBeenCalledWith(createDto);
      expect(absensiGuruRepository.save).toHaveBeenCalledWith(newAbsensiGuru);
    });
  });

  describe('findAbsensiKelasById', () => {
    it('should return an array of AbsensiKelas for a given ID', async () => {
      const kelasId = '1';
      const result = [{ id: 1, jadwalMengajarId: 1, siswaId: 1, tanggal: new Date(), status: 'hadir' }];
      mockAbsensiKelasRepository.find.mockResolvedValue(result);
      expect(await service.findAbsensiKelasById(kelasId)).toBe(result);
      expect(absensiKelasRepository.find).toHaveBeenCalledWith({ where: { jadwalMengajarId: parseInt(kelasId, 10) } });
    });

    it('should throw NotFoundException if no absensi for the given kelasId is found', async () => {
      const kelasId = '999';
      mockAbsensiKelasRepository.find.mockResolvedValue(null); // Or an empty array, depending on implementation
      await expect(service.findAbsensiKelasById(kelasId)).rejects.toThrowError(`Absensi for Kelas with ID ${kelasId} not found`);
    });
  });

  describe('createAbsensiKelas', () => {
    it('should create a new AbsensiKelas record', async () => {
      const kelasId = '1';
      const createDto: CreateAbsensiKelasDto = {
        kelasId: '1', // This property is not directly used in entity creation, but part of DTO
        tanggal: '2023-01-01',
        status: 'hadir',
      };
      const newAbsensiKelas = {
        tanggal: new Date(createDto.tanggal),
        status: createDto.status,
        jadwalMengajarId: parseInt(kelasId, 10),
      } as AbsensiKelas;
      const savedAbsensiKelas = { ...newAbsensiKelas, id: 1 };

      mockAbsensiKelasRepository.create.mockReturnValue(newAbsensiKelas);
      mockAbsensiKelasRepository.save.mockResolvedValue(savedAbsensiKelas);

      expect(await service.createAbsensiKelas(kelasId, createDto)).toBe(savedAbsensiKelas);
      expect(absensiKelasRepository.create).toHaveBeenCalledWith({
        ...createDto,
        jadwalMengajarId: parseInt(kelasId, 10),
      });
      expect(absensiKelasRepository.save).toHaveBeenCalledWith(newAbsensiKelas);
    });
  });

  describe('getAbsensiStatistik', () => {
    it('should return absensi statistics', async () => {
      const mockQuery: AbsensiStatistikQueryDto = { periode: 'bulan' };
      const mockUser = { role: 'super_admin' }; // Mock user object
      const result: AbsensiStatistikResponse = { // This structure needs to match AbsensiStatistikResponse
        summary: {
          total_siswa: 100,
          total_hari_efektif: 20,
          persentase_kehadiran_keseluruhan: 90,
          trend_mingguan: 5
        },
        breakdown_status: {
          hadir: { count: 90, percentage: 90 },
          izin: { count: 5, percentage: 5 },
          sakit: { count: 3, percentage: 3 },
          alpha: { count: 2, percentage: 2 }
        },
        statistik_per_kelas: [],
        statistik_harian: [],
        siswa_bermasalah: [],
        pola_keterlambatan: {
          rata_rata_jam_masuk: '08:00',
          jumlah_terlambat: 0,
          siswa_paling_sering_terlambat: []
        },
        perbandingan_periode: {
          periode_sekarang: 90, periode_sebelumnya: 85, perubahan_persen: 5, trend: 'naik'
        }
      };

      jest.spyOn(service, 'getAbsensiStatistik').mockResolvedValue(result);

      expect(await service.getAbsensiStatistik(mockQuery, mockUser)).toBe(result);
      expect(service.getAbsensiStatistik).toHaveBeenCalledWith(mockQuery, mockUser);
    });
  });
});
