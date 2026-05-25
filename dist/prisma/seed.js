"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const adapter_pg_1 = require("@prisma/adapter-pg");
const client_1 = require("@prisma/client");
const bcrypt = __importStar(require("bcrypt"));
const prisma = new client_1.PrismaClient({
    adapter: new adapter_pg_1.PrismaPg({ connectionString: process.env.DATABASE_URL }),
});
async function main() {
    console.log('🌱 Iniciando seed...\n');
    const farm = await prisma.farm.upsert({
        where: { rut: '900123456-1' },
        update: {},
        create: {
            name: 'Finca BoviControl Demo',
            location: 'Colombia',
            department: 'Antioquia',
            municipality: 'Medellín',
            areaHectares: 150,
            phone: '+57 300 000 0000',
            email: 'finca@bovicontrol.com',
            rut: '900123456-1',
        },
    });
    console.log(`✅ Finca creada: ${farm.name} (ID: ${farm.id})`);
    const password = 'Admin2026!';
    const hashed = await bcrypt.hash(password, 12);
    const admin = await prisma.user.upsert({
        where: { email: 'admin@bovicontrol.com' },
        update: {},
        create: {
            email: 'admin@bovicontrol.com',
            password: hashed,
            firstName: 'Admin',
            lastName: 'BoviControl',
            role: 'ADMIN',
            farmId: farm.id,
        },
    });
    console.log(`✅ Usuario admin creado: ${admin.email}`);
    const breeds = [
        'Angus', 'Brahman', 'Cebú', 'Holstein', 'Simmental',
        'Hereford', 'Limousin', 'Charolais', 'Gyr', 'Romosinuano',
        'Blanco Orejinegro (BON)', 'Costeño con Cuernos', 'Lucerna',
        'Normando', 'Pardo Suizo',
    ];
    const existingBreeds = await prisma.breed.findMany({ where: { isGlobal: true }, select: { name: true } });
    const existingBreedNames = new Set(existingBreeds.map((b) => b.name));
    const newBreeds = breeds.filter((name) => !existingBreedNames.has(name));
    if (newBreeds.length > 0) {
        await prisma.breed.createMany({ data: newBreeds.map((name) => ({ name, isGlobal: true })) });
    }
    console.log(`✅ ${breeds.length} razas del catálogo listas`);
    const vaccines = [
        { name: 'Fiebre Aftosa', doseIntervalDays: 180 },
        { name: 'Brucelosis (hembras)', doseIntervalDays: null },
        { name: 'Carbón Sintomático', doseIntervalDays: 365 },
        { name: 'Rabia Bovina', doseIntervalDays: 365 },
        { name: 'IBR / DVB / PI3', doseIntervalDays: 365 },
        { name: 'Leptospirosis', doseIntervalDays: 180 },
        { name: 'Edema Maligno', doseIntervalDays: 365 },
        { name: 'Septicemia Hemorrágica', doseIntervalDays: 365 },
    ];
    const existingVaccines = await prisma.vaccine.findMany({ where: { isGlobal: true }, select: { name: true } });
    const existingVaccineNames = new Set(existingVaccines.map((v) => v.name));
    const newVaccines = vaccines.filter((v) => !existingVaccineNames.has(v.name));
    if (newVaccines.length > 0) {
        await prisma.vaccine.createMany({ data: newVaccines.map((v) => ({ name: v.name, doseIntervalDays: v.doseIntervalDays, isGlobal: true })) });
    }
    console.log(`✅ ${vaccines.length} vacunas del catálogo listas`);
    console.log('\n─────────────────────────────────────────');
    console.log('🎉 Seed completado. Credenciales:');
    console.log(`   Email:    admin@bovicontrol.com`);
    console.log(`   Password: ${password}`);
    console.log(`   Farm ID:  ${farm.id}`);
    console.log('─────────────────────────────────────────\n');
}
main()
    .catch((e) => { console.error('❌ Error en seed:', e); process.exit(1); })
    .finally(() => prisma.$disconnect());
//# sourceMappingURL=seed.js.map