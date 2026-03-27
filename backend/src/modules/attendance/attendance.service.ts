import {
  Injectable,
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '@/common/prisma/prisma.service';
import { CreateAttendanceDto } from './attendance.dto';

@Injectable()
export class AttendanceService {
  constructor(private prisma: PrismaService) {}

  private toRadians(value: number): number {
    return (value * Math.PI) / 180;
  }

  validarDistancia(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371000; // metros
    const dLat = this.toRadians(lat2 - lat1);
    const dLng = this.toRadians(lng2 - lng1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRadians(lat1)) *
        Math.cos(this.toRadians(lat2)) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private async getReuniaoLocation(reuniaoId: string) {
    const reuniao = await this.prisma.reuniao.findUnique({ where: { id: reuniaoId } });

    if (!reuniao) {
      throw new NotFoundException(`Reunião com ID ${reuniaoId} não encontrada`);
    }

    if (reuniao.latitude === null || reuniao.latitude === undefined || reuniao.longitude === null || reuniao.longitude === undefined) {
      throw new BadRequestException('Reunião não possui coordenadas de geolocalização para validação');
    }

    return reuniao;
  }

  async registrarPresenca(reuniaoId: string, dto: CreateAttendanceDto) {
    if (!dto.consentimentoLGPD) {
      throw new BadRequestException('Consentimento LGPD é obrigatório');
    }

    if (!dto.whatsappVotante && !dto.cpfVotante) {
      throw new BadRequestException('WhatsApp ou CPF do votante é obrigatório para evitar duplicatas');
    }

    const reuniao = await this.getReuniaoLocation(reuniaoId);

    const orConditions: any[] = [];
    if (dto.whatsappVotante) orConditions.push({ whatsappVotante: dto.whatsappVotante });
    if (dto.cpfVotante) orConditions.push({ cpfVotante: dto.cpfVotante });

    const duplicate = await this.prisma.meetingAttendance.findFirst({
      where: {
        OR: orConditions,
      },
      include: {
        reuniao: true,
      },
    });

    if (duplicate && duplicate.reuniao && duplicate.reuniaoId !== reuniaoId) {
      const sameDay =
        duplicate.reuniao.data.toISOString().slice(0, 10) === reuniao.data.toISOString().slice(0, 10);
      if (sameDay) {
        throw new ConflictException('CPF/WhatsApp já registrado em outra reunião no mesmo dia');
      }
    }

    const distanciaMetros = this.validarDistancia(
      dto.latitude,
      dto.longitude,
      reuniao.latitude,
      reuniao.longitude,
    );

    const valida = distanciaMetros <= 500;

    const created = await this.prisma.meetingAttendance.create({
      data: {
        reuniaoId,
        nomeVotante: dto.nomeVotante,
        telefoneVotante: dto.telefoneVotante,
        whatsappVotante: dto.whatsappVotante,
        cpfVotante: dto.cpfVotante,
        interesses: JSON.stringify(dto.interesses || []),
        latitude: dto.latitude,
        longitude: dto.longitude,
        distanciaMetros: Math.round(distanciaMetros),
        valida,
        consentimentoLGPD: dto.consentimentoLGPD,
      },
    });

    return created;
  }

  async listarPresentes(
    reuniaoId: string,
    filtros?: {
      valida?: boolean;
      nomeVotante?: string;
      interesse?: string;
    },
  ) {
    const where: any = {
      reuniaoId,
    };

    if (filtros?.valida !== undefined) {
      where.valida = filtros.valida;
    }

    if (filtros?.nomeVotante) {
      where.nomeVotante = { contains: filtros.nomeVotante };
    }

    const presentes = await this.prisma.meetingAttendance.findMany({ where });

    if (filtros?.interesse) {
      return presentes.filter((p) => {
        try {
          const arr: string[] = p.interesses ? JSON.parse(p.interesses) : [];
          return arr.includes(filtros.interesse as string);
        } catch {
          return false;
        }
      });
    }

    return presentes;
  }

  async listarPresentesValidadas(reuniaoId: string) {
    return this.listarPresentes(reuniaoId, { valida: true });
  }
}
