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
import { ReunioesService } from './reunioes.service';
import {
  CreateReuniaoDto,
  UpdateReuniaoDto,
  RegistrarPresencaDto,
  ReuniaoResponseDto,
} from './reunioes.dto';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { CurrentTenant } from '@/common/decorators';

@Controller('reunioes')
@UseGuards(JwtAuthGuard)
export class ReunioesController {
  constructor(private reunioesService: ReunioesService) {}

  /**
   * Listar reuniões com filtro opcional por mês
   * GET /reunioes?mes=03
   */
  @Get()
  async findAll(
    @CurrentTenant() tenantId: string,
    @Query('mes') mes?: string,
    @Query('skip', new ParseIntPipe({ optional: true })) skip = 0,
    @Query('take', new ParseIntPipe({ optional: true })) take = 10,
  ): Promise<any> {
    return this.reunioesService.findAll(tenantId, { skip, take }, mes);
  }

  /**
   * Criar nova reunião
   * POST /reunioes
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @CurrentTenant() tenantId: string,
    @Body() createReuniaoDto: CreateReuniaoDto,
  ): Promise<ReuniaoResponseDto> {
    return this.reunioesService.create(tenantId, createReuniaoDto);
  }

  /**
   * Obter reunião por ID
   * GET /reunioes/:id
   */
  @Get(':id')
  async findOne(
    @CurrentTenant() tenantId: string,
    @Param('id') id: string,
  ): Promise<ReuniaoResponseDto> {
    return this.reunioesService.findOne(tenantId, id);
  }

  /**
   * Atualizar reunião
   * PATCH /reunioes/:id
   */
  @Patch(':id')
  async update(
    @CurrentTenant() tenantId: string,
    @Param('id') id: string,
    @Body() updateReuniaoDto: UpdateReuniaoDto,
  ): Promise<ReuniaoResponseDto> {
    return this.reunioesService.update(tenantId, id, updateReuniaoDto);
  }

  /**
   * Deletar reunião
   * DELETE /reunioes/:id
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(
    @CurrentTenant() tenantId: string,
    @Param('id') id: string,
  ): Promise<void> {
    await this.reunioesService.delete(tenantId, id);
  }

  /**
   * Registrar presença em reunião
   * POST /reunioes/:id/presenca
   */
  @Post(':id/presenca')
  async registrarPresenca(
    @CurrentTenant() tenantId: string,
    @Param('id') id: string,
    @Body() registrarPresencaDto: RegistrarPresencaDto,
  ): Promise<ReuniaoResponseDto> {
    return this.reunioesService.registrarPresenca(
      tenantId,
      id,
      registrarPresencaDto.presentes,
    );
  }
}
