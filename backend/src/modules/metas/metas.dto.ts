import { IsString, IsOptional, IsNumber, Min } from 'class-validator';

export class CreateMetaDto {
  @IsString()
  municipio!: string;

  @IsString()
  @IsOptional()
  secao?: string;

  @IsNumber()
  @Min(0)
  metaVotos!: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  votosAtual?: number;

  @IsString()
  @IsOptional()
  observacoes?: string;
}

export class UpdateMetaDto {
  @IsString()
  @IsOptional()
  municipio?: string;

  @IsString()
  @IsOptional()
  secao?: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  metaVotos?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  votosAtual?: number;

  @IsString()
  @IsOptional()
  observacoes?: string;
}

export class RegistrarProgressoDto {
  @IsNumber()
  @Min(0)
  incremento!: number;
}

export class SimulacaoMetaDto {
  @IsNumber()
  @Min(0)
  votosProjetados!: number;
}

export class MetaResponseDto {
  id!: string;
  tenantId!: string;
  municipio!: string;
  secao?: string;
  metaVotos!: number;
  votosAtual!: number;
  percentualAtingido!: number;
  observacoes?: string;
  createdAt!: Date;
  updatedAt!: Date;
}
