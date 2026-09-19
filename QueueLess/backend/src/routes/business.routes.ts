import { Router } from 'express';
import {
  getBusinesses,
  getBusinessById,
  createBusiness,
  updateBusiness,
  getBusinessQR,
} from '../controllers/business.controller.js';
import { authenticate, requireRoles } from '../middleware/auth.middleware.js';

const router = Router();

router.get('/', getBusinesses);
router.get('/:id', getBusinessById);
router.get('/:id/qr', getBusinessQR);

router.post('/', authenticate, requireRoles(['BUSINESS_OWNER', 'ADMIN']), createBusiness);
router.patch('/:id', authenticate, requireRoles(['BUSINESS_OWNER', 'ADMIN']), updateBusiness);

export default router;
