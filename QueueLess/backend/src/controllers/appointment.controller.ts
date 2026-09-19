import { Request, Response, NextFunction } from 'express';
import { Appointment } from '../models/Appointment.js';
import { Business } from '../models/Business.js';
import { Service } from '../models/Service.js';
import { AuthRequest } from '../types/index.js';
import { AppError } from '../middleware/error.middleware.js';
import { createAndSendNotification } from '../services/notification.service.js';

export const getAvailableSlots = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { businessId, date } = req.query; // date: YYYY-MM-DD
    if (!businessId || !date) {
      throw new AppError('businessId and date are required query parameters.', 400);
    }

    const business = await Business.findById(businessId).lean();
    if (!business) throw new AppError('Business not found', 404);

    // Determine day of week
    const targetDate = new Date(String(date));
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayOfWeek = days[targetDate.getDay()];

    const schedule = business.openingHours?.find((h) => h.day === dayOfWeek);
    if (!schedule || !schedule.isOpen) {
      res.status(200).json({ success: true, date, availableSlots: [] });
      return;
    }

    // Generate 30-min slots
    const [openH, openM] = schedule.open.split(':').map(Number);
    const [closeH, closeM] = schedule.close.split(':').map(Number);

    const openMin = openH * 60 + openM;
    const closeMin = closeH * 60 + closeM;

    const allSlots: string[] = [];
    for (let m = openMin; m < closeMin; m += 30) {
      const h = Math.floor(m / 60);
      const min = m % 60;
      const formatted = `${String(h).padStart(2, '0')}:${String(min).padStart(2, '0')}`;
      allSlots.push(formatted);
    }

    // Find already booked appointments for this business on this date
    const booked = await Appointment.find({
      businessId,
      date: String(date),
      status: { $in: ['PENDING', 'CONFIRMED'] },
    })
      .select('timeSlot')
      .lean();

    const bookedSet = new Set(booked.map((b) => b.timeSlot));
    const availableSlots = allSlots.filter((slot) => !bookedSet.has(slot));

    res.status(200).json({
      success: true,
      date,
      day: dayOfWeek,
      availableSlots,
    });
  } catch (error) {
    next(error);
  }
};

export const getAppointments = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) throw new AppError('Unauthorized', 401);

    const { businessId, date, status } = req.query;
    const filter: any = {};

    if (req.user.role === 'USER') {
      filter.userId = req.user.id;
    } else if (req.user.role === 'BUSINESS_OWNER' || req.user.role === 'STAFF') {
      if (businessId) {
        filter.businessId = businessId;
      } else if (req.user.businessId) {
        filter.businessId = req.user.businessId;
      }
    }

    if (date) filter.date = String(date);
    if (status) filter.status = String(status);

    const appointments = await Appointment.find(filter)
      .populate('businessId', 'name address phone logo category')
      .populate('serviceId', 'name durationMinutes price')
      .sort({ date: 1, timeSlot: 1 })
      .lean();

    res.status(200).json({ success: true, appointments });
  } catch (error) {
    next(error);
  }
};

export const createAppointment = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { businessId, serviceId, date, timeSlot, customerName, customerPhone, customerEmail, notes } =
      req.body;

    const business = await Business.findById(businessId);
    if (!business) throw new AppError('Business not found', 404);

    const service = await Service.findById(serviceId);
    if (!service) throw new AppError('Service not found', 404);

    // Check slot collision
    const existing = await Appointment.findOne({
      businessId,
      date,
      timeSlot,
      status: { $in: ['PENDING', 'CONFIRMED'] },
    });

    if (existing) {
      throw new AppError('This time slot is already booked. Please pick another slot.', 400);
    }

    const appointment = await Appointment.create({
      businessId,
      serviceId,
      userId: req.user?.id,
      customerName: customerName || req.user?.email || 'Customer',
      customerPhone: customerPhone || '9876543210',
      customerEmail: customerEmail || req.user?.email || 'customer@example.com',
      date,
      timeSlot,
      status: 'CONFIRMED',
      notes,
    });

    if (req.user?.id) {
      await createAndSendNotification({
        userId: req.user.id,
        businessId,
        title: 'Appointment Confirmed! 📅',
        message: `Your appointment for ${service.name} at ${business.name} on ${date} at ${timeSlot} is confirmed.`,
        type: 'appointment_confirmed',
        data: { appointmentId: appointment._id },
      });
    }

    res.status(201).json({
      success: true,
      message: 'Appointment booked successfully!',
      appointment,
    });
  } catch (error) {
    next(error);
  }
};

export const updateAppointmentStatus = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const { status, date, timeSlot } = req.body;

    const appointment = await Appointment.findById(id).populate('businessId', 'name');
    if (!appointment) throw new AppError('Appointment not found', 404);

    if (status) appointment.status = status;
    if (date) appointment.date = date;
    if (timeSlot) appointment.timeSlot = timeSlot;

    await appointment.save();

    if (appointment.userId) {
      const type = status === 'CANCELLED' ? 'appointment_cancelled' : 'appointment_reminder';
      await createAndSendNotification({
        userId: appointment.userId,
        businessId: appointment.businessId._id,
        title: `Appointment ${status}`,
        message: `Your appointment at ${(appointment.businessId as any).name} is now ${status}.`,
        type,
        data: { appointmentId: appointment._id },
      });
    }

    res.status(200).json({
      success: true,
      message: `Appointment marked as ${status}`,
      appointment,
    });
  } catch (error) {
    next(error);
  }
};
