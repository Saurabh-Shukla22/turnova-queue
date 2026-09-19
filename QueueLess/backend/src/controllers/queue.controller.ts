import { Request, Response, NextFunction } from 'express';
import { Queue } from '../models/Queue.js';
import { QueueEntry } from '../models/QueueEntry.js';
import { Service } from '../models/Service.js';
import { Business } from '../models/Business.js';
import { AuthRequest } from '../types/index.js';
import { AppError } from '../middleware/error.middleware.js';
import {
  emitQueueUpdate,
  emitQueueCalled,
  emitQueueCompleted,
  emitQueueCancelled,
  emitQueuePaused,
  emitQueueResumed,
} from '../services/socket.service.js';
import { calculateWaitTime } from '../services/waitTime.service.js';
import { createAndSendNotification } from '../services/notification.service.js';

// Helper to compile live queue payload for broadcasts
export const getQueueStatePayload = async (queueId: string) => {
  const queue = await Queue.findById(queueId).lean();
  if (!queue) return null;

  const [waitingCount, servingEntry, nextEntries] = await Promise.all([
    QueueEntry.countDocuments({ queueId, status: 'WAITING' }),
    QueueEntry.findOne({ queueId, status: { $in: ['SERVING', 'CALLED'] } })
      .populate('serviceId', 'name durationMinutes price')
      .lean(),
    QueueEntry.find({ queueId, status: 'WAITING' })
      .sort({ tokenNumber: 1 })
      .limit(10)
      .populate('serviceId', 'name durationMinutes')
      .lean(),
  ]);

  const waitEstimate = await calculateWaitTime(
    queueId,
    waitingCount,
    queue.avgWaitTimeMinutes || 15
  );

  return {
    queueId: queue._id.toString(),
    businessId: queue.businessId.toString(),
    name: queue.name,
    prefix: queue.prefix,
    currentNumber: queue.currentNumber,
    lastNumber: queue.lastNumber,
    isPaused: queue.isPaused,
    pauseReason: queue.pauseReason,
    waitingCount,
    estimatedWaitMinutes: waitEstimate.estimatedWaitMinutes,
    waitRange: waitEstimate.formattedRange,
    servingEntry,
    nextEntries,
  };
};

export const getBusinessQueues = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { businessId } = req.params;
    const queues = await Queue.find({ businessId, isActive: true })
      .populate('serviceIds', 'name price durationMinutes')
      .lean();

    const enhanced = await Promise.all(
      queues.map(async (q) => {
        const waitingCount = await QueueEntry.countDocuments({
          queueId: q._id,
          status: 'WAITING',
        });
        const servingEntry = await QueueEntry.findOne({
          queueId: q._id,
          status: { $in: ['SERVING', 'CALLED'] },
        })
          .select('tokenCode customerName status servedAt')
          .lean();

        return {
          ...q,
          waitingCount,
          servingEntry,
        };
      })
    );

    res.status(200).json({ success: true, queues: enhanced });
  } catch (error) {
    next(error);
  }
};

export const getLiveQueue = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { queueId } = req.params;
    const payload = await getQueueStatePayload(queueId);
    if (!payload) {
      throw new AppError('Queue not found', 404);
    }
    res.status(200).json({ success: true, liveState: payload });
  } catch (error) {
    next(error);
  }
};

export const createQueue = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { businessId, name, type = 'general', prefix = 'A', serviceIds, avgWaitTimeMinutes = 15 } =
      req.body;

    const business = await Business.findById(businessId);
    if (!business) throw new AppError('Business not found', 404);

    if (req.user?.role !== 'ADMIN' && business.ownerId.toString() !== req.user?.id) {
      throw new AppError('Unauthorized', 403);
    }

    const queue = await Queue.create({
      businessId,
      name,
      type,
      prefix: prefix.toUpperCase(),
      serviceIds: serviceIds || [],
      avgWaitTimeMinutes,
    });

    res.status(201).json({ success: true, message: 'Queue created', queue });
  } catch (error) {
    next(error);
  }
};

export const joinQueue = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { queueId } = req.params;
    const { serviceId, customerName, customerPhone, notes } = req.body;

    const queue = await Queue.findById(queueId);
    if (!queue || !queue.isActive) {
      throw new AppError('Queue not found or inactive', 404);
    }

    if (queue.isPaused) {
      throw new AppError(
        queue.pauseReason
          ? `Queue is currently paused: ${queue.pauseReason}`
          : 'Queue is currently paused. Please check back shortly.',
        400
      );
    }

    const service = await Service.findById(serviceId);
    if (!service) {
      throw new AppError('Selected service not found', 404);
    }

    // If registered user, check if they already have an active entry in this queue
    const userId = req.user?.id;
    if (userId) {
      const existingEntry = await QueueEntry.findOne({
        queueId,
        userId,
        status: { $in: ['WAITING', 'CALLED', 'SERVING'] },
      });
      if (existingEntry) {
        throw new AppError(
          `You already have an active token (#${existingEntry.tokenCode}) in this queue.`,
          400
        );
      }
    }

    // Increment queue lastNumber
    queue.lastNumber += 1;
    await queue.save();

    const tokenNumber = queue.lastNumber;
    const tokenCode = `${queue.prefix}-${tokenNumber}`;

    // Count people ahead
    const peopleAhead = await QueueEntry.countDocuments({
      queueId,
      status: 'WAITING',
    });

    const waitEstimate = await calculateWaitTime(
      queue._id,
      peopleAhead,
      service.durationMinutes || 15
    );

    const entry = await QueueEntry.create({
      queueId: queue._id,
      businessId: queue.businessId,
      serviceId: service._id,
      userId: userId ? userId : undefined,
      tokenNumber,
      tokenCode,
      customerName: customerName || req.user?.email || 'Valued Customer',
      customerPhone: customerPhone || '9876543210',
      isWalkIn: false,
      status: 'WAITING',
      joinedAt: new Date(),
      estimatedWaitMinutes: waitEstimate.estimatedWaitMinutes,
      notes,
    });

    // Notify user if registered
    if (userId) {
      await createAndSendNotification({
        userId,
        businessId: queue.businessId,
        title: `Joined ${queue.name} — Token #${tokenCode}`,
        message: `Your token #${tokenCode} is confirmed. There are ${peopleAhead} people ahead. Estimated wait: ${waitEstimate.formattedRange}.`,
        type: 'queue_joined',
        data: { queueId: queue._id, entryId: entry._id, tokenCode, peopleAhead },
      });
    }

    // Broadcast live update via Socket.IO
    const liveState = await getQueueStatePayload(queue._id.toString());
    emitQueueUpdate(queue._id.toString(), queue.businessId.toString(), liveState);

    res.status(201).json({
      success: true,
      message: "You're in!",
      entry: {
        id: entry._id,
        tokenNumber,
        tokenCode,
        peopleAhead,
        estimatedWait: waitEstimate.formattedRange,
        estimatedWaitMinutes: waitEstimate.estimatedWaitMinutes,
        status: entry.status,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const addWalkIn = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { queueId } = req.params;
    const { serviceId, customerName, customerPhone, notes } = req.body;

    const queue = await Queue.findById(queueId);
    if (!queue || !queue.isActive) throw new AppError('Queue not found', 404);

    const service = await Service.findById(serviceId);
    if (!service) throw new AppError('Service not found', 404);

    queue.lastNumber += 1;
    await queue.save();

    const tokenNumber = queue.lastNumber;
    const tokenCode = `${queue.prefix}-${tokenNumber}`;

    const peopleAhead = await QueueEntry.countDocuments({
      queueId,
      status: 'WAITING',
    });

    const waitEstimate = await calculateWaitTime(
      queue._id,
      peopleAhead,
      service.durationMinutes || 15
    );

    const entry = await QueueEntry.create({
      queueId: queue._id,
      businessId: queue.businessId,
      serviceId: service._id,
      tokenNumber,
      tokenCode,
      customerName: customerName || `Walk-in #${tokenNumber}`,
      customerPhone: customerPhone || 'N/A',
      isWalkIn: true,
      status: 'WAITING',
      joinedAt: new Date(),
      estimatedWaitMinutes: waitEstimate.estimatedWaitMinutes,
      notes,
    });

    const liveState = await getQueueStatePayload(queue._id.toString());
    emitQueueUpdate(queue._id.toString(), queue.businessId.toString(), liveState);

    res.status(201).json({
      success: true,
      message: 'Walk-in customer added',
      entry,
    });
  } catch (error) {
    next(error);
  }
};

export const nextCustomer = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { queueId } = req.params;
    const queue = await Queue.findById(queueId);
    if (!queue) throw new AppError('Queue not found', 404);

    // 1. Mark currently serving customer as COMPLETED if exists
    const currentServing = await QueueEntry.findOne({
      queueId,
      status: { $in: ['SERVING', 'CALLED'] },
    });

    if (currentServing) {
      currentServing.status = 'COMPLETED';
      currentServing.completedAt = new Date();
      await currentServing.save();

      emitQueueCompleted(queue._id.toString(), queue.businessId.toString(), {
        entryId: currentServing._id,
        tokenCode: currentServing.tokenCode,
      });
    }

    // 2. Find next customer waiting
    const nextEntry = await QueueEntry.findOne({
      queueId,
      status: 'WAITING',
    }).sort({ tokenNumber: 1 });

    if (!nextEntry) {
      // No more customers in line
      const liveState = await getQueueStatePayload(queue._id.toString());
      emitQueueUpdate(queue._id.toString(), queue.businessId.toString(), liveState);

      res.status(200).json({
        success: true,
        message: 'No more customers waiting in queue.',
        servingEntry: null,
      });
      return;
    }

    // 3. Mark next customer as SERVING
    nextEntry.status = 'SERVING';
    nextEntry.servedAt = new Date();
    await nextEntry.save();

    queue.currentNumber = nextEntry.tokenNumber;
    await queue.save();

    // 4. Emit direct called notification to customer
    emitQueueCalled(queue._id.toString(), nextEntry.userId?.toString(), {
      entryId: nextEntry._id,
      tokenCode: nextEntry.tokenCode,
      customerName: nextEntry.customerName,
      message: "🎉 It's your turn! Please proceed to the service counter.",
    });

    if (nextEntry.userId) {
      await createAndSendNotification({
        userId: nextEntry.userId,
        businessId: queue.businessId,
        title: "🎉 It's your turn!",
        message: `Token #${nextEntry.tokenCode} is now being served! Please proceed to the counter.`,
        type: 'your_turn',
        data: { queueId: queue._id, entryId: nextEntry._id, tokenCode: nextEntry.tokenCode },
      });
    }

    // 5. Check upcoming customers (peopleAhead <= 2) and send "approaching" alerts
    const upcomingEntries = await QueueEntry.find({
      queueId,
      status: 'WAITING',
    })
      .sort({ tokenNumber: 1 })
      .limit(2);

    for (let i = 0; i < upcomingEntries.length; i++) {
      const up = upcomingEntries[i];
      if (up.userId) {
        await createAndSendNotification({
          userId: up.userId,
          businessId: queue.businessId,
          title: 'Your turn is approaching',
          message: `You are #${up.tokenCode}. Only ${i + 1} customer(s) ahead of you. Please be ready!`,
          type: 'queue_approaching',
          data: { queueId: queue._id, entryId: up._id, tokenCode: up.tokenCode, peopleAhead: i + 1 },
        });
      }
    }

    // 6. Broadcast live queue state to all connected screens
    const liveState = await getQueueStatePayload(queue._id.toString());
    emitQueueUpdate(queue._id.toString(), queue.businessId.toString(), liveState);

    res.status(200).json({
      success: true,
      message: `Called token #${nextEntry.tokenCode}`,
      servingEntry: nextEntry,
    });
  } catch (error) {
    next(error);
  }
};

export const recallCustomer = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { queueId } = req.params;
    const current = await QueueEntry.findOne({
      queueId,
      status: { $in: ['SERVING', 'CALLED'] },
    });

    if (!current) {
      throw new AppError('No customer currently being served to recall.', 400);
    }

    emitQueueCalled(queueId, current.userId?.toString(), {
      entryId: current._id,
      tokenCode: current.tokenCode,
      customerName: current.customerName,
      message: `Recalling token #${current.tokenCode}. Please proceed immediately!`,
    });

    if (current.userId) {
      await createAndSendNotification({
        userId: current.userId,
        businessId: current.businessId,
        title: `Recall: Token #${current.tokenCode}`,
        message: `Your token #${current.tokenCode} has been recalled. Please proceed to the counter immediately.`,
        type: 'your_turn',
        data: { queueId, entryId: current._id, tokenCode: current.tokenCode },
      });
    }

    res.status(200).json({
      success: true,
      message: `Recalled customer #${current.tokenCode}`,
    });
  } catch (error) {
    next(error);
  }
};

export const skipCustomer = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { queueId } = req.params;
    const current = await QueueEntry.findOne({
      queueId,
      status: { $in: ['SERVING', 'CALLED'] },
    });

    if (!current) {
      throw new AppError('No current customer to skip.', 400);
    }

    current.status = 'NO_SHOW';
    await current.save();

    // Automatically call next customer
    return nextCustomer(req, res, next);
  } catch (error) {
    next(error);
  }
};

export const pauseQueue = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { queueId } = req.params;
    const { reason = 'Temporary pause by staff' } = req.body;

    const queue = await Queue.findByIdAndUpdate(
      queueId,
      { isPaused: true, pauseReason: reason },
      { new: true }
    );
    if (!queue) throw new AppError('Queue not found', 404);

    emitQueuePaused(queue._id.toString(), queue.businessId.toString(), reason);

    res.status(200).json({ success: true, message: 'Queue paused', queue });
  } catch (error) {
    next(error);
  }
};

export const resumeQueue = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { queueId } = req.params;
    const queue = await Queue.findByIdAndUpdate(
      queueId,
      { isPaused: false, pauseReason: '' },
      { new: true }
    );
    if (!queue) throw new AppError('Queue not found', 404);

    emitQueueResumed(queue._id.toString(), queue.businessId.toString());

    res.status(200).json({ success: true, message: 'Queue resumed', queue });
  } catch (error) {
    next(error);
  }
};

export const leaveQueue = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { entryId } = req.params;
    const entry = await QueueEntry.findById(entryId);
    if (!entry) throw new AppError('Queue entry not found', 404);

    // Ensure authorized: entry owner or admin/business owner
    if (
      entry.userId &&
      req.user?.role !== 'ADMIN' &&
      req.user?.role !== 'BUSINESS_OWNER' &&
      entry.userId.toString() !== req.user?.id
    ) {
      throw new AppError('Unauthorized to leave this queue entry', 403);
    }

    entry.status = 'CANCELLED';
    await entry.save();

    emitQueueCancelled(entry.queueId.toString(), entry.businessId.toString(), {
      entryId: entry._id,
      tokenCode: entry.tokenCode,
    });

    const liveState = await getQueueStatePayload(entry.queueId.toString());
    emitQueueUpdate(entry.queueId.toString(), entry.businessId.toString(), liveState);

    res.status(200).json({
      success: true,
      message: 'You have left the queue.',
    });
  } catch (error) {
    next(error);
  }
};

export const getEntryTracking = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { entryId } = req.params;
    const entry = await QueueEntry.findById(entryId)
      .populate('businessId', 'name address phone logo')
      .populate('serviceId', 'name durationMinutes price')
      .populate('queueId', 'name prefix currentNumber isPaused pauseReason')
      .lean();

    if (!entry) throw new AppError('Queue entry not found', 404);

    // Calculate dynamic people ahead
    let peopleAhead = 0;
    if (entry.status === 'WAITING') {
      peopleAhead = await QueueEntry.countDocuments({
        queueId: (entry.queueId as any)._id,
        status: 'WAITING',
        tokenNumber: { $lt: entry.tokenNumber },
      });
    }

    const waitEstimate = await calculateWaitTime(
      (entry.queueId as any)._id,
      peopleAhead,
      (entry.serviceId as any)?.durationMinutes || 15
    );

    // Get current serving entry
    const currentServing = await QueueEntry.findOne({
      queueId: (entry.queueId as any)._id,
      status: { $in: ['SERVING', 'CALLED'] },
    })
      .select('tokenCode customerName')
      .lean();

    res.status(200).json({
      success: true,
      entry: {
        ...entry,
        peopleAhead,
        estimatedWait: waitEstimate.formattedRange,
        estimatedWaitMinutes: waitEstimate.estimatedWaitMinutes,
        currentServing: currentServing?.tokenCode || (entry.queueId as any).currentNumber,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getMyActiveQueues = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) throw new AppError('Unauthorized', 401);

    const activeEntries = await QueueEntry.find({
      userId: req.user.id,
      status: { $in: ['WAITING', 'CALLED', 'SERVING'] },
    })
      .populate('businessId', 'name address phone logo category')
      .populate('serviceId', 'name durationMinutes price')
      .populate('queueId', 'name prefix currentNumber isPaused')
      .sort({ createdAt: -1 })
      .lean();

    const enhanced = await Promise.all(
      activeEntries.map(async (entry) => {
        let peopleAhead = 0;
        if (entry.status === 'WAITING' && entry.queueId) {
          peopleAhead = await QueueEntry.countDocuments({
            queueId: (entry.queueId as any)._id,
            status: 'WAITING',
            tokenNumber: { $lt: entry.tokenNumber },
          });
        }

        const waitEstimate = await calculateWaitTime(
          (entry.queueId as any)._id,
          peopleAhead,
          (entry.serviceId as any)?.durationMinutes || 15
        );

        return {
          ...entry,
          peopleAhead,
          estimatedWait: waitEstimate.formattedRange,
        };
      })
    );

    res.status(200).json({ success: true, activeQueues: enhanced });
  } catch (error) {
    next(error);
  }
};

export const getMyQueueHistory = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) throw new AppError('Unauthorized', 401);

    const history = await QueueEntry.find({
      userId: req.user.id,
      status: { $in: ['COMPLETED', 'CANCELLED', 'NO_SHOW'] },
    })
      .populate('businessId', 'name address logo category')
      .populate('serviceId', 'name price durationMinutes')
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();

    res.status(200).json({ success: true, history });
  } catch (error) {
    next(error);
  }
};
