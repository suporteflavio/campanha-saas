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
import { EleitoresService } from './eleitores.service';
import {
  CreateEleitorDto,
  UpdateEleitorDto,
  EleitorResponseDto,
  SegmentoEnum,
} from './eleitores.dto';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { CurrentTenant } from '@/common/decorators';

@Controller('eleitores')
@UseGuards(JwtAuthGuard)
export class EleitoresController {
  constructor(private eleitoresService: EleitoresService) {}

  /**
   * Listar eleitores com paginação e filtros
   * GET /eleitores?segmento=engajados&skip=0&take=10
   */
  @Get()
  async findAll(
    @CurrentTenant() tenantId: string,
    @Query('segmento') segmento?: SegmentoEnum,
    @Query('skip', new ParseIntPipe({ optional: true })) skip = 0,
    @Query('take', new ParseIntPipe({ optional: true })) take = 10,
  ): Promise<any> {
    return this.eleitoresService.findAll(tenantId, {
      skip,
      take,
      segmento,
    });
  }

  /**
   * Criar novo eleitor
   * POST /eleitores
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @CurrentTenant() tenantId: string,
    @Body() createEleitorDto: CreateEleitorDto,
  ): Promise<EleitorResponseDto> {
    return this.eleitoresService.create(tenantId, createEleitorDto);
  }

  /**
   * Filtrar eleitores por segmento
   * GET /eleitores/segmento/:segmento
   */
  @Get('segmento/:segmento')
  async buscarPorSegmento(
    @CurrentTenant() tenantId: string,
    @Param('segmento') segmento: SegmentoEnum,
    @Query('skip', new ParseIntPipe({ optional: true })) skip = 0,
    @Query('take', new ParseIntPipe({ optional: true })) take = 10,
  ): Promise<any> {
    return this.eleitoresService.buscarPorSegmento(tenantId, segmento, {
      skip,
      take,
    });
  }

  /**
   * Obter eleitor por ID
   * GET /eleitores/:id
   */
  @Get(':id')
  async findOne(
    @CurrentTenant() tenantId: string,
    @Param('id') id: string,
  ): Promise<EleitorResponseDto> {
    return this.eleitoresService.findOne(tenantId, id);
  }

  /**
   * Atualizar eleitor
   * PATCH /eleitores/:id
   */
  @Patch(':id')
  async update(
    @CurrentTenant() tenantId: string,
    @Param('id') id: string,
    @Body() updateEleitorDto: UpdateEleitorDto,
  ): Promise<EleitorResponseDto> {
    return this.eleitoresService.update(tenantId, id, updateEleitorDto);
  }

  /**
   * Deletar eleitor
   * DELETE /eleitores/:id
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(
    @CurrentTenant() tenantId: string,
    @Param('id') id: string,
  ): Promise<void> {
    await this.eleitoresService.delete(tenantId, id);
  }
}
