import { PartialType } from '@nestjs/mapped-types';
import {
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { CreateKoDto } from './create-ko.dto';
import { GenderType } from '../../generated/prisma/enums';

export class UpdateKoDto extends PartialType(CreateKoDto) {
  @IsOptional()
  @IsString({ message: 'Nama kos harus berupa string' })
  @MinLength(3, { message: 'Nama kos minimal 3 karakter' })
  @MaxLength(100, { message: 'Nama kos maksimal 100 karakter' })
  name?: string;

  @IsOptional()
  @IsEnum(GenderType, { message: 'Gender harus PUTRA, PUTRI, atau CAMPUR' })
  gender?: GenderType;

  @IsOptional()
  @IsString({ message: 'Deskripsi harus berupa string' })
  @MaxLength(500, { message: 'Deskripsi maksimal 500 karakter' })
  description?: string;

  @IsOptional()
  isReady?: boolean;
}
