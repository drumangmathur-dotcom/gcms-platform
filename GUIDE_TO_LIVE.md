# 🚀 Zero-to-Live: The Baby Steps Guide

You asked for a breakdown of "where everything is" and "how to make it real." Here is your roadmap.

## 🏗️ 1. The Architecture (Where is my Server?)

You don't need to buy a separate "server" (like a VPS). Your architecture is **Serverless**.

*   **The "Frontend" (What users see)**: Next.js.
*   **The "Backend" (Logic & API)**: Also Next.js! It runs as "Serverless Functions" on the cloud (Vercel).
*   **The "Database" (Where data lives)**: Supabase (PostgreSQL). This is where your users, applications, and bookings are stored.
*   **The "Responses"**: You access these via the **Admin Dashboard** we built. It pulls data directly from Supabase.

## 💳 2. Payment Integration (Doing it for you)

We need a "Split Strategy" because India has specific banking rules (RBI).

| Region | Gateway | Why? |
| :--- | :--- | :--- |
| **Inbound (India)** | **Razorpay** | Best support for UPI, Indian Cards, and international payments needing GST compliance. |
| **Outbound (US/UK)** | **Stripe Connect** | Allows you to automatically "split" the fee (Student pays $2500 -> $500 to Hospital, $2000 to You). |

### Action Plan (I will code this):
1.  **Stripe**: I will modify `lib/payments.ts` to use the real `stripe` SDK.
2.  **Razorpay**: I will add a `lib/razorpay.ts` for Indian payments.
3.  **Checkout Page**: I will create a page that detects the program location and picks the right gateway.

## 🌐 3. Going Live (Deployment)

This is how we put it on the internet with a real `.com` domain.

### Step-by-Step "Baby Steps":

#### Phase A: The Database (Supabase)
1.  Go to [Supabase.com](https://supabase.com) and create a project called "GCMS Live".
2.  Go to **Project Settings -> API**.
3.  Copy the `Project URL` and `anon public key`.
4.  Go to **SQL Editor** in Supabase and paste the content of `db/schema.sql` (I created this file in your project). Click **Run**.
    *   *Result: Your database tables are created.*

#### Phase B: The Code (Vercel)
1.  Go to [Vercel.com](https://vercel.com) and sign up.
2.  Click **"Add New Project"**.
3.  Import from your GitHub repository (you need to push this code to GitHub first).
    *   *If you don't use GitHub, Vercel has a CLI tool I can help you use.*
4.  **Environment Variables**: Vercel will ask for environment variables. Paste the Supabase keys you copied earlier.
5.  Click **Deploy**.
    *   *Result: You have a live URL like `gcms-platform.vercel.app`.*

#### Phase C: The Domain (.com)
1.  Buy your domain (e.g., `clinical-standar.com`) on Namecheap, GoDaddy, or directly inside Vercel.
2.  In Vercel, go to **Settings -> Domains**.
3.  Type your domain name. Vercel will tell you exactly what "DNS Records" to change where you bought the domain (usually adding an "A Record" or "CNAME").
4.  Wait 1 hour.
    *   *Result: Your site is live at `www.clinical-standard.com`.*

## ✅ The "Is It Done?" Checklist

Here is exactly where we stand.

### Phase A: Database (Supabase)
*   **AI Status**: **Done**. Code is connected. Tables (`users`, etc.) are created and verified.
*   **PENDING (YOU)**: Nothing! This phase is 100% complete.

### Phase B: Payments (Money)
*   **AI Status**: **Done**. The "Universal Checkout" code is written. It splits payments and handles INR/USD automatically.
*   **PENDING (YOU)**: You need to get the **Real Keys** to replace the placeholders.
    1.  [ ] **Stripe (US/International)**:
        *   Go to [dashboard.stripe.com/apikeys](https://dashboard.stripe.com/apikeys).
        *   Copy `Secret Key` (`sk_live_...`).
        *   Paste it into your `.env.local` file (replace `sk_test_...`).
    2.  [ ] **Razorpay (India)**:
        *   Go to [dashboard.razorpay.com/app/keys](https://dashboard.razorpay.com/app/keys).
        *   Copy `Key ID` and `Key Secret`.
        *   Paste them into your `.env.local` file.

### Phase C: Going Live (The Website)
*   **AI Status**: **Ready**. The build passes (`npm run build` is green).
*   **PENDING (YOU)**: You need to put it on the internet.

#### Baby Steps for Phase C:
1.  **GitHub (Save the Code)**:
    *   Create a new repository on [GitHub.com](https://github.com/new) called `gcms-platform`.
    *   Run these commands in your VS Code terminal:
        ```bash
        git init
        git add .
        git commit -m "Initial Launch"
        git branch -M main
        git remote add origin https://github.com/YOUR_USERNAME/gcms-platform.git
        git push -u origin main
        ```
2.  **Vercel (Publish the Site)**:
    *   Go to [Vercel.com](https://vercel.com/new).
    *   Click **"Import"** next to `gcms-platform`.
    *   **IMPORTANT**: When it asks for "Environment Variables", you must Copy/Paste everything from your `.env.local` file (Supabase keys, Stripe keys, etc.).
    *   Click **Deploy**.

**Once you click Deploy, you are live.**
