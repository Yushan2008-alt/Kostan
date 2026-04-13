// auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Role } from '../generated/prisma/enums';
import * as bcrypt from 'bcrypt';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  create(createAuthDto: CreateAuthDto) {
    return this.register(createAuthDto, Role.SOCIETY);
  }

  registerSociety(createAuthDto: CreateAuthDto) {
    return this.register(createAuthDto, Role.SOCIETY);
  }

  registerOwner(createAuthDto: CreateAuthDto) {
    return this.register(createAuthDto, Role.OWNER);
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
  async register(
    data: { email: string; password: string; name: string },
    role: Role,
  ) {
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

  async login(data: LoginAuthDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isValid = await bcrypt.compare(data.password, user.password);
    if (!isValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    return {
      access_token: await this.jwtService.signAsync(payload),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  }

  // Petugas (Owner) dapat update data owner
  async updateProfile(userId: number, data: { name?: string; email?: string }) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { name: data.name, email: data.email },
    });
  }
}
