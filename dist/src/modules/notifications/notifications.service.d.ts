import { PrismaService } from '../../prisma/prisma.service';
export type AlertPriority = 'HIGH' | 'MEDIUM' | 'LOW';
export type AlertType = 'VACCINATION_DUE' | 'BIRTH_UPCOMING' | 'MISSING_MILK' | 'LOW_PRODUCTION' | 'REPRODUCTIVE_DELAY';
export interface SmartAlert {
    id: string;
    type: AlertType;
    priority: AlertPriority;
    title: string;
    message: string;
    animalId?: string;
    animalTag?: string;
    animalName?: string | null;
    daysUntil?: number;
}
export interface CreateNotificationDto {
    userId: string;
    farmId: string;
    title: string;
    message: string;
    type?: string;
    referenceId?: string;
    referenceType?: string;
}
export declare class NotificationsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(dto: CreateNotificationDto): Promise<{
        id: string;
        title: string;
        message: string;
        type: string;
        isRead: boolean;
        readAt: Date | null;
        referenceId: string | null;
        referenceType: string | null;
        createdAt: Date;
        userId: string;
        farmId: string;
    }>;
    findAll(userId: string, farmId: string, isRead?: boolean, page?: number, limit?: number): Promise<import("../../common/utils/pagination.util").PaginatedResult<{
        id: string;
        title: string;
        message: string;
        type: string;
        isRead: boolean;
        readAt: Date | null;
        referenceId: string | null;
        referenceType: string | null;
        createdAt: Date;
        userId: string;
        farmId: string;
    }>>;
    findOne(id: string, userId: string, farmId: string): Promise<{
        id: string;
        title: string;
        message: string;
        type: string;
        isRead: boolean;
        readAt: Date | null;
        referenceId: string | null;
        referenceType: string | null;
        createdAt: Date;
        userId: string;
        farmId: string;
    }>;
    markAsRead(id: string, userId: string, farmId: string): Promise<{
        id: string;
        title: string;
        message: string;
        type: string;
        isRead: boolean;
        readAt: Date | null;
        referenceId: string | null;
        referenceType: string | null;
        createdAt: Date;
        userId: string;
        farmId: string;
    }>;
    markAllAsRead(userId: string, farmId: string): Promise<{
        message: string;
    }>;
    getUnreadCount(userId: string, farmId: string): Promise<{
        unreadCount: number;
    }>;
    delete(id: string, userId: string, farmId: string): Promise<{
        id: string;
        title: string;
        message: string;
        type: string;
        isRead: boolean;
        readAt: Date | null;
        referenceId: string | null;
        referenceType: string | null;
        createdAt: Date;
        userId: string;
        farmId: string;
    }>;
    deleteAllRead(userId: string, farmId: string): Promise<{
        message: string;
    }>;
    generateAlerts(farmId: string): Promise<SmartAlert[]>;
    broadcastToFarm(farmId: string, title: string, message: string, type?: string, referenceId?: string, referenceType?: string): Promise<void>;
}
