import { Controller, Get, Patch, Body, UseGuards, Param } from '@nestjs/common';
import { TenantsService } from './tenants.service';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { CurrentTenant } from '@/common/decorators';

export class UpdateTenantDto {
  nome?: string;
  slug?: string;
  status?: string;
}

export class TenantInfoDto {
  id: string;
  nome: string;
  slug: string;
  cnpj: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

@Controller('tenants')
@UseGuards(JwtAuthGuard)
export class TenantsController {
  constructor(private tenantsService: TenantsService) {}

  /**
   * Obter informações do tenant atual
   * GET /tenants/:id
   */
  @Get(':id')
  async getTenant(
    @CurrentTenant() tenantId: string,
    @Param('id') id: string,
  ): Promise<any> {
    // Validar que o ID do param é o mesmo do token
    if (id !== tenantId) {
      throw new Error('Unauthorized');
    }
    return this.tenantsService.findById(tenantId);
  }

  /**
   * Atualizar informações do tenant
   * PATCH /tenants/:id
   */
  @Patch(':id')
  async updateTenant(
    @CurrentTenant() tenantId: string,
    @Param('id') id: string,
    @Body() updateTenantDto: UpdateTenantDto,
  ): Promise<any> {
    // Validar que o ID do param é o mesmo do token
    if (id !== tenantId) {
      throw new Error('Unauthorized');
    }
    return this.tenantsService.update(tenantId, updateTenantDto);
  }
}
