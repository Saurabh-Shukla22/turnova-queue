import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

import { User } from '../models/User.js';
import { Business } from '../models/Business.js';
import { Service } from '../models/Service.js';
import { Queue } from '../models/Queue.js';
import { QueueEntry } from '../models/QueueEntry.js';
import { Appointment } from '../models/Appointment.js';
import { Review } from '../models/Review.js';
import { Staff } from '../models/Staff.js';
import { Notification } from '../models/Notification.js';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/queueless';

const seedDatabase = async () => {
  try {
    console.log(`[Seed] Connecting to ${MONGODB_URI}...`);
    await mongoose.connect(MONGODB_URI);
    console.log('[Seed] Connected! Clearing existing data...');

    // Clear existing collections
    await Promise.all([
      User.deleteMany({}),
      Business.deleteMany({}),
      Service.deleteMany({}),
      Queue.deleteMany({}),
      QueueEntry.deleteMany({}),
      Appointment.deleteMany({}),
      Review.deleteMany({}),
      Staff.deleteMany({}),
      Notification.deleteMany({}),
    ]);

    console.log('[Seed] Creating core demo users...');

    // 1. Create Demo Users
    const adminUser = await User.create({
      name: 'System Admin',
      email: 'admin@queueless.demo',
      password: 'Admin@123456',
      phone: '+91 98888 00001',
      role: 'ADMIN',
      status: 'active',
    });

    const businessOwner = await User.create({
      name: 'Dr. Arjun Mehta',
      email: 'business@queueless.demo',
      password: 'Business@123456',
      phone: '+91 98888 00002',
      role: 'BUSINESS_OWNER',
      status: 'active',
    });

    const regularUser = await User.create({
      name: 'Yash Sharma',
      email: 'user@queueless.demo',
      password: 'User@123456',
      phone: '+91 98888 00003',
      role: 'USER',
      status: 'active',
      notificationSettings: {
        email: true,
        push: true,
        appointmentReminders: true,
        queueAlerts: true,
      },
    });

    // Additional customer users for queue realistic data
    const customer2 = await User.create({
      name: 'Priya Patel',
      email: 'priya@example.com',
      password: 'User@123456',
      phone: '+91 98888 00004',
      role: 'USER',
    });

    const customer3 = await User.create({
      name: 'Aman Verma',
      email: 'aman@example.com',
      password: 'User@123456',
      phone: '+91 98888 00005',
      role: 'USER',
    });

    console.log('[Seed] Creating businesses...');

    // 2. Create Realistic Businesses
    const businessesData = [
      {
        ownerId: businessOwner._id,
        name: 'City Care Clinic',
        slug: 'city-care-clinic',
        category: 'Clinics',
        description:
          'Leading multi-specialty outpatient healthcare clinic providing expert primary care, pediatrics, and preventive health screenings.',
        phone: '+91 80 4123 4567',
        email: 'info@citycareclinic.demo',
        logo: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=300&auto=format&fit=crop&q=80',
        banner: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=1200&auto=format&fit=crop&q=80',
        address: {
          street: '14 Indiranagar 100ft Road',
          city: 'Bangalore',
          state: 'Karnataka',
          zipCode: '560038',
          country: 'India',
        },
        location: {
          type: 'Point',
          coordinates: [77.6412, 12.9719], // [lng, lat]
        },
        rating: 4.9,
        reviewCount: 128,
        status: 'active',
        openingHours: [
          { day: 'Monday', open: '08:30', close: '20:00', isOpen: true },
          { day: 'Tuesday', open: '08:30', close: '20:00', isOpen: true },
          { day: 'Wednesday', open: '08:30', close: '20:00', isOpen: true },
          { day: 'Thursday', open: '08:30', close: '20:00', isOpen: true },
          { day: 'Friday', open: '08:30', close: '20:00', isOpen: true },
          { day: 'Saturday', open: '09:00', close: '18:00', isOpen: true },
          { day: 'Sunday', open: '10:00', close: '14:00', isOpen: false },
        ],
      },
      {
        ownerId: businessOwner._id,
        name: 'Smile Dental Lounge',
        slug: 'smile-dental-lounge',
        category: 'Clinics',
        description:
          'State-of-the-art dental clinic offering cosmetic dentistry, orthodontic alignment, painless root canals, and regular cleanings.',
        phone: '+91 80 4123 9988',
        email: 'hello@smiledental.demo',
        logo: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=300&auto=format&fit=crop&q=80',
        banner: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=1200&auto=format&fit=crop&q=80',
        address: {
          street: '42 Koramangala 4th Block',
          city: 'Bangalore',
          state: 'Karnataka',
          zipCode: '560034',
          country: 'India',
        },
        location: {
          type: 'Point',
          coordinates: [77.6245, 12.9352],
        },
        rating: 4.8,
        reviewCount: 94,
        status: 'active',
        openingHours: [
          { day: 'Monday', open: '10:00', close: '19:30', isOpen: true },
          { day: 'Tuesday', open: '10:00', close: '19:30', isOpen: true },
          { day: 'Wednesday', open: '10:00', close: '19:30', isOpen: true },
          { day: 'Thursday', open: '10:00', close: '19:30', isOpen: true },
          { day: 'Friday', open: '10:00', close: '19:30', isOpen: true },
          { day: 'Saturday', open: '10:00', close: '17:00', isOpen: true },
          { day: 'Sunday', open: '10:00', close: '14:00', isOpen: false },
        ],
      },
      {
        ownerId: businessOwner._id,
        name: 'Style Studio Salon',
        slug: 'style-studio-salon',
        category: 'Salons',
        description:
          'Premium unisex salon and spa specializing in bespoke hair styling, luxury hair spas, facials, and grooming.',
        phone: '+91 80 4333 7711',
        email: 'care@stylestudio.demo',
        logo: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=300&auto=format&fit=crop&q=80',
        banner: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=1200&auto=format&fit=crop&q=80',
        address: {
          street: '88 Lavelle Road',
          city: 'Bangalore',
          state: 'Karnataka',
          zipCode: '560001',
          country: 'India',
        },
        location: {
          type: 'Point',
          coordinates: [77.5996, 12.9716],
        },
        rating: 4.7,
        reviewCount: 165,
        status: 'active',
        openingHours: [
          { day: 'Monday', open: '10:00', close: '21:00', isOpen: true },
          { day: 'Tuesday', open: '10:00', close: '21:00', isOpen: true },
          { day: 'Wednesday', open: '10:00', close: '21:00', isOpen: true },
          { day: 'Thursday', open: '10:00', close: '21:00', isOpen: true },
          { day: 'Friday', open: '10:00', close: '21:00', isOpen: true },
          { day: 'Saturday', open: '09:30', close: '21:30', isOpen: true },
          { day: 'Sunday', open: '09:30', close: '21:30', isOpen: true },
        ],
      },
      {
        ownerId: businessOwner._id,
        name: 'QuickFix Electronics',
        slug: 'quickfix-electronics',
        category: 'Repair Shops',
        description:
          'Fast certified diagnosis and repairs for smartphones, laptops, MacBooks, tablets, and gaming consoles.',
        phone: '+91 80 2555 8899',
        email: 'service@quickfix.demo',
        logo: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=300&auto=format&fit=crop&q=80',
        banner: 'https://images.unsplash.com/photo-1597733336794-12d05021d510?w=1200&auto=format&fit=crop&q=80',
        address: {
          street: '21 SP Road Electronics Hub',
          city: 'Bangalore',
          state: 'Karnataka',
          zipCode: '560002',
          country: 'India',
        },
        location: {
          type: 'Point',
          coordinates: [77.5855, 12.9678],
        },
        rating: 4.6,
        reviewCount: 78,
        status: 'active',
        openingHours: [
          { day: 'Monday', open: '10:00', close: '20:00', isOpen: true },
          { day: 'Tuesday', open: '10:00', close: '20:00', isOpen: true },
          { day: 'Wednesday', open: '10:00', close: '20:00', isOpen: true },
          { day: 'Thursday', open: '10:00', close: '20:00', isOpen: true },
          { day: 'Friday', open: '10:00', close: '20:00', isOpen: true },
          { day: 'Saturday', open: '10:00', close: '19:00', isOpen: true },
          { day: 'Sunday', open: '11:00', close: '16:00', isOpen: false },
        ],
      },
      {
        ownerId: businessOwner._id,
        name: 'Urban Barber Co.',
        slug: 'urban-barber-co',
        category: 'Barbers',
        description:
          'Classic craft barbering with a modern edge. Clean fades, hot towel straight razor shaves, and beard craftsmanship.',
        phone: '+91 80 4777 3322',
        email: 'cuts@urbanbarber.demo',
        logo: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=300&auto=format&fit=crop&q=80',
        banner: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=1200&auto=format&fit=crop&q=80',
        address: {
          street: '19 Cunningham Road',
          city: 'Bangalore',
          state: 'Karnataka',
          zipCode: '560052',
          country: 'India',
        },
        location: {
          type: 'Point',
          coordinates: [77.5962, 12.9863],
        },
        rating: 4.9,
        reviewCount: 210,
        status: 'active',
        openingHours: [
          { day: 'Monday', open: '09:00', close: '21:00', isOpen: true },
          { day: 'Tuesday', open: '09:00', close: '21:00', isOpen: true },
          { day: 'Wednesday', open: '09:00', close: '21:00', isOpen: true },
          { day: 'Thursday', open: '09:00', close: '21:00', isOpen: true },
          { day: 'Friday', open: '09:00', close: '21:00', isOpen: true },
          { day: 'Saturday', open: '08:30', close: '21:30', isOpen: true },
          { day: 'Sunday', open: '08:30', close: '21:30', isOpen: true },
        ],
      },
      {
        ownerId: businessOwner._id,
        name: 'FreshBite Restaurant',
        slug: 'freshbite-restaurant',
        category: 'Restaurants',
        description:
          'Artisanal farm-to-table dining serving wood-fired sourdough pizzas, fresh pasta, and craft mocktails. Table queue management enabled.',
        phone: '+91 80 4999 1100',
        email: 'table@freshbite.demo',
        logo: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=300&auto=format&fit=crop&q=80',
        banner: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200&auto=format&fit=crop&q=80',
        address: {
          street: '77 Church Street',
          city: 'Bangalore',
          state: 'Karnataka',
          zipCode: '560001',
          country: 'India',
        },
        location: {
          type: 'Point',
          coordinates: [77.6033, 12.9752],
        },
        rating: 4.8,
        reviewCount: 340,
        status: 'active',
        openingHours: [
          { day: 'Monday', open: '12:00', close: '23:00', isOpen: true },
          { day: 'Tuesday', open: '12:00', close: '23:00', isOpen: true },
          { day: 'Wednesday', open: '12:00', close: '23:00', isOpen: true },
          { day: 'Thursday', open: '12:00', close: '23:00', isOpen: true },
          { day: 'Friday', open: '12:00', close: '23:30', isOpen: true },
          { day: 'Saturday', open: '12:00', close: '23:30', isOpen: true },
          { day: 'Sunday', open: '12:00', close: '23:00', isOpen: true },
        ],
      },
    ];

    const createdBusinesses = await Business.insertMany(businessesData);
    const clinic = createdBusinesses[0];
    const dental = createdBusinesses[1];
    const salon = createdBusinesses[2];
    const repair = createdBusinesses[3];
    const barber = createdBusinesses[4];
    const restaurant = createdBusinesses[5];

    console.log('[Seed] Creating services...');

    // 3. Create Services for each business
    const clinicServices = await Service.insertMany([
      {
        businessId: clinic._id,
        name: 'General Consultation',
        description: 'Comprehensive health checkup and vital signs examination with a physician',
        price: 500,
        durationMinutes: 10,
        isActive: true,
      },
      {
        businessId: clinic._id,
        name: 'Pediatric Care',
        description: 'Specialized checkup and growth monitoring for children and toddlers',
        price: 650,
        durationMinutes: 15,
        isActive: true,
      },
      {
        businessId: clinic._id,
        name: 'Follow-up Consultation',
        description: 'Quick check of recovery progress and medication review',
        price: 300,
        durationMinutes: 5,
        isActive: true,
      },
      {
        businessId: clinic._id,
        name: 'Blood Pressure & ECG Screening',
        description: 'Diagnostic heart rhythm and vascular test',
        price: 800,
        durationMinutes: 20,
        isActive: true,
      },
    ]);

    const salonServices = await Service.insertMany([
      {
        businessId: salon._id,
        name: 'Haircut & Styling',
        description: 'Precision cut, wash, scalp massage and blow-dry styling',
        price: 850,
        durationMinutes: 30,
        isActive: true,
      },
      {
        businessId: salon._id,
        name: 'Keratin Hair Spa',
        description: 'Deep conditioning and nourishing hair mask treatment',
        price: 1800,
        durationMinutes: 45,
        isActive: true,
      },
      {
        businessId: salon._id,
        name: 'Glow Facial',
        description: 'Customized organic facial for skin hydration and brightness',
        price: 1500,
        durationMinutes: 40,
        isActive: true,
      },
    ]);

    const barberServices = await Service.insertMany([
      {
        businessId: barber._id,
        name: 'Executive Fade & Beard Trim',
        description: 'Skin fade, hot towel shave, and beard sculpting with premium oil',
        price: 600,
        durationMinutes: 25,
        isActive: true,
      },
      {
        businessId: barber._id,
        name: 'Classic Haircut',
        description: 'Scissor cut and neck taper with pomade styling',
        price: 400,
        durationMinutes: 20,
        isActive: true,
      },
    ]);

    const repairServices = await Service.insertMany([
      {
        businessId: repair._id,
        name: 'Screen Replacement',
        description: 'Original OEM display replacement with 6-month warranty',
        price: 2500,
        durationMinutes: 35,
        isActive: true,
      },
      {
        businessId: repair._id,
        name: 'Battery Diagnostics & Swap',
        description: 'Health test and battery replacement',
        price: 1200,
        durationMinutes: 20,
        isActive: true,
      },
    ]);

    const restaurantServices = await Service.insertMany([
      {
        businessId: restaurant._id,
        name: 'Dine-In Table (2-4 Pax)',
        description: 'Indoor dining reservation for small parties',
        price: 0,
        durationMinutes: 45,
        isActive: true,
      },
      {
        businessId: restaurant._id,
        name: 'Outdoor Patio (Large Group 5+)',
        description: 'Garden alfresco dining table',
        price: 0,
        durationMinutes: 60,
        isActive: true,
      },
    ]);

    console.log('[Seed] Creating queues...');

    // 4. Create Queues
    const clinicMainQueue = await Queue.create({
      businessId: clinic._id,
      name: 'General Queue',
      type: 'general',
      prefix: 'A',
      serviceIds: clinicServices.map((s) => s._id),
      currentNumber: 20,
      lastNumber: 27,
      isPaused: false,
      isActive: true,
      avgWaitTimeMinutes: 5,
    });

    const clinicPriorityQueue = await Queue.create({
      businessId: clinic._id,
      name: 'Priority & Senior Citizens',
      type: 'vip',
      prefix: 'P',
      serviceIds: [clinicServices[0]._id],
      currentNumber: 5,
      lastNumber: 7,
      isPaused: false,
      isActive: true,
      avgWaitTimeMinutes: 8,
    });

    const salonQueue = await Queue.create({
      businessId: salon._id,
      name: 'Salon Walk-in Queue',
      type: 'general',
      prefix: 'S',
      serviceIds: salonServices.map((s) => s._id),
      currentNumber: 12,
      lastNumber: 16,
      isPaused: false,
      isActive: true,
      avgWaitTimeMinutes: 20,
    });

    const barberQueue = await Queue.create({
      businessId: barber._id,
      name: 'Barber Chairs Live Queue',
      type: 'general',
      prefix: 'B',
      serviceIds: barberServices.map((s) => s._id),
      currentNumber: 8,
      lastNumber: 11,
      isPaused: false,
      isActive: true,
      avgWaitTimeMinutes: 15,
    });

    const repairQueue = await Queue.create({
      businessId: repair._id,
      name: 'Diagnostic Counter',
      type: 'general',
      prefix: 'R',
      serviceIds: repairServices.map((s) => s._id),
      currentNumber: 15,
      lastNumber: 18,
      isPaused: false,
      isActive: true,
      avgWaitTimeMinutes: 15,
    });

    const restaurantQueue = await Queue.create({
      businessId: restaurant._id,
      name: 'Dinner Table Queue',
      type: 'general',
      prefix: 'T',
      serviceIds: restaurantServices.map((s) => s._id),
      currentNumber: 4,
      lastNumber: 9,
      isPaused: false,
      isActive: true,
      avgWaitTimeMinutes: 25,
    });

    console.log('[Seed] Populating queue entries...');

    // 5. Populate Active Queue Entries for City Care Clinic
    // Currently serving token #20:
    const now = new Date();
    await QueueEntry.create({
      queueId: clinicMainQueue._id,
      businessId: clinic._id,
      serviceId: clinicServices[0]._id,
      userId: customer2._id,
      tokenNumber: 20,
      tokenCode: 'A-20',
      customerName: 'Rahul Sharma',
      customerPhone: '+91 98888 12345',
      isWalkIn: false,
      status: 'SERVING',
      joinedAt: new Date(now.getTime() - 40 * 60000),
      servedAt: new Date(now.getTime() - 5 * 60000),
      estimatedWaitMinutes: 0,
    });

    // Waiting tokens: #21 to #26
    const waitingNames = ['Aman Verma', 'Priya Patel', 'Ankit Gupta', 'Rohit Sen', 'Sneha Rao', 'Vikram Das'];
    for (let i = 0; i < waitingNames.length; i++) {
      const num = 21 + i;
      await QueueEntry.create({
        queueId: clinicMainQueue._id,
        businessId: clinic._id,
        serviceId: clinicServices[i % 2]._id,
        tokenNumber: num,
        tokenCode: `A-${num}`,
        customerName: waitingNames[i],
        customerPhone: `+91 98888 ${20000 + i}`,
        isWalkIn: i % 2 === 1,
        status: 'WAITING',
        joinedAt: new Date(now.getTime() - (35 - i * 4) * 60000),
        estimatedWaitMinutes: (i + 1) * 5,
      });
    }

    // Token #27: Yash Sharma (our demo regular user!)
    const userEntry = await QueueEntry.create({
      queueId: clinicMainQueue._id,
      businessId: clinic._id,
      serviceId: clinicServices[0]._id, // General Consultation
      userId: regularUser._id,
      tokenNumber: 27,
      tokenCode: 'A-27',
      customerName: 'Yash Sharma',
      customerPhone: regularUser.phone,
      isWalkIn: false,
      status: 'WAITING',
      joinedAt: new Date(now.getTime() - 10 * 60000),
      estimatedWaitMinutes: 28,
    });

    // Create completed entries today for historical analytics
    for (let i = 1; i < 20; i++) {
      const servedTime = new Date(now.getTime() - (220 - i * 10) * 60000);
      const completedTime = new Date(servedTime.getTime() + 8 * 60000);
      await QueueEntry.create({
        queueId: clinicMainQueue._id,
        businessId: clinic._id,
        serviceId: clinicServices[i % 3]._id,
        tokenNumber: i,
        tokenCode: `A-${i}`,
        customerName: `Customer #${i}`,
        customerPhone: `+91 90000 ${10000 + i}`,
        isWalkIn: i % 3 === 0,
        status: 'COMPLETED',
        joinedAt: new Date(servedTime.getTime() - 25 * 60000),
        servedAt: servedTime,
        completedAt: completedTime,
        estimatedWaitMinutes: 15,
      });
    }

    // A couple cancelled/no-shows
    await QueueEntry.create({
      queueId: clinicMainQueue._id,
      businessId: clinic._id,
      serviceId: clinicServices[0]._id,
      tokenNumber: 99,
      tokenCode: 'A-99',
      customerName: 'Karan Mehra',
      customerPhone: '+91 91111 22222',
      status: 'CANCELLED',
      joinedAt: new Date(now.getTime() - 120 * 60000),
      estimatedWaitMinutes: 20,
    });

    console.log('[Seed] Creating staff members...');

    // 6. Create Staff for City Care Clinic
    await Staff.create([
      {
        businessId: clinic._id,
        name: 'Dr. Sunita Deshmukh',
        email: 'sunita@citycareclinic.demo',
        phone: '+91 98888 33301',
        role: 'Consultant Physician',
        permissions: {
          manageQueue: true,
          callNext: true,
          completeToken: true,
          viewCustomers: true,
        },
        isActive: true,
      },
      {
        businessId: clinic._id,
        name: 'Ravi Kumar',
        email: 'ravi@citycareclinic.demo',
        phone: '+91 98888 33302',
        role: 'Receptionist & Token Coordinator',
        permissions: {
          manageQueue: true,
          callNext: true,
          completeToken: true,
          viewCustomers: true,
        },
        isActive: true,
      },
    ]);

    console.log('[Seed] Creating appointments...');

    // 7. Create Upcoming Appointments
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];

    await Appointment.create([
      {
        businessId: clinic._id,
        serviceId: clinicServices[0]._id,
        userId: regularUser._id,
        customerName: regularUser.name,
        customerPhone: regularUser.phone,
        customerEmail: regularUser.email,
        date: tomorrowStr,
        timeSlot: '17:30',
        status: 'CONFIRMED',
        notes: 'Annual routine health review',
      },
      {
        businessId: dental._id,
        serviceId: clinicServices[0]._id,
        userId: regularUser._id,
        customerName: regularUser.name,
        customerPhone: regularUser.phone,
        customerEmail: regularUser.email,
        date: tomorrowStr,
        timeSlot: '11:00',
        status: 'CONFIRMED',
        notes: 'Routine dental prophylaxis',
      },
    ]);

    console.log('[Seed] Creating reviews...');

    // 8. Create Reviews
    await Review.create([
      {
        businessId: clinic._id,
        userId: customer2._id,
        rating: 5,
        waitTimeRating: 5,
        serviceRating: 5,
        comment:
          'Incredible queue system! I waited at a nearby café until token #19 was called, walked in and was seen right away. Saved over an hour!',
        isModerated: false,
      },
      {
        businessId: clinic._id,
        userId: customer3._id,
        rating: 5,
        waitTimeRating: 4,
        serviceRating: 5,
        comment:
          'Doctor was thorough and the real-time position tracker kept me completely relaxed with zero anxiety.',
        isModerated: false,
      },
      {
        businessId: salon._id,
        userId: customer2._id,
        rating: 4,
        waitTimeRating: 4,
        serviceRating: 5,
        comment: 'Great hair spa and pleasant staff. Live queue was accurate within 3 minutes.',
        isModerated: false,
      },
    ]);

    console.log('[Seed] Creating initial notifications for user...');

    // 9. Create Notifications
    await Notification.create([
      {
        userId: regularUser._id,
        businessId: clinic._id,
        title: 'Joined City Care Clinic — Token #A-27',
        message: 'You have joined the General Queue. 6 customers ahead of you. Estimated wait: 25–35 min.',
        type: 'queue_joined',
        read: false,
        data: { queueId: clinicMainQueue._id, entryId: userEntry._id, tokenCode: 'A-27' },
      },
      {
        userId: regularUser._id,
        businessId: clinic._id,
        title: 'Appointment Reminder 📅',
        message: `Your upcoming appointment for General Consultation is scheduled for tomorrow at 5:30 PM.`,
        type: 'appointment_reminder',
        read: false,
      },
    ]);

    console.log('=============================================');
    console.log('✅ DATABASE SEEDING COMPLETED SUCCESSFULLY!');
    console.log('=============================================');
    console.log('Demo Accounts:');
    console.log('  1. User:     user@queueless.demo     / User@123456');
    console.log('  2. Business: business@queueless.demo / Business@123456');
    console.log('  3. Admin:    admin@queueless.demo    / Admin@123456');
    console.log('Active Demo Queue:');
    console.log('  Business: City Care Clinic');
    console.log('  User Token: #A-27 (6 people ahead, serving #A-20)');
    console.log('=============================================');

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('[Seed Error]:', error);
    process.exit(1);
  }
};

seedDatabase();
