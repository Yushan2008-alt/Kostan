import { Reflector } from '@nestjs/core';
import { ExecutionContext } from '@nestjs/common';
import { RolesGuard } from './roles.guard';
import { Role } from '../../generated/prisma/enums';

describe('RolesGuard', () => {
  const reflectorMock = {
    getAllAndOverride: jest.fn(),
  };
  const makeContext = (role?: Role) =>
    ({
      getHandler: jest.fn(),
      getClass: jest.fn(),
      switchToHttp: () => ({
        getRequest: () => ({ user: role ? { role } : undefined }),
      }),
    }) as unknown as ExecutionContext;

  it('allows when route has no role metadata', () => {
    reflectorMock.getAllAndOverride.mockReturnValue(undefined);
    const guard = new RolesGuard(reflectorMock as unknown as Reflector);
    expect(guard.canActivate(makeContext())).toBe(true);
  });

  it('allows when user has required role', () => {
    reflectorMock.getAllAndOverride.mockReturnValue([Role.OWNER]);
    const guard = new RolesGuard(reflectorMock as unknown as Reflector);
    expect(guard.canActivate(makeContext(Role.OWNER))).toBe(true);
  });

  it('denies when user role does not match', () => {
    reflectorMock.getAllAndOverride.mockReturnValue([Role.OWNER]);
    const guard = new RolesGuard(reflectorMock as unknown as Reflector);
    expect(guard.canActivate(makeContext(Role.SOCIETY))).toBe(false);
  });
});
