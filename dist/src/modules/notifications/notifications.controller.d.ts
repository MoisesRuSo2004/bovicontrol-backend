import { NotificationsService } from './notifications.service';
export declare class NotificationsController {
    private readonly notificationsService;
    constructor(notificationsService: NotificationsService);
    generateAlerts(farmId: string): Promise<import("./notifications.service").SmartAlert[]>;
    findAll(userId: string, farmId: string, isRead?: string, page?: string, limit?: string): Promise<import("../../common/utils/pagination.util").PaginatedResult<{
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
    getUnreadCount(userId: string, farmId: string): Promise<{
        unreadCount: number;
    }>;
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
    deleteAllRead(userId: string, farmId: string): Promise<{
        message: string;
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
}
