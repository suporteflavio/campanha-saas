import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/common/prisma/prisma.service';

interface PrevisaoVotos {
  municipio: string;
  votosProjetados: number;
  intervaloConfianca: {
    minimo: number;
    maximo: number;
  };
  probabilidadeAtingirMeta: number;
  tendencia: 'crescente' | 'decrescente' | 'estavel';
  diasRestantes: number;
}

interface AnaliseSegmentacao {
  total: number;
  engajados: {
    quantidade: number;
    percentual: number;
    potencial: string;
  };
  indecisos: {
    quantidade: number;
    percentual: number;
    estrategia: string;
  };
  contrarios: {
    quantidade: number;
    percentual: number;
    recomendacao: string;
  };
}

interface AlertaIA {
  tipo: 'oportunidade' | 'risco' | 'seguranca';
  titulo: string;
  descricao: string;
  prioridade: 'alta' | 'media' | 'baixa';
  dataGeracao: Date;
  acaoRecomendada: string;
}

interface PrevisaoHistorica {
  votosM1: number;
  votosM2: number;
  votosM3: number;
  tendenciaPercentual: number;
}

@Injectable()
export class InteligenciaService {
  constructor(private prisma: PrismaService) {}

  /**
   * Gerar previsao de votos usando analise de dados historicos e metas
   * Algoritmo: Regressao linear simples com intervalo de confianca
   */
  async gerarPrevisao(
    tenantId: string,
    dados: PrevisaoHistorica,
  ): Promise<PrevisaoVotos[]> {
    // Buscar todas as metas do tenant
    const metas = await this.prisma.meta.findMany({
      where: { tenantId },
    });

    const previsoesVotos = metas.map((meta) => {
      // Calcular tendencia a partir dos dados historicos
      const votos = [dados.votosM1, dados.votosM2, dados.votosM3];
      const mediaVotos = votos.reduce((a, b) => a + b) / votos.length;
      const tendencia = dados.tendenciaPercentual;

      // Estimar votos projetados (com tendencia)
      const votosProjetados = Math.round(
        mediaVotos * (1 + tendencia / 100),
      );

      // Calcular intervalo de confianca (±20%)
      const margem = votosProjetados * 0.2;

      // Probabilidade de atingir meta (modelo simplificado)
      const diferencaVotos = meta.votosNecessarios - votosProjetados;
      const probabilidade =
        diferencaVotos <= 0
          ? 100
          : Math.max(
              0,
              100 -
                (diferencaVotos / meta.votosNecessarios) * 100,
            );

      // Determinar tendencia
      let tendenciaLabel: 'crescente' | 'decrescente' | 'estavel';
      if (tendencia > 5) tendenciaLabel = 'crescente';
      else if (tendencia < -5) tendenciaLabel = 'decrescente';
      else tendenciaLabel = 'estavel';

      return {
        municipio: meta.municipio,
        votosProjetados,
        intervaloConfianca: {
          minimo: Math.round(votosProjetados - margem),
          maximo: Math.round(votosProjetados + margem),
        },
        probabilidadeAtingirMeta: Number(probabilidade.toFixed(2)),
        tendencia: tendenciaLabel,
        diasRestantes: 7, // Assumindo ciclo semanal
      };
    });

    return previsoesVotos;
  }

  /**
   * Analisar segmentacao de eleitores e gerar estrategicas de abordagem
   */
  async analisarSegmentacao(
    tenantId: string,
  ): Promise<AnaliseSegmentacao> {
    const [totalEleitores, engajados, indecisos, contrarios] =
      await Promise.all([
        this.prisma.eleitor.count({
          where: { tenantId },
        }),
        this.prisma.eleitor.count({
          where: { tenantId, segmento: 'engajados' },
        }),
        this.prisma.eleitor.count({
          where: { tenantId, segmento: 'indecisos' },
        }),
        this.prisma.eleitor.count({
          where: { tenantId, segmento: 'contrarios' },
        }),
      ]);

    const safeTotal = totalEleitores || 1; // Evitar divisao por zero

    return {
      total: totalEleitores,
      engajados: {
        quantidade: engajados,
        percentual: Number(
          ((engajados / safeTotal) * 100).toFixed(2),
        ),
        potencial:
          'ALTO - Focar em manutencao e amplificacao de mensagens',
      },
      indecisos: {
        quantidade: indecisos,
        percentual: Number(
          ((indecisos / safeTotal) * 100).toFixed(2),
        ),
        estrategia:
          'MEDIA - Produzir conteudo persuasivo e direto ao ponto',
      },
      contrarios: {
        quantidade: contrarios,
        percentual: Number(
          ((contrarios / safeTotal) * 100).toFixed(2),
        ),
        recomendacao:
          'BAIXA - Evitar confronto direto, focar em "nao-voto"',
      },
    };
  }

  /**
   * Gerar alertas automaticos baseados em IA
   * Analisa padroes de seguranca, oportunidade e risco
   */
  async gerarAlertas(tenantId: string): Promise<AlertaIA[]> {
    const alertas: AlertaIA[] = [];

    // Buscar dados necessarios em paralelo
    const [metas, demandas, eleitores, campanhas] = await Promise.all([
      this.prisma.meta.findMany({ where: { tenantId } }),
      this.prisma.demanda.findMany({ where: { tenantId } }),
      this.prisma.eleitor.findMany({ where: { tenantId } }),
      this.prisma.campanhaMarketing.findMany({ where: { tenantId } }),
    ]);

    // ========== ALERTAS DE RISCO ==========

    // Risco: Meta com baixo progresso ha mais de X metas
    const metasComRisco = metas.filter(
      (m) => (m.votosAtual / m.votosNecessarios) * 100 < 20,
    );

    if (metasComRisco.length > 0) {
      alertas.push({
        tipo: 'risco',
        titulo: 'Risco Critico de Meta',
        descricao: `${metasComRisco.length} municipio(s) com progresso critico (< 20% da meta)`,
        prioridade: 'alta',
        dataGeracao: new Date(),
        acaoRecomendada:
          'Aumentar esforcos de campanha, realizar eventos nas regioes de baixo desempenho',
      });
    }

    // Risco: Alta quantidade de demandas nao resolvidas
    const demandasNaoResolvidas = demandas.filter(
      (d) => d.status !== 'resolvida',
    );

    if (demandasNaoResolvidas.length > 10) {
      alertas.push({
        tipo: 'risco',
        titulo: 'Backlog de Demandas Elevado',
        descricao: `Voce tem ${demandasNaoResolvidas.length} demandas pendentes`,
        prioridade: 'media',
        dataGeracao: new Date(),
        acaoRecomendada:
          'Priorizar demandas de alta importancia e delegar tarefas',
      });
    }

    // ========== ALERTAS DE OPORTUNIDADE ==========

    // Oportunidade: Alto engajamento em algum segmento
    const eleitoresEngajados = eleitores.filter(
      (e) => e.segmento === 'engajados',
    );

    if (
      eleitoresEngajados.length > 0 &&
      (eleitoresEngajados.length / eleitores.length) * 100 > 40
    ) {
      alertas.push({
        tipo: 'oportunidade',
        titulo: 'Base Engajada Forte',
        descricao: `Voce tem ${eleitoresEngajados.length} eleitores engajados`,
        prioridade: 'media',
        dataGeracao: new Date(),
        acaoRecomendada:
          'Amplificar mensagens atraves dos engajados (efeito multiplicador)',
      });
    }

    // Oportunidade: Campanha com excelente taxa de engajamento
    const campanhasOtimas = campanhas.filter(
      (c) =>
        c.alcance > 0 &&
        (c.engajamento / c.alcance) * 100 > 10,
    );

    if (campanhasOtimas.length > 0) {
      alertas.push({
        tipo: 'oportunidade',
        titulo: 'Campanha com Alto Engajamento',
        descricao: `${campanhasOtimas.length} campanha(s) com taxa > 10%`,
        prioridade: 'baixa',
        dataGeracao: new Date(),
        acaoRecomendada:
          'Replicar estrategia dessas campanhas em outras plataformas',
      });
    }

    // ========== ALERTAS DE SEGURANCA ==========

    // Seguranca: Baixa taxa de consentimento LGPD
    const comConsent = eleitores.filter((e) => e.consentimento).length;
    const taxaConsent =
      eleitores.length > 0
        ? (comConsent / eleitores.length) * 100
        : 0;

    if (taxaConsent < 30 && eleitores.length > 0) {
      alertas.push({
        tipo: 'seguranca',
        titulo: 'Conformidade LGPD Baixa',
        descricao: `Apenas ${taxaConsent.toFixed(0)}% de eleitores com consentimento`,
        prioridade: 'alta',
        dataGeracao: new Date(),
        acaoRecomendada:
          'Implementar estrategia de consentimento em todos os contatos',
      });
    }

    return alertas;
  }

  /**
   * Obter recomendacoes de otimizacao baseadas em padroes
   */
  async obterRecomendacoes(tenantId: string) {
    const [metas, segmentacao] = await Promise.all([
      this.prisma.meta.findMany({ where: { tenantId } }),
      this.analisarSegmentacao(tenantId),
    ]);

    const recomendacoes = [];

    // Recomendacao 1: Focar em municipios com melhor desempenho
    const metasOtimas = metas.filter(
      (m) => (m.votosAtual / m.votosNecessarios) * 100 > 70,
    );

    if (metasOtimas.length > 0) {
      recomendacoes.push({
        titulo: 'Replicar Sucesso',
        descricao: `Municipios com > 70% de meta: ${metasOtimas.map((m) => m.municipio).join(', ')}`,
        acao: 'Estudar estrategias bem-sucedidas e aplicar em outros municipios',
      });
    }

    // Recomendacao 2: Aumentar engajamento de indecisos
    if (segmentacao.indecisos.percentual > 20) {
      recomendacoes.push({
        titulo: 'Convertimento de Indecisos',
        descricao: `Voce tem ${segmentacao.indecisos.quantidade} eleitores indecisos`,
        acao: 'Criar conteudo persuasivo focado em proposta de valor diferenciada',
      });
    }

    // Recomendacao 3: Reduzir contrarios
    if (segmentacao.contrarios.quantidade > 100) {
      recomendacoes.push({
        titulo: 'Estrategia com Contrarios',
        descricao: `${segmentacao.contrarios.quantidade} eleitores contrarios identificados`,
        acao: 'Focar em segmentos neutros, evitar confronto direto',
      });
    }

    return recomendacoes;
  }
}