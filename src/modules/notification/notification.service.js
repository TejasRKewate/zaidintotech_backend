import * as notificationRepository from './notification.repository.js';

export const getUserNotifications = async (userId) => {
  if (!userId) {
    throw new Error('User ID is required');
  }
  return await notificationRepository.findByUserId(userId);
};

export const markNotificationAsRead = async (notificationId) => {
  const existingNotification = await notificationRepository.findById(notificationId);
  if (!existingNotification) {
    throw new Error('Notification not found');
  }
  
  return await notificationRepository.markAsReadById(notificationId);
};

export const createNewNotification = async (data) => {
  return await notificationRepository.createNotification(data);
};