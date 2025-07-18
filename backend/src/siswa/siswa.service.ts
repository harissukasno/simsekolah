import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Siswa } from './siswa.entity';
import { CreateSiswaDto, UpdateSiswaDto } from './siswa.dto';
import * as XLSX from 'xlsx';
import { Multer } from 'multer';

@Injectable()
export class SiswaService {
  constructor(
    @InjectRepository(Siswa)
    private readonly siswaRepository: Repository<Siswa>,
  ) {}

  async findAll(page: number, limit: number): Promise<Siswa[]> {
    const skip = (page - 1) * limit;
    return this.siswaRepository.find({
      skip,
      take: limit,
      relations: ['user', 'kelas'],
    });
  }

  async findOne(id: number): Promise<Siswa> {
    const siswa = await this.siswaRepository.findOne({
      where: { id },
      relations: ['user', 'kelas'],
    });
    if (!siswa) {
      throw new NotFoundException(`Siswa with ID ${id} not found`);
    }
    return siswa;
  }

  async create(createSiswaDto: CreateSiswaDto): Promise<Siswa> {
    const siswa = this.siswaRepository.create(createSiswaDto);
    return this.siswaRepository.save(siswa);
  }

  async update(id: number, updateSiswaDto: UpdateSiswaDto): Promise<Siswa> {
    await this.siswaRepository.update(id, updateSiswaDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const result = await this.siswaRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Siswa with ID ${id} not found`);
    }
  }

  async getRapor(id: number): Promise<any> {
    // This is a placeholder. In a real application, you would fetch
    // rapor data from a different service or database.
    const siswa = await this.findOne(id);
    return {
      siswa,
      rapor: `Rapor data for ${siswa.nama_lengkap}`,
    };
  }
  async importSiswa(file: Multer.File): Promise<string> {
    const workbook = XLSX.read(file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data: any[] = XLSX.utils.sheet_to_json(worksheet);

    for (const item of data) {
      const createSiswaDto: CreateSiswaDto = {
        nis: item.nis,
        nisn: item.nisn,
        nama_lengkap: item.nama_lengkap,
        jenis_kelamin: item.jenis_kelamin,
        tempat_lahir: item.tempat_lahir,
        tanggal_lahir: item.tanggal_lahir,
        agama: item.agama,
        alamat: item.alamat,
        no_telp: item.no_telp,
        kelasId: item.kelasId,
        tahun_masuk: item.tahun_masuk,
      };
      await this.create(createSiswaDto);
    }

    return 'Import successful';
  }
    async exportSiswa(): Promise<Buffer> {
        const siswaList = await this.siswaRepository.find({
        relations: ['user', 'kelas'],
        });
        const worksheet = XLSX.utils.json_to_sheet(siswaList);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Siswa');
        return XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
    }
}