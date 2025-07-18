import { Test, TestingModule } from '@nestjs/testing';
import { SiswaController } from './siswa.controller';
import { SiswaService } from './siswa.service';
import { CreateSiswaDto, UpdateSiswaDto } from './siswa.dto';
import { Multer } from 'multer';

describe('SiswaController', () => {
  let controller: SiswaController;
  let service: SiswaService;

  const mockSiswaService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    getRapor: jest.fn(),
    importSiswa: jest.fn(),
    exportSiswa: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SiswaController],
      providers: [
        {
          provide: SiswaService,
          useValue: mockSiswaService,
        },
      ],
    }).compile();

    controller = module.get<SiswaController>(SiswaController);
    service = module.get<SiswaService>(SiswaService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of siswa', async () => {
      const result = [{ id: 1, nama_lengkap: 'Test Siswa' }];
      mockSiswaService.findAll.mockResolvedValue(result);
      expect(await controller.findAll(1, 10)).toBe(result);
      expect(mockSiswaService.findAll).toHaveBeenCalledWith(1, 10);
    });
  });

  describe('create', () => {
    it('should create a new siswa', async () => {
      const createSiswaDto: CreateSiswaDto = {
        nis: '12345',
        nama_lengkap: 'New Siswa',
        jenis_kelamin: 'L',
      };
      const result = { id: 1, ...createSiswaDto };
      mockSiswaService.create.mockResolvedValue(result);
      expect(await controller.create(createSiswaDto)).toBe(result);
      expect(mockSiswaService.create).toHaveBeenCalledWith(createSiswaDto);
    });
  });
  describe('findOne', () => {
    it('should return a siswa by id', async () => {
      const result = { id: 1, nama_lengkap: 'Test Siswa' };
      mockSiswaService.findOne.mockResolvedValue(result);
      expect(await controller.findOne('1')).toBe(result);
      expect(mockSiswaService.findOne).toHaveBeenCalledWith(1);
    });
  });
  describe('update', () => {
    it('should update a siswa', async () => {
      const updateSiswaDto: UpdateSiswaDto = {
        nama_lengkap: 'Updated Siswa',
      };
      const result = { id: 1, ...updateSiswaDto };
      mockSiswaService.update.mockResolvedValue(result);
      expect(await controller.update('1', updateSiswaDto)).toBe(result);
      expect(mockSiswaService.update).toHaveBeenCalledWith(1, updateSiswaDto);
    });
  });
  describe('remove', () => {
    it('should remove a siswa', async () => {
      const result = { affected: 1 };
      mockSiswaService.remove.mockResolvedValue(result);
      expect(await controller.remove('1')).toBe(result);
      expect(mockSiswaService.remove).toHaveBeenCalledWith(1);
    });
  });
  describe('getRapor', () => {
    it('should return rapor for a siswa', async () => {
      const result = { id: 1, rapor: 'Rapor Data' };
      mockSiswaService.getRapor.mockResolvedValue(result);
      expect(await controller.getRapor('1')).toBe(result);
      expect(mockSiswaService.getRapor).toHaveBeenCalledWith(1);
    });
  });
  describe('importSiswa', () => {
    it('should import siswa from file', async () => {
      const file: Multer.File = { originalname: 'siswa.csv', buffer: Buffer.from('') };
      const result = { success: true, message: 'Import successful' };
      mockSiswaService.importSiswa.mockResolvedValue(result);
      expect(await controller.importSiswa(file)).toBe(result);
      expect(mockSiswaService.importSiswa).toHaveBeenCalledWith(file);
    });
  });
  describe('exportSiswa', () => {
    it('should export siswa data', async () => {
      const result = { success: true, message: 'Export successful' };
      mockSiswaService.exportSiswa.mockResolvedValue(result);
      expect(await controller.exportSiswa()).toBe(result);
      expect(mockSiswaService.exportSiswa).toHaveBeenCalled();
    });
  }
  );
});