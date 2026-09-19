import mongoose, { Schema } from 'mongoose';
import { IReview } from '../types/index.js';

const ReviewSchema = new Schema<IReview>(
  {
    businessId: { type: Schema.Types.ObjectId, ref: 'Business', required: true, index: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    queueEntryId: { type: Schema.Types.ObjectId, ref: 'QueueEntry' },
    rating: { type: Number, required: true, min: 1, max: 5 },
    waitTimeRating: { type: Number, required: true, min: 1, max: 5, default: 5 },
    serviceRating: { type: Number, required: true, min: 1, max: 5, default: 5 },
    comment: { type: String, trim: true },
    isModerated: { type: Boolean, default: false },
  },
  { timestamps: true }
);

ReviewSchema.index({ businessId: 1, createdAt: -1 });

export const Review = mongoose.model<IReview>('Review', ReviewSchema);
