import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
} from '@nestjs/common';
import { DemandasService } from './demandas.service';
import {
  CreateDemandasDto,
  UpdateDemandasDto,
  AtualizarStatusDemandasDto,
  DemandasResponseDto,
  EstatisticasDemandasDto,
  StatusDemanda,
  PrioridadeDemanda,
} from './demandas.dto';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { CurrentTenant } from '@/common/decorators';

@Controller('demandas')
@UseGuards(JwtAuthGuard)
export class DemandasController {
  constructor(private demandasService: DemandasService) {}

  /**
   * Listar demandas com filtros opcionais
   * GET /demandas?status=aberta&prioridade=alta&skip=0&take=10
   */
  @Get()
  async findAll(
    @CurrentTenant() tenantId: string,
    @Query('status') status?: StatusDemanda,
    @Query('prioridade') prioridade?: PrioridadeDemanda,
    @Query('skip', new ParseIntPipe({ optional: true })) skip = 0,
    @Query('take', new ParseIntPipe({ optional: true })) take = 10,
  ): Promise<any> {
    return this.demandasService.findAll(
      tenantId,
      { skip, take },
      status,
      prioridade,
    );
  }

  /**
   * Criar nova demanda
   * POST /demandas
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @CurrentTenant() tenantId: string,
    @Body() createDemandasDto: CreateDemandasDto,
  ): Promise<DemandasResponseDto> {
    return this.demandasService.create(tenantId, createDemandasDto);
  }

  /**
   * Obter demanda por ID
   * GET /demandas/:id
   */
  @Get(':id')
  async findOne(
    @CurrentTenant() tenantId: string,
    @Param('id') id: string,
  ): Promise<DemandasResponseDto> {
    return this.demandasService.findOne(tenantId, id);
  }

  /**
   * Atualizar demanda
   * PATCH /demandas/:id
   */
  @Patch(':id')
  async update(
    @CurrentTenant() tenantId: string,
    @Param('id') id: string,
    @Body() updateDemandasDto: UpdateDemandasDto,
  ): Promise<DemandasResponseDto> {
    return this.demandasService.update(tenantId, id, updateDemandasDto);
  }

  /**
   * Deletar demanda
   * DELETE /demandas/:id
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(
    @CurrentTenant() tenantId: string,
    @Param('id') id: string,
  ): Promise<void> {
    await this.demandasService.delete(tenantId, id);
  }

  /**
   * Atualizar status da demanda
   * PATCH /demandas/:id/status
   */
  @Patch(':id/status')
  async atualizarStatus(
    @CurrentTenant() tenantId: string,
    @Param('id') id: string,
    @Body() atualizarStatusDto: AtualizarStatusDemandasDto,
  ): Promise<DemandasResponseDto> {
    return this.demandasService.atualizarStatus(
      tenantId,
      id,
      atualizarStatusDto.status,
    );
  }

  /**
   * Obter estatísticas de demandas
   * GET /demandas/estatisticas
   */
  @Get('estatisticas')
  async obterEstatisticas(
    @CurrentTenant() tenantId: string,
  ): Promise<EstatisticasDemandasDto> {
    return this.demandasService.obterEstatisticas(tenantId);
  }
}
