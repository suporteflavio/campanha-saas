import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/common/prisma/prisma.service';

interface CreateCampanhaMarketingDto {
  nome: string;
  plataforma: 'instagram' | 'whatsapp' | 'email' | 'sms' | 'pixel';
  conteudo?: string;
  dataInicio: Date;
  dataFim?: Date;
  status?: 'planejada' | 'ativa' | 'pausada' | 'encerrada';
  alcance?: number;
  engajamento?: number;
}

interface UpdateCampanhaMarketingDto {
  nome?: string;
  plataforma?: 'instagram' | 'whatsapp' | 'email' | 'sms' | 'pixel';
  conteudo?: string;
  dataInicio?: Date;
  dataFim?: Date;
  status?: 'planejada' | 'ativa' | 'pausada' | 'encerrada';
}

interface MetricasCampanha {
  alcance: number;
  engajamento: number;
}

@Injectable()
export class MarketingService {
  constructor(private prisma: PrismaService) {}

  /**
   * Criar campanha de marketing (instagram, whatsapp, email, sms, pixel)
   */
  async create(
    tenantId: string,
    data: CreateCampanhaMarketingDto,
  ) {
    return await this.prisma.campanhaMarketing.create({
      data: {
        ...data,
        tenantId,
      },
    });
  }

  /**
   * Listar campanhas com filtro opcional de plataforma
   */
  async findAll(
    tenantId: string,
    plataforma?: string,
    skip: number = 0,
    take: number = 10,
  ) {
    const where: any = { tenantId };
    if (plataforma) where.plataforma = plataforma;

    const [data, total] = await Promise.all([
      this.prisma.campanhaMarketing.findMany({
        where,
        skip,
        take,
        orderBy: { criadoEm: 'desc' },
      }),
      this.prisma.campanhaMarketing.count({ where }),
    ]);

    return {
      data,
      pagination: {
        total,
        skip,
        take,
        pages: Math.ceil(total / take),
      },
    };
  }

  /**
   * Buscar campanha específica
   */
  async findOne(tenantId: string, id: string) {
    const campanha = await this.prisma.campanhaMarketing.findFirst({
      where: { id, tenantId },
    });

    if (!campanha) {
      throw new NotFoundException(
        `Campanha com ID ${id} não encontrada`,
      );
    }

    return campanha;
  }

  /**
   * Atualizar campanha
   */
  async update(
    tenantId: string,
    id: string,
    data: UpdateCampanhaMarketingDto,
  ) {
    await this.findOne(tenantId, id);

    return await this.prisma.campanhaMarketing.update({
      where: { id },
      data,
    });
  }

  /**
   * Deletar campanha
   */
  async delete(tenantId: string, id: string) {
    await this.findOne(tenantId, id);

    return await this.prisma.campanhaMarketing.delete({
      where: { id },
    });
  }

  /**
   * Registrar métricas de uma campanha (alcance e engajamento)
   */
  async registrarMetricas(
    tenantId: string,
    id: string,
    metricas: MetricasCampanha,
  ) {
    await this.findOne(tenantId, id);

    return await this.prisma.campanhaMarketing.update({
      where: { id },
      data: {
        alcance: metricas.alcance,
        engajamento: metricas.engajamento,
      },
    });
  }

  /**
   * Calcular taxa de engajamento
   */
  async calcularTaxaEngajamento(tenantId: string, id: string) {
    const campanha = await this.findOne(tenantId, id);

    if (campanha.alcance === 0) {
      return 0;
    }

    return ((campanha.engajamento / campanha.alcance) * 100).toFixed(2);
  }

  /**
   * Obter performance por plataforma
   */
  async obterPerformancePorPlataforma(tenantId: string) {
    const campanhas = await this.prisma.campanhaMarketing.findMany({
      where: { tenantId },
    });

    const plataformas: Record<
      string,
      { total: number; alcanceTotal: number; engajamentoTotal: number }
    > = {};

    campanhas.forEach((campanha) => {
      if (!plataformas[campanha.plataforma]) {
        plataformas[campanha.plataforma] = {
          total: 0,
          alcanceTotal: 0,
          engajamentoTotal: 0,
        };
      }
      plataformas[campanha.plataforma].total++;
      plataformas[campanha.plataforma].alcanceTotal += campanha.alcance;
      plataformas[campanha.plataforma].engajamentoTotal +=
        campanha.engajamento;
    });

    return Object.entries(plataformas).map(([plataforma, dados]) => ({
      plataforma,
      campanhas: dados.total,
      alcanceTotal: dados.alcanceTotal,
      engajamentoTotal: dados.engajamentoTotal,
      taxaMedia: dados.alcanceTotal > 0
        ? ((dados.engajamentoTotal / dados.alcanceTotal) * 100).toFixed(2)
        : 0,
    }));
  }
}
