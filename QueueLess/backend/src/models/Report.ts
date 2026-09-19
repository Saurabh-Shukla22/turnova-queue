import mongoose, { Schema } from 'mongoose';
import { IReport } from '../types/index.js';

const ReportSchema = new Schema<IReport>(
  {
    reporterUserId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    businessId: { type: Schema.Types.ObjectId, ref: 'Business', required: true, index: true },
    reason: { type: String, required: true },
    description: { type: String },
    status: {
      type: String,
      enum: ['pending', 'reviewed', 'dismissed'],
      default: 'pending',
      index: true,
    },
  },
  { timestamps: true }
);

export const Report = mongoose.model<IReport>('Report', ReportSchema);
