import { Module } from '@nestjs/common';
import { InteligenciaService } from './inteligencia.service';
import { InteligenciaController } from './inteligencia.controller';
import { PrismaModule } from '@/common/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [InteligenciaController],
  providers: [InteligenciaService],
  exports: [InteligenciaService],
})
export class InteligenciaModule {}
