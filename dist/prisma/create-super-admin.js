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
const SUPER_ADMIN_EMAIL = 'moises@bovicontrol.com';
const SUPER_ADMIN_USERNAME = 'moises.ruiz';
const SUPER_ADMIN_PASSWORD = 'SuperAdmin2026!';
const SUPER_ADMIN_NOMBRE = 'Moises';
const SUPER_ADMIN_APELLIDO = 'Ruiz';
async function main() {
    console.log('🔐 Creando SUPER_ADMIN...\n');
    const existing = await prisma.user.findUnique({ where: { email: SUPER_ADMIN_EMAIL } });
    if (existing) {
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
            email: SUPER_ADMIN_EMAIL,
            username: SUPER_ADMIN_USERNAME,
            password: hashed,
            firstName: SUPER_ADMIN_NOMBRE,
            lastName: SUPER_ADMIN_APELLIDO,
            role: 'SUPER_ADMIN',
            farmId: null,
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
//# sourceMappingURL=create-super-admin.js.map