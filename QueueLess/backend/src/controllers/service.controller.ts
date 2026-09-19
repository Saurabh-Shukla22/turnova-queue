import { Request, Response, NextFunction } from 'express';
import { Service } from '../models/Service.js';
import { Business } from '../models/Business.js';
import { AuthRequest } from '../types/index.js';
import { AppError } from '../middleware/error.middleware.js';

export const getServices = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { businessId } = req.params;
    const services = await Service.find({ businessId, isActive: true }).lean();
    res.status(200).json({ success: true, services });
  } catch (error) {
    next(error);
  }
};

export const createService = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { businessId } = req.params;
    const { name, description, price, durationMinutes } = req.body;

    const business = await Business.findById(businessId);
    if (!business) throw new AppError('Business not found', 404);

    if (req.user?.role !== 'ADMIN' && business.ownerId.toString() !== req.user?.id) {
      throw new AppError('Unauthorized', 403);
    }

    const service = await Service.create({
      businessId,
      name,
      description,
      price,
      durationMinutes: durationMinutes || 15,
      isActive: true,
    });

    res.status(201).json({ success: true, message: 'Service added successfully', service });
  } catch (error) {
    next(error);
  }
};

export const updateService = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const service = await Service.findById(id);
    if (!service) throw new AppError('Service not found', 404);

    const business = await Business.findById(service.businessId);
    if (req.user?.role !== 'ADMIN' && business?.ownerId.toString() !== req.user?.id) {
      throw new AppError('Unauthorized', 403);
    }

    const updated = await Service.findByIdAndUpdate(id, req.body, { new: true });
    res.status(200).json({ success: true, message: 'Service updated', service: updated });
  } catch (error) {
    next(error);
  }
};

export const deleteService = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const service = await Service.findById(id);
    if (!service) throw new AppError('Service not found', 404);

    const business = await Business.findById(service.businessId);
    if (req.user?.role !== 'ADMIN' && business?.ownerId.toString() !== req.user?.id) {
      throw new AppError('Unauthorized', 403);
    }

    await Service.findByIdAndUpdate(id, { isActive: false });
    res.status(200).json({ success: true, message: 'Service deactivated successfully' });
  } catch (error) {
    next(error);
  }
};
