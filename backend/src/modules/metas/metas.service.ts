import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/common/prisma/prisma.service';

interface CreateMetaDto {
  municipio: string;
  votosNecessarios: number;
  votosAtual?: number;
  historico?: string;
  simulacao?: string;
}

interface UpdateMetaDto {
  municipio?: string;
  votosNecessarios?: number;
  votosAtual?: number;
  historico?: string;
  simulacao?: string;
}

interface DadosSimulacao {
  cenario: string;
  votosProjetados: number;
  percentualCrescimento: number;
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
        ...data,
        tenantId,
        votosAtual: data.votosAtual || 0,
      },
    });
  }

  /**
   * Listar todas as metas
   */
  async findAll(
    tenantId: string,
    skip: number = 0,
    take: number = 10,
  ) {
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

    return await this.prisma.meta.update({
      where: { id },
      data,
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
    dados: DadosSimulacao,
  ) {
    const meta = await this.findOne(tenantId, id);

    const simulacao = {
      cenario: dados.cenario,
      votosProjetados: dados.votosProjetados,
      percentualCrescimento: dados.percentualCrescimento,
      diferencaParaMeta: meta.votosNecessarios - dados.votosProjetados,
      dataCalculo: new Date(),
    };

    // Atualizar campo simulacao com JSON
    return await this.prisma.meta.update({
      where: { id },
      data: { simulacao: JSON.stringify(simulacao) },
    });
  }
}
