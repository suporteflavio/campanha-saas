import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/common/prisma/prisma.service';

interface CreateReuniaoDto {
  titulo?: string;
  descricao?: string;
  data?: Date;
  datahora?: Date;
  local?: string;
  municipio?: string;
  tipo?: string;
  presentes?: number;
}

interface UpdateReuniaoDto {
  titulo?: string;
  descricao?: string;
  data?: Date;
  datahora?: Date;
  local?: string;
  municipio?: string;
  tipo?: string;
  presentes?: number;
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
        titulo: data.titulo || '',
        descricao: data.descricao,
        data: data.data || data.datahora || new Date(),
        local: data.local,
        tipo: data.tipo || 'reuniao',
        presentes: data.presentes || 0,
        tenantId,
      },
    });
  }

  /**
   * Listar reuniões com filtro opcional de mês
   */
  async findAll(
    tenantId: string,
    pagination: { skip?: number; take?: number } = {},
    mes?: string,
  ) {
    const { skip = 0, take = 10 } = pagination;
    const mesNum = mes ? parseInt(mes, 10) : undefined;
    const where: any = { tenantId };

    // Filtrar por mês se fornecido (1-12)
    if (mesNum && mesNum >= 1 && mesNum <= 12) {
      const currentYear = new Date().getFullYear();
      const startDate = new Date(currentYear, mesNum - 1, 1);
      const endDate = new Date(currentYear, mesNum, 0);

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

    const updateData: any = {};
    if (data.titulo !== undefined) updateData.titulo = data.titulo;
    if (data.descricao !== undefined) updateData.descricao = data.descricao;
    if (data.data !== undefined) updateData.data = data.data;
    if (data.datahora !== undefined) updateData.data = data.datahora;
    if (data.local !== undefined) updateData.local = data.local;
    if (data.tipo !== undefined) updateData.tipo = data.tipo;
    if (data.presentes !== undefined) updateData.presentes = data.presentes;

    return await this.prisma.reuniao.update({
      where: { id },
      data: updateData,
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
