import { Request, Response, NextFunction } from 'express';
import { Review } from '../models/Review.js';
import { Business } from '../models/Business.js';
import { AuthRequest } from '../types/index.js';
import { AppError } from '../middleware/error.middleware.js';

export const getBusinessReviews = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { businessId } = req.params;
    const reviews = await Review.find({ businessId })
      .populate('userId', 'name avatar')
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({ success: true, reviews });
  } catch (error) {
    next(error);
  }
};

export const createReview = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) throw new AppError('Unauthorized', 401);

    const { businessId, queueEntryId, rating, waitTimeRating, serviceRating, comment } = req.body;

    const business = await Business.findById(businessId);
    if (!business) throw new AppError('Business not found', 404);

    const review = await Review.create({
      businessId,
      userId: req.user.id,
      queueEntryId,
      rating: Number(rating),
      waitTimeRating: Number(waitTimeRating || rating),
      serviceRating: Number(serviceRating || rating),
      comment,
    });

    // Recalculate business average rating
    const allReviews = await Review.find({ businessId }).select('rating').lean();
    const sum = allReviews.reduce((acc, r) => acc + r.rating, 0);
    const avg = Math.round((sum / allReviews.length) * 10) / 10;

    business.rating = avg;
    business.reviewCount = allReviews.length;
    await business.save();

    res.status(201).json({
      success: true,
      message: 'Review submitted successfully!',
      review,
      updatedRating: avg,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteReview = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const review = await Review.findById(id);
    if (!review) throw new AppError('Review not found', 404);

    if (req.user?.role !== 'ADMIN' && review.userId.toString() !== req.user?.id) {
      throw new AppError('Unauthorized to delete this review', 403);
    }

    const businessId = review.businessId;
    await Review.findByIdAndDelete(id);

    // Update business rating
    const allReviews = await Review.find({ businessId }).select('rating').lean();
    const business = await Business.findById(businessId);
    if (business) {
      if (allReviews.length > 0) {
        const sum = allReviews.reduce((acc, r) => acc + r.rating, 0);
        business.rating = Math.round((sum / allReviews.length) * 10) / 10;
        business.reviewCount = allReviews.length;
      } else {
        business.rating = 5.0;
        business.reviewCount = 0;
      }
      await business.save();
    }

    res.status(200).json({ success: true, message: 'Review removed' });
  } catch (error) {
    next(error);
  }
};
