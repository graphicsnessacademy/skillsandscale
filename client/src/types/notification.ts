export type NotificationCategory = 'business' | 'academic' | 'security';

export interface INotification {
    _id: string;
    category: NotificationCategory;
    title: string;
    message: string;
    link: string;
    isRead: boolean;
    createdAt: string;
}