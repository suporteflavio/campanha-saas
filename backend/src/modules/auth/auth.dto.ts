import { IsString, IsEmail, MinLength } from 'class-validator';

export class LoginDto {
  @IsString()
  cpf: string;

  @IsString()
  @MinLength(6)
  password: string;
}

export class RegisterDto {
  @IsString()
  cpf: string;

  @IsString()
  name: string;

  @IsEmail()
  email?: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsString()
  cnpj: string;

  @IsString()
  tenantName: string;
}

export class AuthResponseDto {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    cpf: string;
    name: string;
    email?: string;
    role: string;
    tenantId: string;
  };
}
