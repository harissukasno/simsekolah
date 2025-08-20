import { Test, TestingModule } from '@nestjs/testing';
import { UjianService } from './ujian.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Ujian } from './ujian.entity';

describe('UjianService', () => {
  let service: UjianService;

  // bikin mock repository
  const mockUjianRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UjianService,
        {
          provide: getRepositoryToken(Ujian), // ini kunci penting
          useValue: mockUjianRepository,
        },
      ],
    }).compile();

    service = module.get<UjianService>(UjianService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
