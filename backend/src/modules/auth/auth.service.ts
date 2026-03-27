import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '@/common/prisma/prisma.service';
import { LoginDto, RegisterDto, AuthResponseDto } from './auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto): Promise<AuthResponseDto> {
    const user = await this.prisma.user.findUnique({
      where: { cpf: loginDto.cpf },
    });

    if (!user) {
      throw new UnauthorizedException('CPF ou senha inválidos');
    }

    const isValidPassword = await bcrypt.compare(
      loginDto.password,
      user.password,
    );

    if (!isValidPassword) {
      throw new UnauthorizedException('CPF ou senha inválidos');
    }

    // Get user's tenants
    const tenantUser = await this.prisma.tenantUser.findFirst({
      where: { userId: user.id },
      include: { tenant: true },
    });

    if (!tenantUser) {
      throw new UnauthorizedException('Usuário não tem tenant associado');
    }

    return this.generateTokens(user, tenantUser);
  }

  async register(registerDto: RegisterDto): Promise<AuthResponseDto> {
    // Check if user already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { cpf: registerDto.cpf },
    });

    if (existingUser) {
      throw new ConflictException('CPF já cadastrado');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    // Create tenant
    const tenant = await this.prisma.tenant.create({
      data: {
        name: registerDto.tenantName,
        cnpj: registerDto.cnpj,
        slug: registerDto.tenantName.toLowerCase().replace(/\s+/g, '-'),
      },
    });

    // Create user
    const user = await this.prisma.user.create({
      data: {
        cpf: registerDto.cpf,
        name: registerDto.name,
        email: registerDto.email,
        password: hashedPassword,
      },
    });

    // Create tenant-user relationship with admin role
    const tenantUser = await this.prisma.tenantUser.create({
      data: {
        tenantId: tenant.id,
        userId: user.id,
        role: 'admin',
      },
      include: { tenant: true },
    });

    return this.generateTokens(user, tenantUser);
  }

  async refreshToken(token: string): Promise<{ accessToken: string }> {
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });

      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
      });

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      const accessToken = this.jwtService.sign({
        sub: user.id,
        cpf: user.cpf,
        name: user.name,
        tenantId: payload.tenantId,
        role: payload.role,
      });

      return { accessToken };
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  private generateTokens(user: any, tenantUser: any): AuthResponseDto {
    const payload = {
      sub: user.id,
      cpf: user.cpf,
      name: user.name,
      tenantId: tenantUser.tenantId,
      role: tenantUser.role,
    };

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: '1h',
    });

    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: '7d',
    });

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        cpf: user.cpf,
        name: user.name,
        email: user.email,
        role: tenantUser.role,
        tenantId: tenantUser.tenantId,
      },
    };
  }
}
