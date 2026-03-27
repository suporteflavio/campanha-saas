import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { CreateAttendanceDto } from './attendance.dto';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { CurrentTenant } from '@/common/decorators';

@Controller('attendance')
@UseGuards(JwtAuthGuard)
export class AttendanceController {
  constructor(private attendanceService: AttendanceService) {}

  @Post('registrar')
  async registrar(
    @CurrentTenant() tenantId: string,
    @Body() payload: CreateAttendanceDto,
  ) {
    return this.attendanceService.registrarPresenca(payload.reuniaoId, payload);
  }

  @Get('reuniao/:reuniaoId')
  async listarReuniao(
    @CurrentTenant() tenantId: string,
    @Param('reuniaoId') reuniaoId: string,
    @Query('valida') valida?: string,
    @Query('nomeVotante') nomeVotante?: string,
    @Query('interesse') interesse?: string,
  ) {
    const filter: any = {};
    if (valida !== undefined) {
      filter.valida = valida === 'true';
    }
    if (nomeVotante) filter.nomeVotante = nomeVotante;
    if (interesse) filter.interesse = interesse;

    return this.attendanceService.listarPresentes(reuniaoId, filter);
  }

  @Get('validadas/:reuniaoId')
  async listarValidadas(
    @CurrentTenant() tenantId: string,
    @Param('reuniaoId') reuniaoId: string,
  ) {
    return this.attendanceService.listarPresentesValidadas(reuniaoId);
  }
}
