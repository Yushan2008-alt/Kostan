import { Test, TestingModule } from '@nestjs/testing';
import { KosService } from './kos.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';
import { GenderType } from '../generated/prisma/enums';

describe('KosService', () => {
  let service: KosService;
  let prisma: {
    user: { findUnique: jest.Mock };
    kos: { create: jest.Mock };
  };

  beforeEach(async () => {
    prisma = {
      user: { findUnique: jest.fn() },
      kos: { create: jest.fn() },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [KosService, { provide: PrismaService, useValue: prisma }],
    }).compile();

    service = module.get<KosService>(KosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should throw when owner does not exist', async () => {
    prisma.user.findUnique.mockResolvedValue(null);

    await expect(
      service.create({
        name: 'Kos Anggrek',
        ownerId: 99,
        gender: GenderType.PUTRI,
      }),
    ).rejects.toThrow(NotFoundException);
  });

  it('should create kos when owner exists', async () => {
    const dto = {
      name: 'Kos Anggrek',
      ownerId: 3,
      gender: GenderType.PUTRI,
      isReady: true,
    };
    prisma.user.findUnique.mockResolvedValue({ id: 3 });
    prisma.kos.create.mockResolvedValue({ id: 11, ...dto });

    const result = await service.create(dto);

    expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { id: 3 } });
    expect(prisma.kos.create).toHaveBeenCalledWith({ data: dto });
    expect(result).toEqual({ id: 11, ...dto });
  });
});
