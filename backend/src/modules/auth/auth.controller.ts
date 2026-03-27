import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto, AuthResponseDto } from './auth.dto';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { CurrentUser } from '@/common/decorators';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto): Promise<AuthResponseDto> {
    return this.authService.login(loginDto);
  }

  @Post('register')
  async register(@Body() registerDto: RegisterDto): Promise<AuthResponseDto> {
    return this.authService.register(registerDto);
  }

  @Post('refresh-token')
  @UseGuards(JwtAuthGuard)
  async refreshToken(@CurrentUser() user: any) {
    return this.authService.refreshToken(user.refreshToken);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  async logout(): Promise<{ message: string }> {
    return { message: 'Logout realizado com sucesso' };
  }
}
