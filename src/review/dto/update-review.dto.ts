import { PartialType } from '@nestjs/mapped-types';
import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { CreateReviewDto } from './create-review.dto';

export class UpdateReviewDto extends PartialType(CreateReviewDto) {
  @IsOptional()
  @IsString({ message: 'Komentar harus berupa string' })
  @MinLength(10, { message: 'Komentar minimal 10 karakter' })
  @MaxLength(500, { message: 'Komentar maksimal 500 karakter' })
  comment?: string;

  @IsOptional()
  @IsString({ message: 'Balasan harus berupa string' })
  @MaxLength(500, { message: 'Balasan maksimal 500 karakter' })
  reply?: string;
}
