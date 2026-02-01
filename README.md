# Global Clinical Mobility Standard (GCMS) Platform

## 🏥 Overview
GCMS is a premium clinical logistics platform connecting international medical graduates with high-volume fellowship and observership opportunities in India, the US, and the UK.

The platform relies on a "Clinical Prestige" aesthetic, utilizing **Next.js 14**, **Tailwind CSS**, and **Supabase**.

## 🚀 Getting Started

### 1. Prerequisites
- Node.js 18+
- npm or yarn

### 2. Environment Setup
The application relies on Supabase for data and Clerk for authentication.
Rename `.env.local.example` (or use the created template) to `.env.local` and populate the keys:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Clerk Auth
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
```

### 3. Installation
```bash
npm install
```

### 4. Running Locally
```bash
npm run dev
```
Visit [http://localhost:3000](http://localhost:3000) to view the application.

## 🌟 Key Features

### 👩‍⚕️ Student Dashboard (/dashboard/student)
- **Application Tracker**: Visual progress bar for fellowship applications.
- **Widgets**: Digital Logbook, Housing Assignment, and Concierge Chat.

### 👨‍💼 Admin Command Center (/dashboard/admin)
- **Kanban Board**: Manage student applications (New -> Vetting -> Payment -> Active).
- **Financial Pulse**: Real-time revenue tracking.
- **Simulations**:
    - **Split Payments**: Test Stripe Connect logic between Platform and Hospital.
    - **Housing Algo**: content-matching algorithm for student housing.

### 🏥 Program Catalog (/programs)
- Dynamic program listings.
- Dedicated details page (`/programs/[id]`) with curriculum and tuition info.

## 🛠️ Tech Stack
- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS, Shadcn/UI, Lucide Icons
- **Database**: Supabase
- **Auth**: Clerk
- ** fonts**: Playfair Display (Serif) & Inter (Sans)

## 📂 Project Structure
- `/app`: App Router pages and layouts.
- `/components`: Reusable UI components and widgets.
- `/lib`: Utility functions and mock logic (payments, housing).
- `/db`: SQL Schema definitions.
