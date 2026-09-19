export type UserRole = 'USER' | 'BUSINESS_OWNER' | 'STAFF' | 'ADMIN';

export interface User {
  id: string;
  _id?: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  avatar?: string;
  businessId?: string;
  businessName?: string;
  notificationSettings?: {
    email: boolean;
    push: boolean;
    appointmentReminders: boolean;
    queueAlerts: boolean;
  };
  status?: 'active' | 'suspended';
}

export interface Business {
  _id: string;
  ownerId: string;
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
  location?: {
    type: string;
    coordinates: [number, number];
  };
  phone: string;
  email: string;
  openingHours: {
    day: string;
    open: string;
    close: string;
    isOpen: boolean;
  }[];
  rating: number;
  reviewCount: number;
  status: 'active' | 'suspended' | 'pending_approval';
  qrCode?: string;
  isOpen?: boolean;
  waitingCount?: number;
  estimatedWait?: number;
  isPaused?: boolean;
  activeQueueId?: string;
  distanceKm?: number | null;
  services?: Service[];
  queues?: Queue[];
  reviews?: Review[];
  staff?: Staff[];
}

export interface Service {
  _id: string;
  businessId: string;
  name: string;
  description?: string;
  price: number;
  durationMinutes: number;
  isActive: boolean;
}

export interface Queue {
  _id: string;
  businessId: string;
  name: string;
  type: 'general' | 'vip' | 'appointment' | 'emergency';
  prefix: string;
  serviceIds: string[] | Service[];
  currentNumber: number;
  lastNumber: number;
  isPaused: boolean;
  pauseReason?: string;
  isActive: boolean;
  avgWaitTimeMinutes: number;
  waitingCount?: number;
  currentServing?: any;
  estimatedWait?: number;
}

export interface QueueEntry {
  _id: string;
  queueId: string | Queue;
  businessId: string | Business;
  serviceId: string | Service;
  userId?: string;
  tokenNumber: number;
  tokenCode: string;
  customerName: string;
  customerPhone: string;
  isWalkIn: boolean;
  status: 'WAITING' | 'CALLED' | 'SERVING' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW';
  joinedAt: string;
  calledAt?: string;
  servedAt?: string;
  completedAt?: string;
  estimatedWaitMinutes: number;
  estimatedWait?: string;
  peopleAhead?: number;
  currentServing?: string | number;
  notes?: string;
}

export interface Appointment {
  _id: string;
  businessId: Business;
  serviceId: Service;
  userId?: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  date: string;
  timeSlot: string;
  status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW';
  notes?: string;
}

export interface NotificationItem {
  _id: string;
  userId: string;
  businessId?: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  data?: any;
  createdAt: string;
}

export interface Review {
  _id: string;
  businessId: string;
  userId: {
    _id: string;
    name: string;
    avatar?: string;
  };
  rating: number;
  waitTimeRating: number;
  serviceRating: number;
  comment?: string;
  createdAt: string;
}

export interface Staff {
  _id: string;
  businessId: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  permissions: {
    manageQueue: boolean;
    callNext: boolean;
    completeToken: boolean;
    viewCustomers: boolean;
  };
  isActive: boolean;
}
