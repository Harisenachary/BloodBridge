# 🩸 BloodBridge — Verified Blood Requirement & Donor Coordination Platform

> **Every Second Matters. Every Connection Counts.**  
> A real-time, privacy-first healthcare platform connecting emergency blood requesters, voluntary donors, and accredited hospitals across India.

[![Vite](https://img.shields.io/badge/Vite-8.3-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-19.2-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-emerald.svg)](LICENSE)

---

## 🌟 Key Features

### 1. 📊 Real-Time Network Statistics Dashboard
- **Accredited Centers:** Live count of verified hospitals and licensed regional blood banks.
- **Tested Blood Units:** Live tracking of screened units held in cold storage.
- **Standby Donors:** Real-time count of active, verified voluntary donors ready for emergency response.
- **Urgent Cases:** Active emergency cases undergoing live donor matching.

### 2. 🩸 8-Blood-Group Stock Matrix
- Interactive instant stock breakdown across all 8 major blood groups (**O-**, **O+**, **A+**, **A-**, **B+**, **B-**, **AB+**, **AB-**).
- 1-click filter that instantly filters available hospital bags across the country.

### 3. 📍 Location & Component-Based Search
- Search tested blood by **City** (Hyderabad, Bengaluru, New Delhi, Mumbai, Pune, Chennai, etc.).
- Filter by specific **Component**:
  - Packed Red Blood Cells (PRBC)
  - Platelets (Single Donor / Random Donor Apheresis)
  - Fresh Frozen Plasma (FFP)
  - Whole Blood

### 4. 🛍️ Instant "Reserve & Collect" System
- Users can place a **Cold-Chain Hold** on available hospital units for up to 12 hours.
- Generates an **Official Digital Collection Voucher** with:
  - Unique Reservation Code (e.g. `BB-RES-HYD-9482`)
  - Hospital Counter & 24x7 Emergency Contact Numbers
  - Printable / Downloadable Pickup Slip

### 5. 🏥 Verified Hospital & Blood Bank Directory
- Complete listing of verified healthcare facilities with licensing numbers, addresses, round-the-clock emergency desks, and live stock tags.

### 6. 🚨 Rapid Emergency Broadcast Intake
- 30-second emergency blood request workflow when rare blood groups are out of stock.
- Instant automated dispatch alerts sent to matching nearby voluntary donors.

### 7. 🔒 Cryptographic Token Tracking & Privacy-by-Design
- Live request tracking (`/request-status/:token`) using private, encrypted tokens.
- **Zero Contact Exposure:** Protects families from public phone scraping, spam, and scammers.

### 8. ❤️ Voluntary Donor Protection & "Quiet Mode"
- Built-in **Quiet Mode** and weekly frequency limits to protect voluntary donors from burnout while maintaining availability for life-threatening emergencies.

---

## 🛠️ Tech Stack

- **Frontend:** React 19, TypeScript, React Router v7
- **Bundler & Dev Server:** Vite 8
- **Styling:** Tailwind CSS + Vanilla CSS Tokens
- **Icons & Motion:** Lucide React, Framer Motion, Canvas Confetti
- **State Management & Persistence:** LocalStorage & Demo Data Store
- **Database & RLS:** PostgreSQL Schema via Supabase (with full Row-Level Security policies)
- **Testing:** Vitest + React Testing Library (18/18 Unit Tests Passing)

---

## 🚀 Quick Start (Run Locally)

### Prerequisites
- Node.js (version 18+ recommended)
- npm or pnpm

### Installation
```bash
# 1. Clone the repository
git clone https://github.com/YOUR_USERNAME/bloodbridge.git

# 2. Navigate to project directory
cd bloodbridge

# 3. Install dependencies
npm install

# 4. Start local development server
npm run dev
```

Visit `http://localhost:5173/` in your browser.

---

## 🧪 Testing & Verification

```bash
# Run automated test suite
npm test

# Run production build check
npm run build
```

---

## ☁️ 1-Click Deployment (Vercel)

This project is pre-configured with `vercel.json` for seamless Single Page Application (SPA) routing:

1. Import your GitHub repository into [Vercel](https://vercel.com).
2. Framework Preset: **Vite**
3. Build Command: `npm run build`
4. Output Directory: `dist`
5. Click **Deploy**.

---

## 👥 Built-in Demo Personas

BloodBridge includes a 1-click **Demo Mode Switcher** in the top navigation bar to test all user roles instantly without manual setup:
- **Public Visitor** (Search blood, explore hospital inventory, reserve units)
- **Voluntary Donor** (Access donor dashboard, availability & Quiet Mode)
- **Requester** (Track active requirements and token updates)
- **Hospital / Blood Bank Staff** (Manage inventory and verify patient pickups)
- **Master Admin** (Audit logs, platform moderation, verification queue)

---

## 📄 License
This project is open-source and licensed under the [MIT License](LICENSE).
