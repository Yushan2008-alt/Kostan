import { PartialType } from '@nestjs/mapped-types';
import { CreateBookingDto } from './create-booking.dto';
import { BookingStatus } from '@prisma/client';

export class UpdateBookingDto extends PartialType(CreateBookingDto) {
  status?: BookingStatus;
}
