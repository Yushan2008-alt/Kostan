import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { PrismaService } from '../prisma/prisma.service';
import { BookingStatus } from '../generated/prisma/enums';

@Injectable()
export class BookingService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createBookingDto: CreateBookingDto) {
    const room = await this.prisma.room.findUnique({
      where: { id: createBookingDto.roomId },
    });
    if (!room) {
      throw new NotFoundException(`Room with ID ${createBookingDto.roomId} not found`);
    }

    const society = await this.prisma.user.findUnique({
      where: { id: createBookingDto.societyId },
    });
    if (!society) {
      throw new NotFoundException(`Society with ID ${createBookingDto.societyId} not found`);
    }

    return this.prisma.booking.create({
      data: {
        roomId: createBookingDto.roomId,
        societyId: createBookingDto.societyId,
        status: BookingStatus.PENDING,
      },
    });
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
