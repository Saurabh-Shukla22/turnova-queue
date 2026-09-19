import { Router } from 'express';
import {
  getServices,
  createService,
  updateService,
  deleteService,
} from '../controllers/service.controller.js';
import { authenticate, requireRoles } from '../middleware/auth.middleware.js';

const router = Router();

router.get('/business/:businessId', getServices);
router.post(
  '/business/:businessId',
  authenticate,
  requireRoles(['BUSINESS_OWNER', 'ADMIN', 'STAFF']),
  createService
);
router.patch(
  '/:id',
  authenticate,
  requireRoles(['BUSINESS_OWNER', 'ADMIN', 'STAFF']),
  updateService
);
router.delete(
  '/:id',
  authenticate,
  requireRoles(['BUSINESS_OWNER', 'ADMIN', 'STAFF']),
  deleteService
);

export default router;
