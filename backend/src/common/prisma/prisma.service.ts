import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient {
  constructor() {
    super({
      datasources: {
        db: {
          url: process.env.DATABASE_URL,
        },
      },
    });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  // Set tenant context for RLS
  setTenantContext(tenantId: string, userId?: string) {
    return this.$executeRawUnsafe(
      `SET app.tenant_id = '${tenantId}'`,
    );
  }
}
