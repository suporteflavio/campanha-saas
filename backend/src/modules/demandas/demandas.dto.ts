import { IsString, IsOptional, IsEnum, IsDate } from 'class-validator';
import { Type } from 'class-transformer';

export enum StatusDemanda {
  ABERTA = 'aberta',
  EM_PROGRESSO = 'em_progresso',
  CONCLUIDA = 'concluida',
  CANCELADA = 'cancelada',
}

export enum PrioridadeDemanda {
  BAIXA = 'baixa',
  MEDIA = 'media',
  ALTA = 'alta',
  CRITICA = 'critica',
}

export class CreateDemandasDto {
  @IsString()
  titulo!: string;

  @IsString()
  @IsOptional()
  descricao?: string;

  @IsEnum(StatusDemanda)
  @IsOptional()
  status?: StatusDemanda;

  @IsEnum(PrioridadeDemanda)
  prioridade!: PrioridadeDemanda;

  @IsString()
  @IsOptional()
  responsavel?: string;

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  dataVencimento?: Date;
}

export class UpdateDemandasDto {
  @IsString()
  @IsOptional()
  titulo?: string;

  @IsString()
  @IsOptional()
  descricao?: string;

  @IsEnum(StatusDemanda)
  @IsOptional()
  status?: StatusDemanda;

  @IsEnum(PrioridadeDemanda)
  @IsOptional()
  prioridade?: PrioridadeDemanda;

  @IsString()
  @IsOptional()
  responsavel?: string;

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  dataVencimento?: Date;
}

export class AtualizarStatusDemandasDto {
  @IsEnum(StatusDemanda)
  status!: StatusDemanda;
}

export class DemandasResponseDto {
  id!: string;
  tenantId!: string;
  titulo!: string;
  descricao?: string;
  status!: StatusDemanda;
  prioridade!: PrioridadeDemanda;
  responsavel?: string;
  dataVencimento?: Date;
  createdAt!: Date;
  updatedAt!: Date;
}

export class EstatisticasDemandasDto {
  total!: number;
  aberta!: number;
  em_progresso!: number;
  concluida!: number;
  cancelada!: number;
  porPrioridade!: {
    baixa: number;
    media: number;
    alta: number;
    critica: number;
  };
}
