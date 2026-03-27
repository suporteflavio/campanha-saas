import { IsString, IsOptional, IsDate, IsNumber, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';

export enum TipoReuniao {
  REUNIAO = 'reuniao',
  EVENTO = 'evento',
  CARREATA = 'carreata',
  COMICIO = 'comicio',
}

export class CreateReuniaoDto {
  @IsString()
  titulo!: string;

  @IsString()
  @IsOptional()
  descricao?: string;

  @IsDate()
  @Type(() => Date)
  datahora!: Date;

  @IsString()
  @IsOptional()
  local?: string;

  @IsString()
  @IsOptional()
  municipio?: string;

  @IsEnum(TipoReuniao)
  tipo!: TipoReuniao;

  @IsNumber()
  @IsOptional()
  presentes?: number;
}

export class UpdateReuniaoDto {
  @IsString()
  @IsOptional()
  titulo?: string;

  @IsString()
  @IsOptional()
  descricao?: string;

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  datahora?: Date;

  @IsString()
  @IsOptional()
  local?: string;

  @IsString()
  @IsOptional()
  municipio?: string;

  @IsEnum(TipoReuniao)
  @IsOptional()
  tipo?: TipoReuniao;

  @IsNumber()
  @IsOptional()
  presentes?: number;
}

export class RegistrarPresencaDto {
  @IsNumber()
  presentes!: number;
}

export class ReuniaoResponseDto {
  id!: string;
  tenantId!: string;
  titulo!: string;
  descricao?: string;
  datahora!: Date;
  local?: string;
  municipio?: string;
  tipo!: TipoReuniao;
  presentes!: number;
  createdAt!: Date;
  updatedAt!: Date;
}
