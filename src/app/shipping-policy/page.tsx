import { Truck } from "lucide-react";

export const metadata = { title: "Shipping Policy – TheIdeaDecorator" };

export default function ShippingPolicyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <Truck className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Shipping Policy</h1>
          <p className="text-xs text-muted-foreground">Last updated: May 2025</p>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {[
          { label: "Standard Delivery", value: "5–7 business days", color: "bg-blue-500/10 text-blue-600 dark:text-blue-400" },
          { label: "Express Delivery", value: "2–3 business days", color: "bg-amber-500/10 text-amber-600 dark:text-amber-400" },
          { label: "Free Shipping", value: "Orders above ₹499", color: "bg-green-500/10 text-green-600 dark:text-green-400" },
        ].map((s) => (
          <div key={s.label} className={`p-4 rounded-xl border border-border text-center ${s.color}`}>
            <p className="text-lg font-bold">{s.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
          </div>
        ))}
      </div>
      <div className="prose prose-sm max-w-none text-muted-foreground space-y-6">
        <section>
          <h2 className="text-base font-semibold text-foreground mb-2">Processing Time</h2>
          <p>Orders are processed within 1–2 business days of payment confirmation. Orders placed on weekends or public holidays are processed the next business day.</p>
        </section>
        <section>
          <h2 className="text-base font-semibold text-foreground mb-2">Delivery Partners</h2>
          <p>We ship via Delhivery and Shiprocket to 20,000+ pin codes across India. A tracking number will be emailed to you once your order is dispatched.</p>
        </section>
        <section>
          <h2 className="text-base font-semibold text-foreground mb-2">Shipping Charges</h2>
          <p>Shipping is free on all orders above ₹499. A flat shipping fee of ₹49 applies to orders below ₹499. Express delivery charges vary by location.</p>
        </section>
        <section>
          <h2 className="text-base font-semibold text-foreground mb-2">Delivery Attempts</h2>
          <p>Our logistics partners will attempt delivery twice. If delivery fails, the package will be held at the nearest hub for 3 days before being returned. Please ensure someone is available at the delivery address.</p>
        </section>
        <section>
          <h2 className="text-base font-semibold text-foreground mb-2">Damaged / Missing Items</h2>
          <p>If your order arrives damaged or incomplete, please contact us within 48 hours of delivery with photos at <a href="mailto:support@theideadecorator.in" className="text-primary">support@theideadecorator.in</a>.</p>
        </section>
      </div>
    </div>
  );
}
