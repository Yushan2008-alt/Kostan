// review.controller.ts
import {
  Controller,
  Post,
  Body,
  Patch,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ReviewService } from './review.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../generated/prisma/enums';

@Controller('reviews')
export class ReviewController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly reviewService: ReviewService,
  ) {}

  // Society dapat menambahkan komentar
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SOCIETY)
  @Post()
  async addReview(
    @Body() body: CreateReviewDto,
    @Req() req: { user: { id: number } },
  ) {
    return this.reviewService.create(body, req.user.id);
  }

  // Owner dapat membalas reviews dari society
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.OWNER)
  @Patch(':id/reply')
  async replyReview(@Param('id') id: string, @Body() body: { reply: string }) {
    return this.prisma.review.update({
      where: { id: parseInt(id) },
      data: { reply: body.reply },
    });
  }
}
