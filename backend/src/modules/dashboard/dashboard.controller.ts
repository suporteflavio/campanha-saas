import {
  Controller,
  Get,
  UseGuards,
} from '@nestjs/common';
import { DashboardService } from './dashboard.service';

import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { CurrentTenant } from '@/common/decorators';

@Controller('dashboard')
@UseGuards(JwtAuthGuard)
export class DashboardController {
  constructor(private dashboardService: DashboardService) {}

  /**
   * Obter resumo geral do dashboard
   * Inclui: total eleitores, lideranças, reuniões, votos projetados, demandas abertas, saldo financeiro
   * GET /dashboard/resumo
   */
  @Get('resumo')
  async getResumo(
    @CurrentTenant() tenantId: string,
  ): Promise<any> {
    return this.dashboardService.getResumo(tenantId);
  }

  /**
   * Obter métricas detalhadas
   * Inclui: eleitores por município, segmentação, percentual de meta
   * GET /dashboard/metricas
   */
  @Get('metricas')
  async getMetricas(
    @CurrentTenant() tenantId: string,
  ): Promise<any> {
    return this.dashboardService.getMetricas(tenantId);
  }

  /**
   * Obter timeline de eventos
   * Reuniões e eventos dos próximos 30 dias
   * GET /dashboard/timeline
   */
  @Get('timeline')
  async getTimeline(
    @CurrentTenant() tenantId: string,
  ): Promise<any> {
    return this.dashboardService.getTimeline(tenantId);
  }

  /**
   * Obter alertas do sistema
   * Alertas de: metas não atingidas, demandas vencidas, reuniões próximas
   * GET /dashboard/alertas
   */
  @Get('alertas')
  async getAlertas(
    @CurrentTenant() tenantId: string,
  ): Promise<any> {
    return this.dashboardService.getAlertas(tenantId);
  }
}
