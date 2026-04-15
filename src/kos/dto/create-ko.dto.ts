import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { GenderType } from '../../generated/prisma/enums';

export class CreateKoDto {
  @IsString({ message: 'Nama kos harus berupa string' })
  @IsNotEmpty({ message: 'Nama kos tidak boleh kosong' })
  @MinLength(3, { message: 'Nama kos minimal 3 karakter' })
  @MaxLength(100, { message: 'Nama kos maksimal 100 karakter' })
  name!: string;

  @IsNumber({}, { message: 'Owner ID harus berupa angka' })
  @IsPositive({ message: 'Owner ID harus positif' })
  @IsNotEmpty({ message: 'Owner ID tidak boleh kosong' })
  ownerId!: number;

  @IsEnum(GenderType, { message: 'Gender harus PUTRA, PUTRI, atau CAMPUR' })
  @IsNotEmpty({ message: 'Gender tidak boleh kosong' })
  gender!: GenderType;

  @IsOptional()
  @IsString({ message: 'Deskripsi harus berupa string' })
  @MaxLength(500, { message: 'Deskripsi maksimal 500 karakter' })
  description?: string;

  @IsOptional()
  isReady?: boolean;
}
