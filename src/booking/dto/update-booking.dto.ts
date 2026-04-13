import { PartialType } from '@nestjs/mapped-types';
import { IsEnum, IsOptional } from 'class-validator';
import { CreateBookingDto } from './create-booking.dto';
import { BookingStatus } from '../../generated/prisma/enums';

export class UpdateBookingDto extends PartialType(CreateBookingDto) {
  @IsOptional()
  @IsEnum(BookingStatus, { message: 'Status booking tidak valid' })
  status?: BookingStatus;
}
