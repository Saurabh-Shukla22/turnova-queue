import mongoose, { Schema } from 'mongoose';
import { INotification } from '../types/index.js';

const NotificationSchema = new Schema<INotification>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    businessId: { type: Schema.Types.ObjectId, ref: 'Business' },
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: {
      type: String,
      enum: [
        'queue_joined',
        'token_generated',
        'queue_approaching',
        'your_turn',
        'appointment_reminder',
        'appointment_confirmed',
        'appointment_cancelled',
        'queue_paused',
        'queue_resumed',
      ],
      required: true,
      index: true,
    },
    read: { type: Boolean, default: false, index: true },
    data: { type: Schema.Types.Mixed },
  },
  { timestamps: true }
);

export const Notification = mongoose.model<INotification>('Notification', NotificationSchema);
