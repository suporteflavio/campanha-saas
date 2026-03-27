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
import { FinanceiroService } from './financeiro.service';
import {
  CreateContaDto,
  UpdateContaDto,
  CreateNotaFiscalDto,
  UpdateNotaFiscalDto,
  ContaResponseDto,
  NotaFiscalResponseDto,
  ResumoFinanceiroDto,
  TipoNota,
  StatusNota,
} from './financeiro.dto';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { CurrentTenant } from '@/common/decorators';

@Controller('financeiro')
@UseGuards(JwtAuthGuard)
export class FinanceiroController {
  constructor(private financeiroService: FinanceiroService) {}

  /**
   * Listar contas bancárias
   * GET /financeiro/contas
   */
  @Get('contas')
  async findAllContas(
    @CurrentTenant() tenantId: string,
    @Query('skip', new ParseIntPipe({ optional: true })) skip = 0,
    @Query('take', new ParseIntPipe({ optional: true })) take = 10,
  ): Promise<any> {
    return this.financeiroService.findAllContas(tenantId, { skip, take });
  }

  /**
   * Criar nova conta
   * POST /financeiro/contas
   */
  @Post('contas')
  @HttpCode(HttpStatus.CREATED)
  async createConta(
    @CurrentTenant() tenantId: string,
    @Body() createContaDto: CreateContaDto,
  ): Promise<ContaResponseDto> {
    return this.financeiroService.createConta(tenantId, createContaDto);
  }

  /**
   * Obter conta por ID
   * GET /financeiro/contas/:id
   */
  @Get('contas/:id')
  async findOneConta(
    @CurrentTenant() tenantId: string,
    @Param('id') id: string,
  ): Promise<ContaResponseDto> {
    return this.financeiroService.findOneConta(tenantId, id);
  }

  /**
   * Atualizar conta
   * PATCH /financeiro/contas/:id
   */
  @Patch('contas/:id')
  async updateConta(
    @CurrentTenant() tenantId: string,
    @Param('id') id: string,
    @Body() updateContaDto: UpdateContaDto,
  ): Promise<ContaResponseDto> {
    return this.financeiroService.updateConta(tenantId, id, updateContaDto);
  }

  /**
   * Deletar conta
   * DELETE /financeiro/contas/:id
   */
  @Delete('contas/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteConta(
    @CurrentTenant() tenantId: string,
    @Param('id') id: string,
  ): Promise<void> {
    await this.financeiroService.deleteConta(tenantId, id);
  }

  /**
   * Listar notas fiscais com filtros
   * GET /financeiro/notas?tipo=receita&status=pago
   */
  @Get('notas')
  async findAllNotas(
    @CurrentTenant() tenantId: string,
    @Query('tipo') tipo?: TipoNota,
    @Query('status') status?: StatusNota,
    @Query('skip', new ParseIntPipe({ optional: true })) skip = 0,
    @Query('take', new ParseIntPipe({ optional: true })) take = 10,
  ): Promise<any> {
    return this.financeiroService.findAllNotas(tenantId, { skip, take }, tipo, status);
  }

  /**
   * Criar nova nota fiscal
   * POST /financeiro/notas
   */
  @Post('notas')
  @HttpCode(HttpStatus.CREATED)
  async createNotaFiscal(
    @CurrentTenant() tenantId: string,
    @Body() createNotaFiscalDto: CreateNotaFiscalDto,
  ): Promise<NotaFiscalResponseDto> {
    return this.financeiroService.createNotaFiscal(tenantId, createNotaFiscalDto);
  }

  /**
   * Obter nota fiscal por ID
   * GET /financeiro/notas/:id
   */
  @Get('notas/:id')
  async findOneNota(
    @CurrentTenant() tenantId: string,
    @Param('id') id: string,
  ): Promise<NotaFiscalResponseDto> {
    return this.financeiroService.findOneNota(tenantId, id);
  }

  /**
   * Atualizar nota fiscal
   * PATCH /financeiro/notas/:id
   */
  @Patch('notas/:id')
  async updateNota(
    @CurrentTenant() tenantId: string,
    @Param('id') id: string,
    @Body() updateNotaFiscalDto: UpdateNotaFiscalDto,
  ): Promise<NotaFiscalResponseDto> {
    return this.financeiroService.updateNota(tenantId, id, updateNotaFiscalDto);
  }

  /**
   * Deletar nota fiscal
   * DELETE /financeiro/notas/:id
   */
  @Delete('notas/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteNota(
    @CurrentTenant() tenantId: string,
    @Param('id') id: string,
  ): Promise<void> {
    await this.financeiroService.deleteNota(tenantId, id);
  }

  /**
   * Obter resumo financeiro
   * GET /financeiro/resumo
   */
  @Get('resumo')
  async calcularResumo(
    @CurrentTenant() tenantId: string,
  ): Promise<any> {
    return this.financeiroService.calcularResumo(tenantId);
  }
}
