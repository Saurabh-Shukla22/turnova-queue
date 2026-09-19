# QueueLess — Real-Time Smart Queue Management Platform

> **"Skip the line. Save your time."**

QueueLess is a modern, full-stack SaaS platform designed to eliminate physical waiting lines across clinics, salons, barbershops, restaurants, repair hubs, and government centers. Customers join virtual queues on their smartphones, receive digital tokens, monitor their exact position in real time via Socket.IO, and arrive precisely when it is their turn. Businesses manage queues with live control rooms, call next customers, add walk-ins, pause/resume queues, generate QR posters, book appointments, and analyze customer flow trends with Recharts.

---

## 🌟 Key Features

### 👤 For Customers & Patients
- **Nearby Queue Discovery**: Search by name or category, filter by open status, lowest wait times, distance, and ratings.
- **Instant Digital Token Generation**: Choose a service, preview estimated wait times and people waiting, and generate a verified token (`#A-27`) with a single click.
- **Real-Time Live Queue Tracker**: Live progress timeline (`20 → 21 → 22 → ... → YOU`), people ahead counter, and calibrated wait-time estimates without page refreshes.
- **Audio & Push Turn Alerts**: Subtle audio chimes and in-app notifications when approaching (2 people ahead) and when called ("🎉 It's your turn!").
- **Priority Appointment Booking**: Select available time slots synchronized with business operating hours.
- **Verified Customer Reviews**: Rate and review businesses based on actual wait time and service quality.
- **Favorites & History**: Save visited places and view past visits.

### 🏢 For Business Owners & Staff
- **Live Queue Control Room**:
  - Prominent current serving token counter (`#A-20 - Rahul Sharma`).
  - Next in line customer queue with wait time predictions.
  - Action buttons: `[Next Customer]`, `[Recall]`, `[Skip / No-Show]`, `[Pause Queue]`, `[Resume Queue]`.
- **Walk-in Customer Integration**: Issue physical walk-in tokens on the spot that merge seamlessly into the digital sequence.
- **Dynamic Smart Wait-Time Engine**: Recalibrates estimated wait times dynamically using recent completed service durations from the current day.
- **Printable QR Poster Studio**: High-resolution QR code generator for businesses to display at entrance doors for instant walk-up queue joining.
- **Multi-Service Catalog**: Configure multiple offerings with distinct durations and pricing.
- **Staff Permission Matrix**: Delegate counter operators with fine-grained access (`manageQueue`, `callNext`, `completeToken`, `viewCustomers`).
- **Comprehensive Flow Analytics**: Recharts visualizations for daily customer volume, peak hours, popular services, and visit outcomes.

### 🛡️ For Administrators
- **Platform Governance**: Overview of total users, businesses, active queues, and daily tokens.
- **User & Business Moderation**: 1-click account suspension or approval.
- **Complaints & Reports Handling**: Moderate reported businesses and user feedback.

---

## 🔑 Demo Login Credentials

The database comes pre-seeded with realistic businesses (City Care Clinic, Smile Dental Lounge, Style Studio, QuickFix Electronics, Urban Barber, FreshBite Restaurant) and ready-to-test accounts:

| Role | Email | Password | Pre-configured State |
| :--- | :--- | :--- | :--- |
| **Regular User** | `user@queueless.demo` | `User@123456` | Has active token **#A-27** at City Care Clinic, 6 people ahead |
| **Business Owner** | `business@queueless.demo` | `Business@123456` | Owns City Care Clinic with live queue control room |
| **Administrator** | `admin@queueless.demo` | `Admin@123456` | Full platform supervision, user & business management |

*Note: The login page includes 1-click demo buttons to switch between roles instantly.*

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | Next.js 15+ (App Router), React 19, TypeScript, Tailwind CSS, Lucide React, Framer Motion, TanStack Query, Recharts, Socket.IO Client, next-themes (Dark/Light mode) |
| **Backend** | Node.js, Express.js, TypeScript, Socket.IO Server, Mongoose, JWT Authentication, bcryptjs, Zod validation, Helmet, CORS, Express Rate Limit, QRCode |
| **Database** | MongoDB 8.0 (with 2dsphere geo-indexing and compound queue indexes) |

---

## 📐 Architecture & Real-Time Flow

```
   [Customer Web Browser]                        [Business Dashboard]
             │                                             │
             │── HTTP: POST /api/queues/:id/join ─────────│
             │                                             │
             ▼                                             ▼
      ┌─────────────────────────────────────────────────────────┐
      │               QueueLess Express API Server              │
      │   (JWT Auth, Zod Validation, Smart Wait-Time Engine)    │
      └────────────────────────────┬────────────────────────────┘
                                   │
                                   ▼
      ┌─────────────────────────────────────────────────────────┐
      │             Socket.IO Real-Time Event Hub               │
      │   Rooms: queue:<id> | business:<id> | user:<id>         │
      └────────────────────────────┬────────────────────────────┘
             │                                             │
             │◄── queue:update (counter #A-21 serving) ────│
             │◄── queue:called ("🎉 It's your turn!") ────│
             ▼                                             ▼
     [Auto Chime & Banner]                         [Next Customer Called]
```

### Real-Time Socket.IO Events
- `queue:join_room` / `queue:leave_room`: Subscribe to real-time events for a specific queue.
- `business:join_room` / `business:leave_room`: Subscribe to business control events.
- `user:join`: Subscribe to targeted personal notifications (`user:<id>`).
- `queue:update`: Broadcasts updated serving token, waiting count, and people ahead.
- `queue:called`: Direct alert when customer's token is called to the counter (triggers browser chime).
- `queue:paused` / `queue:resumed`: Instant banner toggle on all customer screens.
- `notification:new`: In-app notification bell real-time counter increment.

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ (tested on Node v22.18.0)
- npm 9+
- MongoDB instance running locally or on MongoDB Atlas (default: `mongodb://127.0.0.1:27017/queueless`)

---

### 1. Backend Setup

```bash
cd QueueLess/backend

# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env

# 3. Seed demo data (Clinics, Salons, Users, Queues, Appointments, Tokens)
npm run seed

# 4. Start development server
npm run dev
# Server will start on http://localhost:5000 with Socket.IO attached
```

---

### 2. Frontend Setup

```bash
cd QueueLess/frontend

# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env.local

# 3. Start Next.js development server
npm run dev
# Frontend will be accessible at http://localhost:3000
```

---

## 📡 REST API Reference

### Authentication
- `POST /api/auth/register` — Register a customer or business owner (auto-bootstraps business & queues)
- `POST /api/auth/login` — Sign in and receive JWT token
- `GET /api/auth/me` — Retrieve active profile and business metadata
- `POST /api/auth/forgot-password` — Password reset instructions

### Businesses & Discovery
- `GET /api/businesses` — Search & filter (by category, open now, low wait, rating, distance, sort)
- `GET /api/businesses/:id` — Full details, active queues, services, staff, and reviews
- `GET /api/businesses/:id/qr` — Base64 QR code image pointing to business page
- `POST /api/businesses` — Create business profile *(Owner / Admin)*
- `PATCH /api/businesses/:id` — Update details, hours, address *(Owner / Admin)*

### Queues & Live Token Operations
- `GET /api/queues/business/:businessId` — List all queues for a business
- `GET /api/queues/:queueId/live` — Real-time state (serving entry, waiting list, wait estimate)
- `POST /api/queues/:queueId/join` — Join virtual queue & generate digital token
- `POST /api/queues/:queueId/walkin` — Issue walk-in token *(Owner / Staff)*
- `POST /api/queues/:queueId/next` — Advance to next customer *(Owner / Staff)*
- `POST /api/queues/:queueId/recall` — Recall current serving customer *(Owner / Staff)*
- `POST /api/queues/:queueId/skip` — Mark customer as No-Show *(Owner / Staff)*
- `POST /api/queues/:queueId/pause` — Temporarily pause queue *(Owner / Staff)*
- `POST /api/queues/:queueId/resume` — Resume queue *(Owner / Staff)*
- `POST /api/queues/entries/:entryId/leave` — Abandon queue token
- `GET /api/queues/entries/my-active` — Get logged-in user's active tokens

### Appointments
- `GET /api/appointments/available-slots?businessId=...&date=...` — Calculate available 30-min slots
- `POST /api/appointments` — Book priority time slot
- `PATCH /api/appointments/:id/status` — Modify status (Confirmed, Completed, Cancelled)

### Analytics
- `GET /api/analytics/business/:businessId` — Daily customer volume, peak hours, service popularity, outcomes

### Administration
- `GET /api/admin/stats` — Platform-wide metrics
- `GET /api/admin/users` — List and search users
- `PATCH /api/admin/users/:id/status` — Suspend or activate user accounts
- `PATCH /api/admin/businesses/:id/status` — Approve or suspend business accounts

---

## 🔒 Security Best Practices
- **Password Hashing**: Salted hashing with `bcryptjs`.
- **JWT Protection**: Tokens signed with configurable secret and expiry.
- **Role-Based Access Control**: Strict middleware verification for `USER`, `BUSINESS_OWNER`, `STAFF`, and `ADMIN`.
- **Injection Protection**: Parameterized Mongoose queries and Zod schema validation on incoming payloads.
- **HTTP Security**: `helmet` headers, CORS configuration, and `express-rate-limit`.

---

## 🔮 Future Enhancements
- WhatsApp / SMS direct token delivery via Twilio.
- Multi-language voice announcements (calling tokens over loudspeaker for waiting rooms).
- Smart calendar sync (Google Calendar / Apple iCal export).
- Geofence auto-checkin when within 200m of the storefront.

---

## 📄 License
MIT License. Built for production-quality real-time smart queue management.
