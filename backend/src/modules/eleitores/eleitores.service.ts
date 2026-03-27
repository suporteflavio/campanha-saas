import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/common/prisma/prisma.service';

interface CreateEleitorDto {
  nome?: string;
  cpf?: string;
  email?: string;
  whatsapp?: string;
  consentimento?: boolean;
  segmento?: string;
  telefone?: string;
  endereco?: string;
  municipio?: string;
  zona?: string;
  secao?: string;
  observacoes?: string;
  consentimentoWhatsapp?: boolean;
}

interface UpdateEleitorDto {
  nome?: string;
  email?: string;
  whatsapp?: string;
  consentimento?: boolean;
  segmento?: string;
  telefone?: string;
  endereco?: string;
  municipio?: string;
  zona?: string;
  secao?: string;
  observacoes?: string;
  consentimentoWhatsapp?: boolean;
}

interface FiltrosEleitores {
  segmento?: string;
  busca?: string;
  consentimento?: boolean;
  skip?: number;
  take?: number;
}

@Injectable()
export class EleitoresService {
  constructor(private prisma: PrismaService) {}

  /**
   * Criar um novo eleitor com captura de WhatsApp e consentimento
   */
  async create(tenantId: string, data: CreateEleitorDto) {
    return await this.prisma.eleitor.create({
      data: {
        nome: data.nome || '',
        cpf: data.cpf || '',
        email: data.email,
        whatsapp: data.whatsapp,
        consentimento: data.consentimento ?? false,
        segmento: data.segmento,
        tenantId,
      },
    });
  }

  /**
   * Listar eleitores com filtros opcionais e paginação
   */
  async findAll(
    tenantId: string,
    filtros: FiltrosEleitores = {},
  ) {
    const { segmento, busca, consentimento, skip = 0, take = 10 } = filtros;

    // Construir filtros
    const where: any = { tenantId };
    if (segmento) where.segmento = segmento;
    if (consentimento !== undefined) where.consentimento = consentimento;
    if (busca) {
      where.OR = [
        { nome: { contains: busca } },
        { cpf: { contains: busca } },
        { whatsapp: { contains: busca } },
      ];
    }

    const [data, total] = await Promise.all([
      this.prisma.eleitor.findMany({
        where,
        skip,
        take,
        orderBy: { criadoEm: 'desc' },
      }),
      this.prisma.eleitor.count({ where }),
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
   * Buscar eleitor específico por ID
   */
  async findOne(tenantId: string, id: string) {
    const eleitor = await this.prisma.eleitor.findFirst({
      where: { id, tenantId },
    });

    if (!eleitor) {
      throw new NotFoundException(
        `Eleitor com ID ${id} não encontrado`,
      );
    }

    return eleitor;
  }

  /**
   * Atualizar dados de um eleitor
   */
  async update(
    tenantId: string,
    id: string,
    data: UpdateEleitorDto,
  ) {
    await this.findOne(tenantId, id);

    const updateData: any = {};
    if (data.nome !== undefined) updateData.nome = data.nome;
    if (data.email !== undefined) updateData.email = data.email;
    if (data.whatsapp !== undefined) updateData.whatsapp = data.whatsapp;
    if (data.consentimento !== undefined) updateData.consentimento = data.consentimento;
    if (data.segmento !== undefined) updateData.segmento = data.segmento;

    return await this.prisma.eleitor.update({
      where: { id },
      data: updateData,
    });
  }

  /**
   * Deletar um eleitor
   */
  async delete(tenantId: string, id: string) {
    await this.findOne(tenantId, id);

    return await this.prisma.eleitor.delete({ where: { id } });
  }

  /**
   * Buscar eleitores por segmento (engajados, indecisos, contrários)
   */
  async buscarPorSegmento(
    tenantId: string,
    segmento: 'engajados' | 'indecisos' | 'contrários',
    pagination: { skip?: number; take?: number } = {},
  ) {
    const { skip = 0, take = 10 } = pagination;
    const [data, total] = await Promise.all([
      this.prisma.eleitor.findMany({
        where: { tenantId, segmento },
        skip,
        take,
        orderBy: { criadoEm: 'desc' },
      }),
      this.prisma.eleitor.count({
        where: { tenantId, segmento },
      }),
    ]);

    return {
      data,
      segmento,
      pagination: {
        total,
        skip,
        take,
        pages: Math.ceil(total / take),
      },
    };
  }
}
