import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/common/prisma/prisma.service';

interface CreateReuniaoDto {
  titulo: string;
  descricao?: string;
  data: Date;
  local?: string;
  tipo?: 'reuniao' | 'evento' | 'carreata';
}

interface UpdateReuniaoDto {
  titulo?: string;
  descricao?: string;
  data?: Date;
  local?: string;
  tipo?: 'reuniao' | 'evento' | 'carreata';
}

@Injectable()
export class ReunioesService {
  constructor(private prisma: PrismaService) {}

  /**
   * Criar uma nova reunião/evento
   */
  async create(tenantId: string, data: CreateReuniaoDto) {
    return await this.prisma.reuniao.create({
      data: {
        ...data,
        tenantId,
      },
    });
  }

  /**
   * Listar reuniões com filtro opcional de mês
   */
  async findAll(
    tenantId: string,
    mes?: number,
    skip: number = 0,
    take: number = 10,
  ) {
    const where: any = { tenantId };

    // Filtrar por mês se fornecido (1-12)
    if (mes && mes >= 1 && mes <= 12) {
      const currentYear = new Date().getFullYear();
      const startDate = new Date(currentYear, mes - 1, 1);
      const endDate = new Date(currentYear, mes, 0);

      where.data = {
        gte: startDate,
        lte: endDate,
      };
    }

    const [data, total] = await Promise.all([
      this.prisma.reuniao.findMany({
        where,
        skip,
        take,
        orderBy: { data: 'desc' },
      }),
      this.prisma.reuniao.count({ where }),
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
   * Buscar reunião específica por ID
   */
  async findOne(tenantId: string, id: string) {
    const reuniao = await this.prisma.reuniao.findFirst({
      where: { id, tenantId },
    });

    if (!reuniao) {
      throw new NotFoundException(
        `Reunião com ID ${id} não encontrada`,
      );
    }

    return reuniao;
  }

  /**
   * Atualizar dados de uma reunião
   */
  async update(
    tenantId: string,
    id: string,
    data: UpdateReuniaoDto,
  ) {
    await this.findOne(tenantId, id);

    return await this.prisma.reuniao.update({
      where: { id },
      data,
    });
  }

  /**
   * Deletar uma reunião
   */
  async delete(tenantId: string, id: string) {
    await this.findOne(tenantId, id);

    return await this.prisma.reuniao.delete({ where: { id } });
  }

  /**
   * Registrar presença em uma reunião (atualizar número de presentes)
   */
  async registrarPresenca(
    tenantId: string,
    id: string,
    presentes: number,
  ) {
    await this.findOne(tenantId, id);

    if (presentes < 0) {
      throw new Error('Número de presentes não pode ser negativo');
    }

    return await this.prisma.reuniao.update({
      where: { id },
      data: { presentes },
    });
  }
}
