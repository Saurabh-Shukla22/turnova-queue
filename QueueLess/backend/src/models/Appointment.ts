import mongoose, { Schema } from 'mongoose';
import { IAppointment } from '../types/index.js';

const AppointmentSchema = new Schema<IAppointment>(
  {
    businessId: { type: Schema.Types.ObjectId, ref: 'Business', required: true, index: true },
    serviceId: { type: Schema.Types.ObjectId, ref: 'Service', required: true, index: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', index: true },
    customerName: { type: String, required: true, trim: true },
    customerPhone: { type: String, required: true, trim: true },
    customerEmail: { type: String, required: true, trim: true },
    date: { type: String, required: true, index: true }, // YYYY-MM-DD
    timeSlot: { type: String, required: true }, // HH:mm
    status: {
      type: String,
      enum: ['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED', 'NO_SHOW'],
      default: 'CONFIRMED',
      index: true,
    },
    notes: { type: String },
  },
  { timestamps: true }
);

AppointmentSchema.index({ businessId: 1, date: 1, timeSlot: 1 });

export const Appointment = mongoose.model<IAppointment>('Appointment', AppointmentSchema);
