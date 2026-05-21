# TheIdeaDecorator

A full-featured e-commerce and affiliate marketplace built with Next.js 16, React 19, and modern web technologies. Inspired by the UI/UX patterns from [myrtle.moe](https://github.com/Eltik/myrtle).

## Features

### E-Commerce
- **Direct Sell Products** - Add products with stock management, SKU, weight, dimensions
- **Shopping Cart** - Full cart with quantity controls, price calculations
- **Checkout Flow** - Multi-step checkout with address management and payment selection
- **Order Management** - Track orders with status updates (pending → confirmed → shipped → delivered)
- **Multiple Payment Methods** - COD, UPI, Cards, Net Banking

### Affiliate
- **Affiliate Products** - Link to Amazon, Flipkart, Myntra, and other platforms
- **Auto-Metadata Fetch** - Paste a URL and auto-fill product details
- **Click Tracking** - Track affiliate link clicks and performance
- **Platform Detection** - Automatically detect the affiliate platform from URL

### User Features
- **Wishlist & Watchlists** - Save favorites and create named collections
- **User Authentication** - Firebase Auth with Google and email/password
- **User Profiles** - Manage profile, addresses, and preferences
- **Recently Viewed** - Track browsing history
- **Search** - Full-text product search

### Admin Dashboard
- **Product Management** - Add, edit, delete products (both affiliate and direct)
- **Image Upload** - Upload product images or use URLs
- **Category Management** - Create and manage product categories
- **Analytics Overview** - Revenue, orders, clicks, platform distribution
- **Order Tracking** - View and manage all orders

### Design & UX (Myrtle-inspired)
- **Dark/Light Theme** - Full theme support with smooth transitions
- **Glassmorphism UI** - Modern glass-effect cards and navigation
- **Framer Motion Animations** - Smooth page transitions and micro-interactions
- **Responsive Design** - Mobile-first with breakpoints for all screen sizes
- **Gradient Accents** - Purple-to-blue gradient branding throughout

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **UI**: React 19, Tailwind CSS v4, Radix UI
- **State**: Zustand with localStorage persistence
- **Backend**: Supabase (real-time sync) + Firebase Auth
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Font**: Geist Mono

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

Copy `.env.example` to `.env.local` and fill in:

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_GA_MEASUREMENT_ID=
```

## Admin Access

Navigate to the hidden admin link in the footer (hover over the period at the end of the disclosure text) or go directly to `/login`.
