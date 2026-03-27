import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/common/prisma/prisma.service';

interface UpdateTenantDto {
  name?: string;
  nome?: string;
  slug?: string;
  status?: string;
}

@Injectable()
export class TenantsService {
  constructor(private prisma: PrismaService) {}

  /**
   * Obter tenant por ID (sem filtro de tenantId, pois é global)
   */
  async findById(id: string) {
    const tenant = await this.prisma.tenant.findUnique({
      where: { id },
      include: {
        users: {
          include: {
            user: true,
          },
        },
        liderancas: true,
        eleitores: true,
        reunioes: true,
        metas: true,
        equipe: true,
        demandas: true,
        campanhas: true,
        contas: true,
        notas: true,
      },
    });

    if (!tenant) {
      throw new NotFoundException(`Tenant com ID ${id} não encontrado`);
    }

    return tenant;
  }

  /**
   * Atualizar dados do tenant (nome, slug, status)
   */
  async update(id: string, data: UpdateTenantDto) {
    // Verificar se tenant existe
    await this.findById(id);

    const updateData: any = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.nome !== undefined) updateData.name = data.nome;
    if (data.slug !== undefined) updateData.slug = data.slug;
    if (data.status !== undefined) updateData.status = data.status;

    return await this.prisma.tenant.update({
      where: { id },
      data: updateData,
      include: {
        users: {
          include: {
            user: true,
          },
        },
      },
    });
  }

  /**
   * Listar todos os tenants (admin only)
   */
  async list(skip: number = 0, take: number = 10) {
    const [data, total] = await Promise.all([
      this.prisma.tenant.findMany({
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: {
          users: {
            include: {
              user: true,
            },
          },
        },
      }),
      this.prisma.tenant.count(),
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
   * Obter estatisticas do tenant
   */
  async obterEstatisticas(id: string) {
    const tenant = await this.findById(id);

    const [totalEleitores, totalLideranças, totalReunioes, totalEquipe] =
      await Promise.all([
        this.prisma.eleitor.count({
          where: { tenantId: id },
        }),
        this.prisma.lideranca.count({
          where: { tenantId: id },
        }),
        this.prisma.reuniao.count({
          where: { tenantId: id },
        }),
        this.prisma.equipeMembro.count({
          where: { tenantId: id, status: { not: 'demitido' } },
        }),
      ]);

    return {
      tenantId: id,
      nome: tenant.name,
      cnpj: tenant.cnpj,
      status: tenant.status,
      totalUsuarios: tenant.users.length,
      totalEleitores,
      totalLideranças,
      totalReunioes,
      totalEquipeAtiva: totalEquipe,
      criadoEm: tenant.createdAt,
    };
  }
}
