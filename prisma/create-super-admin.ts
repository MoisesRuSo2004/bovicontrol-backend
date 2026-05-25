/**
 * Script de un solo uso para crear el usuario SUPER_ADMIN.
 * Ejecutar: npx ts-node -r tsconfig-paths/register prisma/create-super-admin.ts
 * O con: npx tsx prisma/create-super-admin.ts
 */
import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

// ── Cambia estos datos antes de ejecutar ────────────────────────────────────
const SUPER_ADMIN_EMAIL    = 'moises@bovicontrol.com';
const SUPER_ADMIN_USERNAME = 'moises.ruiz';
const SUPER_ADMIN_PASSWORD = 'SuperAdmin2026!';
const SUPER_ADMIN_NOMBRE   = 'Moises';
const SUPER_ADMIN_APELLIDO = 'Ruiz';
// ────────────────────────────────────────────────────────────────────────────

async function main() {
  console.log('🔐 Creando SUPER_ADMIN...\n');

  const existing = await prisma.user.findUnique({ where: { email: SUPER_ADMIN_EMAIL } });
  if (existing) {
    // Si ya existe, solo actualiza el rol y username
    const updated = await prisma.user.update({
      where: { email: SUPER_ADMIN_EMAIL },
      data: { role: 'SUPER_ADMIN', username: SUPER_ADMIN_USERNAME },
    });
    console.log(`✅ Usuario existente actualizado a SUPER_ADMIN: ${updated.email} | @${updated.username}`);
    return;
  }

  const hashed = await bcrypt.hash(SUPER_ADMIN_PASSWORD, 12);

  const superAdmin = await prisma.user.create({
    data: {
      email:     SUPER_ADMIN_EMAIL,
      username:  SUPER_ADMIN_USERNAME,
      password:  hashed,
      firstName: SUPER_ADMIN_NOMBRE,
      lastName:  SUPER_ADMIN_APELLIDO,
      role:      'SUPER_ADMIN',
      // SUPER_ADMIN no pertenece a ninguna finca
      farmId:    null,
    },
  });

  console.log('─────────────────────────────────────────');
  console.log('🎉 SUPER_ADMIN creado exitosamente!');
  console.log(`   Usuario:  ${superAdmin.username}`);
  console.log(`   Email:    ${superAdmin.email}`);
  console.log(`   Password: ${SUPER_ADMIN_PASSWORD}`);
  console.log(`   Role:     ${superAdmin.role}`);
  console.log('─────────────────────────────────────────\n');
  console.log('⚠️  Cambia la contraseña después de ingresar por primera vez.\n');
}

main()
  .catch((e) => { console.error('❌ Error:', e); process.exit(1); })
  .finally(() => prisma.$disconnect());
