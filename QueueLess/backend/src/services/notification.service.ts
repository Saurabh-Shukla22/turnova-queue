import { Types } from 'mongoose';
import { Notification } from '../models/Notification.js';
import { NotificationType } from '../types/index.js';
import { emitNotification } from './socket.service.js';
import { User } from '../models/User.js';

interface CreateNotificationParams {
  userId: string | Types.ObjectId;
  businessId?: string | Types.ObjectId;
  title: string;
  message: string;
  type: NotificationType;
  data?: Record<string, any>;
}

export const createAndSendNotification = async (params: CreateNotificationParams) => {
  try {
    const notification = await Notification.create({
      userId: params.userId,
      businessId: params.businessId,
      title: params.title,
      message: params.message,
      type: params.type,
      data: params.data,
      read: false,
    });

    // Check user's notification preferences
    const user = await User.findById(params.userId).lean();
    if (user && user.notificationSettings) {
      if (params.type.includes('queue') && !user.notificationSettings.queueAlerts) {
        return notification;
      }
      if (params.type.includes('appointment') && !user.notificationSettings.appointmentReminders) {
        return notification;
      }
    }

    // Emit live socket event to user room
    emitNotification(params.userId.toString(), notification);

    console.log(`[Notification] Sent '${params.type}' to user ${params.userId}: "${params.title}"`);
    return notification;
  } catch (error) {
    console.error('[Notification] Error creating notification:', error);
    return null;
  }
};
