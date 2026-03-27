import {
  Controller,
  Get,
  Patch,
  Param,
  Body,
  UseGuards,
  Query,
} from '@nestjs/common';
import { RootAdminService } from './root-admin.service';
import { RootGuard } from './root.guard';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { CurrentTenant } from '@/common/decorators';
import { UpdateSubscriptionDto } from './root-admin.dto';

@Controller('root-admin')
@UseGuards(JwtAuthGuard, RootGuard)
export class RootAdminController {
  constructor(private rootAdminService: RootAdminService) {}

  @Get('campaigns')
  async listCampaigns() {
    return this.rootAdminService.listAllCampaigns();
  }

  @Get('campaigns/:tenantId/stats')
  async getCampaignStats(@Param('tenantId') tenantId: string) {
    return this.rootAdminService.getCampaignStats(tenantId);
  }

  @Patch('campaigns/:tenantId/subscription')
  async updateSubscription(
    @Param('tenantId') tenantId: string,
    @Body() dto: UpdateSubscriptionDto,
  ) {
    if (dto.dueDate) {
      await this.rootAdminService.blockCampaign(tenantId, dto.gracePeriodDays);
    }
    return this.rootAdminService.getCampaignStats(tenantId);
  }

  @Patch('campaigns/:tenantId/block')
  async blockCampaign(
    @Param('tenantId') tenantId: string,
    @Body('gracePeriodDays') gracePeriodDays?: number,
  ) {
    return this.rootAdminService.blockCampaign(tenantId, gracePeriodDays);
  }

  @Patch('campaigns/:tenantId/unblock')
  async unblockCampaign(@Param('tenantId') tenantId: string) {
    return this.rootAdminService.unblockCampaign(tenantId);
  }

  @Get('dashboard')
  async getDashboard() {
    return this.rootAdminService.getRootDashboard();
  }

  @Get('alerts')
  async getAlerts() {
    return this.rootAdminService.getAlerts();
  }
}
