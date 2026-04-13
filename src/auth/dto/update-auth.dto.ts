import { PartialType } from '@nestjs/mapped-types';
import {
  IsEmail,
  IsOptional,
  IsString,
  MinLength,
  MaxLength,
} from 'class-validator';
import { CreateAuthDto } from './create-auth.dto';

export class UpdateAuthDto extends PartialType(CreateAuthDto) {
  @IsOptional()
  @IsEmail({}, { message: 'Email harus dalam format yang valid' })
  email?: string;

  @IsOptional()
  @IsString({ message: 'Nama harus berupa string' })
  @MinLength(2, { message: 'Nama minimal 2 karakter' })
  @MaxLength(50, { message: 'Nama maksimal 50 karakter' })
  name?: string;
}
