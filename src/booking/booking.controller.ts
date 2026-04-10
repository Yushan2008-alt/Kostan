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
import { PrismaService } from '../prisma/prisma.service';
import { BookingStatus, Role } from '../generated/prisma/enums';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('bookings')
export class BookingController {
  constructor(private prisma: PrismaService) {}

  // Pembuatan Booking (diperlukan agar nota bisa dicetak)
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SOCIETY)
  async createBooking(
    @Body() body: CreateBookingDto,
    @Req() req: any /* TODO: strongly type request.user via auth guard */,
  ) {
    return this.prisma.booking.create({
      data: {
        roomId: body.roomId,
        societyId: req.user.id,
        status: BookingStatus.PENDING,
      },
    });
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
