import { Injectable, NotFoundException } from '@nestjs/common';
import { paginate, getPaginationParams } from '../../common/utils/pagination.util';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateDiseaseDto } from './dto/create-disease.dto';
import { CreateHealthAlertDto } from './dto/create-health-alert.dto';
import { CreateMedicationDto } from './dto/create-medication.dto';
import { CreateTreatmentDto } from './dto/create-treatment.dto';
import { CreateVaccinationDto } from './dto/create-vaccination.dto';
import { CreateVaccineDto } from './dto/create-vaccine.dto';
import { TreatmentStatus } from '@prisma/client';

@Injectable()
export class HealthService {
  constructor(private readonly prisma: PrismaService) {}

  private async validateAnimal(animalId: string, farmId: string) {
    const animal = await this.prisma.animal.findFirst({ where: { id: animalId, farmId } });
    if (!animal) throw new NotFoundException(`Animal con id ${animalId} no encontrado en esta finca`);
    return animal;
  }

  // ─── Vaccines ───────────────────────────────────────────────────────────────

  async createVaccine(dto: CreateVaccineDto) {
    return this.prisma.vaccine.create({ data: dto });
  }

  async findAllVaccines() {
    return this.prisma.vaccine.findMany({ orderBy: { name: 'asc' } });
  }

  async findOneVaccine(id: string) {
    const v = await this.prisma.vaccine.findUnique({ where: { id } });
    if (!v) throw new NotFoundException(`Vacuna con id ${id} no encontrada`);
    return v;
  }

  // ─── Medications ────────────────────────────────────────────────────────────

  async createMedication(dto: CreateMedicationDto) {
    return this.prisma.medication.create({ data: dto });
  }

  async findAllMedications() {
    return this.prisma.medication.findMany({ orderBy: { name: 'asc' } });
  }

  async findOneMedication(id: string) {
    const m = await this.prisma.medication.findUnique({ where: { id } });
    if (!m) throw new NotFoundException(`Medicamento con id ${id} no encontrado`);
    return m;
  }

  // ─── Vaccinations ────────────────────────────────────────────────────────────

  async createVaccination(farmId: string, dto: CreateVaccinationDto) {
    await this.validateAnimal(dto.animalId, farmId);
    await this.findOneVaccine(dto.vaccineId);
    return this.prisma.vaccination.create({
      data: {
        ...dto,
        appliedDate: new Date(dto.appliedDate),
        ...(dto.nextDueDate ? { nextDueDate: new Date(dto.nextDueDate) } : {}),
      },
      include: {
        animal: { select: { id: true, tagNumber: true, name: true } },
        vaccine: { select: { id: true, name: true } },
      },
    });
  }

  async findAllVaccinations(farmId: string, animalId?: string, from?: string, to?: string, page = 1, limit = 20) {
    const { skip, take } = getPaginationParams(page, limit);
    const where: any = {
      animal: { farmId },
      ...(animalId && { animalId }),
      ...(from || to ? { appliedDate: { ...(from && { gte: new Date(from) }), ...(to && { lte: new Date(to) }) } } : {}),
    };
    const [data, total] = await Promise.all([
      this.prisma.vaccination.findMany({
        where,
        skip,
        take,
        orderBy: { appliedDate: 'desc' },
        include: {
          animal: { select: { id: true, tagNumber: true, name: true } },
          vaccine: { select: { id: true, name: true } },
        },
      }),
      this.prisma.vaccination.count({ where }),
    ]);
    return paginate(data, total, page, limit);
  }

  async getUpcomingVaccinations(farmId: string, daysAhead = 30) {
    const now = new Date();
    const future = new Date(now.getTime() + daysAhead * 24 * 60 * 60 * 1000);
    // Include overdue (up to 60 days ago) so users see what's already past due
    const overdueCutoff = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);
    return this.prisma.vaccination.findMany({
      where: {
        animal: { farmId, status: 'ACTIVE' },
        nextDueDate: { gte: overdueCutoff, lte: future },
      },
      orderBy: { nextDueDate: 'asc' },
      include: {
        animal: { select: { id: true, tagNumber: true, name: true } },
        vaccine: { select: { id: true, name: true } },
      },
    });
  }

  async findOneVaccination(id: string, farmId: string) {
    const v = await this.prisma.vaccination.findFirst({
      where: { id, animal: { farmId } },
      include: { animal: true, vaccine: true },
    });
    if (!v) throw new NotFoundException(`Vacunación con id ${id} no encontrada`);
    return v;
  }

  async updateVaccination(id: string, farmId: string, dto: Partial<CreateVaccinationDto>) {
    await this.findOneVaccination(id, farmId);
    if (dto.vaccineId) await this.findOneVaccine(dto.vaccineId);
    return this.prisma.vaccination.update({
      where: { id },
      data: {
        ...(dto.vaccineId    && { vaccineId:    dto.vaccineId }),
        ...(dto.appliedDate  && { appliedDate:  new Date(dto.appliedDate) }),
        ...(dto.nextDueDate !== undefined && {
          nextDueDate: dto.nextDueDate ? new Date(dto.nextDueDate) : null,
        }),
        ...(dto.doseMl      !== undefined && { doseMl:      dto.doseMl ?? null }),
        ...(dto.batchNumber !== undefined && { batchNumber: dto.batchNumber ?? null }),
        ...(dto.notes       !== undefined && { notes:       dto.notes ?? null }),
      },
      include: {
        animal: { select: { id: true, tagNumber: true, name: true } },
        vaccine: { select: { id: true, name: true } },
      },
    });
  }

  async deleteVaccination(id: string, farmId: string) {
    await this.findOneVaccination(id, farmId);
    return this.prisma.vaccination.delete({ where: { id } });
  }

  // ─── Treatments ─────────────────────────────────────────────────────────────

  async createTreatment(farmId: string, dto: CreateTreatmentDto) {
    await this.validateAnimal(dto.animalId, farmId);
    if (dto.medicationId) await this.findOneMedication(dto.medicationId);
    return this.prisma.treatment.create({
      data: { ...dto },
      include: {
        animal: { select: { id: true, tagNumber: true, name: true } },
        medication: { select: { id: true, name: true } },
      },
    });
  }

  async findAllTreatments(farmId: string, animalId?: string, status?: TreatmentStatus, from?: string, to?: string, page = 1, limit = 20) {
    const { skip, take } = getPaginationParams(page, limit);
    const where: any = {
      animal: { farmId },
      ...(animalId && { animalId }),
      ...(status && { status }),
      ...(from || to ? { startDate: { ...(from && { gte: new Date(from) }), ...(to && { lte: new Date(to) }) } } : {}),
    };
    const [data, total] = await Promise.all([
      this.prisma.treatment.findMany({
        where,
        skip,
        take,
        orderBy: { startDate: 'desc' },
        include: {
          animal: { select: { id: true, tagNumber: true, name: true } },
          medication: { select: { id: true, name: true } },
        },
      }),
      this.prisma.treatment.count({ where }),
    ]);
    return paginate(data, total, page, limit);
  }

  async findOneTreatment(id: string, farmId: string) {
    const t = await this.prisma.treatment.findFirst({
      where: { id, animal: { farmId } },
      include: { animal: true, medication: true },
    });
    if (!t) throw new NotFoundException(`Tratamiento con id ${id} no encontrado`);
    return t;
  }

  async updateTreatment(id: string, farmId: string, data: Partial<CreateTreatmentDto>) {
    await this.findOneTreatment(id, farmId);
    return this.prisma.treatment.update({ where: { id }, data });
  }

  // ─── Diseases ────────────────────────────────────────────────────────────────

  async createDisease(farmId: string, dto: CreateDiseaseDto) {
    await this.validateAnimal(dto.animalId, farmId);
    return this.prisma.disease.create({
      data: { ...dto },
      include: { animal: { select: { id: true, tagNumber: true, name: true } } },
    });
  }

  async findAllDiseases(farmId: string, animalId?: string, page = 1, limit = 20) {
    const { skip, take } = getPaginationParams(page, limit);
    const where: any = {
      animal: { farmId },
      ...(animalId && { animalId }),
    };
    const [data, total] = await Promise.all([
      this.prisma.disease.findMany({
        where,
        skip,
        take,
        orderBy: { diagnosisDate: 'desc' },
        include: {
          animal: { select: { id: true, tagNumber: true, name: true } },
        },
      }),
      this.prisma.disease.count({ where }),
    ]);
    return paginate(data, total, page, limit);
  }

  async findOneDisease(id: string, farmId: string) {
    const d = await this.prisma.disease.findFirst({
      where: { id, animal: { farmId } },
      include: { animal: true },
    });
    if (!d) throw new NotFoundException(`Enfermedad con id ${id} no encontrada`);
    return d;
  }

  async updateDisease(id: string, farmId: string, data: Partial<CreateDiseaseDto>) {
    await this.findOneDisease(id, farmId);
    return this.prisma.disease.update({ where: { id }, data });
  }

  // ─── Health Alerts ───────────────────────────────────────────────────────────

  async createAlert(farmId: string, dto: CreateHealthAlertDto) {
    if (dto.animalId) await this.validateAnimal(dto.animalId, farmId);
    return this.prisma.healthAlert.create({ data: { ...dto, farmId } });
  }

  async findAllAlerts(farmId: string, isCompleted?: boolean, page = 1, limit = 20) {
    const { skip, take } = getPaginationParams(page, limit);
    const where: any = {
      farmId,
      ...(isCompleted !== undefined && { isCompleted }),
    };
    const [data, total] = await Promise.all([
      this.prisma.healthAlert.findMany({
        where,
        skip,
        take,
        orderBy: { scheduledDate: 'asc' },
        include: { animal: { select: { id: true, tagNumber: true, name: true } } },
      }),
      this.prisma.healthAlert.count({ where }),
    ]);
    return paginate(data, total, page, limit);
  }

  async getUpcomingAlerts(farmId: string, daysAhead = 7) {
    const now = new Date();
    const future = new Date(now.getTime() + daysAhead * 24 * 60 * 60 * 1000);
    return this.prisma.healthAlert.findMany({
      where: {
        farmId,
        isCompleted: false,
        scheduledDate: { gte: now, lte: future },
      },
      orderBy: { scheduledDate: 'asc' },
      include: { animal: { select: { id: true, tagNumber: true, name: true } } },
    });
  }

  async resolveAlert(id: string, farmId: string) {
    const alert = await this.prisma.healthAlert.findFirst({ where: { id, farmId } });
    if (!alert) throw new NotFoundException(`Alerta con id ${id} no encontrada`);
    return this.prisma.healthAlert.update({
      where: { id },
      data: { isCompleted: true, completedAt: new Date() },
    });
  }
}
