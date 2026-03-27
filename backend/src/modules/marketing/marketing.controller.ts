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
import { MarketingService } from './marketing.service';
import {
  CreateMarketingDto,
  UpdateMarketingDto,
  RegistrarMetricasDto,
  MarketingResponseDto,
  PerformanceMarketingDto,
  PlataformaMarketing,
} from './marketing.dto';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { CurrentTenant } from '@/common/decorators';

@Controller('marketing')
@UseGuards(JwtAuthGuard)
export class MarketingController {
  constructor(private marketingService: MarketingService) {}

  /**
   * Listar campanhas com filtro opcional de plataforma
   * GET /marketing?plataforma=instagram&skip=0&take=10
   */
  @Get()
  async findAll(
    @CurrentTenant() tenantId: string,
    @Query('plataforma') plataforma?: PlataformaMarketing,
    @Query('skip', new ParseIntPipe({ optional: true })) skip = 0,
    @Query('take', new ParseIntPipe({ optional: true })) take = 10,
  ): Promise<any> {
    return this.marketingService.findAll(tenantId, { skip, take }, plataforma);
  }

  /**
   * Criar nova campanha
   * POST /marketing
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @CurrentTenant() tenantId: string,
    @Body() createMarketingDto: CreateMarketingDto,
  ): Promise<MarketingResponseDto> {
    return this.marketingService.create(tenantId, createMarketingDto);
  }

  /**
   * Obter campanha por ID
   * GET /marketing/:id
   */
  @Get(':id')
  async findOne(
    @CurrentTenant() tenantId: string,
    @Param('id') id: string,
  ): Promise<MarketingResponseDto> {
    return this.marketingService.findOne(tenantId, id);
  }

  /**
   * Atualizar campanha
   * PATCH /marketing/:id
   */
  @Patch(':id')
  async update(
    @CurrentTenant() tenantId: string,
    @Param('id') id: string,
    @Body() updateMarketingDto: UpdateMarketingDto,
  ): Promise<MarketingResponseDto> {
    return this.marketingService.update(tenantId, id, updateMarketingDto);
  }

  /**
   * Deletar campanha
   * DELETE /marketing/:id
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(
    @CurrentTenant() tenantId: string,
    @Param('id') id: string,
  ): Promise<void> {
    await this.marketingService.delete(tenantId, id);
  }

  /**
   * Registrar métricas da campanha
   * POST /marketing/:id/metricas
   */
  @Post(':id/metricas')
  async registrarMetricas(
    @CurrentTenant() tenantId: string,
    @Param('id') id: string,
    @Body() registrarMetricasDto: RegistrarMetricasDto,
  ): Promise<MarketingResponseDto> {
    return this.marketingService.registrarMetricas(
      tenantId,
      id,
      registrarMetricasDto,
    );
  }

  /**
   * Obter performance por plataforma
   * GET /marketing/performance/por-plataforma
   */
  @Get('performance/por-plataforma')
  async obterPerformancePorPlataforma(
    @CurrentTenant() tenantId: string,
  ): Promise<any[]> {
    return this.marketingService.obterPerformancePorPlataforma(tenantId);
  }
}
