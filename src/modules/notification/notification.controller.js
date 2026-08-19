import * as notificationService from './notification.service.js';
import { sendResponse } from '../../common/utils/apiResponse.js';

export const getNotifications = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const notifications = await notificationService.getUserNotifications(userId);
    
    return sendResponse(res, 200, true, 'Notifications retrieved successfully', notifications);
  } catch (error) {
    next(error);
  }
};

export const markAsRead = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updatedNotification = await notificationService.markNotificationAsRead(id);
    
    return sendResponse(res, 200, true, 'Notification marked as read', updatedNotification);
  } catch (error) {
    next(error);
  }
};