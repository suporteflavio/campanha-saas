import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { CompetitorsService } from './competitors.service';
import { CreateCompetitorDto, UpdateCompetitorDto } from './competitors.dto';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { CurrentTenant } from '@/common/decorators';

@Controller('competitors')
@UseGuards(JwtAuthGuard)
export class CompetitorsController {
  constructor(private competitorsService: CompetitorsService) {}

  @Post()
  async create(
    @CurrentTenant() tenantId: string,
    @Body() dto: CreateCompetitorDto,
  ) {
    return this.competitorsService.create(tenantId, dto);
  }

  @Get()
  async findAll(
    @CurrentTenant() tenantId: string,
    @Query('partido') partido?: string,
    @Query('cargo') cargoPretendido?: string,
  ) {
    return this.competitorsService.findAll(tenantId, {
      partido,
      cargoPretendido,
    });
  }

  @Get('analise/comparacao')
  async comparacao(
    @CurrentTenant() tenantId: string,
    @Query('votosEstimados', new ParseIntPipe({ optional: true })) votosEstimados = 0,
  ) {
    return this.competitorsService.compararComCandidato(tenantId, votosEstimados);
  }

  @Get(':id')
  async findOne(
    @CurrentTenant() tenantId: string,
    @Param('id') id: string,
  ) {
    return this.competitorsService.findOne(tenantId, id);
  }

  @Patch(':id')
  async update(
    @CurrentTenant() tenantId: string,
    @Param('id') id: string,
    @Body() dto: UpdateCompetitorDto,
  ) {
    return this.competitorsService.update(tenantId, id, dto);
  }

  @Delete(':id')
  async delete(
    @CurrentTenant() tenantId: string,
    @Param('id') id: string,
  ) {
    return this.competitorsService.delete(tenantId, id);
  }
}
