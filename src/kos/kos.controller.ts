// kos.controller.ts
import { Controller, Get, Query } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { GenderType } from '../generated/prisma/enums';

@Controller('kos')
export class KosController {
  constructor(private prisma: PrismaService) {}

  // Society dapat melihat daftar kos yang siap dihuni & memfilter gender
  @Get()
  async getKoses(@Query('gender') gender?: GenderType) {
    const filter: any = { isReady: true }; // Hanya yang siap dihuni

    if (gender) {
      filter.gender = gender; // Filter PUTRA / PUTRI / CAMPUR
    }

    return this.prisma.kos.findMany({
      where: filter,
      include: {
        facilities: true,
        rooms: { where: { isAvailable: true } },
      },
    });
  }
}
