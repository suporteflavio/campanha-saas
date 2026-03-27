import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/common/prisma/prisma.service';

interface CreateMetaDto {
  municipio?: string;
  votosNecessarios?: number;
  metaVotos?: number;
  votosAtual?: number;
  historico?: string;
  simulacao?: string;
  secao?: string;
  observacoes?: string;
}

interface UpdateMetaDto {
  municipio?: string;
  votosNecessarios?: number;
  metaVotos?: number;
  votosAtual?: number;
  historico?: string;
  simulacao?: string;
  secao?: string;
  observacoes?: string;
}

@Injectable()
export class MetasService {
  constructor(private prisma: PrismaService) {}

  /**
   * Criar meta de votos para um município
   */
  async create(tenantId: string, data: CreateMetaDto) {
    return await this.prisma.meta.create({
      data: {
        municipio: data.municipio || '',
        votosNecessarios: data.votosNecessarios ?? data.metaVotos ?? 0,
        votosAtual: data.votosAtual || 0,
        historico: data.historico,
        simulacao: data.simulacao,
        tenantId,
      },
    });
  }

  /**
   * Listar todas as metas
   */
  async findAll(
    tenantId: string,
    pagination: { skip?: number; take?: number } = {},
  ) {
    const { skip = 0, take = 10 } = pagination;
    const [data, total] = await Promise.all([
      this.prisma.meta.findMany({
        where: { tenantId },
        skip,
        take,
        orderBy: { criadoEm: 'desc' },
      }),
      this.prisma.meta.count({ where: { tenantId } }),
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
   * Buscar meta específica por ID
   */
  async findOne(tenantId: string, id: string) {
    const meta = await this.prisma.meta.findFirst({
      where: { id, tenantId },
    });

    if (!meta) {
      throw new NotFoundException(
        `Meta com ID ${id} não encontrada`,
      );
    }

    return meta;
  }

  /**
   * Atualizar meta
   */
  async update(
    tenantId: string,
    id: string,
    data: UpdateMetaDto,
  ) {
    await this.findOne(tenantId, id);

    const updateData: any = {};
    if (data.municipio !== undefined) updateData.municipio = data.municipio;
    if (data.votosNecessarios !== undefined) updateData.votosNecessarios = data.votosNecessarios;
    if (data.metaVotos !== undefined) updateData.votosNecessarios = data.metaVotos;
    if (data.votosAtual !== undefined) updateData.votosAtual = data.votosAtual;
    if (data.historico !== undefined) updateData.historico = data.historico;
    if (data.simulacao !== undefined) updateData.simulacao = data.simulacao;

    return await this.prisma.meta.update({
      where: { id },
      data: updateData,
    });
  }

  /**
   * Deletar meta
   */
  async delete(tenantId: string, id: string) {
    await this.findOne(tenantId, id);

    return await this.prisma.meta.delete({ where: { id } });
  }

  /**
   * Registrar progresso de votos (incrementar votosAtual)
   */
  async registrarProgresso(
    tenantId: string,
    id: string,
    votos: number,
  ) {
    const meta = await this.findOne(tenantId, id);

    const novoTotal = meta.votosAtual + votos;

    return await this.prisma.meta.update({
      where: { id },
      data: { votosAtual: novoTotal },
    });
  }

  /**
   * Calcular simulação de cenários de votos
   */
  async calcularSimulacao(
    tenantId: string,
    id: string,
    votosProjetados: number,
  ) {
    const meta = await this.findOne(tenantId, id);

    const simulacao = {
      votosProjetados,
      diferencaParaMeta: meta.votosNecessarios - votosProjetados,
      dataCalculo: new Date(),
    };

    // Atualizar campo simulacao com JSON
    return await this.prisma.meta.update({
      where: { id },
      data: { simulacao: JSON.stringify(simulacao) },
    });
  }
}
