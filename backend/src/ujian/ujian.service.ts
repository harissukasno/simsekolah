import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ujian } from './ujian.entity';

@Injectable()
export class UjianService {
  constructor(
    @InjectRepository(Ujian)
    private readonly ujianRepository: Repository<Ujian>,
  ) {}

  async findAll(): Promise<Ujian[]> {
    return this.ujianRepository.find();
  }

  async findOne(id: number): Promise<Ujian> {
    const ujian = await this.ujianRepository.findOne({ where: { id } });
    if (!ujian) {
      throw new NotFoundException(`Ujian with ID ${id} not found`);
    }
    return ujian;
  }

  async create(ujian: Ujian): Promise<Ujian> {
    return this.ujianRepository.save(ujian);
  }

  async update(id: number, ujian: Ujian): Promise<Ujian> {
    await this.ujianRepository.update(id, ujian);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.ujianRepository.delete(id);
  }
}
