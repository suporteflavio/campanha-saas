import { IsString, IsOptional, IsEnum, IsDate, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';

export enum StatusEquipe {
  ATIVO = 'ativo',
  LICENCA = 'licenca',
  DEMITIDO = 'demitido',
  AFASTADO = 'afastado',
}

export enum CargoEquipe {
  COORDENADOR = 'coordenador',
  CAPORAL = 'caporal',
  VOLUNTARIO = 'voluntario',
  ASSESSOR = 'assessor',
}

export class CreateEquipeDto {
  @IsString()
  nome: string;

  @IsString()
  cpf: string;

  @IsString()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  telefone?: string;

  @IsEnum(CargoEquipe)
  cargo: CargoEquipe;

  @IsString()
  @IsOptional()
  regiao?: string;

  @IsNumber()
  @Type(() => Number)
  @Min('0')
  @IsOptional()
  salario?: number;

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  dataAdmissao?: Date;
}

export class UpdateEquipeDto {
  @IsString()
  @IsOptional()
  nome?: string;

  @IsString()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  telefone?: string;

  @IsEnum(CargoEquipe)
  @IsOptional()
  cargo?: CargoEquipe;

  @IsString()
  @IsOptional()
  regiao?: string;

  @IsNumber()
  @Type(() => Number)
  @Min('0')
  @IsOptional()
  salario?: number;

  @IsEnum(StatusEquipe)
  @IsOptional()
  status?: StatusEquipe;
}

export class GerarEscalaDto {
  @IsDate()
  @Type(() => Date)
  semanaInicio: Date;

  @IsString()
  @IsOptional()
  descricao?: string;
}

export class EquipeResponseDto {
  id: string;
  tenantId: string;
  nome: string;
  cpf: string;
  email?: string;
  telefone?: string;
  cargo: CargoEquipe;
  regiao?: string;
  salario?: number;
  status: StatusEquipe;
  dataAdmissao: Date;
  createdAt: Date;
  updatedAt: Date;
}

export class FolhaPagamentoResponseDto {
  totalMembros: number;
  totalSalarios: number;
  mediaSalarial: number;
  membros: Array<{
    id: string;
    nome: string;
    cargo: CargoEquipe;
    salario: number;
  }>;
}
