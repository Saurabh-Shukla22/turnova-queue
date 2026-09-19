import { Router } from 'express';
import {
  getBusinessQueues,
  getLiveQueue,
  createQueue,
  joinQueue,
  addWalkIn,
  nextCustomer,
  recallCustomer,
  skipCustomer,
  pauseQueue,
  resumeQueue,
  leaveQueue,
  getEntryTracking,
  getMyActiveQueues,
  getMyQueueHistory,
} from '../controllers/queue.controller.js';
import { authenticate, optionalAuth, requireRoles } from '../middleware/auth.middleware.js';

const router = Router();

// Public & user tracking
router.get('/business/:businessId', getBusinessQueues);
router.get('/:queueId/live', getLiveQueue);
router.get('/entries/my-active', authenticate, getMyActiveQueues);
router.get('/entries/my-history', authenticate, getMyQueueHistory);
router.get('/entries/:entryId', getEntryTracking);

// Queue operations
router.post('/', authenticate, requireRoles(['BUSINESS_OWNER', 'ADMIN']), createQueue);
router.post('/:queueId/join', optionalAuth, joinQueue);
router.post('/entries/:entryId/leave', optionalAuth, leaveQueue);

// Business queue control room operations
router.post(
  '/:queueId/walkin',
  authenticate,
  requireRoles(['BUSINESS_OWNER', 'STAFF', 'ADMIN']),
  addWalkIn
);
router.post(
  '/:queueId/next',
  authenticate,
  requireRoles(['BUSINESS_OWNER', 'STAFF', 'ADMIN']),
  nextCustomer
);
router.post(
  '/:queueId/recall',
  authenticate,
  requireRoles(['BUSINESS_OWNER', 'STAFF', 'ADMIN']),
  recallCustomer
);
router.post(
  '/:queueId/skip',
  authenticate,
  requireRoles(['BUSINESS_OWNER', 'STAFF', 'ADMIN']),
  skipCustomer
);
router.post(
  '/:queueId/pause',
  authenticate,
  requireRoles(['BUSINESS_OWNER', 'STAFF', 'ADMIN']),
  pauseQueue
);
router.post(
  '/:queueId/resume',
  authenticate,
  requireRoles(['BUSINESS_OWNER', 'STAFF', 'ADMIN']),
  resumeQueue
);

export default router;
