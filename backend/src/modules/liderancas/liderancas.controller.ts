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
import { LiderancasService } from './liderancas.service';
import {
  CreateLiderancaDto,
  UpdateLiderancaDto,
  UpdateLiderancaScoreDto,
  LiderancaResponseDto,
} from './liderancas.dto';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { CurrentTenant } from '@/common/decorators';

@Controller('liderancas')
@UseGuards(JwtAuthGuard)
export class LiderancasController {
  constructor(private liderancasService: LiderancasService) {}

  /**
   * Listar lideranças com paginação
   * GET /liderancas?skip=0&take=10
   */
  @Get()
  async findAll(
    @CurrentTenant() tenantId: string,
    @Query('skip', new ParseIntPipe({ optional: true })) skip = 0,
    @Query('take', new ParseIntPipe({ optional: true })) take = 10,
  ): Promise<any> {
    return this.liderancasService.findAll(tenantId, { skip, take });
  }

  /**
   * Criar nova liderança
   * POST /liderancas
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @CurrentTenant() tenantId: string,
    @Body() createLiderancaDto: CreateLiderancaDto,
  ): Promise<LiderancaResponseDto> {
    return this.liderancasService.create(tenantId, createLiderancaDto);
  }

  /**
   * Obter liderança por ID
   * GET /liderancas/:id
   */
  @Get(':id')
  async findOne(
    @CurrentTenant() tenantId: string,
    @Param('id') id: string,
  ): Promise<LiderancaResponseDto> {
    return this.liderancasService.findOne(tenantId, id);
  }

  /**
   * Atualizar liderança
   * PATCH /liderancas/:id
   */
  @Patch(':id')
  async update(
    @CurrentTenant() tenantId: string,
    @Param('id') id: string,
    @Body() updateLiderancaDto: UpdateLiderancaDto,
  ): Promise<LiderancaResponseDto> {
    return this.liderancasService.update(tenantId, id, updateLiderancaDto);
  }

  /**
   * Deletar liderança
   * DELETE /liderancas/:id
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(
    @CurrentTenant() tenantId: string,
    @Param('id') id: string,
  ): Promise<void> {
    await this.liderancasService.delete(tenantId, id);
  }

  /**
   * Atualizar score de gamificação
   * PATCH /liderancas/:id/score
   */
  @Patch(':id/score')
  async updateScore(
    @CurrentTenant() tenantId: string,
    @Param('id') id: string,
    @Body() updateScoreDto: UpdateLiderancaScoreDto,
  ): Promise<LiderancaResponseDto> {
    return this.liderancasService.updateScore(
      tenantId,
      id,
      updateScoreDto.score,
    );
  }
}
