import { Module } from '@nestjs/common';
import { RootAdminController } from './root-admin.controller';
import { RootAdminService } from './root-admin.service';
import { PrismaModule } from '@/common/prisma/prisma.module';
import { RootGuard } from './root.guard';

@Module({
  imports: [PrismaModule],
  controllers: [RootAdminController],
  providers: [RootAdminService, RootGuard],
})
export class RootAdminModule {}
