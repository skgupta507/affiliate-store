import Link from "next/link";
import { FileText } from "lucide-react";

export const metadata = { title: "Terms & Conditions – TheIdeaDecorator" };

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <FileText className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Terms & Conditions</h1>
          <p className="text-xs text-muted-foreground">Last updated: May 2025</p>
        </div>
      </div>
      <div className="prose prose-sm max-w-none text-muted-foreground space-y-6">
        <section>
          <h2 className="text-base font-semibold text-foreground mb-2">1. Acceptance of Terms</h2>
          <p>By accessing and using TheIdeaDecorator, you agree to be bound by these Terms. If you do not agree, please discontinue use of our platform.</p>
        </section>
        <section>
          <h2 className="text-base font-semibold text-foreground mb-2">2. Products & Pricing</h2>
          <p>We strive to display accurate product information and pricing. Prices are in Indian Rupees (₹) and inclusive of applicable taxes unless stated otherwise. We reserve the right to modify prices without prior notice.</p>
        </section>
        <section>
          <h2 className="text-base font-semibold text-foreground mb-2">3. Orders & Payments</h2>
          <p>Orders are confirmed only after successful payment. We accept UPI, net banking, credit/debit cards, and COD (where available). In case of payment failure, the order will be cancelled automatically.</p>
        </section>
        <section>
          <h2 className="text-base font-semibold text-foreground mb-2">4. Affiliate Links</h2>
          <p>Some products link to third-party platforms (Amazon, Flipkart, etc.). We may earn a commission on purchases made through these links at no extra cost to you. Affiliate transactions are governed by the respective platform's terms.</p>
        </section>
        <section>
          <h2 className="text-base font-semibold text-foreground mb-2">5. Intellectual Property</h2>
          <p>All content on this website — including text, images, logos, and design — is the property of TheIdeaDecorator and may not be reproduced without permission.</p>
        </section>
        <section>
          <h2 className="text-base font-semibold text-foreground mb-2">6. Limitation of Liability</h2>
          <p>TheIdeaDecorator is not liable for any indirect, incidental, or consequential damages arising from use of our platform or products. Our maximum liability is limited to the value of your purchase.</p>
        </section>
        <section>
          <h2 className="text-base font-semibold text-foreground mb-2">7. Governing Law</h2>
          <p>These terms are governed by Indian law. Disputes shall be subject to the jurisdiction of courts in Bangalore, Karnataka.</p>
        </section>
        <section>
          <h2 className="text-base font-semibold text-foreground mb-2">8. Contact</h2>
          <p>For any questions, contact us at <a href="mailto:support@theideadecorator.in" className="text-primary">support@theideadecorator.in</a>.</p>
        </section>
      </div>
    </div>
  );
}
