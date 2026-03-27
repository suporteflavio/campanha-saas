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
export class InteligenciaService {\n  constructor(private prisma: PrismaService) {}\n\n  /**\n   * Gerar previsão de votos usando análise de dados históricos e metas\n   * Algoritmo: Regressão linear simples com intervalo de confiança\n   */\n  async gerarPrevisao(\n    tenantId: string,\n    dados: PrevisaoHistorica,\n  ): Promise<PrevisaoVotos[]> {\n    // Buscar todas as metas do tenant\n    const metas = await this.prisma.meta.findMany({\n      where: { tenantId },\n    });\n\n    const previsoesVotos = metas.map((meta) => {\n      // Calcular tendência a partir dos dados históricos\n      const votos = [dados.votosM1, dados.votosM2, dados.votosM3];\n      const mediaVotos = votos.reduce((a, b) => a + b) / votos.length;\n      const tendencia = dados.tendenciaPercentual;\n\n      // Estimar votos projetados (com tendência)\n      const votosProjetados = Math.round(\n        mediaVotos * (1 + tendencia / 100),\n      );\n\n      // Calcular intervalo de confiança (±20%)\n      const margem = votosProjetados * 0.2;\n\n      // Probabilidade de atingir meta (modelo simplificado)\n      const diferencaVotos = meta.votosNecessarios - votosProjetados;\n      const probabilidade =\n        diferencaVotos <= 0\n          ? 100\n          : Math.max(\n              0,\n              100 -\n                (diferencaVotos / meta.votosNecessarios) * 100,\n            );\n\n      // Determinar tendência\n      let tendenciaLabel: 'crescente' | 'decrescente' | 'estavel';\n      if (tendencia > 5) tendenciaLabel = 'crescente';\n      else if (tendencia < -5) tendenciaLabel = 'decrescente';\n      else tendenciaLabel = 'estavel';\n\n      return {\n        municipio: meta.municipio,\n        votosProjetados,\n        intervaloConfianca: {\n          minimo: Math.round(votosProjetados - margem),\n          maximo: Math.round(votosProjetados + margem),\n        },\n        probabilidadeAtingirMeta: Number(probabilidade.toFixed(2)),\n        tendencia: tendenciaLabel,\n        diasRestantes: 7, // Assumindo ciclo semanal\n      };\n    });\n\n    return previsoesVotos;\n  }\n\n  /**\n   * Analisar segmentação de eleitores e gerar estratégicas de abordagem\n   */\n  async analisarSegmentacao(\n    tenantId: string,\n  ): Promise<AnaliseSegmentacao> {\n    const [totalEleitores, engajados, indecisos, contrarios] =\n      await Promise.all([\n        this.prisma.eleitor.count({\n          where: { tenantId },\n        }),\n        this.prisma.eleitor.count({\n          where: { tenantId, segmento: 'engajados' },\n        }),\n        this.prisma.eleitor.count({\n          where: { tenantId, segmento: 'indecisos' },\n        }),\n        this.prisma.eleitor.count({\n          where: { tenantId, segmento: 'contrários' },\n        }),\n      ]);\n\n    const safeTotal = totalEleitores || 1; // Evitar divisão por zero\n\n    return {\n      total: totalEleitores,\n      engajados: {\n        quantidade: engajados,\n        percentual: Number(\n          ((engajados / safeTotal) * 100).toFixed(2),\n        ),\n        potencial:\n          'ALTO - Focar em manutenção e amplificação de mensagens',\n      },\n      indecisos: {\n        quantidade: indecisos,\n        percentual: Number(\n          ((indecisos / safeTotal) * 100).toFixed(2),\n        ),\n        estrategia:\n          'MÉDIA - Produzir conteúdo persuasivo e direto ao ponto',\n      },\n      contrarios: {\n        quantidade: contrarios,\n        percentual: Number(\n          ((contrarios / safeTotal) * 100).toFixed(2),\n        ),\n        recomendacao:\n          'BAIXA - Evitar confronto direto, focar em \"não-voto\"',\n      },\n    };\n  }\n\n  /**\n   * Gerar alertas automáticos baseados em IA\n   * Analisa padrões de segurança, oportunidade e risco\n   */\n  async gerarAlertas(tenantId: string): Promise<AlertaIA[]> {\n    const alertas: AlertaIA[] = [];\n\n    // Buscar dados necessários em paralelo\n    const [metas, demandas, eleitores, campanhas] = await Promise.all([\n      this.prisma.meta.findMany({ where: { tenantId } }),\n      this.prisma.demanda.findMany({ where: { tenantId } }),\n      this.prisma.eleitor.findMany({ where: { tenantId } }),\n      this.prisma.campanhaMarketing.findMany({ where: { tenantId } }),\n    ]);\n\n    // ========== ALERTAS DE RISCO ==========\n\n    // Risco: Meta com baixo progresso há mais de X metas\n    const metasComRisco = metas.filter(\n      (m) => (m.votosAtual / m.votosNecessarios) * 100 < 20,\n    );\n\n    if (metasComRisco.length > 0) {\n      alertas.push({\n        tipo: 'risco',\n        titulo: 'Risco Crítico de Meta',\n        descricao: `${metasComRisco.length} município(s) com progresso crítico (< 20% da meta)`,\n        prioridade: 'alta',\n        dataGeracao: new Date(),\n        acaoRecomendada:\n          'Aumentar esforços de campaña, realizar eventos nas regiões de baixo desempenho',\n      });\n    }\n\n    // Risco: Alta quantidade de demandas não resolvidas\n    const demandasNaoResolvidas = demandas.filter(\n      (d) => d.status !== 'resolvida',\n    );\n\n    if (demandasNaoResolvidas.length > 10) {\n      alertas.push({\n        tipo: 'risco',\n        titulo: 'Backlog de Demandas Elevado',\n        descricao: `Você tem ${demandasNaoResolvidas.length} demandas pendentes`,\n        prioridade: 'media',\n        dataGeracao: new Date(),\n        acaoRecomendada:\n          'Priorizar demandas de alta importância e delegar tarefas',\n      });\n    }\n\n    // ========== ALERTAS DE OPORTUNIDADE ==========\n\n    // Oportunidade: Alto engajamento em algum segmento\n    const eleitoresEngajados = eleitores.filter(\n      (e) => e.segmento === 'engajados',\n    );\n\n    if (\n      eleitoresEngajados.length > 0 &&\n      (eleitoresEngajados.length / eleitores.length) * 100 > 40\n    ) {\n      alertas.push({\n        tipo: 'oportunidade',\n        titulo: 'Base Engajada Forte',\n        descricao: `Você tem ${eleitoresEngajados.length} eleitores engajados`,\n        prioridade: 'media',\n        dataGeracao: new Date(),\n        acaoRecomendada:\n          'Amplificar mensagens através dos engajados (efeito multiplicador)',\n      });\n    }\n\n    // Oportunidade: Campanha com excelente taxa de engajamento\n    const campanhasOtimas = campanhas.filter(\n      (c) =>\n        c.alcance > 0 &&\n        (c.engajamento / c.alcance) * 100 > 10,\n    );\n\n    if (campanhasOtimas.length > 0) {\n      alertas.push({\n        tipo: 'oportunidade',\n        titulo: 'Campanha com Alto Engajamento',\n        descricao: `${campanhasOtimas.length} campanha(s) com taxa > 10%`,\n        prioridade: 'baixa',\n        dataGeracao: new Date(),\n        acaoRecomendada:\n          'Replicar estratégia dessas campanhas em outras plataformas',\n      });\n    }\n\n    // ========== ALERTAS DE SEGURANÇA ==========\n\n    // Segurança: Baixa taxa de consentimento LGPD\n    const comConsent = eleitores.filter((e) => e.consentimento).length;\n    const taxaConsent =\n      eleitores.length > 0\n        ? (comConsent / eleitores.length) * 100\n        : 0;\n\n    if (taxaConsent < 30 && eleitores.length > 0) {\n      alertas.push({\n        tipo: 'seguranca',\n        titulo: 'Conformidade LGPD Baixa',\n        descricao: `Apenas ${taxaConsent.toFixed(0)}% de eleitores com consentimento`,\n        prioridade: 'alta',\n        dataGeracao: new Date(),\n        acaoRecomendada:\n          'Implementar estratégia de consentimento em todos os contatos',\n      });\n    }\n\n    return alertas;\n  }\n\n  /**\n   * Obter recomendações de otimização baseadas em padrões\n   */\n  async obterRecomendacoes(tenantId: string) {\n    const [metas, segmentacao] = await Promise.all([\n      this.prisma.meta.findMany({ where: { tenantId } }),\n      this.analisarSegmentacao(tenantId),\n    ]);\n\n    const recomendacoes = [];\n\n    // Recomendação 1: Focar em municípios com melhor desempenho\n    const metasOtimas = metas.filter(\n      (m) => (m.votosAtual / m.votosNecessarios) * 100 > 70,\n    );\n\n    if (metasOtimas.length > 0) {\n      recomendacoes.push({\n        titulo: 'Replicar Sucesso',\n        descricao: `Municípios com > 70% de meta: ${metasOtimas.map((m) => m.municipio).join(', ')}`,\n        acao: 'Estudar estratégias bem-sucedidas e aplicar em outros municípios',\n      });\n    }\n\n    // Recomendação 2: Aumentar engajamento de indecisos\n    if (segmentacao.indecisos.percentual > 20) {\n      recomendacoes.push({\n        titulo: 'Convertimento de Indecisos',\n        descricao: `Você tem ${segmentacao.indecisos.quantidade} eleitores indecisos`,\n        acao: 'Criar conteúdo persuasivo focado em proposta de valor diferenciada',\n      });\n    }\n\n    // Recomendação 3: Reduzir contrários\n    if (segmentacao.contrarios.quantidade > 100) {\n      recomendacoes.push({\n        titulo: 'Estratégia com Contrários',\n        descricao: `${segmentacao.contrarios.quantidade} eleitores contrários identificados`,\n        acao: 'Focar em segmentos neutros, evitar confronto direto',\n      });\n    }\n\n    return recomendacoes;\n  }\n}\n