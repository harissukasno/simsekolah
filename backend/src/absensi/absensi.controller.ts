import { Controller, Post, Body, Get, Param,Query, UseGuards, BadRequestException } from '@nestjs/common';
import { AbsensiService } from './absensi.service';
import { CreateAbsensiSiswaDto, CreateAbsensiGuruDto, CreateAbsensiKelasDto, AbsensiStatistikQueryDto, AbsensiStatistikResponse } from './absensi.dto';
import { AuthGuard } from '../auth/auth.guard'; // Assuming JwtAuthGuard is here
import { RolesGuard } from '../auth/roles.guard'; // Assuming RolesGuard is here
import { GetUser } from './get-user.decorator'; // Assuming GetUser decorator is here

@Controller('absensi')
@UseGuards(AuthGuard, RolesGuard)
export class AbsensiController {
    constructor(private readonly absensiService: AbsensiService) {}

    @Get('siswa')
    async findAllAbsensiSiswa() {
        return this.absensiService.findAllAbsensiSiswa();
    }

    @Post('siswa')
    async createAbsensiSiswa(@Body() createAbsensiSiswaDto: CreateAbsensiSiswaDto) {
        return this.absensiService.createAbsensiSiswa(createAbsensiSiswaDto);
    }

    @Get('guru')
    async findAllAbsensiGuru() {
        return this.absensiService.findAllAbsensiGuru();
    }

    @Post('guru')
    async createAbsensiGuru(@Body() createAbsensiGuruDto: CreateAbsensiGuruDto) {
        return this.absensiService.createAbsensiGuru(createAbsensiGuruDto);
    }

    @Get('kelas/:id')
    async findAbsensiKelasById(@Param('id') kelasId: string) {
        return this.absensiService.findAbsensiKelasById(kelasId);
    }

    @Post('kelas/:id')
    async createAbsensiKelas(@Param('id') kelasId: string, @Body() createAbsensiKelasDto: CreateAbsensiKelasDto) {
        return this.absensiService.createAbsensiKelas(kelasId, createAbsensiKelasDto);
    }

    @Get('statistik')
    async getStatistikAbsensi(
    @Query() query: AbsensiStatistikQueryDto,    
    @GetUser() user: any
    ): Promise<AbsensiStatistikResponse> {
        try {
        const statistik = await this.absensiService.getAbsensiStatistik(query, user);
        return statistik;
        } catch (error) {
        throw new BadRequestException('Gagal mengambil statistik absensi: ' + error.message);
        }
    }
}