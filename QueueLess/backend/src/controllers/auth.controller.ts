import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { Business } from '../models/Business.js';
import { Queue } from '../models/Queue.js';
import { Service } from '../models/Service.js';
import { AuthRequest } from '../types/index.js';
import { AppError } from '../middleware/error.middleware.js';

const signToken = (payload: { id: string; email: string; role: string; businessId?: string }) => {
  const secret = process.env.JWT_SECRET || 'queueless_super_secret_jwt_key_2026_production_quality';
  return jwt.sign(payload, secret, { expiresIn: '7d' });
};

export const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { name, email, password, phone, role = 'USER', businessData } = req.body;

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      throw new AppError('An account with this email already exists.', 400);
    }

    const assignedRole = role === 'BUSINESS_OWNER' ? 'BUSINESS_OWNER' : 'USER';

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      phone,
      role: assignedRole,
    });

    let businessId: string | undefined;

    // If registering as a business, automatically bootstrap business profile and general queue
    if (assignedRole === 'BUSINESS_OWNER' && businessData) {
      const slug = (businessData.name || 'business')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '') + `-${Date.now().toString().slice(-4)}`;

      const business = await Business.create({
        ownerId: user._id,
        name: businessData.name,
        slug,
        category: businessData.category || 'Clinics',
        description: businessData.description || `Welcome to ${businessData.name}`,
        phone: businessData.phone || phone,
        email: email.toLowerCase(),
        address: businessData.address || {
          street: '123 MG Road',
          city: 'Bangalore',
          state: 'Karnataka',
          zipCode: '560001',
          country: 'India',
        },
        location: businessData.location || {
          type: 'Point',
          coordinates: [77.5946, 12.9716],
        },
        openingHours: [
          { day: 'Monday', open: '09:00', close: '19:00', isOpen: true },
          { day: 'Tuesday', open: '09:00', close: '19:00', isOpen: true },
          { day: 'Wednesday', open: '09:00', close: '19:00', isOpen: true },
          { day: 'Thursday', open: '09:00', close: '19:00', isOpen: true },
          { day: 'Friday', open: '09:00', close: '19:00', isOpen: true },
          { day: 'Saturday', open: '09:00', close: '18:00', isOpen: true },
          { day: 'Sunday', open: '10:00', close: '16:00', isOpen: false },
        ],
        rating: 4.8,
        reviewCount: 0,
        status: 'active',
      });

      businessId = business._id.toString();

      // Create default starter service
      const defaultService = await Service.create({
        businessId: business._id,
        name: 'General Service',
        description: 'Standard consultation or service',
        price: 250,
        durationMinutes: 15,
        isActive: true,
      });

      // Create initial queue
      await Queue.create({
        businessId: business._id,
        name: 'Main Queue',
        type: 'general',
        prefix: 'A',
        serviceIds: [defaultService._id],
        currentNumber: 0,
        lastNumber: 0,
        isPaused: false,
        isActive: true,
        avgWaitTimeMinutes: 15,
      });
    }

    const token = signToken({
      id: user._id.toString(),
      email: user.email,
      role: user.role,
      businessId,
    });

    res.status(201).json({
      success: true,
      message: 'Registration successful!',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        avatar: user.avatar,
        notificationSettings: user.notificationSettings,
        businessId,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new AppError('Please provide email and password.', 400);
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user) {
      throw new AppError('Invalid email or password.', 401);
    }

    if (user.status === 'suspended') {
      throw new AppError('Your account has been suspended. Please contact support.', 403);
    }

    const isMatch = await User.comparePassword(password, user.password as string);
    if (!isMatch) {
      throw new AppError('Invalid email or password.', 401);
    }

    let businessId: string | undefined;
    let businessName: string | undefined;

    if (user.role === 'BUSINESS_OWNER') {
      const business = await Business.findOne({ ownerId: user._id }).lean();
      if (business) {
        businessId = business._id.toString();
        businessName = business.name;
      }
    }

    const token = signToken({
      id: user._id.toString(),
      email: user.email,
      role: user.role,
      businessId,
    });

    res.status(200).json({
      success: true,
      message: 'Login successful!',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        avatar: user.avatar,
        notificationSettings: user.notificationSettings,
        businessId,
        businessName,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      throw new AppError('Unauthorized', 401);
    }

    const user = await User.findById(req.user.id).lean();
    if (!user) {
      throw new AppError('User not found', 404);
    }

    let business: any = null;
    if (user.role === 'BUSINESS_OWNER') {
      business = await Business.findOne({ ownerId: user._id }).lean();
    }

    res.status(200).json({
      success: true,
      user: {
        ...user,
        business,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) throw new AppError('Unauthorized', 401);

    const { name, phone, avatar, notificationSettings } = req.body;
    const updates: any = {};
    if (name) updates.name = name;
    if (phone) updates.phone = phone;
    if (avatar) updates.avatar = avatar;
    if (notificationSettings) updates.notificationSettings = notificationSettings;

    const updatedUser = await User.findByIdAndUpdate(req.user.id, updates, {
      new: true,
      runValidators: true,
    }).lean();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: updatedUser,
    });
  } catch (error) {
    next(error);
  }
};

export const forgotPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email: email?.toLowerCase() });
    if (!user) {
      // Return 200 for security to prevent user enumeration
      res.status(200).json({
        success: true,
        message: 'If an account with that email exists, reset instructions have been dispatched.',
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Password reset link sent to your email (simulated for demo).',
    });
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, newPassword } = req.body;
    const user = await User.findOne({ email: email?.toLowerCase() });
    if (!user) {
      throw new AppError('User not found', 404);
    }
    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password has been reset successfully. You can now log in.',
    });
  } catch (error) {
    next(error);
  }
};
