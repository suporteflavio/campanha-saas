import { IsString, IsOptional } from 'class-validator';

export class DashboardResumoDto {
  totalEleitores: number;
  totalLiderancas: number;
  proximasReunioes: number;
  votosProjetados: number;
  demandasAbertas: number;
  saldoFinanceiro: number;
}

export class DashboardMetricasDto {
  porMunicipio!: Array<{
    municipio: string;
    eleitores: number;
    votos: number;
    percentual: number;
  }>;
  porSegmento!: {
    engajados: number;
    indecisos: number;
    contrarios: number;
  };
  metaAtingida!: number;
}

export class DashboardTimelineDto {
  eventos!: Array<{
    id: string;
    titulo: string;
    datahora: Date;
    tipo: string;
    local?: string;
    presentes?: number;
  }>;
}

export class AlertaDto {
  id?: string;
  tipo!: 'meta' | 'demanda' | 'reuniao' | 'sistema';
  titulo!: string;
  mensagem!: string;
  severidade!: 'info' | 'warning' | 'error';
  data!: Date;
}

export class DashboardAlertasDto {
  alertas: AlertaDto[];
}

export class TenantInfoDto {
  id: string;
  nome: string;
  slug: string;
  cnpj: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export class UpdateTenantDto {
  @IsString()
  @IsOptional()
  nome?: string;

  @IsString()
  @IsOptional()
  slug?: string;

  @IsString()
  @IsOptional()
  status?: string;
}
