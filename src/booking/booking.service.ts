import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { PrismaService } from '../prisma/prisma.service';
import { BookingStatus } from '../generated/prisma/enums';

@Injectable()
export class BookingService {
  constructor(private readonly prisma: PrismaService) {}

  async create(roomId: number, societyId: number) {
    const room = await this.prisma.room.findUnique({
      where: { id: roomId },
    });
    if (!room) {
      throw new NotFoundException(`Room with ID ${roomId} not found`);
    }
    if (!room.isAvailable) {
      throw new BadRequestException(`Room with ID ${roomId} is not available`);
    }

    const society = await this.prisma.user.findUnique({
      where: { id: societyId },
    });
    if (!society) {
      throw new NotFoundException(`Society with ID ${societyId} not found`);
    }

    const [booking] = await this.prisma.$transaction([
      this.prisma.booking.create({
        data: {
          roomId,
          societyId,
          status: BookingStatus.PENDING,
        },
      }),
      this.prisma.room.update({
        where: { id: roomId },
        data: { isAvailable: false },
      }),
    ]);

    return booking;
  }

  async findAll() {
    return this.prisma.booking.findMany({
      include: {
        room: true,
        society: true,
      },
    });
  }

  async findOne(id: number) {
    const booking = await this.prisma.booking.findUnique({
      where: { id },
      include: {
        room: true,
        society: true,
      },
    });

    if (!booking) {
      throw new NotFoundException(`Booking with ID ${id} not found`);
    }

    return booking;
  }

  async update(id: number, updateBookingDto: UpdateBookingDto) {
    await this.findOne(id);

    return this.prisma.booking.update({
      where: { id },
      data: updateBookingDto,
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    return this.prisma.booking.delete({
      where: { id },
    });
  }
}
