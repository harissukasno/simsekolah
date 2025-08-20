import { Test, TestingModule } from '@nestjs/testing';
import { UjianController } from './ujian.controller';
import { UjianService } from './ujian.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Ujian, TipeUjian, UjianStatus } from './ujian.entity';
import { CreateUjianDto, JenisUjian, StatusUjian } from './ujian.dto';
import { Repository } from 'typeorm';

describe('UjianController', () => {
  let controller: UjianController;
  let service: UjianService;

  const mockUjianRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UjianController],
      providers: [
        UjianService,
        {
          provide: getRepositoryToken(Ujian),
          useValue: mockUjianRepository,
        },
      ],
    }).compile();

    controller = module.get<UjianController>(UjianController);
    service = module.get<UjianService>(UjianService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  it('should return all ujian', async () => {
    const result = [{ id: 1, name: 'Ujian 1' }];
    mockUjianRepository.find.mockResolvedValue(result);

    expect(await service.findAll()).toEqual(result);
    expect(mockUjianRepository.find).toHaveBeenCalled();
  });

  it('should return one ujian by id', async () => {
    const result = { id: 1, name: 'Ujian 1' };
    mockUjianRepository.findOne.mockResolvedValue(result);

    expect(await service.findOne(1)).toEqual(result);
    expect(mockUjianRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
  });

  it('should create a ujian', async () => {
    const newUjian: Ujian = {
      id: 2,
      kode_ujian: 'UJ002',
      nama_ujian: 'Ujian Matematika',
      mata_pelajaran_id: 1,
      guru_id: 1,
      tanggal_mulai: new Date(),
      tanggal_selesai: new Date(),
      durasi_menit: 90,
      jumlah_soal: 20,
      kelas_id: 1,
      tipe_ujian: TipeUjian.UTS,
      status: UjianStatus.AKTIF,
      token_ujian: 'some_token',
      created_at: new Date(),
    };
    mockUjianRepository.save.mockResolvedValue(newUjian);

    expect(await service.create(newUjian)).toEqual(newUjian);
    expect(mockUjianRepository.save).toHaveBeenCalledWith(newUjian);
  });

});