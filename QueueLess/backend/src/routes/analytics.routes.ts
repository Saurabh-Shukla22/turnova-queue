import { Router } from 'express';
import { getBusinessAnalytics } from '../controllers/analytics.controller.js';
import { authenticate, requireRoles } from '../middleware/auth.middleware.js';

const router = Router();

router.get(
  '/business/:businessId',
  authenticate,
  requireRoles(['BUSINESS_OWNER', 'STAFF', 'ADMIN']),
  getBusinessAnalytics
);

export default router;
