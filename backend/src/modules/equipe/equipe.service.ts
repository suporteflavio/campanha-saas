import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/common/prisma/prisma.service';
import { Decimal } from '@prisma/client/runtime/library';

interface CreateEquipeMembroDto {
  nome: string;
  cpf: string;
  cargo: string;
  salario: number | string;
  dataAdmissao: Date;
  status?: 'ativo' | 'inativo' | 'demitido';
  escala?: string;
}

interface UpdateEquipeMembroDto {
  nome?: string;
  cargo?: string;
  salario?: number | string;
  dataAdmissao?: Date;
  status?: 'ativo' | 'inativo' | 'demitido';
  escala?: string;
}

interface DadosEscala {
  segunda?: string;
  terca?: string;
  quarta?: string;
  quinta?: string;
  sexta?: string;
  sabado?: string;
  domingo?: string;
}

@Injectable()
export class EquipeService {
  constructor(private prisma: PrismaService) {}

  /**
   * Criar membro da equipe
   */
  async create(tenantId: string, data: CreateEquipeMembroDto) {
    return await this.prisma.equipeMembro.create({
      data: {
        ...data,
        tenantId,
        salario: new Decimal(data.salario),
      },
    });
  }

  /**
   * Listar membros da equipe
   */
  async findAll(
    tenantId: string,
    skip: number = 0,
    take: number = 10,
  ) {
    const [data, total] = await Promise.all([
      this.prisma.equipeMembro.findMany({
        where: { tenantId },
        skip,
        take,
        orderBy: { dataAdmissao: 'desc' },
      }),
      this.prisma.equipeMembro.count({ where: { tenantId } }),
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
   * Buscar membro específico
   */
  async findOne(tenantId: string, id: string) {
    const membro = await this.prisma.equipeMembro.findFirst({
      where: { id, tenantId },
    });

    if (!membro) {
      throw new NotFoundException(
        `Membro da equipe com ID ${id} não encontrado`,
      );
    }

    return membro;
  }

  /**
   * Atualizar membro
   */
  async update(
    tenantId: string,
    id: string,
    data: UpdateEquipeMembroDto,
  ) {
    await this.findOne(tenantId, id);

    const updateData: any = { ...data };
    if (data.salario !== undefined) {
      updateData.salario = new Decimal(data.salario);
    }

    return await this.prisma.equipeMembro.update({
      where: { id },
      data: updateData,
    });
  }

  /**
   * Deletar membro (soft delete - muda status para demitido)
   */
  async delete(tenantId: string, id: string) {
    await this.findOne(tenantId, id);

    return await this.prisma.equipeMembro.update({
      where: { id },
      data: { status: 'demitido' },
    });
  }

  /**
   * Gerar escala de trabalho para um membro
   */
  async gerarEscala(
    tenantId: string,
    id: string,
    dados: DadosEscala,
  ) {
    await this.findOne(tenantId, id);

    const escala = {
      segunda: dados.segunda || 'Folga',
      terca: dados.terca || 'Folga',
      quarta: dados.quarta || 'Folga',
      quinta: dados.quinta || 'Folga',
      sexta: dados.sexta || 'Folga',
      sabado: dados.sabado || 'Folga',
      domingo: dados.domingo || 'Folga',
      dataCriacao: new Date(),
    };

    return await this.prisma.equipeMembro.update({
      where: { id },
      data: { escala: JSON.stringify(escala) },
    });
  }

  /**
   * Calcular folha de pagamento total
   */
  async calcularFolhaPagamento(tenantId: string) {
    const membros = await this.prisma.equipeMembro.findMany({
      where: { tenantId, status: { not: 'demitido' } },
    });

    const totalFolha = membros.reduce(
      (sum, membro) => sum + Number(membro.salario),
      0,
    );

    return {
      totalFolha,
      membrosAtivos: membros.length,
      salarioMedio: membros.length > 0 ? totalFolha / membros.length : 0,
      detalhes: membros.map((m) => ({
        nome: m.nome,
        cargo: m.cargo,
        salario: Number(m.salario),
      })),
    };
  }
}
