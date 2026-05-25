import { UserRole } from '@prisma/client';
import { ChangePasswordDto } from './dto/change-password.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
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
    getMe(user: {
        id: string;
        farmId: string;
    }): Promise<{
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
    findOne(id: string, farmId: string): Promise<{
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
    update(id: string, farmId: string, dto: UpdateUserDto): Promise<{
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
    changePassword(id: string, farmId: string, dto: ChangePasswordDto): Promise<{
        message: string;
    }>;
    remove(id: string, farmId: string, role: UserRole): Promise<{
        message: string;
    }>;
}
