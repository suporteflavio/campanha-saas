import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { PrismaModule } from './common/prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { TenantsModule } from './modules/tenants/tenants.module';
import { LiderancasModule } from './modules/liderancas/liderancas.module';
import { EleitoresModule } from './modules/eleitores/eleitores.module';
import { ReunioesModule } from './modules/reunioes/reunioes.module';
import { MetasModule } from './modules/metas/metas.module';
import { FinanceiroModule } from './modules/financeiro/financeiro.module';
import { EquipeModule } from './modules/equipe/equipe.module';
import { DemandasModule } from './modules/demandas/demandas.module';
import { MarketingModule } from './modules/marketing/marketing.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { AttendanceModule } from './modules/attendance/attendance.module';
import { CompetitorsModule } from './modules/competitors/competitors.module';
import { RootAdminModule } from './modules/root-admin/root-admin.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'super-secret-key',
      signOptions: { expiresIn: process.env.JWT_EXPIRATION || '7d' },
    }),
    PrismaModule,
    AuthModule,
    TenantsModule,
    LiderancasModule,
    EleitoresModule,
    ReunioesModule,
    MetasModule,
    FinanceiroModule,
    EquipeModule,
    DemandasModule,
    MarketingModule,
    DashboardModule,
    AttendanceModule,
    CompetitorsModule,
    RootAdminModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
