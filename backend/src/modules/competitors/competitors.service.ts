import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/common/prisma/prisma.service';
import {
  CreateCompetitorDto,
  UpdateCompetitorDto,
} from './competitors.dto';

@Injectable()
export class CompetitorsService {
  constructor(private prisma: PrismaService) {}

  async create(tenantId: string, dto: CreateCompetitorDto) {
    return this.prisma.competitor.create({
      data: {
        tenantId,
        ...dto,
      },
    });
  }

  async findAll(
    tenantId: string,
    filters?: { partido?: string; cargoPretendido?: string },
  ) {
    const where: any = { tenantId };

    if (filters?.partido) {
      where.partido = { contains: filters.partido };
    }
    if (filters?.cargoPretendido) {
      where.cargoPretendido = {
        contains: filters.cargoPretendido,
      };
    }

    return this.prisma.competitor.findMany({ where, orderBy: { criadoEm: 'desc' } });
  }

  async findOne(tenantId: string, id: string) {
    const competitor = await this.prisma.competitor.findFirst({
      where: { id, tenantId },
    });

    if (!competitor) {
      throw new NotFoundException(`Competitor com ID ${id} não encontrado`);
    }

    return competitor;
  }

  async update(tenantId: string, id: string, dto: UpdateCompetitorDto) {
    await this.findOne(tenantId, id);

    return this.prisma.competitor.update({ where: { id }, data: dto });
  }

  async delete(tenantId: string, id: string) {
    await this.findOne(tenantId, id);
    return this.prisma.competitor.delete({ where: { id } });
  }

  async compararComCandidato(tenantId: string, votosEstimados: number) {
    const competitors = await this.prisma.competitor.findMany({ where: { tenantId } });

    const totalVotosAnteriores = competitors.reduce(
      (sum, competitor) => sum + (competitor.votosAnteriores || 0),
      0,
    );

    return {
      candidatoCampanha: {
        votosEstimados,
      },
      sinopse: {
        totalConcorrentes: competitors.length,
        totalVotosAnteriores,
      },
      comparacao: competitors.map((c) => ({
        id: c.id,
        nome: c.nome,
        partido: c.partido,
        votosAnteriores: c.votosAnteriores || 0,
        despesaDeclarada: c.despesaDeclarada || 0,
        gapVotos: votosEstimados - (c.votosAnteriores || 0),
        percentDifference:
          c.votosAnteriores && c.votosAnteriores > 0
            ? Number(((votosEstimados / c.votosAnteriores - 1) * 100).toFixed(2))
            : null,
      })),
    };
  }
}
