# AffiliateHub - Premium Affiliate eCommerce Platform

A modern, fully frontend-only affiliate product showcase platform with premium glassmorphism UI. Add affiliate product links from Amazon, Flipkart, and other platforms, automatically fetch product metadata, and display them in a beautiful eCommerce-style interface.

## Features

- **Glassmorphism UI** — Premium design with blur effects, gradient borders, and smooth animations
- **Auto Metadata Fetch** — Paste an affiliate URL and automatically extract product title, image, description, and price
- **Admin Dashboard** — Add/edit/delete products, manage categories, view analytics
- **Product Showcase** — Beautiful product cards with hover effects, ratings, badges
- **Wishlist** — Save favorite products for later
- **Search & Filter** — Full-text search with category and sort filters
- **Dark/Light Mode** — Theme persistence across sessions
- **Responsive** — Mobile-first design that works on all devices
- **No Backend Required** — Everything runs in the browser using LocalStorage
- **Export/Import** — Backup and restore your product data as JSON

## Tech Stack

- **Next.js 15** (App Router)
- **React 19**
- **TypeScript**
- **Tailwind CSS 4**
- **Framer Motion** — Animations
- **Zustand** — State management with persistence
- **Lucide React** — Icons
- **Radix UI** — Accessible primitives
- **LocalStorage** — Data persistence (no backend needed)

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
cd affiliate-store
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

## Admin Access

Navigate to `/admin` or click the shield icon in the navbar.

**Demo Credentials:**
- Email: `admin@affiliatehub.com`
- Password: `admin123`

## How to Add Products

1. Log in to the Admin Dashboard
2. Click "Add Product" tab
3. Paste an affiliate URL (Amazon, Flipkart, etc.)
4. Click "Fetch" to auto-extract metadata
5. Edit/fill in any missing details
6. Set category, tags, price, and badges
7. Click "Add Product"

The product will immediately appear on the storefront.

## Pages

| Page | Route | Description |
|------|-------|-------------|
| Home | `/` | Hero section + featured/trending products |
| Products | `/products` | All products with search & filters |
| Product Detail | `/products/[id]` | Full product page with related items |
| Categories | `/categories` | Browse by category |
| Search | `/search` | Dedicated search page |
| Wishlist | `/wishlist` | Saved products |
| Admin | `/admin` | Dashboard, add/manage products |
| Login | `/login` | Admin authentication |
| Settings | `/settings` | Theme preferences |
| About | `/about` | About the platform |
| Contact | `/contact` | Contact form |

## Data Storage

By default, all data is stored in the browser's LocalStorage via Zustand's persist middleware. Data survives page refreshes and browser restarts.

### Export/Import

From Admin > Settings, you can:
- **Export** all products as a JSON file
- **Import** products from a previously exported JSON file

## Deployment (Vercel)

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Deploy — no environment variables needed for the base setup

```bash
# Or deploy via CLI
npm i -g vercel
vercel
```

## Optional: Firebase Integration

To add Firebase for persistent cloud storage and authentication:

1. Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
2. Create a `.env.local` file (see `.env.example`)
3. Update the auth and storage logic to use Firebase SDK

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── admin/             # Admin dashboard
│   ├── products/          # Product listing & detail
│   ├── categories/        # Category browsing
│   ├── wishlist/          # Saved products
│   ├── search/            # Search page
│   ├── login/             # Authentication
│   ├── settings/          # User preferences
│   ├── about/             # About page
│   ├── contact/           # Contact form
│   └── layout.tsx         # Root layout
├── components/
│   ├── admin/             # Admin dashboard components
│   ├── layout/            # Navbar, Footer, Toast
│   ├── products/          # ProductCard, ProductGrid
│   └── ui/                # Reusable UI primitives
├── lib/
│   ├── utils.ts           # Utility functions
│   └── metadata.ts        # URL metadata extraction
├── store/
│   └── useStore.ts        # Zustand global state
└── types/
    └── index.ts           # TypeScript interfaces
```

## License

MIT
