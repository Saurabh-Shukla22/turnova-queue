import { Response, NextFunction } from 'express';
import { Notification } from '../models/Notification.js';
import { User } from '../models/User.js';
import { AuthRequest } from '../types/index.js';
import { AppError } from '../middleware/error.middleware.js';

export const getNotifications = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) throw new AppError('Unauthorized', 401);

    const notifications = await Notification.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .limit(40)
      .lean();

    const unreadCount = await Notification.countDocuments({
      userId: req.user.id,
      read: false,
    });

    res.status(200).json({ success: true, notifications, unreadCount });
  } catch (error) {
    next(error);
  }
};

export const markAsRead = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const notification = await Notification.findByIdAndUpdate(
      id,
      { read: true },
      { new: true }
    );
    res.status(200).json({ success: true, notification });
  } catch (error) {
    next(error);
  }
};

export const markAllAsRead = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) throw new AppError('Unauthorized', 401);

    await Notification.updateMany({ userId: req.user.id, read: false }, { read: true });
    res.status(200).json({ success: true, message: 'All notifications marked as read' });
  } catch (error) {
    next(error);
  }
};

export const updateSettings = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) throw new AppError('Unauthorized', 401);
    const { email, push, appointmentReminders, queueAlerts } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        notificationSettings: {
          email: !!email,
          push: !!push,
          appointmentReminders: !!appointmentReminders,
          queueAlerts: !!queueAlerts,
        },
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: 'Notification settings updated',
      settings: user?.notificationSettings,
    });
  } catch (error) {
    next(error);
  }
};
