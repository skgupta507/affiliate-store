import Link from "next/link";
import { Shield } from "lucide-react";

export const metadata = { title: "Privacy Policy – TheIdeaDecorator" };

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <Shield className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Privacy Policy</h1>
          <p className="text-xs text-muted-foreground">Last updated: May 2025</p>
        </div>
      </div>
      <div className="prose prose-sm max-w-none text-muted-foreground space-y-6">
        <section>
          <h2 className="text-base font-semibold text-foreground mb-2">1. Information We Collect</h2>
          <p>We collect information you provide directly: name, email address, phone number, and shipping address when you create an account or place an order. We also automatically collect usage data such as pages visited, products viewed, and browser/device type.</p>
        </section>
        <section>
          <h2 className="text-base font-semibold text-foreground mb-2">2. How We Use Your Information</h2>
          <p>We use your data to process and fulfill orders, send order updates and confirmations, improve our platform experience, send promotional emails (with your consent), and comply with legal obligations.</p>
        </section>
        <section>
          <h2 className="text-base font-semibold text-foreground mb-2">3. Sharing of Information</h2>
          <p>We do not sell your personal data. We share it only with trusted third parties necessary to operate our services: payment processors (Razorpay), logistics partners (Delhivery/Shiprocket), and email service providers.</p>
        </section>
        <section>
          <h2 className="text-base font-semibold text-foreground mb-2">4. Cookies</h2>
          <p>We use cookies to maintain your session, remember cart items, and analyze site usage. You may disable cookies in your browser, but some features may not function correctly.</p>
        </section>
        <section>
          <h2 className="text-base font-semibold text-foreground mb-2">5. Data Security</h2>
          <p>We implement industry-standard security measures including HTTPS encryption and secure storage. Payment information is processed by PCI-DSS compliant payment processors and is never stored on our servers.</p>
        </section>
        <section>
          <h2 className="text-base font-semibold text-foreground mb-2">6. Your Rights</h2>
          <p>You may request access to, correction of, or deletion of your personal data at any time by contacting us at <a href="mailto:support@theideadecorator.in" className="text-primary">support@theideadecorator.in</a>.</p>
        </section>
        <section>
          <h2 className="text-base font-semibold text-foreground mb-2">7. Contact</h2>
          <p>For privacy-related concerns, reach us at <a href="mailto:support@theideadecorator.in" className="text-primary">support@theideadecorator.in</a> or visit our <Link href="/contact" className="text-primary">Contact page</Link>.</p>
        </section>
      </div>
    </div>
  );
}
