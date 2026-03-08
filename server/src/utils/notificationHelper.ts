import Notification from '../models/Notification';

/**
 * Triggers a system-wide notification for Admins
 * @param category 'business' (sales/leads) | 'academic' (course status/certs) | 'security' (passwords/logins)
 * @param forRole 'all' (visible to sub-admins) | 'master-admin' (sensitive logs)
 */
export const triggerNotification = async (
    category: 'business' | 'academic' | 'security',
    title: string,
    message: string,
    link: string,
    forRole: 'all' | 'master-admin' = 'all'
) => {
    try {
        await Notification.create({
            category,
            title,
            message,
            link,
            forRole,
            isRead: false
        });
        console.log(`🔔 Notification Created: [${category.toUpperCase()}] ${title}`);
    } catch (error) {
        console.error("❌ Notification Engine Error:", error);
    }
};