"use client";

import Link from "next/link";
import { Home, Mail, MapPin, MessageCircle, ChevronUp } from "lucide-react";

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
    </svg>
  );
}

function TwitterIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  );
}

function YoutubeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
    </svg>
  );
}

function PinterestIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.174.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.39 18.592.026 11.985.026L12.017 0z"/>
    </svg>
  );
}

const socialLinks = [
  { href: "https://wa.me/917892430507?text=Hi%2C%20I%20need%20help", label: "WhatsApp", icon: MessageCircle, hoverColor: "hover:text-green-500 hover:bg-green-500/10" },
  { href: "https://www.instagram.com/theideadecorator", label: "Instagram", icon: InstagramIcon, hoverColor: "hover:text-pink-500 hover:bg-pink-500/10" },
  { href: "https://www.facebook.com/theideadecorator", label: "Facebook", icon: FacebookIcon, hoverColor: "hover:text-blue-500 hover:bg-blue-500/10" },
  { href: "https://twitter.com/ideadecorator", label: "X (Twitter)", icon: TwitterIcon, hoverColor: "hover:text-foreground hover:bg-accent" },
  { href: "https://www.pinterest.com/theideadecorator", label: "Pinterest", icon: PinterestIcon, hoverColor: "hover:text-red-500 hover:bg-red-500/10" },
  { href: "https://www.youtube.com/@theideadecorator", label: "YouTube", icon: YoutubeIcon, hoverColor: "hover:text-red-600 hover:bg-red-500/10" },
];

export function Footer() {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <footer className="border-t border-border mt-8 bg-card/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
                <Home className="w-4.5 h-4.5 text-primary-foreground" />
              </div>
              <div>
                <span className="text-lg font-bold text-foreground">TheIdea</span>
                <span className="text-lg font-bold text-primary">Decorator</span>
              </div>
            </Link>
            <p className="text-muted-foreground text-sm max-w-md leading-relaxed mb-4">
              Your one-stop destination for curated home decor, interior design products, furniture, lighting, and lifestyle essentials. Shop directly or find the best deals from top brands.
            </p>

            {/* Support Email */}
            <a
              href="mailto:support@theideadecorator.in"
              className="inline-flex items-center gap-2 text-sm text-primary hover:underline mb-4"
            >
              <Mail className="w-4 h-4" />
              support@theideadecorator.in
            </a>

            {/* Address */}
            <div className="flex items-start gap-2 text-xs text-muted-foreground mb-5">
              <MapPin className="w-3.5 h-3.5 shrink-0 mt-0.5 text-muted-foreground/60" />
              <span>#541, Vidyasagar Saraiplaya, Thanisandra Main Road, Dr. SRK Nagar Post, Bangalore – 560077</span>
            </div>

            {/* Social Links */}
            <div>
              <p className="text-xs text-muted-foreground mb-2 font-medium">Follow Us</p>
              <div className="flex gap-2">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-9 h-9 rounded-lg bg-secondary border border-border flex items-center justify-center text-muted-foreground transition-all ${social.hoverColor}`}
                    aria-label={social.label}
                    title={social.label}
                  >
                    <social.icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="text-foreground font-semibold mb-4 text-sm">Shop</h4>
            <div className="flex flex-col gap-2.5">
              {[
                { href: "/products", label: "All Products" },
                { href: "/categories", label: "Categories" },
                { href: "/deals", label: "Today's Deals" },
                { href: "/products?filter=trending", label: "Trending" },
                { href: "/products?filter=featured", label: "Featured" },
              ].map((link) => (
                <Link key={link.href} href={link.href} className="text-muted-foreground hover:text-foreground text-sm transition-colors">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Support + Legal */}
          <div>
            <h4 className="text-foreground font-semibold mb-4 text-sm">Support & More</h4>
            <div className="flex flex-col gap-2.5">
              {[
                { href: "/profile", label: "My Account" },
                { href: "/orders", label: "Track Orders" },
                { href: "/rewards", label: "Rewards Program" },
                { href: "/blog", label: "Blog" },
                { href: "/faq", label: "FAQ" },
                { href: "/support", label: "Help & Support" },
                { href: "/contact", label: "Contact Us" },
                { href: "/shipping-policy", label: "Shipping Policy" },
                { href: "/returns", label: "Returns & Refunds" },
                { href: "/privacy-policy", label: "Privacy Policy" },
                { href: "/terms", label: "Terms & Conditions" },
              ].map((link) => (
                <Link key={link.href} href={link.href} className="text-muted-foreground hover:text-foreground text-sm transition-colors">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-muted-foreground text-sm">
            © {new Date().getFullYear()} TheIdeaDecorator. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <p className="text-muted-foreground/60 text-xs">
              Some links may earn us a commission at no extra cost to you.
            </p>
            <button
              onClick={scrollToTop}
              className="w-8 h-8 rounded-lg bg-secondary border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent transition-all"
              aria-label="Back to top"
            >
              <ChevronUp className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
