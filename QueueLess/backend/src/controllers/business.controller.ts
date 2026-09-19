import { Request, Response, NextFunction } from 'express';
import QRCode from 'qrcode';
import { Business } from '../models/Business.js';
import { Service } from '../models/Service.js';
import { Queue } from '../models/Queue.js';
import { QueueEntry } from '../models/QueueEntry.js';
import { Review } from '../models/Review.js';
import { Staff } from '../models/Staff.js';
import { AuthRequest } from '../types/index.js';
import { AppError } from '../middleware/error.middleware.js';

// Haversine formula for distance calculation in kilometers
function calculateHaversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

function isBusinessOpen(openingHours: any[]): boolean {
  if (!openingHours || openingHours.length === 0) return true;
  const now = new Date();
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const currentDay = days[now.getDay()];
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  const daySchedule = openingHours.find((h) => h.day === currentDay);
  if (!daySchedule || !daySchedule.isOpen) return false;

  const [openH, openM] = daySchedule.open.split(':').map(Number);
  const [closeH, closeM] = daySchedule.close.split(':').map(Number);

  const openMinutes = openH * 60 + openM;
  const closeMinutes = closeH * 60 + closeM;

  return currentMinutes >= openMinutes && currentMinutes <= closeMinutes;
}

export const getBusinesses = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const {
      search,
      category,
      openNow,
      lowWaitTime,
      minRating,
      lat,
      lng,
      sort = 'most_popular',
      page = 1,
      limit = 20,
    } = req.query;

    const query: any = { status: 'active' };

    if (category && category !== 'All') {
      query.category = category;
    }

    if (minRating) {
      query.rating = { $gte: Number(minRating) };
    }

    if (search) {
      query.$or = [
        { name: { $regex: String(search), $options: 'i' } },
        { description: { $regex: String(search), $options: 'i' } },
        { category: { $regex: String(search), $options: 'i' } },
        { 'address.city': { $regex: String(search), $options: 'i' } },
      ];
    }

    const businesses = await Business.find(query).lean();

    const userLat = lat ? parseFloat(String(lat)) : undefined;
    const userLng = lng ? parseFloat(String(lng)) : undefined;

    // Enhance each business with live queue metrics and distance
    const enhanced = await Promise.all(
      businesses.map(async (biz) => {
        // Find default or first active queue
        const activeQueue = await Queue.findOne({ businessId: biz._id, isActive: true }).lean();

        let waitingCount = 0;
        let estimatedWait = 0;
        let isPaused = false;
        let queueId = activeQueue ? activeQueue._id.toString() : null;

        if (activeQueue) {
          isPaused = activeQueue.isPaused;
          waitingCount = await QueueEntry.countDocuments({
            queueId: activeQueue._id,
            status: 'WAITING',
          });
          estimatedWait = waitingCount * (activeQueue.avgWaitTimeMinutes || 15);
        }

        let distanceKm: number | null = null;
        if (
          userLat !== undefined &&
          userLng !== undefined &&
          biz.location?.coordinates?.length === 2
        ) {
          const [bLng, bLat] = biz.location.coordinates;
          distanceKm = calculateHaversineDistance(userLat, userLng, bLat, bLng);
        }

        const isOpen = isBusinessOpen(biz.openingHours);

        return {
          ...biz,
          isOpen,
          waitingCount,
          estimatedWait,
          isPaused,
          activeQueueId: queueId,
          distanceKm,
        };
      })
    );

    // Filter in-memory for dynamic metrics
    let filtered = enhanced;
    if (openNow === 'true') {
      filtered = filtered.filter((b) => b.isOpen);
    }
    if (lowWaitTime === 'true') {
      filtered = filtered.filter((b) => b.estimatedWait <= 25);
    }

    // Sort
    if (sort === 'nearest' && userLat !== undefined) {
      filtered.sort((a, b) => (a.distanceKm ?? 9999) - (b.distanceKm ?? 9999));
    } else if (sort === 'highest_rated') {
      filtered.sort((a, b) => b.rating - a.rating);
    } else if (sort === 'lowest_wait') {
      filtered.sort((a, b) => a.estimatedWait - b.estimatedWait);
    } else {
      // most_popular: based on rating and review count
      filtered.sort((a, b) => b.rating * b.reviewCount - a.rating * a.reviewCount);
    }

    // Pagination
    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.max(1, Number(limit));
    const startIndex = (pageNum - 1) * limitNum;
    const paginated = filtered.slice(startIndex, startIndex + limitNum);

    res.status(200).json({
      success: true,
      total: filtered.length,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(filtered.length / limitNum),
      businesses: paginated,
    });
  } catch (error) {
    next(error);
  }
};

export const getBusinessById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    const business = await Business.findById(id).lean();
    if (!business) {
      throw new AppError('Business not found', 404);
    }

    const [services, queues, reviews, staff] = await Promise.all([
      Service.find({ businessId: id, isActive: true }).lean(),
      Queue.find({ businessId: id, isActive: true }).lean(),
      Review.find({ businessId: id })
        .populate('userId', 'name avatar')
        .sort({ createdAt: -1 })
        .limit(10)
        .lean(),
      Staff.find({ businessId: id, isActive: true }).select('-userId').lean(),
    ]);

    // Enhance each queue with live counts
    const enhancedQueues = await Promise.all(
      queues.map(async (q) => {
        const waitingCount = await QueueEntry.countDocuments({
          queueId: q._id,
          status: 'WAITING',
        });
        const currentServing = await QueueEntry.findOne({
          queueId: q._id,
          status: 'SERVING',
        })
          .select('tokenCode customerName servedAt')
          .lean();

        return {
          ...q,
          waitingCount,
          currentServing,
          estimatedWait: waitingCount * (q.avgWaitTimeMinutes || 15),
        };
      })
    );

    const isOpen = isBusinessOpen(business.openingHours);

    // Generate or ensure QR code
    const clientUrl = process.env.CLIENT_URL || 'http://localhost:3000';
    const queueUrl = `${clientUrl}/business/${business._id}`;
    const qrDataUrl = await QRCode.toDataURL(queueUrl, { width: 300, margin: 2 });

    res.status(200).json({
      success: true,
      business: {
        ...business,
        isOpen,
        qrCode: qrDataUrl,
        services,
        queues: enhancedQueues,
        reviews,
        staff,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const createBusiness = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) throw new AppError('Unauthorized', 401);

    const { name, category, description, phone, email, address, location, openingHours } = req.body;

    const slug = (name || 'business')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '') + `-${Date.now().toString().slice(-4)}`;

    const business = await Business.create({
      ownerId: req.user.id,
      name,
      slug,
      category,
      description,
      phone,
      email,
      address,
      location: location || { type: 'Point', coordinates: [77.5946, 12.9716] },
      openingHours: openingHours || [
        { day: 'Monday', open: '09:00', close: '19:00', isOpen: true },
        { day: 'Tuesday', open: '09:00', close: '19:00', isOpen: true },
        { day: 'Wednesday', open: '09:00', close: '19:00', isOpen: true },
        { day: 'Thursday', open: '09:00', close: '19:00', isOpen: true },
        { day: 'Friday', open: '09:00', close: '19:00', isOpen: true },
        { day: 'Saturday', open: '09:00', close: '18:00', isOpen: true },
        { day: 'Sunday', open: '10:00', close: '16:00', isOpen: false },
      ],
      status: 'active',
    });

    // Create default service & queue
    const service = await Service.create({
      businessId: business._id,
      name: 'Standard Service',
      description: 'Standard consultation or service',
      price: 300,
      durationMinutes: 15,
      isActive: true,
    });

    await Queue.create({
      businessId: business._id,
      name: 'General Queue',
      type: 'general',
      prefix: 'A',
      serviceIds: [service._id],
      currentNumber: 0,
      lastNumber: 0,
      isPaused: false,
      isActive: true,
      avgWaitTimeMinutes: 15,
    });

    res.status(201).json({
      success: true,
      message: 'Business profile created successfully',
      business,
    });
  } catch (error) {
    next(error);
  }
};

export const updateBusiness = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const business = await Business.findById(id);
    if (!business) throw new AppError('Business not found', 404);

    if (req.user?.role !== 'ADMIN' && business.ownerId.toString() !== req.user?.id) {
      throw new AppError('Unauthorized to edit this business', 403);
    }

    const updated = await Business.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: 'Business updated successfully',
      business: updated,
    });
  } catch (error) {
    next(error);
  }
};

export const getBusinessQR = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const business = await Business.findById(id);
    if (!business) throw new AppError('Business not found', 404);

    const clientUrl = process.env.CLIENT_URL || 'http://localhost:3000';
    const queueUrl = `${clientUrl}/business/${business._id}`;
    const qrDataUrl = await QRCode.toDataURL(queueUrl, {
      width: 400,
      margin: 2,
      color: {
        dark: '#1e3a8a',
        light: '#ffffff',
      },
    });

    res.status(200).json({
      success: true,
      qrCode: qrDataUrl,
      url: queueUrl,
      businessName: business.name,
    });
  } catch (error) {
    next(error);
  }
};
