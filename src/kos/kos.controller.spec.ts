import { Test, TestingModule } from '@nestjs/testing';
import { KosController } from './kos.controller';
import { KosService } from './kos.service';
import { PrismaService } from '../prisma/prisma.service';
import { GenderType, Role } from '../generated/prisma/enums';

describe('KosController', () => {
  let controller: KosController;
  let kosService: { create: jest.Mock };

  beforeEach(async () => {
    kosService = { create: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [KosController],
      providers: [
        { provide: KosService, useValue: kosService },
        { provide: PrismaService, useValue: { kos: { findMany: jest.fn() } } },
      ],
    }).compile();

    controller = module.get<KosController>(KosController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create kos using owner id from jwt user', async () => {
    const payload = {
      name: 'Kos Melati',
      gender: GenderType.CAMPUR,
      description: 'Dekat kampus',
      isReady: true,
    };
    const req = { user: { id: 7, email: 'owner@mail.com', role: Role.OWNER } };
    kosService.create.mockResolvedValue({ id: 1, ownerId: 7, ...payload });

    const result = await controller.createKos(payload, req);

    expect(kosService.create).toHaveBeenCalledWith({
      ...payload,
      ownerId: 7,
    });
    expect(result).toEqual({ id: 1, ownerId: 7, ...payload });
  });
});
