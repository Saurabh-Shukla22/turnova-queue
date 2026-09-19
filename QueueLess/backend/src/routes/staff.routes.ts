import { Router } from 'express';
import {
  getBusinessStaff,
  createStaff,
  updateStaff,
  deleteStaff,
} from '../controllers/staff.controller.js';
import { authenticate, requireRoles } from '../middleware/auth.middleware.js';

const router = Router();

router.get('/business/:businessId', authenticate, getBusinessStaff);
router.post(
  '/business/:businessId',
  authenticate,
  requireRoles(['BUSINESS_OWNER', 'ADMIN']),
  createStaff
);
router.patch('/:id', authenticate, requireRoles(['BUSINESS_OWNER', 'ADMIN']), updateStaff);
router.delete('/:id', authenticate, requireRoles(['BUSINESS_OWNER', 'ADMIN']), deleteStaff);

export default router;
