import mongoose, { Schema } from 'mongoose';
import { IService } from '../types/index.js';

const ServiceSchema = new Schema<IService>(
  {
    businessId: { type: Schema.Types.ObjectId, ref: 'Business', required: true, index: true },
    name: { type: String, required: true, trim: true },
    description: { type: String },
    price: { type: Number, required: true, min: 0 },
    durationMinutes: { type: Number, required: true, min: 1, default: 15 },
    isActive: { type: Boolean, default: true, index: true },
  },
  { timestamps: true }
);

export const Service = mongoose.model<IService>('Service', ServiceSchema);
