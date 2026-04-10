import { Test, TestingModule } from '@nestjs/testing';
import { KosService } from './kos.service';
import { PrismaService } from '../prisma/prisma.service';

describe('KosService', () => {
  let service: KosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [KosService, { provide: PrismaService, useValue: {} }],
    }).compile();

    service = module.get<KosService>(KosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
