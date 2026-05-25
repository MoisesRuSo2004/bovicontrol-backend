import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

async function main() {
  console.log('🌱 Iniciando seed...\n');

  // ── Farm ──────────────────────────────────────────────────────────────────
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

  // ── Admin user ────────────────────────────────────────────────────────────
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

  // ── Breeds catalog ────────────────────────────────────────────────────────
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

  // ── Global vaccines catalog ───────────────────────────────────────────────
  const vaccines = [
    { name: 'Fiebre Aftosa',         doseIntervalDays: 180 },
    { name: 'Brucelosis (hembras)',   doseIntervalDays: null },
    { name: 'Carbón Sintomático',     doseIntervalDays: 365 },
    { name: 'Rabia Bovina',           doseIntervalDays: 365 },
    { name: 'IBR / DVB / PI3',        doseIntervalDays: 365 },
    { name: 'Leptospirosis',          doseIntervalDays: 180 },
    { name: 'Edema Maligno',          doseIntervalDays: 365 },
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
