import {
  IsString,
  IsNumber,
  IsBoolean,
  IsArray,
  ArrayNotEmpty,
  IsOptional,
} from 'class-validator';

export class CreateAttendanceDto {
  @IsString()
  reuniaoId!: string;

  @IsString()
  nomeVotante!: string;

  @IsString()
  @IsOptional()
  telefoneVotante?: string;

  @IsString()
  @IsOptional()
  whatsappVotante?: string;

  @IsArray()
  @IsOptional()
  interesses?: string[];

  @IsNumber()
  latitude!: number;

  @IsNumber()
  longitude!: number;

  @IsBoolean()
  consentimentoLGPD!: boolean;

  @IsString()
  @IsOptional()
  cpfVotante?: string;
}

export class AttendanceResponseDto {
  id!: string;
  reuniaoId!: string;
  nomeVotante!: string;
  telefoneVotante?: string;
  whatsappVotante?: string;
  interesses!: string[];
  latitude?: number;
  longitude?: number;
  consentimentoLGPD!: boolean;
  distanciaMetros?: number;
  valida!: boolean;
  registradaEm!: Date;
  cpfVotante?: string;
}
