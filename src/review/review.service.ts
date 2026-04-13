import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ReviewService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createReviewDto: CreateReviewDto, societyId: number) {
    const kos = await this.prisma.kos.findUnique({
      where: { id: createReviewDto.kosId },
    });
    if (!kos) {
      throw new NotFoundException(
        `Kos with ID ${createReviewDto.kosId} not found`,
      );
    }

    const society = await this.prisma.user.findUnique({
      where: { id: societyId },
    });
    if (!society) {
      throw new NotFoundException(`Society with ID ${societyId} not found`);
    }

    return this.prisma.review.create({
      data: {
        comment: createReviewDto.comment,
        kosId: createReviewDto.kosId,
        societyId,
        reply: createReviewDto.reply,
      },
    });
  }

  async findAll() {
    return this.prisma.review.findMany({
      include: {
        kos: true,
        society: true,
      },
    });
  }

  async findOne(id: number) {
    const review = await this.prisma.review.findUnique({
      where: { id },
      include: {
        kos: true,
        society: true,
      },
    });

    if (!review) {
      throw new NotFoundException(`Review with ID ${id} not found`);
    }

    return review;
  }

  async update(id: number, updateReviewDto: UpdateReviewDto) {
    await this.findOne(id);

    return this.prisma.review.update({
      where: { id },
      data: updateReviewDto,
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    return this.prisma.review.delete({
      where: { id },
    });
  }
}
