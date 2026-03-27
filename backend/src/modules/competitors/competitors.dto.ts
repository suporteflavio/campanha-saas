import { IsString, IsOptional, IsNumber, Min, IsEnum, IsDecimal } from 'class-validator';

export class CreateCompetitorDto {
  @IsString()
  nome: string;

  @IsString()
  partido: string;

  @IsString()
  cargoPretendido: string;

  @IsString()
  estado: string;

  @IsOptional()
  @IsNumber()
  votosAnteriores?: number;

  @IsOptional()
  @IsNumber()
  despesaDeclarada?: number;

  @IsOptional()
  @IsString()
  notas?: string;
}

export class UpdateCompetitorDto {
  @IsOptional()
  @IsString()
  nome?: string;

  @IsOptional()
  @IsString()
  partido?: string;

  @IsOptional()
  @IsString()
  cargoPretendido?: string;

  @IsOptional()
  @IsString()
  estado?: string;

  @IsOptional()
  @IsNumber()
  votosAnteriores?: number;

  @IsOptional()
  @IsNumber()
  despesaDeclarada?: number;

  @IsOptional()
  @IsString()
  notas?: string;
}

export class CompetitorResponseDto {
  id: string;
  tenantId: string;
  nome: string;
  partido: string;
  cargoPretendido: string;
  estado: string;
  votosAnteriores?: number;
  despesaDeclarada?: number;
  notas?: string;
  criadoEm: Date;
  atualizadoEm: Date;
}
