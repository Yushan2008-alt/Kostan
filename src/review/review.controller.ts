// review.controller.ts
import { Controller, Post, Body, Patch, Param, Req, UseGuards } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
// import { RolesGuard, Roles } from '../auth/roles'; // Asumsi Custom Guard

@Controller('reviews')
export class ReviewController {
  constructor(private prisma: PrismaService) {}

  // Society dapat menambahkan komentar
  // @Roles('SOCIETY')
  @Post()
  async addReview(@Body() body: { kosId: number; comment: string }, @Req() req: any) {
    return this.prisma.review.create({
      data: {
        comment: body.comment,
        kosId: body.kosId,
        societyId: req.user.id, // ID didapat dari JWT token
      },
    });
  }

  // Owner dapat membalas reviews dari society
  // @Roles('OWNER')
  @Patch(':id/reply')
  async replyReview(@Param('id') id: string, @Body() body: { reply: string }) {
    return this.prisma.review.update({
      where: { id: parseInt(id) },
      data: { reply: body.reply },
    });
  }
}