import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
} from '@nestjs/common';
import { EquipeService } from './equipe.service';
import {
  CreateEquipeDto,
  UpdateEquipeDto,
  GerarEscalaDto,
  EquipeResponseDto,
  FolhaPagamentoResponseDto,
} from './equipe.dto';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { CurrentTenant } from '@/common/decorators';

@Controller('equipe')
@UseGuards(JwtAuthGuard)
export class EquipeController {
  constructor(private equipeService: EquipeService) {}

  /**
   * Listar membros da equipe com paginação
   * GET /equipe?skip=0&take=10
   */
  @Get()
  async findAll(
    @CurrentTenant() tenantId: string,
    @Query('skip', new ParseIntPipe({ optional: true })) skip = 0,
    @Query('take', new ParseIntPipe({ optional: true })) take = 10,
  ): Promise<any> {
    return this.equipeService.findAll(tenantId, { skip, take });
  }

  /**
   * Criar novo membro da equipe
   * POST /equipe
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @CurrentTenant() tenantId: string,
    @Body() createEquipeDto: CreateEquipeDto,
  ): Promise<EquipeResponseDto> {
    return this.equipeService.create(tenantId, createEquipeDto);
  }

  /**
   * Obter membro por ID
   * GET /equipe/:id
   */
  @Get(':id')
  async findOne(
    @CurrentTenant() tenantId: string,
    @Param('id') id: string,
  ): Promise<EquipeResponseDto> {
    return this.equipeService.findOne(tenantId, id);
  }

  /**
   * Atualizar membro da equipe
   * PATCH /equipe/:id
   */
  @Patch(':id')
  async update(
    @CurrentTenant() tenantId: string,
    @Param('id') id: string,
    @Body() updateEquipeDto: UpdateEquipeDto,
  ): Promise<EquipeResponseDto> {
    return this.equipeService.update(tenantId, id, updateEquipeDto);
  }

  /**
   * Deletar membro (soft delete)
   * DELETE /equipe/:id
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(
    @CurrentTenant() tenantId: string,
    @Param('id') id: string,
  ): Promise<void> {
    await this.equipeService.delete(tenantId, id);
  }

  /**
   * Gerar escala semanal
   * POST /equipe/:id/escala
   */
  @Post(':id/escala')
  async gerarEscala(
    @CurrentTenant() tenantId: string,
    @Param('id') memberId: string,
    @Body() gerarEscalaDto: GerarEscalaDto,
  ): Promise<any> {
    return this.equipeService.gerarEscala(
      tenantId,
      memberId,
      gerarEscalaDto,
    );
  }

  /**
   * Calcular e listar folha de pagamento
   * GET /equipe/folha-pagamento
   */
  @Get('folha-pagamento')
  async calcularFolhaPagamento(
    @CurrentTenant() tenantId: string,
  ): Promise<FolhaPagamentoResponseDto> {
    return this.equipeService.calcularFolhaPagamento(tenantId);
  }
}
