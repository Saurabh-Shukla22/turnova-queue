import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AuthRequest, UserRole } from '../types/index.js';
import { Business } from '../models/Business.js';
import { Staff } from '../models/Staff.js';

interface JwtPayload {
  id: string;
  email: string;
  role: UserRole;
  businessId?: string;
}

export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ success: false, message: 'Authentication required. No token provided.' });
      return;
    }

    const token = authHeader.split(' ')[1];
    const secret = process.env.JWT_SECRET || 'queueless_super_secret_jwt_key_2026_production_quality';

    const decoded = jwt.verify(token, secret) as JwtPayload;
    req.user = decoded;

    if (req.user.role === 'BUSINESS_OWNER' && !req.user.businessId) {
      const business = await Business.findOne({ ownerId: req.user.id }).select('_id').lean();
      if (business) {
        req.user.businessId = business._id.toString();
      }
    }

    next();
  } catch (error: any) {
    if (error.name === 'TokenExpiredError') {
      res.status(401).json({ success: false, message: 'Your session has expired. Please log in again.' });
      return;
    }
    res.status(401).json({ success: false, message: 'Invalid authentication token.' });
  }
};

export const optionalAuth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const secret = process.env.JWT_SECRET || 'queueless_super_secret_jwt_key_2026_production_quality';
      const decoded = jwt.verify(token, secret) as JwtPayload;
      req.user = decoded;
    }
    next();
  } catch {
    // Continue without req.user for guest
    next();
  }
};

export const requireRoles = (roles: UserRole[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized. Please login.' });
      return;
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        message: 'Forbidden. You do not have permission to perform this action.',
      });
      return;
    }

    next();
  };
};

export const requireBusinessAccess = (requiredPermission?: 'manageQueue' | 'callNext' | 'completeToken' | 'viewCustomers') => {
  return async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized.' });
      return;
    }

    if (req.user.role === 'ADMIN') {
      return next();
    }

    const businessIdParam = req.params.businessId || req.body.businessId;

    if (req.user.role === 'BUSINESS_OWNER') {
      if (businessIdParam) {
        const business = await Business.findOne({ _id: businessIdParam, ownerId: req.user.id }).lean();
        if (!business) {
          res.status(403).json({ success: false, message: 'Access denied to this business.' });
          return;
        }
      }
      return next();
    }

    if (req.user.role === 'STAFF') {
      if (!businessIdParam) {
        return next();
      }

      const staffMember = await Staff.findOne({
        businessId: businessIdParam,
        $or: [{ userId: req.user.id }, { email: req.user.email }],
        isActive: true,
      }).lean();

      if (!staffMember) {
        res.status(403).json({ success: false, message: 'Staff member not found or inactive.' });
        return;
      }

      if (requiredPermission && !staffMember.permissions[requiredPermission]) {
        res.status(403).json({
          success: false,
          message: `Insufficient staff permission: ${requiredPermission}`,
        });
        return;
      }

      return next();
    }

    res.status(403).json({ success: false, message: 'Business access denied.' });
  };
};
