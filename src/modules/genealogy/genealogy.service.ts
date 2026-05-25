import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

export interface AnimalNode {
  id: string;
  tagNumber: string;
  name: string | null;
  sex: string;
  birthDate: Date | null;
  photoUrl: string | null;
  breed: { id: string; name: string } | null;
  father?: AnimalNode | null;
  mother?: AnimalNode | null;
}

@Injectable()
export class GenealogyService {
  constructor(private readonly prisma: PrismaService) {}

  private async getAnimalOrFail(id: string, farmId: string) {
    const animal = await this.prisma.animal.findFirst({
      where: { id, farmId },
      select: { id: true, tagNumber: true, name: true, sex: true, birthDate: true, photoUrl: true, fatherId: true, motherId: true, breed: { select: { id: true, name: true } } },
    });
    if (!animal) throw new NotFoundException(`Animal con id ${id} no encontrado en esta finca`);
    return animal;
  }

  async getAnimalTree(id: string, farmId: string): Promise<AnimalNode> {
    return this.buildAncestorTree(id, farmId, 3);
  }

  private async buildAncestorTree(id: string, farmId: string, depth: number): Promise<AnimalNode> {
    const animal = await this.getAnimalOrFail(id, farmId);
    const node: AnimalNode = {
      id: animal.id,
      tagNumber: animal.tagNumber,
      name: animal.name,
      sex: animal.sex,
      birthDate: animal.birthDate,
      photoUrl: animal.photoUrl,
      breed: animal.breed,
    };

    if (depth > 0) {
      if (animal.fatherId) {
        try {
          node.father = await this.buildAncestorTree(animal.fatherId, farmId, depth - 1);
        } catch {
          node.father = null;
        }
      }
      if (animal.motherId) {
        try {
          node.mother = await this.buildAncestorTree(animal.motherId, farmId, depth - 1);
        } catch {
          node.mother = null;
        }
      }
    }

    return node;
  }

  async getAncestors(id: string, farmId: string, generations = 3) {
    const safeGenerations = Math.min(Math.max(1, generations), 5);
    const ancestorIds = new Set<string>();
    const ancestors: Array<{ id: string; tagNumber: string; name: string | null; sex: string; generation: number }> = [];

    const collectAncestors = async (animalId: string, generation: number) => {
      if (generation > safeGenerations) return;
      const animal = await this.prisma.animal.findFirst({
        where: { id: animalId, farmId },
        select: { id: true, tagNumber: true, name: true, sex: true, fatherId: true, motherId: true },
      });
      if (!animal) return;

      if (!ancestorIds.has(animal.id)) {
        ancestorIds.add(animal.id);
        if (generation > 0) {
          ancestors.push({ id: animal.id, tagNumber: animal.tagNumber, name: animal.name, sex: animal.sex, generation });
        }
      }

      const tasks: Promise<void>[] = [];
      if (animal.fatherId) tasks.push(collectAncestors(animal.fatherId, generation + 1));
      if (animal.motherId) tasks.push(collectAncestors(animal.motherId, generation + 1));
      await Promise.all(tasks);
    };

    await collectAncestors(id, 0);
    return ancestors.sort((a, b) => a.generation - b.generation);
  }

  async getDescendants(id: string, farmId: string, generations = 3) {
    await this.getAnimalOrFail(id, farmId);
    const safeGenerations = Math.min(Math.max(1, generations), 5);
    const descendants: Array<{ id: string; tagNumber: string; name: string | null; sex: string; photoUrl: string | null; generation: number; parentRole: string }> = [];
    const visitedIds = new Set<string>([id]);

    const collectDescendants = async (animalId: string, generation: number) => {
      if (generation > safeGenerations) return;

      const children = await this.prisma.animal.findMany({
        where: {
          farmId,
          OR: [{ fatherId: animalId }, { motherId: animalId }],
        },
        select: { id: true, tagNumber: true, name: true, sex: true, photoUrl: true, fatherId: true, motherId: true },
      });

      const tasks: Promise<void>[] = [];
      for (const child of children) {
        if (!visitedIds.has(child.id)) {
          visitedIds.add(child.id);
          const parentRole = child.fatherId === animalId ? 'father' : 'mother';
          descendants.push({ id: child.id, tagNumber: child.tagNumber, name: child.name, sex: child.sex, photoUrl: child.photoUrl, generation, parentRole });
          tasks.push(collectDescendants(child.id, generation + 1));
        }
      }
      await Promise.all(tasks);
    };

    await collectDescendants(id, 1);
    return descendants.sort((a, b) => a.generation - b.generation);
  }

  async analyzeInbreeding(animalId: string, farmId: string) {
    await this.getAnimalOrFail(animalId, farmId);
    const ancestors = await this.getAncestors(animalId, farmId, 3);

    // Count how many ancestors appear more than once (common ancestors from both lineages)
    const ancestorIdCounts = new Map<string, number>();
    for (const ancestor of ancestors) {
      ancestorIdCounts.set(ancestor.id, (ancestorIdCounts.get(ancestor.id) || 0) + 1);
    }

    const commonAncestors = [...ancestorIdCounts.entries()]
      .filter(([, count]) => count > 1)
      .map(([id]) => ancestors.find((a) => a.id === id)!);

    // Simple Wright inbreeding coefficient approximation:
    // F = sum over common ancestors A of: (0.5)^(n1 + n2 + 1) * (1 + FA)
    // We use generation numbers as proxy for path lengths (simplified)
    let inbreedingCoefficient = 0;
    for (const [ancId, count] of ancestorIdCounts.entries()) {
      if (count > 1) {
        const ancestorEntries = ancestors.filter((a) => a.id === ancId);
        // Simplified: paths sum of generations / 2
        const pathLengths = ancestorEntries.map((a) => a.generation);
        const n1 = pathLengths[0];
        const n2 = pathLengths[1] ?? n1;
        inbreedingCoefficient += Math.pow(0.5, n1 + n2 + 1);
      }
    }

    // Store analysis result
    const analysis = await this.prisma.inbreedingAnalysis.create({
      data: {
        animalId,
        inbreedingCoefficient,
        analysisDate: new Date(),
        generationsAnalyzed: 3,
        notes: JSON.stringify({ ancestors: ancestors.length, commonAncestors: commonAncestors.map((a) => a.id) }),
      },
    });

    return {
      animalId,
      inbreedingCoefficient: Math.round(inbreedingCoefficient * 10000) / 10000,
      inbreedingPercentage: `${(inbreedingCoefficient * 100).toFixed(2)}%`,
      risk: inbreedingCoefficient < 0.0625 ? 'LOW' : inbreedingCoefficient < 0.125 ? 'MEDIUM' : 'HIGH',
      commonAncestors: commonAncestors.length,
      generationsAnalyzed: 3,
      analysisId: analysis.id,
    };
  }

  async getInbreedingHistory(animalId: string, farmId: string) {
    await this.getAnimalOrFail(animalId, farmId);
    return this.prisma.inbreedingAnalysis.findMany({
      where: { animalId },
      orderBy: { analysisDate: 'desc' },
    });
  }
}
