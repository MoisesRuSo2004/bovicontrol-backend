import { UserRole } from '@prisma/client';
export declare class RegisterDto {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phone?: string;
    role?: UserRole;
    farmId: string;
}
