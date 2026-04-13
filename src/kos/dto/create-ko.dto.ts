import { GenderType } from '../../generated/prisma/enums';

export class CreateKoDto {
  name: string;
  ownerId: number;
  gender: GenderType;
  description?: string;
  isReady?: boolean;
}
