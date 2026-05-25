import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateFarmDto } from './dto/create-farm.dto';
import { UpdateFarmDto } from './dto/update-farm.dto';

@Injectable()
export class FarmsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateFarmDto) {
    if (dto.rut) {
      const existing = await this.prisma.farm.findUnique({ where: { rut: dto.rut } });
      if (existing) throw new ConflictException(`Ya existe una finca con el RUT ${dto.rut}`);
    }
    return this.prisma.farm.create({ data: dto });
  }

  async findAll() {
    return this.prisma.farm.findMany({
      orderBy: { name: 'asc' },
      select: {
        id: true,
        name: true,
        location: true,
        department: true,
        municipality: true,
        areaHectares: true,
        phone: true,
        email: true,
        rut: true,
        isActive: true,
        createdAt: true,
        _count: { select: { animals: true, users: true } },
      },
    });
  }

  async findOne(id: string) {
    const farm = await this.prisma.farm.findUnique({
      where: { id },
      include: {
        _count: {
          select: { animals: true, users: true },
        },
      },
    });
    if (!farm) throw new NotFoundException(`Finca con id ${id} no encontrada`);
    return farm;
  }

  async update(id: string, dto: UpdateFarmDto) {
    await this.findOne(id);
    if (dto.rut) {
      const existing = await this.prisma.farm.findFirst({
        where: { rut: dto.rut, NOT: { id } },
      });
      if (existing) throw new ConflictException(`Ya existe otra finca con el RUT ${dto.rut}`);
    }
    return this.prisma.farm.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.farm.delete({ where: { id } });
  }
}
