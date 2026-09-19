import { Response, NextFunction } from 'express';
import { Staff } from '../models/Staff.js';
import { Business } from '../models/Business.js';
import { AuthRequest } from '../types/index.js';
import { AppError } from '../middleware/error.middleware.js';

export const getBusinessStaff = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { businessId } = req.params;
    const staff = await Staff.find({ businessId }).sort({ createdAt: -1 }).lean();
    res.status(200).json({ success: true, staff });
  } catch (error) {
    next(error);
  }
};

export const createStaff = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { businessId } = req.params;
    const { name, email, phone, role, permissions } = req.body;

    const business = await Business.findById(businessId);
    if (!business) throw new AppError('Business not found', 404);

    if (req.user?.role !== 'ADMIN' && business.ownerId.toString() !== req.user?.id) {
      throw new AppError('Unauthorized', 403);
    }

    const staffMember = await Staff.create({
      businessId,
      name,
      email: email.toLowerCase(),
      phone,
      role: role || 'Staff Operator',
      permissions: permissions || {
        manageQueue: true,
        callNext: true,
        completeToken: true,
        viewCustomers: true,
      },
      isActive: true,
    });

    res.status(201).json({
      success: true,
      message: 'Staff member added successfully',
      staff: staffMember,
    });
  } catch (error) {
    next(error);
  }
};

export const updateStaff = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const staff = await Staff.findById(id);
    if (!staff) throw new AppError('Staff member not found', 404);

    const business = await Business.findById(staff.businessId);
    if (req.user?.role !== 'ADMIN' && business?.ownerId.toString() !== req.user?.id) {
      throw new AppError('Unauthorized', 403);
    }

    const updated = await Staff.findByIdAndUpdate(id, req.body, { new: true });
    res.status(200).json({ success: true, message: 'Staff updated', staff: updated });
  } catch (error) {
    next(error);
  }
};

export const deleteStaff = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const staff = await Staff.findById(id);
    if (!staff) throw new AppError('Staff member not found', 404);

    const business = await Business.findById(staff.businessId);
    if (req.user?.role !== 'ADMIN' && business?.ownerId.toString() !== req.user?.id) {
      throw new AppError('Unauthorized', 403);
    }

    await Staff.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: 'Staff member removed' });
  } catch (error) {
    next(error);
  }
};
