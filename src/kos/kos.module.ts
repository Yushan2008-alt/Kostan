import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { KosService } from './kos.service';
import { KosController } from './kos.controller';

@Module({
  imports: [PrismaModule],
  controllers: [KosController],
  providers: [KosService],
})
export class KosModule {}
