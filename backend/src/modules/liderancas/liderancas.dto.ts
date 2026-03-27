import { IsString, IsEmail, IsOptional, IsNumber, Min, Max } from 'class-validator';

export class CreateLiderancaDto {
  @IsString()
  nome!: string;

  @IsString()
  cpf!: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  telefone?: string;

  @IsNumber()
  @IsOptional()
  @Min(1)
  @Max(10)
  nivel?: number;

  @IsString()
  @IsOptional()
  regiao?: string;

  @IsString()
  @IsOptional()
  mapa?: string;

  @IsString()
  @IsOptional()
  pai_id?: string;
}

export class UpdateLiderancaDto {
  @IsString()
  @IsOptional()
  nome?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  telefone?: string;

  @IsNumber()
  @IsOptional()
  nivel?: number;

  @IsString()
  @IsOptional()
  regiao?: string;

  @IsString()
  @IsOptional()
  mapa?: string;

  @IsString()
  @IsOptional()
  pai_id?: string;
}

export class UpdateLiderancaScoreDto {
  @IsNumber()
  score!: number;
}

export class LiderancaResponseDto {
  id!: string;
  tenantId!: string;
  nome!: string;
  cpf!: string;
  email?: string;
  telefone?: string;
  nivel?: number;
  regiao?: string;
  mapa?: string;
  score?: number;
  pai_id?: string;
  createdAt!: Date;
  updatedAt!: Date;
}
