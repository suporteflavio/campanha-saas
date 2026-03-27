import { IsString, IsOptional, IsEnum, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';

export enum PlataformaMarketing {
  INSTAGRAM = 'instagram',
  WHATSAPP = 'whatsapp',
  EMAIL = 'email',
  SMS = 'sms',
  PIXEL = 'pixel',
  TIKTOK = 'tiktok',
  FACEBOOK = 'facebook',
}

export class CreateMarketingDto {
  @IsString()
  titulo!: string;

  @IsString()
  @IsOptional()
  descricao?: string;

  @IsEnum(PlataformaMarketing)
  plataforma!: PlataformaMarketing;

  @IsNumber()
  @Type(() => Number)
  @Min(0)
  @IsOptional()
  alcance?: number;

  @IsNumber()
  @Type(() => Number)
  @Min(0)
  @IsOptional()
  engajamento?: number;

  @IsString()
  @IsOptional()
  linkCampanha?: string;

  @IsString()
  @IsOptional()
  observacoes?: string;
}

export class UpdateMarketingDto {
  @IsString()
  @IsOptional()
  titulo?: string;

  @IsString()
  @IsOptional()
  descricao?: string;

  @IsEnum(PlataformaMarketing)
  @IsOptional()
  plataforma?: PlataformaMarketing;

  @IsNumber()
  @Type(() => Number)
  @Min(0)
  @IsOptional()
  alcance?: number;

  @IsNumber()
  @Type(() => Number)
  @Min(0)
  @IsOptional()
  engajamento?: number;

  @IsString()
  @IsOptional()
  linkCampanha?: string;

  @IsString()
  @IsOptional()
  observacoes?: string;
}

export class RegistrarMetricasDto {
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  alcance!: number;

  @IsNumber()
  @Type(() => Number)
  @Min(0)
  engajamento!: number;
}

export class MarketingResponseDto {
  id!: string;
  tenantId!: string;
  titulo!: string;
  descricao?: string;
  plataforma!: PlataformaMarketing;
  alcance!: number;
  engajamento!: number;
  taxaEngajamento!: number;
  linkCampanha?: string;
  observacoes?: string;
  createdAt!: Date;
  updatedAt!: Date;
}

export class PerformanceMarketingDto {
  plataforma!: PlataformaMarketing;
  totalCampanhas!: number;
  alcanceTotal!: number;
  engajamentoTotal!: number;
  taxaEngajamentoMedia!: number;
}
