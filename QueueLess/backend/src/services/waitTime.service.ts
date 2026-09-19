import { Types } from 'mongoose';
import { QueueEntry } from '../models/QueueEntry.js';
import { Queue } from '../models/Queue.js';

export interface WaitTimeEstimate {
  estimatedWaitMinutes: number;
  minWaitMinutes: number;
  maxWaitMinutes: number;
  formattedRange: string;
  peopleAhead: number;
}

export const calculateWaitTime = async (
  queueId: string | Types.ObjectId,
  peopleAhead: number,
  fallbackServiceMinutes = 15
): Promise<WaitTimeEstimate> => {
  if (peopleAhead <= 0) {
    return {
      estimatedWaitMinutes: 0,
      minWaitMinutes: 0,
      maxWaitMinutes: 2,
      formattedRange: 'Less than 2 min (You are next!)',
      peopleAhead: 0,
    };
  }

  // Look up recent completed entries today for dynamic calibration
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const recentCompleted = await QueueEntry.find({
    queueId,
    status: 'COMPLETED',
    servedAt: { $exists: true },
    completedAt: { $exists: true },
    createdAt: { $gte: today },
  })
    .sort({ completedAt: -1 })
    .limit(10)
    .lean();

  let avgMinutes = fallbackServiceMinutes;

  if (recentCompleted.length >= 3) {
    let totalServiceDurationMs = 0;
    let validCount = 0;
    for (const entry of recentCompleted) {
      if (entry.servedAt && entry.completedAt) {
        const diffMs = new Date(entry.completedAt).getTime() - new Date(entry.servedAt).getTime();
        const diffMins = diffMs / (1000 * 60);
        if (diffMins > 0.5 && diffMins < 120) {
          totalServiceDurationMs += diffMs;
          validCount++;
        }
      }
    }
    if (validCount >= 3) {
      avgMinutes = Math.round(totalServiceDurationMs / (validCount * 60 * 1000));
      avgMinutes = Math.max(3, Math.min(avgMinutes, 60)); // Clamp between 3 and 60 mins
    }
  } else {
    // If not enough completed tokens, check queue's own configured avgWaitTime
    const queue = await Queue.findById(queueId).lean();
    if (queue && queue.avgWaitTimeMinutes) {
      avgMinutes = queue.avgWaitTimeMinutes;
    }
  }

  const baseMinutes = peopleAhead * avgMinutes;
  // Dynamic +/- buffer of 15-20%
  const variance = Math.max(3, Math.round(baseMinutes * 0.18));
  const minWait = Math.max(1, baseMinutes - variance);
  const maxWait = baseMinutes + variance;

  return {
    estimatedWaitMinutes: baseMinutes,
    minWaitMinutes: minWait,
    maxWaitMinutes: maxWait,
    formattedRange: `${minWait}–${maxWait} min`,
    peopleAhead,
  };
};
