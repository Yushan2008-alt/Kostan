import { PartialType } from '@nestjs/mapped-types';
import { CreateKoDto } from './create-ko.dto';

export class UpdateKoDto extends PartialType(CreateKoDto) {}
