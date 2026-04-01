import { Test, TestingModule } from '@nestjs/testing';
import { KosController } from './kos.controller';
import { KosService } from './kos.service';
import { PrismaService } from '../prisma/prisma.service';

describe('KosController', () => {
  let controller: KosController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [KosController],
      providers: [KosService, { provide: PrismaService, useValue: {} }],
    }).compile();

    controller = module.get<KosController>(KosController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
