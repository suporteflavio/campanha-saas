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
import { MetasService } from './metas.service';
import {
  CreateMetaDto,
  UpdateMetaDto,
  RegistrarProgressoDto,
  SimulacaoMetaDto,
  MetaResponseDto,
} from './metas.dto';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { CurrentTenant } from '@/common/decorators';

@Controller('metas')
@UseGuards(JwtAuthGuard)
export class MetasController {
  constructor(private metasService: MetasService) {}

  /**
   * Listar metas com paginação
   * GET /metas?skip=0&take=10
   */
  @Get()
  async findAll(
    @CurrentTenant() tenantId: string,
    @Query('skip', new ParseIntPipe({ optional: true })) skip = 0,
    @Query('take', new ParseIntPipe({ optional: true })) take = 10,
  ): Promise<any> {
    return this.metasService.findAll(tenantId, { skip, take });
  }

  /**
   * Criar nova meta
   * POST /metas
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @CurrentTenant() tenantId: string,
    @Body() createMetaDto: CreateMetaDto,
  ): Promise<MetaResponseDto> {
    return this.metasService.create(tenantId, createMetaDto);
  }

  /**
   * Obter meta por ID
   * GET /metas/:id
   */
  @Get(':id')
  async findOne(
    @CurrentTenant() tenantId: string,
    @Param('id') id: string,
  ): Promise<MetaResponseDto> {
    return this.metasService.findOne(tenantId, id);
  }

  /**
   * Atualizar meta
   * PATCH /metas/:id
   */
  @Patch(':id')
  async update(
    @CurrentTenant() tenantId: string,
    @Param('id') id: string,
    @Body() updateMetaDto: UpdateMetaDto,
  ): Promise<MetaResponseDto> {
    return this.metasService.update(tenantId, id, updateMetaDto);
  }

  /**
   * Deletar meta
   * DELETE /metas/:id
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(
    @CurrentTenant() tenantId: string,
    @Param('id') id: string,
  ): Promise<void> {
    await this.metasService.delete(tenantId, id);
  }

  /**
   * Registrar progresso na meta
   * POST /metas/:id/progresso
   */
  @Post(':id/progresso')
  async registrarProgresso(
    @CurrentTenant() tenantId: string,
    @Param('id') id: string,
    @Body() registrarProgressoDto: RegistrarProgressoDto,
  ): Promise<MetaResponseDto> {
    return this.metasService.registrarProgresso(
      tenantId,
      id,
      registrarProgressoDto.incremento,
    );
  }

  /**
   * Calcular simulação de votos
   * POST /metas/:id/simulacao
   */
  @Post(':id/simulacao')
  async calcularSimulacao(
    @CurrentTenant() tenantId: string,
    @Param('id') id: string,
    @Body() simulacaoDto: SimulacaoMetaDto,
  ): Promise<any> {
    return this.metasService.calcularSimulacao(
      tenantId,
      id,
      simulacaoDto.votosProjetados,
    );
  }
}
