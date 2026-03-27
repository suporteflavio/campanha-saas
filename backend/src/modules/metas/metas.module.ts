import { Module } from '@nestjs/common';
import { MetasController } from './metas.controller';
import { MetasService } from './metas.service';
import { PrismaModule } from '@/common/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [MetasController],
  providers: [MetasService],
})
export class MetasModule {}
