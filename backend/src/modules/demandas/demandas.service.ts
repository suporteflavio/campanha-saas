import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/common/prisma/prisma.service';

interface CreateDemandaDto {
  titulo?: string;
  descricao?: string;
  prioridade?: string;
  status?: string;
  eleitorId?: string;
  responsavel?: string;
  dataVencimento?: Date;
}

interface UpdateDemandaDto {
  titulo?: string;
  descricao?: string;
  prioridade?: string;
  status?: string;
  responsavel?: string;
  dataVencimento?: Date;
}

@Injectable()
export class DemandasService {
  constructor(private prisma: PrismaService) {}

  /**
   * Criar nova demanda
   */
  async create(tenantId: string, data: CreateDemandaDto) {
    return await this.prisma.demanda.create({
      data: {
        titulo: data.titulo || '',
        descricao: data.descricao,
        prioridade: data.prioridade || 'media',
        status: data.status || 'aberta',
        eleitorId: data.eleitorId,
        tenantId,
      },
    });
  }

  /**
   * Listar demandas com filtros opcionais
   */
  async findAll(
    tenantId: string,
    pagination: { skip?: number; take?: number } = {},
    status?: 'aberta' | 'em_andamento' | 'resolvida',
    prioridade?: 'baixa' | 'media' | 'alta',
  ) {
    const { skip = 0, take = 10 } = pagination;

    const where: any = { tenantId };
    if (status) where.status = status;
    if (prioridade) where.prioridade = prioridade;

    const [data, total] = await Promise.all([
      this.prisma.demanda.findMany({
        where,
        skip,
        take,
        orderBy: { criadoEm: 'desc' },
      }),
      this.prisma.demanda.count({ where }),
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
   * Buscar demanda específica
   */
  async findOne(tenantId: string, id: string) {
    const demanda = await this.prisma.demanda.findFirst({
      where: { id, tenantId },
    });

    if (!demanda) {
      throw new NotFoundException(
        `Demanda com ID ${id} não encontrada`,
      );
    }

    return demanda;
  }

  /**
   * Atualizar demanda
   */
  async update(
    tenantId: string,
    id: string,
    data: UpdateDemandaDto,
  ) {
    await this.findOne(tenantId, id);

    const updateData: any = {};
    if (data.titulo !== undefined) updateData.titulo = data.titulo;
    if (data.descricao !== undefined) updateData.descricao = data.descricao;
    if (data.prioridade !== undefined) updateData.prioridade = data.prioridade;
    if (data.status !== undefined) updateData.status = data.status;

    return await this.prisma.demanda.update({
      where: { id },
      data: updateData,
    });
  }

  /**
   * Deletar demanda
   */
  async delete(tenantId: string, id: string) {
    await this.findOne(tenantId, id);

    return await this.prisma.demanda.delete({ where: { id } });
  }

  /**
   * Atualizar status da demanda (aberta -> em_andamento -> resolvida)
   */
  async atualizarStatus(
    tenantId: string,
    id: string,
    novoStatus: string,
  ) {
    await this.findOne(tenantId, id);

    return await this.prisma.demanda.update({
      where: { id },
      data: { status: novoStatus },
    });
  }

  /**
   * Obter estatísticas de demandas
   */
  async obterEstatisticas(tenantId: string) {
    const demandas = await this.prisma.demanda.findMany({
      where: { tenantId },
    });

    const total = demandas.length;
    const abertas = demandas.filter((d) => d.status === 'aberta').length;
    const emAndamento = demandas.filter(
      (d) => d.status === 'em_andamento',
    ).length;
    const resolvidas = demandas.filter(
      (d) => d.status === 'resolvida',
    ).length;

    const altas = demandas.filter((d) => d.prioridade === 'alta').length;
    const medias = demandas.filter((d) => d.prioridade === 'media').length;
    const baixas = demandas.filter((d) => d.prioridade === 'baixa').length;

    return {
      total,
      porStatus: { abertas, emAndamento, resolvidas },
      porPrioridade: { altas, medias, baixas },
      percentualResolucao: total > 0 ? (resolvidas / total) * 100 : 0,
    };
  }
}
