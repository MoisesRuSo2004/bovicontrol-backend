import { PrismaService } from '../../prisma/prisma.service';
import { ChangePasswordDto } from './dto/change-password.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRole } from '@prisma/client';
export declare class UsersService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(dto: CreateUserDto): Promise<{
        id: string;
        email: string;
        username: string | null;
        firstName: string;
        lastName: string;
        phone: string | null;
        role: import("@prisma/client").$Enums.UserRole;
        isActive: boolean;
        lastLoginAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
        farmId: string | null;
    }>;
    findAll(farmId: string): Promise<{
        id: string;
        email: string;
        username: string | null;
        firstName: string;
        lastName: string;
        phone: string | null;
        role: import("@prisma/client").$Enums.UserRole;
        isActive: boolean;
        lastLoginAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
        farmId: string | null;
    }[]>;
    findOne(id: string, farmId: string | null): Promise<{
        id: string;
        email: string;
        username: string | null;
        firstName: string;
        lastName: string;
        phone: string | null;
        role: import("@prisma/client").$Enums.UserRole;
        isActive: boolean;
        lastLoginAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
        farmId: string | null;
    }>;
    update(id: string, farmId: string | null, dto: UpdateUserDto): Promise<{
        id: string;
        email: string;
        username: string | null;
        firstName: string;
        lastName: string;
        phone: string | null;
        role: import("@prisma/client").$Enums.UserRole;
        isActive: boolean;
        lastLoginAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
        farmId: string | null;
    }>;
    changePassword(id: string, farmId: string | null, dto: ChangePasswordDto): Promise<{
        message: string;
    }>;
    remove(id: string, farmId: string, requestingRole: UserRole): Promise<{
        message: string;
    }>;
}
