import { Module } from '@nestjs/common';
import { DemandasController } from './demandas.controller';
import { DemandasService } from './demandas.service';
import { PrismaModule } from '@/common/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [DemandasController],
  providers: [DemandasService],
})
export class DemandasModule {}
