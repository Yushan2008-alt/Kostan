// booking.controller.ts
import { Controller, Get, Post, Patch, Param, Body, Query, Req } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { BookingStatus } from '../generated/prisma/enums';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';

@Controller('bookings')
export class BookingController {
  constructor(private prisma: PrismaService) {}

  // Pembuatan Booking (diperlukan agar nota bisa dicetak)
  @Post()
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
  async updateStatus(
    @Param('id') id: string,
    @Body() body: UpdateBookingDto,
  ) {
    return this.prisma.booking.update({
      where: { id: parseInt(id) },
      data: { status: body.status },
    });
  }

  // Owner dapat melihat histori transaksi berdasarkan tanggal dan bulan
  @Get('history')
  async getHistory(
    @Query('month') month: string,
    @Query('year') year: string,
  ) {
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