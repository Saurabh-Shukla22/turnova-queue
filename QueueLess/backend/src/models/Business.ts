import mongoose, { Schema } from 'mongoose';
import { IBusiness } from '../types/index.js';

const BusinessSchema = new Schema<IBusiness>(
  {
    ownerId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    name: { type: String, required: true, trim: true, index: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    category: {
      type: String,
      required: true,
      index: true,
      enum: [
        'Clinics',
        'Salons',
        'Barbers',
        'Restaurants',
        'Diagnostic Centers',
        'Repair Shops',
        'Banks',
        'Government Services',
        'Other',
      ],
    },
    description: { type: String, required: true },
    logo: { type: String },
    banner: { type: String },
    address: {
      street: { type: String, required: true },
      city: { type: String, required: true, index: true },
      state: { type: String, required: true },
      zipCode: { type: String, required: true },
      country: { type: String, default: 'India' },
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true,
      },
    },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    openingHours: [
      {
        day: { type: String, required: true },
        open: { type: String, default: '09:00' },
        close: { type: String, default: '19:00' },
        isOpen: { type: Boolean, default: true },
      },
    ],
    rating: { type: Number, default: 4.5, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ['active', 'suspended', 'pending_approval'],
      default: 'active',
      index: true,
    },
    qrCode: { type: String },
  },
  { timestamps: true }
);

BusinessSchema.index({ location: '2dsphere' });
BusinessSchema.index({ name: 'text', description: 'text', category: 'text' });

export const Business = mongoose.model<IBusiness>('Business', BusinessSchema);
