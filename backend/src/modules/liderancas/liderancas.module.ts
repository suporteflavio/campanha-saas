import { Module } from '@nestjs/common';
import { LiderancasController } from './liderancas.controller';
import { LiderancasService } from './liderancas.service';
import { PrismaModule } from '@/common/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [LiderancasController],
  providers: [LiderancasService],
})
export class LiderancasModule {}
