export interface NotificationDto {
    id: number;
    title?: string;
    message: string;
    createdAtUtc: string;
    isRead: boolean;
}
