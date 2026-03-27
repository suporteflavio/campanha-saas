import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { InteligenciaService } from './inteligencia.service';

@Controller('inteligencia')
export class InteligenciaController {
  constructor(private readonly inteligenciaService: InteligenciaService) {}

  /**
   * Gerar previsao de votos
   */
  @Post(':tenantId/previsao')
  async gerarPrevisao(
    @Param('tenantId') tenantId: string,
    @Body()
    dados: {
      votosM1: number;
      votosM2: number;
      votosM3: number;
      tendenciaPercentual: number;
    },
  ) {
    return await this.inteligenciaService.gerarPrevisao(tenantId, dados);
  }

  /**
   * Analisar segmentacao de eleitores
   */
  @Get(':tenantId/segmentacao')
  async analisarSegmentacao(@Param('tenantId') tenantId: string) {
    return await this.inteligenciaService.analisarSegmentacao(tenantId);
  }

  /**
   * Gerar alertas automaticos
   */
  @Get(':tenantId/alertas')
  async gerarAlertas(@Param('tenantId') tenantId: string) {
    return await this.inteligenciaService.gerarAlertas(tenantId);
  }

  /**
   * Obter recomendacoes de otimizacao
   */
  @Get(':tenantId/recomendacoes')
  async obterRecomendacoes(@Param('tenantId') tenantId: string) {
    return await this.inteligenciaService.obterRecomendacoes(tenantId);
  }
}