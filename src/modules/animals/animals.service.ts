import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';

const MAX_GALLERY_PHOTOS = 5;
import { extname } from 'path';
import { randomUUID } from 'crypto';
import { paginate, getPaginationParams } from '../../common/utils/pagination.util';
import { PrismaService } from '../../prisma/prisma.service';
import { ANIMAL_PHOTOS_BUCKET, SupabaseService } from '../../supabase/supabase.service';
import { CreateAnimalDto } from './dto/create-animal.dto';
import { QueryAnimalDto } from './dto/query-animal.dto';
import { UpdateAnimalDto } from './dto/update-animal.dto';

@Injectable()
export class AnimalsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly supabase: SupabaseService,
  ) {}

  async create(farmId: string, dto: CreateAnimalDto) {
    const existing = await this.prisma.animal.findFirst({
      where: { tagNumber: dto.tagNumber, farmId },
    });
    if (existing) {
      throw new BadRequestException(`Ya existe un animal con el arete "${dto.tagNumber}" en esta finca`);
    }

    if (dto.breedId) {
      const breed = await this.prisma.breed.findUnique({ where: { id: dto.breedId } });
      if (!breed) throw new NotFoundException(`Raza con id ${dto.breedId} no encontrada`);
    }

    if (dto.fatherId) {
      const father = await this.prisma.animal.findFirst({ where: { id: dto.fatherId, farmId } });
      if (!father) throw new NotFoundException(`Padre con id ${dto.fatherId} no encontrado en esta finca`);
    }

    if (dto.motherId) {
      const mother = await this.prisma.animal.findFirst({ where: { id: dto.motherId, farmId } });
      if (!mother) throw new NotFoundException(`Madre con id ${dto.motherId} no encontrada en esta finca`);
    }

    return this.prisma.animal.create({
      data: {
        ...dto,
        farmId,
        // Prisma DateTime requires a full ISO-8601 string; a date-only string ("YYYY-MM-DD")
        // causes a "premature end of input" validation error, so we convert it here.
        ...(dto.birthDate ? { birthDate: new Date(dto.birthDate) } : {}),
      },
      include: { breed: true, father: { select: { id: true, tagNumber: true, name: true } }, mother: { select: { id: true, tagNumber: true, name: true } } },
    });
  }

  async findAll(farmId: string, query: QueryAnimalDto) {
    const { page = 1, limit = 20, status, sex, breedId, search } = query;
    const { skip, take } = getPaginationParams(page, limit);

    const where: Prisma.AnimalWhereInput = {
      farmId,
      ...(status && { status }),
      ...(sex && { sex }),
      ...(breedId && { breedId }),
      ...(search && {
        OR: [
          { tagNumber: { contains: search, mode: 'insensitive' } },
          { name: { contains: search, mode: 'insensitive' } },
        ],
      }),
    };

    const [data, total] = await Promise.all([
      this.prisma.animal.findMany({
        where,
        skip,
        take,
        orderBy: { tagNumber: 'asc' },
        include: {
          breed: { select: { id: true, name: true } },
          father: { select: { id: true, tagNumber: true, name: true } },
          mother: { select: { id: true, tagNumber: true, name: true } },
        },
      }),
      this.prisma.animal.count({ where }),
    ]);

    return paginate(data, total, page, limit);
  }

  // ─── Category Summary ────────────────────────────────────────────────────────
  // Categories follow the standard Colombian cattle classification:
  //   Males:   TERNERO (0-8m) · MACHO_LEVANTE (8-24m) · TORO (>24m)
  //   Females: TERNERA (0-8m) · NOVILLA (>8m, no births) · VACA_PRENADA (active pregnancy)
  //            VACA_PARIDA (birth ≤10m ago) · VACA_ESCOTERAS (birth >10m ago, not pregnant)

  async getCategorySummary(farmId: string) {
    const now = new Date();

    const animals = await this.prisma.animal.findMany({
      where: { farmId, status: 'ACTIVE' },
      select: {
        id: true,
        tagNumber: true,
        name: true,
        sex: true,
        birthDate: true,
        currentWeight: true,
        photoUrl: true,
        breed: { select: { name: true } },
        // Only fetch pregnancies for females (status IN_PROGRESS or COMPLETED)
        pregnanciesAsFemale: {
          where: { status: { in: ['IN_PROGRESS', 'COMPLETED'] } },
          select: { status: true, actualBirthDate: true },
          orderBy: { conceptionDate: 'desc' },
        },
      },
      orderBy: { tagNumber: 'asc' },
    });

    const getAgeMonths = (birthDate: Date | null): number | null => {
      if (!birthDate) return null;
      return Math.floor(
        (now.getTime() - birthDate.getTime()) / (1000 * 60 * 60 * 24 * 30.44),
      );
    };

    const categorized = animals.map((animal) => {
      const ageMonths = getAgeMonths(animal.birthDate);
      let category: string;

      if (animal.sex === 'MALE') {
        if (ageMonths === null || ageMonths >= 24) category = 'TORO';
        else if (ageMonths < 8) category = 'TERNERO';
        else category = 'MACHO_LEVANTE';
      } else {
        // Female logic
        if (ageMonths !== null && ageMonths < 8) {
          category = 'TERNERA';
        } else {
          const activePreg = animal.pregnanciesAsFemale.find((p) => p.status === 'IN_PROGRESS');
          const lastBirth  = animal.pregnanciesAsFemale.find(
            (p) => p.status === 'COMPLETED' && p.actualBirthDate != null,
          );

          if (activePreg) {
            category = 'VACA_PRENADA';
          } else if (lastBirth?.actualBirthDate) {
            const monthsSince = Math.floor(
              (now.getTime() - lastBirth.actualBirthDate.getTime()) / (1000 * 60 * 60 * 24 * 30.44),
            );
            category = monthsSince <= 10 ? 'VACA_PARIDA' : 'VACA_ESCOTERAS';
          } else {
            category = 'NOVILLA'; // includes heifers of any age without births
          }
        }
      }

      return {
        id:            animal.id,
        tagNumber:     animal.tagNumber,
        name:          animal.name,
        sex:           animal.sex,
        ageMonths,
        currentWeight: animal.currentWeight,
        photoUrl:      animal.photoUrl,
        breedName:     animal.breed?.name ?? null,
        category,
      };
    });

    // Aggregate counts
    const counts: Record<string, number> = {};
    for (const a of categorized) {
      counts[a.category] = (counts[a.category] ?? 0) + 1;
    }

    // Ordered category list (fixed display order)
    const ORDER = ['TERNERO','TERNERA','MACHO_LEVANTE','TORO','NOVILLA','VACA_PRENADA','VACA_PARIDA','VACA_ESCOTERAS'];
    const categories = ORDER.map((key) => ({ key, count: counts[key] ?? 0 })).filter((c) => c.count > 0);

    return { total: animals.length, categories, animals: categorized };
  }

  async findOne(id: string, farmId: string) {
    const animal = await this.prisma.animal.findFirst({
      where: { id, farmId },
      include: {
        breed: true,
        father: { select: { id: true, tagNumber: true, name: true, sex: true } },
        mother: { select: { id: true, tagNumber: true, name: true, sex: true } },
        fatherOf: { select: { id: true, tagNumber: true, name: true, sex: true, status: true } },
        motherOf: { select: { id: true, tagNumber: true, name: true, sex: true, status: true } },
        _count: {
          select: {
            reproductiveEventsAsFemale: true,
            pregnanciesAsFemale: true,
            vaccinations: true,
            treatments: true,
            milkRecords: true,
            weightRecords: true,
          },
        },
      },
    });
    if (!animal) throw new NotFoundException(`Animal con id ${id} no encontrado en esta finca`);
    return animal;
  }

  async update(id: string, farmId: string, dto: UpdateAnimalDto) {
    await this.findOne(id, farmId);

    if (dto.tagNumber) {
      const existing = await this.prisma.animal.findFirst({
        where: { tagNumber: dto.tagNumber, farmId, NOT: { id } },
      });
      if (existing) throw new BadRequestException(`Ya existe otro animal con el arete "${dto.tagNumber}"`);
    }

    return this.prisma.animal.update({
      where: { id },
      data: {
        ...dto,
        ...(dto.birthDate ? { birthDate: new Date(dto.birthDate) } : {}),
      },
      include: { breed: true },
    });
  }

  async remove(id: string, farmId: string) {
    const animal = await this.findOne(id, farmId);
    // Clean up photo from Supabase Storage before deleting the record
    if (animal.photoUrl) {
      await this.supabase.deleteFileByUrl(ANIMAL_PHOTOS_BUCKET, animal.photoUrl);
    }
    return this.prisma.animal.delete({ where: { id } });
  }

  // ── Photo management (Supabase Storage) ──────────────────────────────────

  async updatePhoto(
    id: string,
    farmId: string,
    buffer: Buffer,
    mimetype: string,
    originalName: string,
  ) {
    const animal = await this.findOne(id, farmId);

    // Delete old photo from Supabase Storage (non-blocking, best-effort)
    if (animal.photoUrl) {
      await this.supabase.deleteFileByUrl(ANIMAL_PHOTOS_BUCKET, animal.photoUrl);
    }

    // Build a unique path: "animal-photos/<animalId>/<uuid>.<ext>"
    const ext = (extname(originalName) || '.jpg').toLowerCase();
    const storagePath = `${id}/${randomUUID()}${ext}`;

    const photoUrl = await this.supabase.uploadFile(
      ANIMAL_PHOTOS_BUCKET,
      storagePath,
      buffer,
      mimetype,
    );

    return this.prisma.animal.update({
      where: { id },
      data: { photoUrl },
      include: {
        breed: true,
        father: { select: { id: true, tagNumber: true, name: true, sex: true } },
        mother: { select: { id: true, tagNumber: true, name: true, sex: true } },
      },
    });
  }

  async removePhoto(id: string, farmId: string) {
    const animal = await this.findOne(id, farmId);
    if (animal.photoUrl) {
      await this.supabase.deleteFileByUrl(ANIMAL_PHOTOS_BUCKET, animal.photoUrl);
    }
    await this.prisma.animal.update({ where: { id }, data: { photoUrl: null } });
  }

  // ── Gallery management (Supabase Storage) ────────────────────────────────

  async getGallery(id: string, farmId: string) {
    await this.findOne(id, farmId); // ownership check
    return this.prisma.animalPhoto.findMany({
      where: { animalId: id },
      orderBy: { createdAt: 'asc' },
    });
  }

  async addGalleryPhoto(
    id: string,
    farmId: string,
    buffer: Buffer,
    mimetype: string,
    originalName: string,
  ) {
    await this.findOne(id, farmId);

    const count = await this.prisma.animalPhoto.count({ where: { animalId: id } });
    if (count >= MAX_GALLERY_PHOTOS) {
      throw new BadRequestException(
        `El animal ya tiene el máximo de ${MAX_GALLERY_PHOTOS} fotos en su galería`,
      );
    }

    const ext = (extname(originalName) || '.jpg').toLowerCase();
    const storagePath = `gallery/${id}/${randomUUID()}${ext}`;

    const url = await this.supabase.uploadFile(
      ANIMAL_PHOTOS_BUCKET,
      storagePath,
      buffer,
      mimetype,
    );

    return this.prisma.animalPhoto.create({ data: { animalId: id, url } });
  }

  async removeGalleryPhoto(id: string, farmId: string, photoId: string) {
    await this.findOne(id, farmId);

    const photo = await this.prisma.animalPhoto.findFirst({
      where: { id: photoId, animalId: id },
    });
    if (!photo) throw new NotFoundException(`Foto con id ${photoId} no encontrada`);

    await this.supabase.deleteFileByUrl(ANIMAL_PHOTOS_BUCKET, photo.url);
    await this.prisma.animalPhoto.delete({ where: { id: photoId } });
  }

  async getStats(farmId: string) {
    const [total, bySex, byStatus, pregnancies] = await Promise.all([
      this.prisma.animal.count({ where: { farmId } }),
      this.prisma.animal.groupBy({ by: ['sex'], where: { farmId }, _count: true }),
      this.prisma.animal.groupBy({ by: ['status'], where: { farmId }, _count: true }),
      this.prisma.pregnancy.count({ where: { female: { farmId }, status: 'IN_PROGRESS' } }),
    ]);

    const active = byStatus.find((s) => s.status === 'ACTIVE')?._count ?? 0;
    const females = bySex.find((s) => s.sex === 'FEMALE')?._count ?? 0;
    const males = bySex.find((s) => s.sex === 'MALE')?._count ?? 0;

    return { total, active, females, males, pregnancies, bySex, byStatus };
  }
}
