import { Request } from 'express';
import { Role } from '../../generated/prisma/enums';

export type AuthenticatedRequest = Request & {
  user: {
    id: number;
    email: string;
    role: Role;
  };
};
