import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let service: AuthService;
  const prismaMock = {
    user: {
      create: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService, { provide: PrismaService, useValue: prismaMock }],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should register owner with OWNER role', async () => {
    prismaMock.user.create.mockResolvedValue({ id: 1 });

    await service.registerOwner({
      email: 'owner@mail.com',
      password: 'secret',
      name: 'Owner',
    });

    expect(prismaMock.user.create).toHaveBeenCalled();
    const callArg = prismaMock.user.create.mock.calls[0][0];
    expect(callArg.data.role).toBe('OWNER');
  });

  it('should return user data on successful login', async () => {
    prismaMock.user.findUnique.mockResolvedValue({
      id: 1,
      email: 'user@mail.com',
      password: await bcrypt.hash('secret', 10),
      name: 'User',
      role: 'SOCIETY',
    });

    const result = await service.login({
      email: 'user@mail.com',
      password: 'secret',
    });

    expect(result).toEqual({
      user: {
        id: 1,
        email: 'user@mail.com',
        name: 'User',
        role: 'SOCIETY',
      },
    });
  });

  it('should throw UnauthorizedException for invalid login', async () => {
    prismaMock.user.findUnique.mockResolvedValue(null);

    await expect(
      service.login({ email: 'none@mail.com', password: 'wrong' }),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });
});
