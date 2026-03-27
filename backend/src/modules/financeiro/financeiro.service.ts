import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/common/prisma/prisma.service';
import { Decimal } from '@prisma/client/runtime/library';

interface CreateContaDto {
  descricao: string;
  saldo?: number | string;
  tipo?: 'corrente' | 'aplicacao';
}

interface UpdateContaDto {
  descricao?: string;
  saldo?: number | string;
  tipo?: 'corrente' | 'aplicacao';
}

interface CreateNotaFiscalDto {
  numero: string;
  descricao: string;
  valor: number | string;
  data: Date;
  tipo?: 'receita' | 'despesa';
  status?: 'pendente' | 'aprovada' | 'rejeitada';
}

interface UpdateNotaFiscalDto {
  numero?: string;
  descricao?: string;
  valor?: number | string;
  data?: Date;
  tipo?: 'receita' | 'despesa';
  status?: 'pendente' | 'aprovada' | 'rejeitada';
}

interface FiltrosNotas {
  tipo?: 'receita' | 'despesa';
  status?: 'pendente' | 'aprovada' | 'rejeitada';
  skip?: number;
  take?: number;
}

@Injectable()
export class FinanceiroService {
  constructor(private prisma: PrismaService) {}

  // ========== CONTAS ==========

  /**
   * Criar conta bancária
   */
  async createConta(tenantId: string, data: CreateContaDto) {
    return await this.prisma.conta.create({
      data: {
        ...data,
        tenantId,
        saldo: new Decimal(data.saldo || 0),
      },
    });
  }

  /**
   * Listar todas as contas
   */
  async findAllContas(
    tenantId: string,
    skip: number = 0,
    take: number = 10,
  ) {
    const [data, total] = await Promise.all([
      this.prisma.conta.findMany({
        where: { tenantId },
        skip,
        take,
        orderBy: { criadoEm: 'desc' },
      }),
      this.prisma.conta.count({ where: { tenantId } }),
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
   * Buscar conta específica
   */
  async findOneConta(tenantId: string, id: string) {
    const conta = await this.prisma.conta.findFirst({
      where: { id, tenantId },
    });

    if (!conta) {
      throw new NotFoundException(
        `Conta com ID ${id} não encontrada`,
      );
    }

    return conta;
  }

  /**
   * Atualizar conta
   */
  async updateConta(
    tenantId: string,
    id: string,
    data: UpdateContaDto,
  ) {
    await this.findOneConta(tenantId, id);

    const updateData: any = { ...data };
    if (data.saldo !== undefined) {
      updateData.saldo = new Decimal(data.saldo);
    }

    return await this.prisma.conta.update({
      where: { id },
      data: updateData,
    });
  }

  /**
   * Deletar conta
   */
  async deleteConta(tenantId: string, id: string) {
    await this.findOneConta(tenantId, id);

    return await this.prisma.conta.delete({ where: { id } });
  }

  // ========== NOTAS FISCAIS ==========

  /**
   * Criar nota fiscal
   */
  async createNotaFiscal(tenantId: string, data: CreateNotaFiscalDto) {
    return await this.prisma.notaFiscal.create({
      data: {
        ...data,
        tenantId,
        valor: new Decimal(data.valor),
      },
    });
  }

  /**
   * Listar notas fiscais com filtros opcionais
   */
  async findAllNotas(
    tenantId: string,
    filtros: FiltrosNotas = {},
  ) {
    const { tipo, status, skip = 0, take = 10 } = filtros;

    const where: any = { tenantId };
    if (tipo) where.tipo = tipo;
    if (status) where.status = status;

    const [data, total] = await Promise.all([
      this.prisma.notaFiscal.findMany({
        where,
        skip,
        take,
        orderBy: { data: 'desc' },
      }),
      this.prisma.notaFiscal.count({ where }),
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
   * Buscar nota fiscal específica
   */
  async findOneNota(tenantId: string, id: string) {
    const nota = await this.prisma.notaFiscal.findFirst({
      where: { id, tenantId },
    });

    if (!nota) {
      throw new NotFoundException(
        `Nota fiscal com ID ${id} não encontrada`,
      );
    }

    return nota;
  }

  /**
   * Atualizar nota fiscal
   */
  async updateNota(
    tenantId: string,
    id: string,
    data: UpdateNotaFiscalDto,
  ) {
    await this.findOneNota(tenantId, id);

    const updateData: any = { ...data };
    if (data.valor !== undefined) {
      updateData.valor = new Decimal(data.valor);
    }

    return await this.prisma.notaFiscal.update({
      where: { id },
      data: updateData,
    });
  }

  /**
   * Deletar nota fiscal (soft delete - apenas muda status)
   */
  async deleteNota(tenantId: string, id: string) {
    await this.findOneNota(tenantId, id);

    return await this.prisma.notaFiscal.update({
      where: { id },
      data: { status: 'rejeitada' },
    });
  }

  // ========== RESUMO FINANCEIRO ==========

  /**
   * Calcular resumo geral (saldo total, receitas, despesas)
   */
  async calcularResumo(tenantId: string) {
    const [contas, notas] = await Promise.all([
      this.prisma.conta.findMany({
        where: { tenantId },
      }),
      this.prisma.notaFiscal.findMany({
        where: { tenantId },
      }),
    ]);

    const saldoTotal = contas.reduce(
      (sum, conta) => sum + Number(conta.saldo),
      0,
    );

    const receitasAprovadas = notas
      .filter((n) => n.tipo === 'receita' && n.status === 'aprovada')
      .reduce((sum, n) => sum + Number(n.valor), 0);

    const despesasAprovadas = notas
      .filter((n) => n.tipo === 'despesa' && n.status === 'aprovada')
      .reduce((sum, n) => sum + Number(n.valor), 0);

    const receitasPendentes = notas
      .filter((n) => n.tipo === 'receita' && n.status === 'pendente')
      .reduce((sum, n) => sum + Number(n.valor), 0);

    const despesasPendentes = notas
      .filter((n) => n.tipo === 'despesa' && n.status === 'pendente')
      .reduce((sum, n) => sum + Number(n.valor), 0);

    return {
      saldoTotal,
      receitasAprovadas,
      despesasAprovadas,
      receitasPendentes,
      despesasPendentes,
      saldoLiquido: saldoTotal + receitasAprovadas - despesasAprovadas,
      contasTotal: contas.length,
      notasTotal: notas.length,
    };
  }
}
