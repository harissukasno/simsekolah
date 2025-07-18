import { Test, TestingModule } from '@nestjs/testing';
import { SiswaService } from './siswa.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Siswa } from './siswa.entity';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { CreateSiswaDto, UpdateSiswaDto } from './siswa.dto';
import * as XLSX from 'xlsx';

describe('SiswaService', () => {
  let service: SiswaService;
  let repository: Repository<Siswa>;

  const mockSiswaRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SiswaService,
        {
          provide: getRepositoryToken(Siswa),
          useValue: mockSiswaRepository,
        },
      ],
    }).compile();

    service = module.get<SiswaService>(SiswaService);
    repository = module.get<Repository<Siswa>>(getRepositoryToken(Siswa));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of siswa', async () => {
      const result = [{ id: 1, nama_lengkap: 'Test Siswa' }];
      mockSiswaRepository.find.mockResolvedValue(result);
      expect(await service.findAll(1, 10)).toBe(result);
      expect(mockSiswaRepository.find).toHaveBeenCalledWith({
        skip: 0,
        take: 10,
        relations: ['user', 'kelas'],
      });
    });
  });

  describe('findOne', () => {
    it('should return a siswa by id', async () => {
      const result = { id: 1, nama_lengkap: 'Test Siswa' };
      mockSiswaRepository.findOne.mockResolvedValue(result);
      expect(await service.findOne(1)).toBe(result);
      expect(mockSiswaRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['user', 'kelas'],
      });
    });
    it('should throw NotFoundException if siswa is not found', async () => {
      mockSiswaRepository.findOne.mockResolvedValue(null);
      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
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
      mockSiswaRepository.create.mockReturnValue(result);
      mockSiswaRepository.save.mockResolvedValue(result);
      expect(await service.create(createSiswaDto)).toBe(result);
      expect(mockSiswaRepository.create).toHaveBeenCalledWith(createSiswaDto);
      expect(mockSiswaRepository.save).toHaveBeenCalledWith(result);
    });
  });
  describe('update', () => {
    it('should update a siswa', async () => {
      const updateSiswaDto: UpdateSiswaDto = {
        nama_lengkap: 'Updated Siswa',
      };
      const result = { id: 1, ...updateSiswaDto };
      mockSiswaRepository.findOne.mockResolvedValue(result);
      mockSiswaRepository.update.mockResolvedValue({ affected: 1 });
      expect(await service.update(1, updateSiswaDto)).toBe(result);
      expect(mockSiswaRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['user', 'kelas'],
      });
      expect(mockSiswaRepository.update).toHaveBeenCalledWith(1, updateSiswaDto);
    });
    it('should throw NotFoundException if siswa is not found', async () => {
      mockSiswaRepository.findOne.mockResolvedValue(null);
      await expect(service.update(1, {})).rejects.toThrow(NotFoundException);
    });
  });
  describe('remove', () => {
    it('should remove a siswa', async () => {
      mockSiswaRepository.delete.mockResolvedValue({ affected: 1 });
      await service.remove(1);
      expect(mockSiswaRepository.delete).toHaveBeenCalledWith(1);
    });
    it('should throw NotFoundException if siswa is not found', async () => {
      mockSiswaRepository.delete.mockResolvedValue({ affected: 0 });
      await expect(service.remove(1)).rejects.toThrow(NotFoundException);
    });
  });
  describe('getRapor', () => {
    it('should return rapor data for a siswa', async () => {
      const result = { id: 1, nama_lengkap: 'Test Siswa' };
      mockSiswaRepository.findOne.mockResolvedValue(result);
      expect(await service.getRapor(1)).toEqual({
        siswa: result,
        rapor: `Rapor data for ${result.nama_lengkap}`,
      });
      expect(mockSiswaRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['user', 'kelas'],
      });
    });
  });
  describe('importSiswa', () => {
    it('should import siswa from file', async () => {
      const file = {
        buffer: Buffer.from(''),
      } as any;
      const data = [
        {
          nis: '12345',
          nisn: '67890',
          nama_lengkap: 'Imported Siswa',
          jenis_kelamin: 'L',
        },
      ];
      const workbook = {
        SheetNames: ['Sheet1'],
        Sheets: {
          Sheet1: XLSX.utils.json_to_sheet(data),
        },
      };
      jest.spyOn(XLSX, 'read').mockReturnValue(workbook);
      jest.spyOn(XLSX.utils, 'sheet_to_json').mockReturnValue(data);

      mockSiswaRepository.create.mockReturnValue(data[0]);
      mockSiswaRepository.save.mockResolvedValue(data[0]);

      expect(await service.importSiswa(file)).toBe('Import successful');
      expect(mockSiswaRepository.create).toHaveBeenCalledWith(data[0]);
      expect(mockSiswaRepository.save).toHaveBeenCalledWith(data[0]);
    });
  });
  describe('exportSiswa', () => {
    it('should export siswa data', async () => {
      const result = [{ id: 1, nama_lengkap: 'Exported Siswa' }];
      mockSiswaRepository.find.mockResolvedValue(result);
      const exportedData = await service.exportSiswa();
      expect(exportedData).toBeDefined();
      expect(mockSiswaRepository.find).toHaveBeenCalledWith({
        relations: ['user', 'kelas'],
      });
    });
  });
});