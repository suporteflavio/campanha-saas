import { IsString, IsEmail, IsOptional, IsEnum } from 'class-validator';

export enum SegmentoEnum {
  ENGAJADOS = 'engajados',
  INDECISOS = 'indecisos',
  CONTRARIOS = 'contrários',
}

export class CreateEleitorDto {
  @IsString()
  nome!: string;

  @IsString()
  cpf!: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  whatsapp?: string;

  @IsString()
  @IsOptional()
  telefone?: string;

  @IsString()
  @IsOptional()
  endereco?: string;

  @IsString()
  @IsOptional()
  municipio?: string;

  @IsString()
  @IsOptional()
  zona?: string;

  @IsString()
  @IsOptional()
  secao?: string;

  @IsEnum(SegmentoEnum)
  @IsOptional()
  segmento? = SegmentoEnum.INDECISOS;

  @IsString()
  @IsOptional()
  observacoes?: string;

  @IsString()
  @IsOptional()
  consentimentoWhatsapp?: boolean;
}

export class UpdateEleitorDto {
  @IsString()
  @IsOptional()
  nome?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  whatsapp?: string;

  @IsString()
  @IsOptional()
  telefone?: string;

  @IsString()
  @IsOptional()
  endereco?: string;

  @IsString()
  @IsOptional()
  municipio?: string;

  @IsString()
  @IsOptional()
  zona?: string;

  @IsString()
  @IsOptional()
  secao?: string;

  @IsEnum(SegmentoEnum)
  @IsOptional()
  segmento?: SegmentoEnum;

  @IsString()
  @IsOptional()
  observacoes?: string;

  @IsString()
  @IsOptional()
  consentimentoWhatsapp?: boolean;
}

export class EleitorResponseDto {
  id!: string;
  tenantId!: string;
  nome!: string;
  cpf!: string;
  email?: string;
  whatsapp?: string;
  telefone?: string;
  endereco?: string;
  municipio?: string;
  zona?: string;
  secao?: string;
  segmento!: SegmentoEnum;
  observacoes?: string;
  consentimentoWhatsapp!: boolean;
  createdAt!: Date;
  updatedAt!: Date;
}
