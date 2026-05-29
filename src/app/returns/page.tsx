import { RotateCcw } from "lucide-react";

export const metadata = { title: "Returns & Refunds – TheIdeaDecorator" };

export default function ReturnsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <RotateCcw className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Returns & Refunds</h1>
          <p className="text-xs text-muted-foreground">Last updated: May 2025</p>
        </div>
      </div>
      <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-700 dark:text-green-400 text-sm mb-8 font-medium">
        ✓ 7-Day Hassle-Free Returns on all direct purchases
      </div>
      <div className="prose prose-sm max-w-none text-muted-foreground space-y-6">
        <section>
          <h2 className="text-base font-semibold text-foreground mb-2">Return Eligibility</h2>
          <p>You may return a product within 7 days of delivery if it is unused, in its original packaging, with all tags and accessories intact. We do not accept returns for used, damaged, or altered products.</p>
        </section>
        <section>
          <h2 className="text-base font-semibold text-foreground mb-2">Non-Returnable Items</h2>
          <p>Custom/personalized items, perishable goods, and products marked as "non-returnable" on the product page are not eligible for return.</p>
        </section>
        <section>
          <h2 className="text-base font-semibold text-foreground mb-2">How to Initiate a Return</h2>
          <ol className="list-decimal list-inside space-y-1">
            <li>Go to My Orders and select the order</li>
            <li>Click "Request Return" and select a reason</li>
            <li>Our team will arrange a pickup within 2 business days</li>
            <li>Once received and inspected, refund is processed</li>
          </ol>
        </section>
        <section>
          <h2 className="text-base font-semibold text-foreground mb-2">Refund Timeline</h2>
          <p>Refunds are processed within 5–7 business days after the returned item passes quality inspection. The amount is credited to your original payment method (UPI/bank/card).</p>
        </section>
        <section>
          <h2 className="text-base font-semibold text-foreground mb-2">Exchanges</h2>
          <p>We currently do not offer direct exchanges. Please return the item and place a new order for the desired product.</p>
        </section>
        <section>
          <h2 className="text-base font-semibold text-foreground mb-2">Affiliate Products</h2>
          <p>For products purchased via affiliate links (Amazon, Flipkart, etc.), please follow the respective platform's return policy. We cannot process returns for affiliate purchases.</p>
        </section>
        <section>
          <h2 className="text-base font-semibold text-foreground mb-2">Need Help?</h2>
          <p>Email us at <a href="mailto:support@theideadecorator.in" className="text-primary">support@theideadecorator.in</a> and we'll be happy to assist.</p>
        </section>
      </div>
    </div>
  );
}
