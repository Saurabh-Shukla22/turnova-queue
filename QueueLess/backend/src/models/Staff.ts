import mongoose, { Schema } from 'mongoose';
import { IStaff } from '../types/index.js';

const StaffSchema = new Schema<IStaff>(
  {
    businessId: { type: Schema.Types.ObjectId, ref: 'Business', required: true, index: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, required: true, trim: true },
    role: { type: String, required: true, trim: true },
    permissions: {
      manageQueue: { type: Boolean, default: true },
      callNext: { type: Boolean, default: true },
      completeToken: { type: Boolean, default: true },
      viewCustomers: { type: Boolean, default: true },
    },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

StaffSchema.index({ businessId: 1, email: 1 });

export const Staff = mongoose.model<IStaff>('Staff', StaffSchema);
