import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { SiswaService } from './siswa.service';
import { CreateSiswaDto, UpdateSiswaDto } from './siswa.dto';
import { Multer } from 'multer';

@Controller('siswa')
export class SiswaController {
  constructor(private readonly siswaService: SiswaService) {}

  @Get()
  findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.siswaService.findAll(page, limit);
  }

  @Post()
  create(@Body() createSiswaDto: CreateSiswaDto) {
    return this.siswaService.create(createSiswaDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.siswaService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateSiswaDto: UpdateSiswaDto) {
    return this.siswaService.update(+id, updateSiswaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.siswaService.remove(+id);
  }

  @Get(':id/rapor')
  getRapor(@Param('id') id: string) {
    return this.siswaService.getRapor(+id);
  }

  @Post('import')
  importSiswa(@UploadedFile() file: Multer.File) {
    return this.siswaService.importSiswa(file);
  }

  @Get('export')
  exportSiswa() {
    return this.siswaService.exportSiswa();
  }
}
