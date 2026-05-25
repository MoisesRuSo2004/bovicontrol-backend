import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../prisma/prisma.service';
import { ChangePasswordDto } from './dto/change-password.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRole } from '@prisma/client';

const USER_SELECT = {
  id: true,
  firstName: true,
  lastName: true,
  email: true,
  username: true,
  phone: true,
  role: true,
  isActive: true,
  farmId: true,
  lastLoginAt: true,
  createdAt: true,
  updatedAt: true,
};

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateUserDto) {
    const existing = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (existing) throw new ConflictException('Ya existe un usuario con este email');

    const farm = await this.prisma.farm.findUnique({ where: { id: dto.farmId } });
    if (!farm) throw new BadRequestException('La finca especificada no existe');

    const hashedPassword = await bcrypt.hash(dto.password, 12);
    return this.prisma.user.create({
      data: { ...dto, password: hashedPassword },
      select: USER_SELECT,
    });
  }

  async findAll(farmId: string) {
    return this.prisma.user.findMany({
      where: { farmId },
      select: USER_SELECT,
      orderBy: { firstName: 'asc' },
    });
  }

  async findOne(id: string, farmId: string | null) {
    // SUPER_ADMIN tiene farmId=null, puede acceder a su propio perfil
    const where = farmId ? { id, farmId } : { id };
    const user = await this.prisma.user.findFirst({ where, select: USER_SELECT });
    if (!user) throw new NotFoundException(`Usuario con id ${id} no encontrado`);
    return user;
  }

  async update(id: string, farmId: string | null, dto: UpdateUserDto) {
    await this.findOne(id, farmId);
    if (dto.email) {
      const existing = await this.prisma.user.findFirst({ where: { email: dto.email, NOT: { id } } });
      if (existing) throw new ConflictException('Ya existe otro usuario con ese email');
    }
    if (dto.username) {
      const existing = await this.prisma.user.findFirst({ where: { username: dto.username, NOT: { id } } });
      if (existing) throw new ConflictException(`El usuario "@${dto.username}" ya está en uso`);
    }
    return this.prisma.user.update({
      where: { id },
      data: dto,
      select: USER_SELECT,
    });
  }

  async changePassword(id: string, farmId: string | null, dto: ChangePasswordDto) {
    const where = farmId ? { id, farmId } : { id };
    const user = await this.prisma.user.findFirst({ where });
    if (!user) throw new NotFoundException(`Usuario con id ${id} no encontrado`);

    const isValid = await bcrypt.compare(dto.currentPassword, user.password);
    if (!isValid) throw new UnauthorizedException('La contraseña actual es incorrecta');

    const hashed = await bcrypt.hash(dto.newPassword, 12);
    await this.prisma.user.update({ where: { id }, data: { password: hashed } });
    return { message: 'Contraseña actualizada correctamente' };
  }

  async remove(id: string, farmId: string, requestingRole: UserRole) {
    const user = await this.findOne(id, farmId);
    if (user.role === UserRole.SUPER_ADMIN && requestingRole !== UserRole.SUPER_ADMIN) {
      throw new ForbiddenException('No puedes eliminar un SUPER_ADMIN');
    }
    await this.prisma.user.delete({ where: { id } });
    return { message: 'Usuario eliminado correctamente' };
  }
}
