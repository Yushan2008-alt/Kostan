import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;
  const authServiceMock = {
    create: jest.fn(),
    registerSociety: jest.fn(),
    registerOwner: jest.fn(),
    login: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: authServiceMock }],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call registerOwner', async () => {
    const payload = { email: 'owner@mail.com', password: 'secret', name: 'Owner' };
    await controller.registerOwner(payload);
    expect(authServiceMock.registerOwner).toHaveBeenCalledWith(payload);
  });

  it('should call login', async () => {
    const payload = { email: 'user@mail.com', password: 'secret' };
    await controller.login(payload);
    expect(authServiceMock.login).toHaveBeenCalledWith(payload);
  });

  it('should call registerSociety', async () => {
    const payload = { email: 'society@mail.com', password: 'secret', name: 'Society' };
    await controller.registerSociety(payload);
    expect(authServiceMock.registerSociety).toHaveBeenCalledWith(payload);
  });
});
