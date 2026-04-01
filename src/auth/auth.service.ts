// auth.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Role } from '../generated/prisma/enums';
import * as bcrypt from 'bcrypt';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  create(createAuthDto: CreateAuthDto) {
    return this.register(createAuthDto, Role.SOCIETY);
  }

  findAll() {
    return this.prisma.user.findMany();
  }

  findOne(id: number) {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return this.prisma.user.update({
      where: { id },
      data: updateAuthDto,
    });
  }

  remove(id: number) {
    return this.prisma.user.delete({
      where: { id },
    });
  }

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
