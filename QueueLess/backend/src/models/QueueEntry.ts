import mongoose, { Schema } from 'mongoose';
import { IQueueEntry } from '../types/index.js';

const QueueEntrySchema = new Schema<IQueueEntry>(
  {
    queueId: { type: Schema.Types.ObjectId, ref: 'Queue', required: true, index: true },
    businessId: { type: Schema.Types.ObjectId, ref: 'Business', required: true, index: true },
    serviceId: { type: Schema.Types.ObjectId, ref: 'Service', required: true, index: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', index: true },
    tokenNumber: { type: Number, required: true },
    tokenCode: { type: String, required: true, index: true },
    customerName: { type: String, required: true, trim: true },
    customerPhone: { type: String, required: true, trim: true },
    isWalkIn: { type: Boolean, default: false },
    status: {
      type: String,
      enum: ['WAITING', 'CALLED', 'SERVING', 'COMPLETED', 'CANCELLED', 'NO_SHOW'],
      default: 'WAITING',
      index: true,
    },
    joinedAt: { type: Date, default: Date.now },
    calledAt: { type: Date },
    servedAt: { type: Date },
    completedAt: { type: Date },
    estimatedWaitMinutes: { type: Number, default: 15 },
    notes: { type: String },
  },
  { timestamps: true }
);

QueueEntrySchema.index({ queueId: 1, status: 1, tokenNumber: 1 });
QueueEntrySchema.index({ businessId: 1, createdAt: -1 });

export const QueueEntry = mongoose.model<IQueueEntry>('QueueEntry', QueueEntrySchema);
