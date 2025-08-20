import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { UjianService } from './ujian.service';
import { Ujian } from './ujian.entity';

@Controller('ujian')
export class UjianController {
  constructor(private readonly ujianService: UjianService) {}

  @Get()
  async findAll(): Promise<Ujian[]> {
    return this.ujianService.findAll();
  }

  @Post()
  async create(@Body() ujian: Ujian): Promise<Ujian> {
    return this.ujianService.create(ujian);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Ujian> {
    return this.ujianService.findOne(+id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() ujian: Ujian): Promise<Ujian> {
    return this.ujianService.update(+id, ujian);
  }

  @Get(':id/soal')
  async getSoalUjian(@Param('id') id: string): Promise<any> {
    // Implement logic to get soal ujian
    return `Getting soal for ujian ${id}`;
  }

  @Post(':id/mulai')
  async mulaiUjian(@Param('id') id: string): Promise<any> {
    // Implement logic to start ujian
    return `Starting ujian ${id}`;
  }

  @Post(':id/jawab')
  async submitJawaban(@Param('id') id: string, @Body() jawaban: any): Promise<any> {
    // Implement logic to submit jawaban
    return `Submitting jawaban for ujian ${id}`;
  }

  @Post(':id/selesai')
  async selesaiUjian(@Param('id') id: string): Promise<any> {
    // Implement logic to finish ujian
    return `Finishing ujian ${id}`;
  }

  @Get(':id/hasil')
  async getHasilUjian(@Param('id') id: string): Promise<any> {
    // Implement logic to get ujian results
    return `Getting results for ujian ${id}`;
  }
}
