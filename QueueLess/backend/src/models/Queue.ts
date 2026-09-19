import mongoose, { Schema } from 'mongoose';
import { IQueue } from '../types/index.js';

const QueueSchema = new Schema<IQueue>(
  {
    businessId: { type: Schema.Types.ObjectId, ref: 'Business', required: true, index: true },
    name: { type: String, required: true, trim: true, default: 'General Queue' },
    type: {
      type: String,
      enum: ['general', 'vip', 'appointment', 'emergency'],
      default: 'general',
    },
    prefix: { type: String, default: 'A', trim: true },
    serviceIds: [{ type: Schema.Types.ObjectId, ref: 'Service' }],
    currentNumber: { type: Number, default: 0 },
    lastNumber: { type: Number, default: 0 },
    isPaused: { type: Boolean, default: false },
    pauseReason: { type: String },
    isActive: { type: Boolean, default: true, index: true },
    avgWaitTimeMinutes: { type: Number, default: 15 },
  },
  { timestamps: true }
);

export const Queue = mongoose.model<IQueue>('Queue', QueueSchema);
