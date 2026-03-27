import { IsString, IsOptional, IsDate, IsNumber, IsIn } from 'class-validator';
import { Type } from 'class-transformer';

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

  @IsIn(['reuniao', 'evento', 'carreata', 'comicio'])
  tipo!: 'reuniao' | 'evento' | 'carreata' | 'comicio';

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

  @IsIn(['reuniao', 'evento', 'carreata', 'comicio'])
  @IsOptional()
  tipo?: 'reuniao' | 'evento' | 'carreata' | 'comicio';

  @IsNumber()
  @IsOptional()
  presentes?: number;
}
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
