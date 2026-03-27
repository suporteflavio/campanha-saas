export class CampaignStatsDto {
  tenantId: string;
  name: string;
  cnpj: string;
  usuariosAtivos: number;
  dataVencimento?: Date;
  statusAssinatura: 'active' | 'overdue' | 'suspended';
  mrr: number;
}

export class UpdateSubscriptionDto {
  status: 'active' | 'overdue' | 'suspended';
  dueDate?: Date;
  gracePeriodDays?: number;
}

export class RootDashboardDto {
  totalCampanhas: number;
  mrrTotal: number;
  usuariosTotal: number;
  campanhasAtraso: Array<{ tenantId: string; nome: string; daysLate: number }>;
  alertas: string[];
}
