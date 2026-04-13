// booking.controller.ts
import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { BookingService } from './booking.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import type { AuthenticatedRequest } from '../auth/types/authenticated-request.type';
import { PrismaService } from '../prisma/prisma.service';
import { Role } from '../generated/prisma/enums';

@Controller('bookings')
export class BookingController {
  constructor(
    private readonly bookingService: BookingService,
    private readonly prisma: PrismaService,
  ) {}

  // Pembuatan Booking (diperlukan agar nota bisa dicetak)
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SOCIETY)
  async createBooking(
    @Body() body: CreateBookingDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.bookingService.create(body.roomId, req.user.id);
  }

  // Society dapat mencetak bukti/nota pemesanan kamar kos
  // Mengambil detail lengkap untuk ditampilkan di frontend (PDF/Cetak)
  @Get(':id/nota')
  async getBookingNota(@Param('id') id: string) {
    return this.prisma.booking.findUnique({
      where: { id: parseInt(id) },
      include: {
        society: { select: { name: true, email: true } },
        room: { include: { kos: true } }, // Membawa data kamar & kos
      },
    });
  }

  // Owner dapat merubah status diterima atau ditolak
  @Patch(':id/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.OWNER)
  async updateStatus(@Param('id') id: string, @Body() body: UpdateBookingDto) {
    return this.prisma.booking.update({
      where: { id: parseInt(id) },
      data: { status: body.status },
    });
  }

  // Owner dapat melihat histori transaksi berdasarkan tanggal dan bulan
  @Get('history')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.OWNER)
  async getHistory(@Query('month') month: string, @Query('year') year: string) {
    const startDate = new Date(parseInt(year), parseInt(month) - 1, 1);
    const endDate = new Date(parseInt(year), parseInt(month), 0); // Hari terakhir bulan tsb

    return this.prisma.booking.findMany({
      where: {
        bookingDate: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: { room: true, society: { select: { name: true } } },
    });
  }
}
