// kos.controller.ts
import { Body, Controller, Get, Post, Query, Req, UseGuards } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { GenderType, Role } from '../generated/prisma/enums';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CreateKoDto } from './dto/create-ko.dto';
import { KosService } from './kos.service';
import { Request } from 'express';

type AuthenticatedRequest = Request & {
  user: {
    id: number;
    email: string;
    role: Role;
  };
};

@Controller('kos')
export class KosController {
  constructor(
    private prisma: PrismaService,
    private readonly kosService: KosService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.OWNER)
  async createKos(
    @Body() body: Omit<CreateKoDto, 'ownerId'>,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.kosService.create({
      ...body,
      ownerId: req.user.id,
    });
  }

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
