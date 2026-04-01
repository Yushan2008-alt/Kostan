import { Injectable, OnModuleInit, INestApplication } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

/**
 * A lightweight wrapper around PrismaClient.  We extend
 * PrismaClient so that we can inject the service anywhere and
 * still call `this.prisma.<model>` directly (e.g. `this.prisma.booking.create`).
 *
 * The generated service from the Nest CLI is just a placeholder with
 * CRUD stubs, so the controller code would have broken at compile-time
 * because `booking`/`kos` etc. didn't exist on the type.
 */

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }

  async enableShutdownHooks(app: INestApplication) {
    this.$on('beforeExit' as never, async () => {
      await app.close();
    });
  }
}
