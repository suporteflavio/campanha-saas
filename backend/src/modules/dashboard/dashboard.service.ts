import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/common/prisma/prisma.service';

interface Alerta {
  tipo: 'perigo' | 'aviso' | 'sucesso';
  mensagem: string;
  prioridade: 'alta' | 'media' | 'baixa';
}

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  /**
   * Obter overview geral do tenant
   */
  async getResumo(tenantId: string) {
    const [
      totalEleitores,
      totalLideranças,
      totalReunioes,
      metas,
      resumoFinanceiro,
      totalDemandas,
      demandas,
    ] = await Promise.all([
      this.prisma.eleitor.count({ where: { tenantId } }),
      this.prisma.lideranca.count({ where: { tenantId } }),
      this.prisma.reuniao.count({ where: { tenantId } }),
      this.prisma.meta.findMany({ where: { tenantId } }),
      this.getResumoFinanceiro(tenantId),
      this.prisma.demanda.count({ where: { tenantId } }),
      this.prisma.demanda.findMany({ where: { tenantId } }),
    ]);

    const votosAtuais = metas.reduce((sum, m) => sum + m.votosAtual, 0);
    const votosNecessarios = metas.reduce(
      (sum, m) => sum + m.votosNecessarios,
      0,
    );

    const demandasAbertas = demandas.filter(
      (d) => d.status === 'aberta',
    ).length;

    return {
      totalEleitores,
      totalLideranças,
      totalReunioes,
      totalDemandas,
      demandasAbertas,
      votosAtuais,
      votosNecessarios,
      percentualMeta:
        votosNecessarios > 0
          ? ((votosAtuais / votosNecessarios) * 100).toFixed(2)
          : 0,
      resumoFinanceiro,
      dataAtualizacao: new Date(),
    };
  }

  /**
   * Obter métricas detalhadas por município
   */
  async getMetricas(tenantId: string) {
    const [reunioes, metas, campanhas] = await Promise.all([
      this.prisma.reuniao.findMany({
        where: { tenantId },
      }),
      this.prisma.meta.findMany({
        where: { tenantId },
      }),
      this.prisma.campanhaMarketing.findMany({
        where: { tenantId },
      }),
    ]);

    const eleitoresPorSegmento = {
      engajados: await this.prisma.eleitor.count({
        where: { tenantId, segmento: 'engajados' },
      }),
      indecisos: await this.prisma.eleitor.count({
        where: { tenantId, segmento: 'indecisos' },
      }),
      contrarios: await this.prisma.eleitor.count({
        where: { tenantId, segmento: 'contrários' },
      }),
    };

    const metasPorProgresso = {
      baixoProgresso: metas.filter(
        (m) => (m.votosAtual / m.votosNecessarios) * 100 < 30,
      ).length,
      medioProgresso: metas.filter(
        (m) =>
          (m.votosAtual / m.votosNecessarios) * 100 >= 30 &&
          (m.votosAtual / m.votosNecessarios) * 100 < 70,
      ).length,
      altoProgresso: metas.filter(
        (m) => (m.votosAtual / m.votosNecessarios) * 100 >= 70,
      ).length,
    };

    const campanhasPorPlataforma = {
      instagram: campanhas.filter((c) => c.plataforma === 'instagram').length,
      whatsapp: campanhas.filter((c) => c.plataforma === 'whatsapp').length,
      email: campanhas.filter((c) => c.plataforma === 'email').length,
      sms: campanhas.filter((c) => c.plataforma === 'sms').length,
      pixel: campanhas.filter((c) => c.plataforma === 'pixel').length,
    };

    return {
      reunioes: {
        total: reunioes.length,
        presentes: reunioes.reduce((sum, r) => sum + r.presentes, 0),
        media:
          reunioes.length > 0
            ? (reunioes.reduce((sum, r) => sum + r.presentes, 0) /
                reunioes.length).toFixed(0)
            : 0,
      },
      eleitores: eleitoresPorSegmento,
      metas: {
        total: metas.length,
        porProgresso: metasPorProgresso,
      },
      campanhas: {
        total: campanhas.length,
        porPlataforma: campanhasPorPlataforma,
        alcanceTotal: campanhas.reduce((sum, c) => sum + c.alcance, 0),
        engajamentoTotal: campanhas.reduce((sum, c) => sum + c.engajamento, 0),
      },
    };
  }

  /**
   * Obter timeline de próximas reuniões
   */
  async getTimeline(tenantId: string, diasAdiante: number = 30) {
    const dataAtual = new Date();
    const dataFutura = new Date();
    dataFutura.setDate(dataFutura.getDate() + diasAdiante);

    const reunioes = await this.prisma.reuniao.findMany({
      where: {
        tenantId,
        data: {
          gte: dataAtual,
          lte: dataFutura,
        },
      },
      orderBy: { data: 'asc' },
      take: 50,
    });

    return reunioes.map((r) => ({
      id: r.id,
      titulo: r.titulo,
      data: r.data,
      local: r.local,
      tipo: r.tipo,
      presentes: r.presentes,
    }));
  }

  /**
   * Obter alertas automáticos baseados em lógica
   */
  async getAlertas(tenantId: string): Promise<Alerta[]> {
    const alertas: Alerta[] = [];

    // Alertas de meta de votos
    const metas = await this.prisma.meta.findMany({
      where: { tenantId },
    });

    metas.forEach((m) => {
      const percentual = (m.votosAtual / m.votosNecessarios) * 100;

      if (percentual < 30) {
        alertas.push({
          tipo: 'perigo',
          mensagem: `🔴 Meta CRÍTICA: ${m.municipio} está em ${percentual.toFixed(0)}% dos votos necessários`,
          prioridade: 'alta',
        });
      } else if (percentual < 60) {
        alertas.push({
          tipo: 'aviso',
          mensagem: `🟡 Meta MÉDIA: ${m.municipio} está em ${percentual.toFixed(0)}% dos votos`,
          prioridade: 'media',
        });
      } else if (percentual >= 80) {
        alertas.push({
          tipo: 'sucesso',
          mensagem: `✅ Meta ATINGIDA: ${m.municipio} alcançou ${percentual.toFixed(0)}%`,
          prioridade: 'baixa',
        });
      }
    });

    // Alertas de demandas abertas urgentes
    const demandasAltas = await this.prisma.demanda.findMany({
      where: {
        tenantId,
        prioridade: 'alta',
        status: { not: 'resolvida' },
      },
    });

    if (demandasAltas.length > 0) {
      alertas.push({
        tipo: 'perigo',
        mensagem: `Você tem ${demandasAltas.length} demanda(s) de alta prioridade pendente(s)`,
        prioridade: 'alta',
      });
    }

    // Alertas de reuniões próximas
    const hoje = new Date();
    const amanha = new Date(hoje);
    amanha.setDate(amanha.getDate() + 1);

    const reunioesProximas = await this.prisma.reuniao.findMany({
      where: {
        tenantId,
        data: {
          gte: hoje,
          lte: amanha,
        },
      },
    });

    if (reunioesProximas.length > 0) {
      alertas.push({
        tipo: 'aviso',
        mensagem: `${reunioesProximas.length} reunião(ões) agendada(s) para hoje ou amanhã`,
        prioridade: 'media',
      });
    }

    return alertas;
  }

  /**
   * Calcular resumo financeiro
   */
  private async getResumoFinanceiro(tenantId: string) {
    const notas = await this.prisma.notaFiscal.findMany({
      where: { tenantId },
    });

    const totalReceitas = notas
      .filter((n) => n.tipo === 'receita')
      .reduce((sum, n) => sum + Number(n.valor), 0);

    const totalDespesas = notas
      .filter((n) => n.tipo === 'despesa')
      .reduce((sum, n) => sum + Number(n.valor), 0);

    return {
      totalReceitas,
      totalDespesas,
      saldo: totalReceitas - totalDespesas,
    };
  }
}
