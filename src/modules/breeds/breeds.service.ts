import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateBreedDto } from './dto/create-breed.dto';
import { UpdateBreedDto } from './dto/update-breed.dto';

@Injectable()
export class BreedsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateBreedDto) {
    const existing = await this.prisma.breed.findFirst({ where: { name: { equals: dto.name, mode: 'insensitive' } } });
    if (existing) throw new ConflictException(`Ya existe una raza con el nombre "${dto.name}"`);
    return this.prisma.breed.create({ data: dto });
  }

  async findAll() {
    return this.prisma.breed.findMany({
      orderBy: { name: 'asc' },
      include: { _count: { select: { animals: true } } },
    });
  }

  async findOne(id: string) {
    const breed = await this.prisma.breed.findUnique({
      where: { id },
      include: { _count: { select: { animals: true } } },
    });
    if (!breed) throw new NotFoundException(`Raza con id ${id} no encontrada`);
    return breed;
  }

  async update(id: string, dto: UpdateBreedDto) {
    await this.findOne(id);
    if (dto.name) {
      const existing = await this.prisma.breed.findFirst({
        where: { name: { equals: dto.name, mode: 'insensitive' }, NOT: { id } },
      });
      if (existing) throw new ConflictException(`Ya existe otra raza con el nombre "${dto.name}"`);
    }
    return this.prisma.breed.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    const breed = await this.findOne(id);
    if ((breed._count as any).animals > 0) {
      throw new ConflictException('No puedes eliminar una raza que tiene animales asociados');
    }
    return this.prisma.breed.delete({ where: { id } });
  }
}
