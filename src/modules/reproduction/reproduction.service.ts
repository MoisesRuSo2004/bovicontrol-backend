import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { AnimalSex, PregnancyStatus } from '@prisma/client';
import { paginate, getPaginationParams } from '../../common/utils/pagination.util';
import { PrismaService } from '../../prisma/prisma.service';
import { CreatePregnancyDto } from './dto/create-pregnancy.dto';
import { CreateReproductiveEventDto } from './dto/create-reproductive-event.dto';
import { UpdatePregnancyDto } from './dto/update-pregnancy.dto';

@Injectable()
export class ReproductionService {
  constructor(private readonly prisma: PrismaService) {}

  private async validateAnimal(animalId: string, farmId: string) {
    const animal = await this.prisma.animal.findFirst({ where: { id: animalId, farmId } });
    if (!animal) throw new NotFoundException(`Animal con id ${animalId} no encontrado en esta finca`);
    return animal;
  }

  // ─── Reproductive Events ────────────────────────────────────────────────────

  async createEvent(farmId: string, dto: CreateReproductiveEventDto) {
    await this.validateAnimal(dto.femaleId, farmId);
    if (dto.maleId) {
      const bull = await this.prisma.animal.findFirst({ where: { id: dto.maleId, farmId, sex: AnimalSex.MALE } });
      if (!bull) throw new NotFoundException(`Toro con id ${dto.maleId} no encontrado`);
    }
    return this.prisma.reproductiveEvent.create({
      data: { ...dto },
      include: { female: { select: { id: true, tagNumber: true, name: true } } },
    });
  }

  async findAllEvents(farmId: string, femaleId?: string, page = 1, limit = 20) {
    const { skip, take } = getPaginationParams(page, limit);
    const where: any = {
      female: { farmId },
      ...(femaleId && { femaleId }),
    };
    const [data, total] = await Promise.all([
      this.prisma.reproductiveEvent.findMany({
        where,
        skip,
        take,
        orderBy: { eventDate: 'desc' },
        include: { female: { select: { id: true, tagNumber: true, name: true } } },
      }),
      this.prisma.reproductiveEvent.count({ where }),
    ]);
    return paginate(data, total, page, limit);
  }

  async findOneEvent(id: string, farmId: string) {
    const event = await this.prisma.reproductiveEvent.findFirst({
      where: { id, female: { farmId } },
      include: { female: true },
    });
    if (!event) throw new NotFoundException(`Evento reproductivo con id ${id} no encontrado`);
    return event;
  }

  async removeEvent(id: string, farmId: string) {
    await this.findOneEvent(id, farmId);
    return this.prisma.reproductiveEvent.delete({ where: { id } });
  }

  // ─── Pregnancies ────────────────────────────────────────────────────────────

  async createPregnancy(farmId: string, dto: CreatePregnancyDto) {
    const animal = await this.validateAnimal(dto.femaleId, farmId);
    if (animal.sex !== AnimalSex.FEMALE) {
      throw new BadRequestException('Solo se puede registrar preñez para animales hembra');
    }

    const activePregnancy = await this.prisma.pregnancy.findFirst({
      where: { femaleId: dto.femaleId, status: PregnancyStatus.IN_PROGRESS },
    });
    if (activePregnancy) throw new BadRequestException('El animal ya tiene una preñez activa');

    return this.prisma.pregnancy.create({
      data: { ...dto },
      include: { female: { select: { id: true, tagNumber: true, name: true } } },
    });
  }

  async findAllPregnancies(farmId: string, femaleId?: string, status?: PregnancyStatus, page = 1, limit = 20) {
    const { skip, take } = getPaginationParams(page, limit);
    const where: any = {
      female: { farmId },
      ...(femaleId && { femaleId }),
      ...(status && { status }),
    };
    const [data, total] = await Promise.all([
      this.prisma.pregnancy.findMany({
        where,
        skip,
        take,
        orderBy: { conceptionDate: 'desc' },
        include: { female: { select: { id: true, tagNumber: true, name: true } } },
      }),
      this.prisma.pregnancy.count({ where }),
    ]);
    return paginate(data, total, page, limit);
  }

  async findOnePregnancy(id: string, farmId: string) {
    const pregnancy = await this.prisma.pregnancy.findFirst({
      where: { id, female: { farmId } },
      include: { female: true },
    });
    if (!pregnancy) throw new NotFoundException(`Registro de preñez con id ${id} no encontrado`);
    return pregnancy;
  }

  async updatePregnancy(id: string, farmId: string, dto: UpdatePregnancyDto) {
    await this.findOnePregnancy(id, farmId);
    return this.prisma.pregnancy.update({
      where: { id },
      data: dto,
      include: { female: { select: { id: true, tagNumber: true, name: true } } },
    });
  }

  async getUpcomingBirths(farmId: string, daysAhead = 30) {
    const now = new Date();
    const future = new Date(now.getTime() + daysAhead * 24 * 60 * 60 * 1000);
    return this.prisma.pregnancy.findMany({
      where: {
        female: { farmId },
        status: PregnancyStatus.IN_PROGRESS,
        expectedBirthDate: { gte: now, lte: future },
      },
      orderBy: { expectedBirthDate: 'asc' },
      include: { female: { select: { id: true, tagNumber: true, name: true } } },
    });
  }

  async updateEvent(id: string, farmId: string, dto: Partial<CreateReproductiveEventDto>) {
    await this.findOneEvent(id, farmId);
    return this.prisma.reproductiveEvent.update({
      where: { id },
      data: {
        ...(dto.type && { type: dto.type }),
        ...(dto.eventDate && { eventDate: new Date(dto.eventDate) }),
        ...(dto.notes !== undefined && { notes: dto.notes ?? null }),
        ...(dto.bullSemen !== undefined && { bullSemen: dto.bullSemen ?? null }),
        ...(dto.technicianName !== undefined && { technicianName: dto.technicianName ?? null }),
        ...(dto.maleId !== undefined && { maleId: dto.maleId || null }),
      },
      include: { female: { select: { id: true, tagNumber: true, name: true } } },
    });
  }

  async deletePregnancy(id: string, farmId: string) {
    await this.findOnePregnancy(id, farmId);
    return this.prisma.pregnancy.delete({ where: { id } });
  }
}
