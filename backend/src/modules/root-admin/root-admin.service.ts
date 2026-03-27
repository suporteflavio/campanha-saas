import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '@/common/prisma/prisma.service';
import { UpdateSubscriptionDto } from './root-admin.dto';

@Injectable()
export class RootAdminService {
  constructor(private prisma: PrismaService) {}

  async listAllCampaigns() {
    const tenants = await this.prisma.tenant.findMany({
      include: {
        users: true,
      },
    });

    return tenants.map((tenant) => ({
      tenantId: tenant.id,
      name: tenant.name,
      cnpj: tenant.cnpj,
      usuariosAtivos: tenant.users.length,
      dataVencimento: tenant.subscriptionDueDate || null,
      statusAssinatura: (tenant.subscriptionStatus as 'active' | 'overdue' | 'suspended') || 'active',
      mrr: Number(tenant.mrr || 0),
    }));
  }

  async getCampaignStats(tenantId: string) {
    const tenant = await this.prisma.tenant.findUnique({
      where: { id: tenantId },
      include: {
        users: true,
        reunioes: true,
      },
    });

    if (!tenant) {
      throw new NotFoundException(`Tenant ${tenantId} não encontrado`);
    }

    const usuariosAtivos = tenant.users.length;
    const volumeDados =
      (tenant.reunioes?.length || 0) +
      (await this.prisma.eleitor.count({ where: { tenantId } })) +
      (await this.prisma.lideranca.count({ where: { tenantId } }));

    return {
      tenantId: tenant.id,
      name: tenant.name,
      cnpj: tenant.cnpj,
      usuariosAtivos,
      dataVencimento: tenant.subscriptionDueDate || null,
      statusAssinatura: (tenant.subscriptionStatus as 'active' | 'overdue' | 'suspended') || 'active',
      mrr: Number(tenant.mrr || 0),
      volumeDados,
    };
  }

  async blockCampaign(tenantId: string, novaCarencia?: number) {
    const tenant = await this.prisma.tenant.findUnique({ where: { id: tenantId } });
    if (!tenant) {
      throw new NotFoundException(`Tenant ${tenantId} não encontrado`);
    }

    const grace = novaCarencia ?? tenant.gracePeriodDays ?? 5;

    const dueDate = tenant.subscriptionDueDate;
    if (!dueDate) {
      throw new BadRequestException('Data de vencimento da assinatura não encontrada');
    }

    const overdueDays = Math.floor((Date.now() - dueDate.getTime()) / (1000 * 60 * 60 * 24));
    const shouldBlock = overdueDays >= grace;

    await this.prisma.tenant.update({
      where: { id: tenantId },
      data: {
        subscriptionStatus: shouldBlock ? 'suspended' : 'overdue',
        gracePeriodDays: grace,
      },
    });

    return {
      tenantId,
      blocked: shouldBlock,
      overdueDays,
      gracePeriodDays: grace,
    };
  }

  async unblockCampaign(tenantId: string) {
    await this.prisma.tenant.findUnique({ where: { id: tenantId } });

    const tenant = await this.prisma.tenant.update({
      where: { id: tenantId },
      data: {
        subscriptionStatus: 'active',
      },
    });

    return {
      tenantId,
      statusAssinatura: tenant.subscriptionStatus,
    };
  }

  async getRootDashboard() {
    const tenants = await this.prisma.tenant.findMany({ include: { users: true } });

    const totalCampanhas = tenants.length;
    const usuariosTotal = tenants.reduce((sum, t) => sum + (t.users?.length || 0), 0);
    const mrrTotal = tenants.reduce((sum, t) => sum + Number(t.mrr || 0), 0);
    const campanhasAtraso = tenants
      .filter((t) => t.subscriptionStatus === 'overdue' && t.subscriptionDueDate)
      .map((t) => ({
        tenantId: t.id,
        nome: t.name,
        daysLate: Math.floor((Date.now() - t.subscriptionDueDate.getTime()) / (1000 * 60 * 60 * 24)),
      }));

    const alertas = [];
    if (campanhasAtraso.length > 0) {
      alertas.push(`${campanhasAtraso.length} campanhas em atraso`);
    }

    return {
      totalCampanhas,
      mrrTotal,
      usuariosTotal,
      campanhasAtraso,
      alertas,
    };
  }

  async getAlerts() {
    const alerts: string[] = [];
    const overdueTenants = await this.prisma.tenant.findMany({
      where: { subscriptionStatus: 'overdue' },
      select: { id: true, name: true },
    });

    if (overdueTenants.length > 0) {
      alerts.push(`${overdueTenants.length} tenants com assinatura em atraso`);
    }

    const suspended = await this.prisma.tenant.count({ where: { subscriptionStatus: 'suspended' } });
    if (suspended > 0) {
      alerts.push(`${suspended} tenants bloqueados`);
    }

    return alerts;
  }
}
