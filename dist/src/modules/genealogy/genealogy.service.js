"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GenealogyService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let GenealogyService = class GenealogyService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getAnimalOrFail(id, farmId) {
        const animal = await this.prisma.animal.findFirst({
            where: { id, farmId },
            select: { id: true, tagNumber: true, name: true, sex: true, birthDate: true, photoUrl: true, fatherId: true, motherId: true, breed: { select: { id: true, name: true } } },
        });
        if (!animal)
            throw new common_1.NotFoundException(`Animal con id ${id} no encontrado en esta finca`);
        return animal;
    }
    async getAnimalTree(id, farmId) {
        return this.buildAncestorTree(id, farmId, 3);
    }
    async buildAncestorTree(id, farmId, depth) {
        const animal = await this.getAnimalOrFail(id, farmId);
        const node = {
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
                }
                catch {
                    node.father = null;
                }
            }
            if (animal.motherId) {
                try {
                    node.mother = await this.buildAncestorTree(animal.motherId, farmId, depth - 1);
                }
                catch {
                    node.mother = null;
                }
            }
        }
        return node;
    }
    async getAncestors(id, farmId, generations = 3) {
        const safeGenerations = Math.min(Math.max(1, generations), 5);
        const ancestorIds = new Set();
        const ancestors = [];
        const collectAncestors = async (animalId, generation) => {
            if (generation > safeGenerations)
                return;
            const animal = await this.prisma.animal.findFirst({
                where: { id: animalId, farmId },
                select: { id: true, tagNumber: true, name: true, sex: true, fatherId: true, motherId: true },
            });
            if (!animal)
                return;
            if (!ancestorIds.has(animal.id)) {
                ancestorIds.add(animal.id);
                if (generation > 0) {
                    ancestors.push({ id: animal.id, tagNumber: animal.tagNumber, name: animal.name, sex: animal.sex, generation });
                }
            }
            const tasks = [];
            if (animal.fatherId)
                tasks.push(collectAncestors(animal.fatherId, generation + 1));
            if (animal.motherId)
                tasks.push(collectAncestors(animal.motherId, generation + 1));
            await Promise.all(tasks);
        };
        await collectAncestors(id, 0);
        return ancestors.sort((a, b) => a.generation - b.generation);
    }
    async getDescendants(id, farmId, generations = 3) {
        await this.getAnimalOrFail(id, farmId);
        const safeGenerations = Math.min(Math.max(1, generations), 5);
        const descendants = [];
        const visitedIds = new Set([id]);
        const collectDescendants = async (animalId, generation) => {
            if (generation > safeGenerations)
                return;
            const children = await this.prisma.animal.findMany({
                where: {
                    farmId,
                    OR: [{ fatherId: animalId }, { motherId: animalId }],
                },
                select: { id: true, tagNumber: true, name: true, sex: true, photoUrl: true, fatherId: true, motherId: true },
            });
            const tasks = [];
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
    async analyzeInbreeding(animalId, farmId) {
        await this.getAnimalOrFail(animalId, farmId);
        const ancestors = await this.getAncestors(animalId, farmId, 3);
        const ancestorIdCounts = new Map();
        for (const ancestor of ancestors) {
            ancestorIdCounts.set(ancestor.id, (ancestorIdCounts.get(ancestor.id) || 0) + 1);
        }
        const commonAncestors = [...ancestorIdCounts.entries()]
            .filter(([, count]) => count > 1)
            .map(([id]) => ancestors.find((a) => a.id === id));
        let inbreedingCoefficient = 0;
        for (const [ancId, count] of ancestorIdCounts.entries()) {
            if (count > 1) {
                const ancestorEntries = ancestors.filter((a) => a.id === ancId);
                const pathLengths = ancestorEntries.map((a) => a.generation);
                const n1 = pathLengths[0];
                const n2 = pathLengths[1] ?? n1;
                inbreedingCoefficient += Math.pow(0.5, n1 + n2 + 1);
            }
        }
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
    async getInbreedingHistory(animalId, farmId) {
        await this.getAnimalOrFail(animalId, farmId);
        return this.prisma.inbreedingAnalysis.findMany({
            where: { animalId },
            orderBy: { analysisDate: 'desc' },
        });
    }
};
exports.GenealogyService = GenealogyService;
exports.GenealogyService = GenealogyService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], GenealogyService);
//# sourceMappingURL=genealogy.service.js.map