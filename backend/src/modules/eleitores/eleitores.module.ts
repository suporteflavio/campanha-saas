import { Module } from '@nestjs/common';
import { EleitoresController } from './eleitores.controller';
import { EleitoresService } from './eleitores.service';
import { PrismaModule } from '@/common/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [EleitoresController],
  providers: [EleitoresService],
})
export class EleitoresModule {}
