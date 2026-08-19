import Notification from './notification.model.js';

export const findByUserId = async (userId) => {
  return await Notification.find({ userId }).sort({ createdAt: -1 });
};

export const findById = async (id) => {
  return await Notification.findById(id);
};

export const markAsReadById = async (id) => {
  return await Notification.findByIdAndUpdate(
    id,
    { isRead: true },
    { new: true }
  );
};

export const createNotification = async (notificationData) => {
  return await Notification.create(notificationData);
};