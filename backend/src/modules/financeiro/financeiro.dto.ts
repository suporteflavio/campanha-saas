import { IsString, IsOptional, IsNumber, IsEnum, Min } from 'class-validator';
import { Type } from 'class-transformer';

export enum TipoNota {
  RECEITA = 'receita',
  DESPESA = 'despesa',
}

export enum StatusNota {
  PENDENTE = 'pendente',
  PAGO = 'pago',
  CANCELADO = 'cancelado',
}

export class CreateContaDto {
  @IsString()
  numeroConta!: string;

  @IsString()
  banco!: string;

  @IsString()
  @IsOptional()
  agencia?: string;

  @IsNumber()
  @Type(() => Number)
  @Min(0)
  saldoInicial!: number;
}

export class UpdateContaDto {
  @IsString()
  @IsOptional()
  numeroConta?: string;

  @IsString()
  @IsOptional()
  banco?: string;

  @IsString()
  @IsOptional()
  agencia?: string;

  @IsNumber()
  @Type(() => Number)
  @Min(0)
  @IsOptional()
  saldoInicial?: number;
}

export class CreateNotaFiscalDto {
  @IsString()
  descricao!: string;

  @IsNumber()
  @Type(() => Number)
  @Min(0)
  valor!: number;

  @IsEnum(TipoNota)
  tipo!: TipoNota;

  @IsString()
  @IsOptional()
  fornecedor?: string;

  @IsString()
  @IsOptional()
  nomeArquivo?: string;

  @IsString()
  @IsOptional()
  categoriaOrc?: string;
}

export class UpdateNotaFiscalDto {
  @IsString()
  @IsOptional()
  descricao?: string;

  @IsNumber()
  @Type(() => Number)
  @Min(0)
  @IsOptional()
  valor?: number;

  @IsEnum(TipoNota)
  @IsOptional()
  tipo?: TipoNota;

  @IsString()
  @IsOptional()
  fornecedor?: string;

  @IsString()
  @IsOptional()
  nomeArquivo?: string;

  @IsString()
  @IsOptional()
  categoriaOrc?: string;

  @IsEnum(StatusNota)
  @IsOptional()
  status?: StatusNota;
}

export class ContaResponseDto {
  id!: string;
  tenantId!: string;
  numeroConta!: string;
  banco!: string;
  agencia?: string;
  saldoInicial!: number;
  saldoAtual!: number;
  createdAt!: Date;
  updatedAt!: Date;
}

export class NotaFiscalResponseDto {
  id!: string;
  tenantId!: string;
  descricao!: string;
  valor!: number;
  tipo!: TipoNota;
  fornecedor?: string;
  nomeArquivo?: string;
  categoriaOrc?: string;
  status!: StatusNota;
  createdAt!: Date;
  updatedAt!: Date;
}

export class ResumoFinanceiroDto {
  totalReceitas!: number;
  totalDespesas!: number;
  saldoLiquido!: number;
  saldoPorConta: Array<{
    contaId: string;
    banco: string;
    saldo: number;
  }>;
}
