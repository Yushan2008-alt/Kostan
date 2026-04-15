import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateReviewDto {
  @IsString({ message: 'Komentar harus berupa string' })
  @IsNotEmpty({ message: 'Komentar tidak boleh kosong' })
  @MinLength(10, { message: 'Komentar minimal 10 karakter' })
  @MaxLength(500, { message: 'Komentar maksimal 500 karakter' })
  comment!: string;

  @IsNumber({}, { message: 'Kos ID harus berupa angka' })
  @IsPositive({ message: 'Kos ID harus positif' })
  @IsNotEmpty({ message: 'Kos ID tidak boleh kosong' })
  kosId!: number;

  @IsOptional()
  @IsString({ message: 'Balasan harus berupa string' })
  @MaxLength(500, { message: 'Balasan maksimal 500 karakter' })
  reply?: string;
}
