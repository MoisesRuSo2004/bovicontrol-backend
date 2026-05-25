import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { RegisterWithFarmDto } from './dto/register-with-farm.dto';
import { JwtPayload } from './strategies/jwt.strategy';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  /** Registro de usuario existente en una finca ya creada (uso interno / admin) */
  async register(dto: RegisterDto) {
    const existing = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (existing) throw new ConflictException('Ya existe un usuario con este email');

    const farm = await this.prisma.farm.findUnique({ where: { id: dto.farmId } });
    if (!farm) throw new BadRequestException('La finca especificada no existe');

    const hashedPassword = await bcrypt.hash(dto.password, 12);
    const user = await this.prisma.user.create({
      data: {
        firstName: dto.firstName,
        lastName: dto.lastName,
        email: dto.email,
        password: hashedPassword,
        phone: dto.phone,
        role: dto.role,
        farmId: dto.farmId,
      },
      select: { id: true, email: true, firstName: true, lastName: true, role: true, farmId: true },
    });

    const tokens = await this.generateTokens(user.id, user.email, user.role, user.farmId);
    return { user, ...tokens };
  }

  /** Auto-registro: crea la finca y el usuario ADMIN en una sola transacción */
  async registerWithFarm(dto: RegisterWithFarmDto) {
    // 1. Email único
    const existing = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (existing) throw new ConflictException('Ya existe un usuario registrado con ese email');

    // 2. RUT único (si se provee)
    if (dto.farmRut) {
      const existingFarm = await this.prisma.farm.findUnique({ where: { rut: dto.farmRut } });
      if (existingFarm) throw new ConflictException(`Ya existe una finca con el NIT/RUT ${dto.farmRut}`);
    }

    const hashedPassword = await bcrypt.hash(dto.password, 12);

    // 3. Transacción: finca → usuario (ADMIN de su propia finca)
    const user = await this.prisma.$transaction(async (tx) => {
      const farm = await tx.farm.create({
        data: {
          name: dto.farmName,
          location: dto.farmLocation,
          department: dto.farmDepartment,
          municipality: dto.farmMunicipality,
          areaHectares: dto.farmAreaHectares,
          phone: dto.farmPhone,
          email: dto.farmEmail,
          rut: dto.farmRut,
        },
      });

      return tx.user.create({
        data: {
          firstName: dto.firstName,
          lastName: dto.lastName,
          email: dto.email,
          password: hashedPassword,
          phone: dto.phone,
          role: 'ADMIN',
          farmId: farm.id,
        },
        select: { id: true, email: true, firstName: true, lastName: true, role: true, farmId: true },
      });
    });

    const tokens = await this.generateTokens(user.id, user.email, user.role, user.farmId);
    return { user, ...tokens };
  }

  async login(dto: LoginDto) {
    // Busca por username o por email (insensible a mayúsculas)
    const loginValue = dto.login.trim().toLowerCase();
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [
          { email: { equals: loginValue, mode: 'insensitive' } },
          { username: { equals: loginValue, mode: 'insensitive' } },
        ],
      },
      select: {
        id: true,
        email: true,
        username: true,
        password: true,
        firstName: true,
        lastName: true,
        role: true,
        farmId: true,
        isActive: true,
        farm: { select: { isActive: true, subscriptionEndsAt: true } },
      },
    });

    if (!user) throw new UnauthorizedException('Credenciales inválidas');
    if (!user.isActive) throw new UnauthorizedException('Tu cuenta está desactivada. Contacta al administrador.');

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordValid) throw new UnauthorizedException('Credenciales inválidas');

    // Verificar suscripción de la finca (SUPER_ADMIN siempre pasa)
    if (user.role !== 'SUPER_ADMIN') {
      if (!user.farm?.isActive) {
        throw new UnauthorizedException('Tu finca está desactivada. Contacta a BoviControl.');
      }
      if (user.farm?.subscriptionEndsAt && user.farm.subscriptionEndsAt < new Date()) {
        throw new UnauthorizedException(
          `Tu suscripción venció el ${user.farm.subscriptionEndsAt.toLocaleDateString('es-CO')}. Contacta a BoviControl para renovar.`,
        );
      }
    }

    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    const { password: _, ...userWithoutPassword } = user;
    const tokens = await this.generateTokens(user.id, user.email, user.role, user.farmId);
    return { user: userWithoutPassword, ...tokens };
  }

  async refreshTokens(refreshToken: string) {
    const storedToken = await this.prisma.refreshToken.findUnique({ where: { token: refreshToken } });
    if (!storedToken || storedToken.expiresAt < new Date()) {
      throw new UnauthorizedException('Refresh token inválido o expirado');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: storedToken.userId },
      select: { id: true, email: true, role: true, farmId: true, isActive: true },
    });
    if (!user || !user.isActive) throw new UnauthorizedException('Usuario no válido');

    await this.prisma.refreshToken.delete({ where: { token: refreshToken } });
    return this.generateTokens(user.id, user.email, user.role, user.farmId);
  }

  async logout(refreshToken: string) {
    await this.prisma.refreshToken.deleteMany({ where: { token: refreshToken } });
    return { message: 'Sesión cerrada correctamente' };
  }

  private async generateTokens(userId: string, email: string, role: string, farmId: string | null) {
    const payload: JwtPayload = { sub: userId, email, role, farmId: farmId ?? undefined };

    const refreshExpiresInVal = this.configService.get<string>('jwt.refreshExpiresIn');
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload as any),
      this.jwtService.signAsync(payload as any, {
        secret: this.configService.get<string>('jwt.refreshSecret'),
        expiresIn: refreshExpiresInVal as any,
      }),
    ]);

    const refreshExpiresIn = refreshExpiresInVal || '7d';
    const days = parseInt(refreshExpiresIn.replace('d', ''), 10);
    const expiresAt = new Date(Date.now() + days * 24 * 60 * 60 * 1000);

    await this.prisma.refreshToken.create({ data: { token: refreshToken, userId, expiresAt } });

    return { accessToken, refreshToken };
  }
}
