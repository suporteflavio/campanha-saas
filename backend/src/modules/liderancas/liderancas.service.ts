import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/common/prisma/prisma.service';

interface CreateLiderancaDto {
  nome: string;
  cpf: string;
  email?: string;
  telefone?: string;
  nivel?: number;
  regiao?: string;
  mapa?: string;
  pai_id?: string;
}

interface UpdateLiderancaDto {
  nome?: string;
  email?: string;
  telefone?: string;
  nivel?: number;
  regiao?: string;
  mapa?: string;
  pai_id?: string;
}

@Injectable()
export class LiderancasService {
  constructor(private prisma: PrismaService) {}

  /**
   * Criar uma nova liderança com suporte a hierarquia (pai_id)
   */
  async create(tenantId: string, data: CreateLiderancaDto) {
    // Validar se o pai_id existe e pertence ao mesmo tenant
    if (data.pai_id) {
      const pai = await this.prisma.lideranca.findFirst({
        where: { id: data.pai_id, tenantId },
      });

      if (!pai) {
        throw new NotFoundException('Liderança pai não encontrada');
      }
    }

    return await this.prisma.lideranca.create({
      data: {
        ...data,
        tenantId,
      },
      include: {
        pai: true,
        filhos: true,
      },
    });
  }

  /**
   * Listar todas as lideranças com paginação
   */
  async findAll(
    tenantId: string,
    skip: number = 0,
    take: number = 10,
  ) {
    const [data, total] = await Promise.all([
      this.prisma.lideranca.findMany({
        where: { tenantId },
        skip,
        take,
        include: {
          pai: true,
          filhos: true,
        },
        orderBy: { criadoEm: 'desc' },
      }),
      this.prisma.lideranca.count({ where: { tenantId } }),
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
   * Buscar uma liderança específica por ID
   */
  async findOne(tenantId: string, id: string) {
    const lideranca = await this.prisma.lideranca.findFirst({
      where: { id, tenantId },
      include: {
        pai: true,
        filhos: true,
      },
    });

    if (!lideranca) {
      throw new NotFoundException(
        `Liderança com ID ${id} não encontrada`,
      );
    }

    return lideranca;
  }

  /**
   * Atualizar dados de uma liderança
   */
  async update(
    tenantId: string,
    id: string,
    data: UpdateLiderancaDto,
  ) {
    // Verificar se liderança existe
    await this.findOne(tenantId, id);

    // Validar se o novo pai_id existe (se fornecido)
    if (data.pai_id) {
      const pai = await this.prisma.lideranca.findFirst({
        where: { id: data.pai_id, tenantId },
      });

      if (!pai) {
        throw new NotFoundException('Liderança pai não encontrada');
      }
    }

    return await this.prisma.lideranca.update({
      where: { id },
      data,
      include: {
        pai: true,
        filhos: true,
      },
    });
  }

  /**
   * Deletar uma liderança e reatribuir filhos para o pai
   */
  async delete(tenantId: string, id: string) {
    // Verificar se liderança existe
    await this.findOne(tenantId, id);

    // Reatribuir filhos para o pai da liderança siendo deletada
    const lideranca = await this.prisma.lideranca.findUnique({
      where: { id },
    });

    if (lideranca?.pai_id) {
      await this.prisma.lideranca.updateMany({
        where: { pai_id: id },
        data: { pai_id: lideranca.pai_id },
      });
    }

    return await this.prisma.lideranca.delete({ where: { id } });
  }

  /**
   * Atualizar score de gamificação de uma liderança
   */
  async updateScore(
    tenantId: string,
    id: string,
    score: number,
  ) {
    // Verificar se liderança existe
    await this.findOne(tenantId, id);

    return await this.prisma.lideranca.update({
      where: { id },
      data: { score },
      include: {
        pai: true,
        filhos: true,
      },
    });
  }

  /**
   * Obter árvore hierárquica completa de lideranças (apenas raízes)
   */
  async getHierarchy(tenantId: string) {
    return await this.prisma.lideranca.findMany({
      where: {
        tenantId,
        pai_id: null,
      },
      include: {
        filhos: {
          include: {
            filhos: true,
          },
        },
      },
      orderBy: { criadoEm: 'desc' },
    });
  }
}
