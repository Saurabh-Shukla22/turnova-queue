import { Router } from 'express';
import {
  getAdminStats,
  getAdminUsers,
  updateUserStatus,
  getAdminBusinesses,
  updateBusinessStatus,
  getAdminReports,
  updateReportStatus,
  createReport,
} from '../controllers/admin.controller.js';
import { authenticate, requireRoles } from '../middleware/auth.middleware.js';

const router = Router();

// User reporting
router.post('/reports', authenticate, createReport);

// Admin-only endpoints
router.use(authenticate, requireRoles(['ADMIN']));

router.get('/stats', getAdminStats);
router.get('/users', getAdminUsers);
router.patch('/users/:id/status', updateUserStatus);
router.get('/businesses', getAdminBusinesses);
router.patch('/businesses/:id/status', updateBusinessStatus);
router.get('/reports', getAdminReports);
router.patch('/reports/:id/status', updateReportStatus);

export default router;
