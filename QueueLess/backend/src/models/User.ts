import mongoose, { Schema, Model } from 'mongoose';
import bcrypt from 'bcryptjs';
import { IUser } from '../types/index.js';

interface IUserModel extends Model<IUser> {
  comparePassword(candidate: string, hashed: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    password: { type: String, required: true, select: false },
    phone: { type: String, required: true, trim: true },
    role: {
      type: String,
      enum: ['USER', 'BUSINESS_OWNER', 'STAFF', 'ADMIN'],
      default: 'USER',
      index: true,
    },
    avatar: { type: String },
    notificationSettings: {
      email: { type: Boolean, default: true },
      push: { type: Boolean, default: true },
      appointmentReminders: { type: Boolean, default: true },
      queueAlerts: { type: Boolean, default: true },
    },
    status: { type: String, enum: ['active', 'suspended'], default: 'active' },
  },
  { timestamps: true }
);

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.statics.comparePassword = async function (
  candidate: string,
  hashed: string
): Promise<boolean> {
  return bcrypt.compare(candidate, hashed);
};

export const User = mongoose.model<IUser, IUserModel>('User', UserSchema);
