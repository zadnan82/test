// user_frontend/src/services/notifications.service.js

import { apiClient } from './api';
import { getEndpoint, buildEndpoint } from '../config/api.config';

export class NotificationsService {
  // Get user notifications
  async getNotifications(options = {}) {
    const {
      limit = 50,
      offset = 0,
      unread_only = false
    } = options;

    const response = await apiClient.get(getEndpoint('NOTIFICATIONS'), {
      limit,
      offset,
      unread_only
    });
    return response;
  }

  // Get unread notifications count
  async getUnreadCount() {
    const response = await apiClient.get(getEndpoint('UNREAD_COUNT'));
    return response;
  }

  // Mark notification as read
  async markAsRead(notificationId) {
    const endpoint = buildEndpoint('MARK_NOTIFICATION_READ', { id: notificationId });
    const response = await apiClient.put(endpoint);
    return response;
  }

  // Mark all notifications as read
  async markAllAsRead() {
    const response = await apiClient.put(getEndpoint('MARK_ALL_READ'));
    return response;
  }

  // Delete notification
  async deleteNotification(notificationId) {
    const endpoint = buildEndpoint('DELETE_NOTIFICATION', { id: notificationId });
    const response = await apiClient.delete(endpoint);
    return response;
  }

  // Get notifications with unread count
  async getNotificationsWithCount(options = {}) {
    try {
      const [notifications, unreadCount] = await Promise.allSettled([
        this.getNotifications(options),
        this.getUnreadCount()
      ]);

      return {
        notifications: notifications.status === 'fulfilled' ? notifications.value : [],
        unreadCount: unreadCount.status === 'fulfilled' ? unreadCount.value.unread_count : 0,
        errors: {
          notifications: notifications.status === 'rejected' ? notifications.reason : null,
          unreadCount: unreadCount.status === 'rejected' ? unreadCount.reason : null,
        }
      };
    } catch (error) {
      console.error('Failed to get notifications data:', error);
      throw error;
    }
  }
}

// Create and export singleton instance
export const notificationsService = new NotificationsService();
export default notificationsService;