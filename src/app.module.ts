import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { KosModule } from './kos/kos.module';
import { ReviewModule } from './review/review.module';
import { BookingModule } from './booking/booking.module';

@Module({
  imports: [AuthModule, PrismaModule, KosModule, ReviewModule, BookingModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
