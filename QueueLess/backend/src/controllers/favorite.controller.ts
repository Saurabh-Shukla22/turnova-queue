import { Response, NextFunction } from 'express';
import { Favorite } from '../models/Favorite.js';
import { Queue } from '../models/Queue.js';
import { QueueEntry } from '../models/QueueEntry.js';
import { AuthRequest } from '../types/index.js';
import { AppError } from '../middleware/error.middleware.js';

export const getFavorites = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) throw new AppError('Unauthorized', 401);

    const favorites = await Favorite.find({ userId: req.user.id })
      .populate('businessId')
      .lean();

    const enhanced = await Promise.all(
      favorites.map(async (fav) => {
        const biz = fav.businessId as any;
        if (!biz) return null;

        const queue = await Queue.findOne({ businessId: biz._id, isActive: true }).lean();
        let waitingCount = 0;
        let estimatedWait = 0;

        if (queue) {
          waitingCount = await QueueEntry.countDocuments({
            queueId: queue._id,
            status: 'WAITING',
          });
          estimatedWait = waitingCount * (queue.avgWaitTimeMinutes || 15);
        }

        return {
          _id: fav._id,
          business: {
            ...biz,
            waitingCount,
            estimatedWait,
            activeQueueId: queue?._id,
          },
        };
      })
    );

    res.status(200).json({ success: true, favorites: enhanced.filter(Boolean) });
  } catch (error) {
    next(error);
  }
};

export const toggleFavorite = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) throw new AppError('Unauthorized', 401);
    const { businessId } = req.params;

    const existing = await Favorite.findOne({ userId: req.user.id, businessId });
    if (existing) {
      await Favorite.findByIdAndDelete(existing._id);
      res.status(200).json({ success: true, isFavorite: false, message: 'Removed from favorites' });
    } else {
      await Favorite.create({ userId: req.user.id, businessId });
      res.status(201).json({ success: true, isFavorite: true, message: 'Added to favorites' });
    }
  } catch (error) {
    next(error);
  }
};
