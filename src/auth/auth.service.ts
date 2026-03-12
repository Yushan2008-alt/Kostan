// auth.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  // 1. Society & Petugas dapat register
  async register(data: any, role: Role) {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    return this.prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        name: data.name,
        role: role, // SOCIETY atau OWNER
      },
    });
  }

  // Petugas (Owner) dapat update data owner
  async updateProfile(userId: number, data: any) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { name: data.name, email: data.email },
    });
  }
}