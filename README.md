# TheIdeaDecorator

**Shop Smart, Live Beautiful** — A full-featured ecommerce and affiliate platform for home decor, furniture, lighting, and lifestyle products.

Built with Next.js 16, React 19, TypeScript, Tailwind CSS, Zustand, Firebase Auth, Supabase, and Razorpay/PayU payments.

🌐 **Live:** [theideadecorator.in](https://theideadecorator.in)

---

## Features

### 🛒 Core Commerce
- **Dual product model** — Affiliate (redirects to Amazon/Flipkart) + Direct sell (your own stock)
- **Multi-image product gallery** — Amazon-style carousel with thumbnails, arrows, zoom modal, keyboard navigation
- **Advanced search** — Full-text search by name, category, brand, tags with autocomplete suggestions
- **Advanced filtering** — Price range, minimum rating, availability (in stock/on sale), category, and 7 sort options
- **Product Q&A** — Customers ask questions, admin answers publicly (like Amazon)
- **Product reviews** — Star ratings, verified purchase badges, helpful votes, image uploads
- **Pincode delivery estimation** — Enter pincode, see estimated delivery date (like Flipkart)
- **Sticky add-to-cart bar** — Fixed bar appears on scroll with product info + action buttons (like Amazon)
- **Social proof** — "Only X left", "Y purchased this week", "Z people viewing" badges
- **Smart recommendations** — Personalized picks based on browsing history, category affinity, cart contents
- **Recently viewed** — Tracks last 20 products viewed

### 🛍️ Shopping Experience
- **Full cart management** — Add, remove, quantity controls, real-time totals
- **"Buy Now" skip cart** — Go directly to checkout with one click
- **Stock validation** — Blocks checkout for out-of-stock items with warnings
- **Coupon system** — Percentage/fixed discounts, min order, max discount, expiry, first-order-only, usage limits
- **Wishlist** — Save favorite products with one click
- **Watchlists** — Create named collections (e.g., "Living Room Ideas")
- **Price alerts** — Get notified when a product drops to your target price

### 💳 Checkout & Payments
- **3-step checkout** — Address → Payment → Review & Place Order
- **Multiple payment gateways:**
  - **Razorpay** — UPI, Cards, Net Banking, Wallets (modal checkout)
  - **PayU** — UPI, Cards, Net Banking, EMI (redirect checkout)
  - **Cash on Delivery** — Pay when you receive
- **Saved addresses** — Multiple addresses with default selection
- **Free shipping** over ₹499 (₹49 otherwise)
- **Order confirmation emails** — Branded HTML invoice via Resend

### 📦 Orders & Tracking
- **Order lifecycle** — Pending → Confirmed → Processing → Shipped → Delivered
- **Order cancellation** — For pending/confirmed orders
- **Detailed invoice generation** — Opens in new window with Print button, includes subtotal, delivery, coupon discount, payment details, address, terms
- **Shipment tracking** — Shiprocket + Delhivery integrations
- **Order status emails** — Automatic branded emails on status changes (shipped, delivered, etc.)

### 👤 User System
- **Firebase Authentication** — Email/Password + Google Sign-In
- **Demo mode** — Works without Firebase for development
- **User profile** — Edit name, photo, view orders, wishlist, watchlists, browsing history in tabbed layout
- **Forgot password** — OTP-based or Firebase reset link
- **Welcome email** — Branded onboarding email on registration
- **Cross-device sync** — Cart, addresses, orders, wishlist synced via Supabase real-time

### 🏆 Loyalty & Rewards
- **Points system** — Earn 1 point per ₹10 spent
- **4-tier program** — Bronze → Silver → Gold → Platinum with increasing multipliers
- **Referral codes** — Share and earn bonus points
- **Points redemption** — Use as discount at checkout (1 point = ₹1)
- **Tier benefits** — Free shipping, priority support, exclusive deals at higher tiers

### 📝 Content & Blog
- **Blog system** — Create/publish articles with cover images, categories, tags, read time
- **3 seed blog posts** — Pre-loaded articles so blog is never empty (decor tips, lighting guide, storage solutions)
- **Blog detail pages** — Full content display with related products, sharing, view tracking
- **SEO-optimized** — JSON-LD structured data for blog posts

### 🎫 Support System
- **Support tickets** — Create, track, and reply to tickets
- **Contact form** — Wired to create tickets AND send email notifications (to admin + customer confirmation)
- **FAQ page** — Searchable accordion with category filtering (8 pre-seeded questions)
- **Live chat link** — WhatsApp floating button
- **Contact email API** — Branded confirmation email to customer + notification to admin

### 🔔 Notifications
- **In-app notifications** — Bell icon in navbar with unread badge
- **Types** — Price drops, back in stock, order updates, promotions, rewards
- **Mark read/clear all** — Full notification management

### 🛡️ Admin Dashboard (11 tabs)
| Tab | Features |
|-----|----------|
| Overview | Revenue stats, top products, click analytics, platform distribution |
| Add Product | URL metadata auto-fetch, multi-image upload, full product form |
| Products | Edit ALL fields (incl. images), toggle featured/trending, delete |
| Inventory | Stock table, bulk updates, CSV export, change logs, restock alerts |
| Categories | CRUD with 20 pre-seeded categories |
| Orders | View all orders, update status (auto-sends email), view addresses |
| Coupons | Create/edit/delete coupons with all parameters |
| Blog | Create/edit/publish posts with rich content |
| Analytics | Revenue, conversion funnel, affiliate performance, profit margin, category revenue |
| Users | View all customers, order history, ban/unban, add new admins |
| Settings | Store configuration |

### 🔍 SEO & Performance
- **Structured data (JSON-LD)** — Product, Organization, Breadcrumb, FAQ, BlogPost schemas
- **Categories page** — Shows category images (from products or manual upload) with gradient overlay, product count, fallback to icon cards
- **Settings page** — Full settings: theme, email notification preferences (4 types), notification management, change password, delete account
- **Deals page** — Real computed stats (active deals count, max discount, items under ₹500, average savings %)
- **Sitemap.xml** — Auto-generated for all public pages
- **Robots.txt** — Proper crawl directives
- **Open Graph** — Social sharing metadata
- **PWA-ready** — Web app manifest, icons, theme color

### 📧 Email System (Resend)
- **No SMTP/app passwords needed** — Uses Resend API (free 3,000/month)
- **Order confirmation** — Branded HTML invoice email
- **Welcome email** — Onboarding with coupon code
- **Status updates** — Shipped, delivered, cancelled notifications
- **Contact form** — Sends to admin + confirmation to customer
- **Password reset OTP** — Branded OTP email
- **Graceful fallback** — Logs to console if Resend not configured

### 🌐 Social Media Integration
- **Footer** — Instagram, Facebook, X (Twitter), Pinterest, YouTube, WhatsApp with branded icons
- **About page** — Social links section
- **Product sharing** — Web Share API with clipboard fallback
- **WhatsApp floating button** — Quick support access

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| UI | React 19, Tailwind CSS 4, Radix UI, Framer Motion |
| State | Zustand (persisted to localStorage) |
| Auth | Firebase Authentication |
| Database | Supabase (PostgreSQL + real-time) |
| Payments | Razorpay + PayU |
| Email | Resend |
| Shipping | Shiprocket + Delhivery |
| Analytics | Google Analytics |
| Icons | Lucide React |
| Forms | React Hook Form + Zod |
| Charts | Recharts |

---

## Quick Start

```bash
# Install dependencies
npm install

# Copy env and configure
cp .env.example .env.local

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Environment Variables

See `.env.example` for all variables. The minimum to get started:

```env
# Emails (free — sign up at resend.com)
RESEND_API_KEY=re_xxxxxxxxx

# Payments (sign up at razorpay.com)
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_xxx
RAZORPAY_KEY_SECRET=xxx

# Optional: Firebase, Supabase, PayU, Shiprocket, Delhivery
```

The app works in **demo mode** without any env variables — auth, payments, and emails gracefully skip.

---

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes (payments, email, shipping)
│   ├── admin/             # Admin dashboard
│   ├── blog/              # Blog listing + detail
│   ├── cart/              # Shopping cart
│   ├── checkout/          # Multi-step checkout
│   ├── contact/           # Contact form (wired to email + tickets)
│   ├── deals/             # Deals & discounts
│   ├── faq/               # FAQ page
│   ├── forgot-password/   # Password reset with OTP
│   ├── orders/            # Order history + PayU completion
│   ├── products/          # Product listing + detail + gallery
│   ├── profile/           # User profile (tabbed)
│   ├── rewards/           # Loyalty program
│   ├── search/            # Search results
│   ├── settings/          # User settings + notifications
│   ├── support/           # Support tickets
│   └── ...               # Other pages
├── components/
│   ├── admin/            # Admin dashboard components
│   ├── layout/           # Navbar, Footer, WhatsApp button
│   ├── products/         # ProductGrid, ReviewSection, ProductQA, DeliveryEstimator, Recommendations
│   ├── ui/               # Reusable UI (Button, Input, Card, Dialog, etc.)
│   ├── SEO.tsx           # JSON-LD structured data components
│   └── NotificationBell.tsx
├── lib/
│   ├── email.ts          # Resend email utility
│   ├── firebase.ts       # Firebase Auth config
│   ├── supabase.ts       # Supabase client
│   ├── supabase-db.ts    # Database operations
│   ├── razorpay.ts       # Razorpay checkout
│   ├── payu.ts           # PayU checkout
│   └── utils.ts          # Helpers
├── store/
│   └── useStore.ts       # Zustand store (all state + actions)
└── types/
    └── index.ts          # TypeScript interfaces
```

---

## Deployment

Optimized for Vercel:

```bash
npm run build  # Builds successfully with 46 pages
```

---

## License

Private project. All rights reserved.
