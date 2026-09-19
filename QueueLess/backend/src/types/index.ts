import { Request } from 'express';
import { Types } from 'mongoose';

export type UserRole = 'USER' | 'BUSINESS_OWNER' | 'STAFF' | 'ADMIN';

export interface IUser {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password?: string;
  phone: string;
  role: UserRole;
  avatar?: string;
  notificationSettings: {
    email: boolean;
    push: boolean;
    appointmentReminders: boolean;
    queueAlerts: boolean;
  };
  status: 'active' | 'suspended';
  createdAt: Date;
  updatedAt: Date;
}

export interface IBusiness {
  _id: Types.ObjectId;
  ownerId: Types.ObjectId;
  name: string;
  slug: string;
  category: string;
  description: string;
  logo?: string;
  banner?: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  location: {
    type: 'Point';
    coordinates: [number, number]; // [lng, lat]
  };
  phone: string;
  email: string;
  openingHours: {
    day: string; // 'Monday', etc.
    open: string; // '09:00'
    close: string; // '18:00'
    isOpen: boolean;
  }[];
  rating: number;
  reviewCount: number;
  status: 'active' | 'suspended' | 'pending_approval';
  qrCode?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IService {
  _id: Types.ObjectId;
  businessId: Types.ObjectId;
  name: string;
  description?: string;
  price: number;
  durationMinutes: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type QueueType = 'general' | 'vip' | 'appointment' | 'emergency';

export interface IQueue {
  _id: Types.ObjectId;
  businessId: Types.ObjectId;
  name: string;
  type: QueueType;
  prefix: string;
  serviceIds: Types.ObjectId[];
  currentNumber: number;
  lastNumber: number;
  isPaused: boolean;
  pauseReason?: string;
  isActive: boolean;
  avgWaitTimeMinutes: number;
  createdAt: Date;
  updatedAt: Date;
}

export type QueueEntryStatus =
  | 'WAITING'
  | 'CALLED'
  | 'SERVING'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'NO_SHOW';

export interface IQueueEntry {
  _id: Types.ObjectId;
  queueId: Types.ObjectId;
  businessId: Types.ObjectId;
  serviceId: Types.ObjectId;
  userId?: Types.ObjectId;
  tokenNumber: number;
  tokenCode: string; // e.g. 'A-27'
  customerName: string;
  customerPhone: string;
  isWalkIn: boolean;
  status: QueueEntryStatus;
  joinedAt: Date;
  calledAt?: Date;
  servedAt?: Date;
  completedAt?: Date;
  estimatedWaitMinutes: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type AppointmentStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'NO_SHOW';

export interface IAppointment {
  _id: Types.ObjectId;
  businessId: Types.ObjectId;
  serviceId: Types.ObjectId;
  userId?: Types.ObjectId;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  date: string; // YYYY-MM-DD
  timeSlot: string; // HH:mm
  status: AppointmentStatus;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type NotificationType =
  | 'queue_joined'
  | 'token_generated'
  | 'queue_approaching'
  | 'your_turn'
  | 'appointment_reminder'
  | 'appointment_confirmed'
  | 'appointment_cancelled'
  | 'queue_paused'
  | 'queue_resumed';

export interface INotification {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  businessId?: Types.ObjectId;
  title: string;
  message: string;
  type: NotificationType;
  read: boolean;
  data?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface IReview {
  _id: Types.ObjectId;
  businessId: Types.ObjectId;
  userId: Types.ObjectId;
  queueEntryId?: Types.ObjectId;
  rating: number; // 1-5
  waitTimeRating: number; // 1-5
  serviceRating: number; // 1-5
  comment?: string;
  isModerated: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IFavorite {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  businessId: Types.ObjectId;
  createdAt: Date;
}

export interface IStaff {
  _id: Types.ObjectId;
  businessId: Types.ObjectId;
  userId?: Types.ObjectId;
  name: string;
  email: string;
  phone: string;
  role: string; // 'Receptionist', 'Doctor', 'Barber', 'Technician'
  permissions: {
    manageQueue: boolean;
    callNext: boolean;
    completeToken: boolean;
    viewCustomers: boolean;
  };
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IReport {
  _id: Types.ObjectId;
  reporterUserId: Types.ObjectId;
  businessId: Types.ObjectId;
  reason: string;
  description?: string;
  status: 'pending' | 'reviewed' | 'dismissed';
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: UserRole;
    businessId?: string;
  };
}
