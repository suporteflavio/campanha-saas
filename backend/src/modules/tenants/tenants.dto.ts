import { IsString, IsOptional } from 'class-validator';

export class UpdateTenantDto {
  @IsString()
  @IsOptional()
  nome?: string;

  @IsString()
  @IsOptional()
  slug?: string;

  @IsString()
  @IsOptional()
  status?: string;
}

export class TenantInfoDto {
  id!: string;
  nome!: string;
  slug!: string;
  cnpj!: string;
  status!: string;
  createdAt!: Date;
  updatedAt!: Date;
}
