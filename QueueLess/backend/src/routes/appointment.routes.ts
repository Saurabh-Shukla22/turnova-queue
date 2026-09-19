import { Router } from 'express';
import {
  getAvailableSlots,
  getAppointments,
  createAppointment,
  updateAppointmentStatus,
} from '../controllers/appointment.controller.js';
import { authenticate, optionalAuth } from '../middleware/auth.middleware.js';

const router = Router();

router.get('/available-slots', getAvailableSlots);
router.get('/', authenticate, getAppointments);
router.post('/', optionalAuth, createAppointment);
router.patch('/:id/status', authenticate, updateAppointmentStatus);

export default router;
