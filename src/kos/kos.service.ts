import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateKoDto } from './dto/create-ko.dto';
import { UpdateKoDto } from './dto/update-ko.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class KosService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createKoDto: CreateKoDto) {
    const owner = await this.prisma.user.findUnique({
      where: { id: createKoDto.ownerId },
    });

    if (!owner) {
      throw new NotFoundException(
        `Owner with ID ${createKoDto.ownerId} not found`,
      );
    }

    return this.prisma.kos.create({
      data: createKoDto,
    });
  }

  async findAll() {
    return this.prisma.kos.findMany({
      include: {
        facilities: true,
        rooms: true,
        reviews: true,
      },
    });
  }

  async findOne(id: number) {
    const kos = await this.prisma.kos.findUnique({
      where: { id },
      include: {
        facilities: true,
        rooms: true,
        reviews: true,
      },
    });

    if (!kos) {
      throw new NotFoundException(`Kos with ID ${id} not found`);
    }

    return kos;
  }

  async update(id: number, updateKoDto: UpdateKoDto) {
    await this.findOne(id);

    return this.prisma.kos.update({
      where: { id },
      data: updateKoDto,
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    return this.prisma.kos.delete({
      where: { id },
    });
  }
}
