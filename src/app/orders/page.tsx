"use client";

import { useEffect, Suspense, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useStore } from "@/store/useStore";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatPrice, getRelativeTime, generateId } from "@/lib/utils";
import { Package, ShoppingBag, Truck, CheckCircle, XCircle, Clock, ArrowRight, FileText, MapPin, CreditCard, Calendar, ChevronDown, ChevronUp, RotateCcw, MessageCircle, Star, Copy } from "lucide-react";

const statusConfig: Record<string, { color: string; icon: typeof Package; label: string }> = {
  pending: { color: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20", icon: Clock, label: "Pending" },
  confirmed: { color: "bg-blue-500/10 text-blue-400 border-blue-500/20", icon: CheckCircle, label: "Confirmed" },
  processing: { color: "bg-purple-500/10 text-purple-400 border-purple-500/20", icon: Package, label: "Processing" },
  shipped: { color: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20", icon: Truck, label: "Shipped" },
  delivered: { color: "bg-green-500/10 text-green-400 border-green-500/20", icon: CheckCircle, label: "Delivered" },
  cancelled: { color: "bg-red-500/10 text-red-400 border-red-500/20", icon: XCircle, label: "Cancelled" },
  returned: { color: "bg-orange-500/10 text-orange-400 border-orange-500/20", icon: Package, label: "Returned" },
};

export default function OrdersPage() {
  return (
    <Suspense fallback={<div className="px-4 py-20 text-center text-muted-foreground">Loading orders...</div>}>
      <OrdersContent />
    </Suspense>
  );
}

function OrdersContent() {
  const { orders, cancelOrder, currentUser, addOrder, clearCart, removeCoupon, addLoyaltyPoints, updateUserProfile } = useStore();
  const searchParams = useSearchParams();
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  // Handle PayU success redirect — create the order from sessionStorage
  useEffect(() => {
    const paymentStatus = searchParams.get("payment");
    const method = searchParams.get("method");

    if (paymentStatus === "success" && method === "payu") {
      const pendingData = sessionStorage.getItem("pendingPayUOrder");
      if (pendingData) {
        try {
          const pending = JSON.parse(pendingData);
          const order = {
            id: generateId(),
            items: pending.items,
            status: "confirmed" as const,
            totalAmount: pending.totalAmount,
            shippingAddress: pending.shippingAddress,
            paymentMethod: "payu",
            paymentStatus: "paid" as const,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            estimatedDelivery: new Date(Date.now() + 5 * 86400000).toISOString(),
            couponCode: pending.couponCode,
            couponDiscount: pending.couponDiscount,
            userId: pending.userId,
          };
          addOrder(order);
          clearCart();
          removeCoupon();

          // Award loyalty points
          const pointsEarned = Math.floor(pending.totalAmount / 10);
          if (pointsEarned > 0) addLoyaltyPoints(pointsEarned);

          // Update user stats
          if (currentUser) {
            updateUserProfile({
              totalSpent: (currentUser.totalSpent || 0) + pending.totalAmount,
              orderCount: (currentUser.orderCount || 0) + 1,
            });
          }

          // Send order email
          if (pending.customerEmail) {
            fetch("/api/send-order-email", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                customerEmail: pending.customerEmail,
                customerName: pending.customerName || "Customer",
                orderId: order.id,
                items: order.items,
                totalAmount: order.totalAmount,
                paymentMethod: "payu",
                shippingAddress: order.shippingAddress,
                orderDate: order.createdAt,
              }),
            }).catch(() => {});
          }
        } catch (e) {
          console.error("Failed to create PayU order:", e);
        }
        sessionStorage.removeItem("pendingPayUOrder");
      }
    }
  }, [searchParams]);

  const handleViewInvoice = (order: typeof orders[0]) => {
    const invoiceWindow = window.open("", "_blank");
    if (!invoiceWindow) return;

    const orderDate = new Date(order.createdAt).toLocaleDateString("en-IN", {
      year: "numeric", month: "long", day: "numeric",
    });

    const estimatedDelivery = order.estimatedDelivery
      ? new Date(order.estimatedDelivery).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" })
      : "3-5 business days";

    const subtotal = order.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const deliveryFee = subtotal > 499 ? 0 : 49;
    const couponDiscount = order.couponDiscount || 0;

    const itemRows = order.items.map((item, idx) => `
      <tr>
        <td style="padding: 12px; border-bottom: 1px solid #f0f0f0; font-size: 13px; color: #333;">${idx + 1}</td>
        <td style="padding: 12px; border-bottom: 1px solid #f0f0f0; font-size: 13px; color: #333;">${item.title}</td>
        <td style="padding: 12px; border-bottom: 1px solid #f0f0f0; font-size: 13px; color: #333; text-align: center;">${item.quantity}</td>
        <td style="padding: 12px; border-bottom: 1px solid #f0f0f0; font-size: 13px; color: #333; text-align: right;">₹${item.price.toLocaleString("en-IN")}</td>
        <td style="padding: 12px; border-bottom: 1px solid #f0f0f0; font-size: 13px; color: #333; text-align: right; font-weight: 600;">₹${(item.price * item.quantity).toLocaleString("en-IN")}</td>
      </tr>
    `).join("");

    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Invoice #${order.id.slice(0, 8).toUpperCase()} — TheIdeaDecorator</title>
    <style>
      @media print { .no-print { display: none !important; } body { padding: 0; } }
      body { margin: 0; padding: 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #fff; color: #333; }
    </style>
    </head>
    <body>
      <div style="max-width:750px;margin:0 auto;">
        <!-- Header -->
        <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:30px;padding-bottom:20px;border-bottom:3px solid #c2410c;">
          <div>
            <h1 style="margin:0;font-size:26px;color:#c2410c;font-weight:800;">TheIdeaDecorator</h1>
            <p style="margin:4px 0 0;font-size:11px;color:#888;">Shop Smart, Live Beautiful</p>
            <p style="margin:10px 0 0;font-size:11px;color:#666;line-height:1.5;">
              #541, Vidyasagar Saraiplaya<br>
              Thanisandra Main Road, Dr. SRK Nagar Post<br>
              Bangalore – 560077, Karnataka, India<br>
              Email: support@theideadecorator.in | Phone: +91 7892430507
            </p>
          </div>
          <div style="text-align:right;">
            <p style="margin:0;font-size:20px;font-weight:700;color:#333;">TAX INVOICE</p>
            <p style="margin:6px 0 0;font-size:13px;color:#555;">Invoice No: <strong>#${order.id.slice(0, 8).toUpperCase()}</strong></p>
            <p style="margin:3px 0 0;font-size:12px;color:#666;">Date: ${orderDate}</p>
            <p style="margin:3px 0 0;font-size:12px;color:#666;">Order ID: ${order.id.slice(0, 12).toUpperCase()}</p>
          </div>
        </div>

        <!-- Customer & Order Info -->
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:24px;margin-bottom:30px;">
          <div style="padding:16px;background:#f9fafb;border-radius:8px;">
            <p style="font-size:10px;color:#888;margin:0 0 8px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;">Bill To / Ship To</p>
            <p style="font-size:14px;margin:0;font-weight:600;color:#333;">${order.shippingAddress.fullName}</p>
            <p style="font-size:12px;margin:5px 0 0;color:#555;line-height:1.6;">
              ${order.shippingAddress.addressLine1}${order.shippingAddress.addressLine2 ? ", " + order.shippingAddress.addressLine2 : ""}<br>
              ${order.shippingAddress.city}, ${order.shippingAddress.state} – ${order.shippingAddress.pincode}<br>
              ${order.shippingAddress.country || "India"}
            </p>
            <p style="font-size:12px;margin:8px 0 0;color:#555;">📞 ${order.shippingAddress.phone}</p>
          </div>
          <div style="padding:16px;background:#f9fafb;border-radius:8px;">
            <p style="font-size:10px;color:#888;margin:0 0 8px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;">Order Details</p>
            <table style="width:100%;font-size:12px;color:#555;">
              <tr><td style="padding:3px 0;">Order Status</td><td style="padding:3px 0;text-align:right;font-weight:600;text-transform:capitalize;">${order.status}</td></tr>
              <tr><td style="padding:3px 0;">Payment Method</td><td style="padding:3px 0;text-align:right;font-weight:600;text-transform:uppercase;">${order.paymentMethod}</td></tr>
              <tr><td style="padding:3px 0;">Payment Status</td><td style="padding:3px 0;text-align:right;font-weight:600;text-transform:capitalize;color:${order.paymentStatus === "paid" ? "#16a34a" : "#eab308"}">${order.paymentStatus}</td></tr>
              ${order.trackingNumber ? `<tr><td style="padding:3px 0;">Tracking No.</td><td style="padding:3px 0;text-align:right;font-weight:600;font-family:monospace;">${order.trackingNumber}</td></tr>` : ""}
              <tr><td style="padding:3px 0;">Est. Delivery</td><td style="padding:3px 0;text-align:right;font-weight:600;">${estimatedDelivery}</td></tr>
              ${order.couponCode ? `<tr><td style="padding:3px 0;">Coupon Used</td><td style="padding:3px 0;text-align:right;font-weight:600;color:#c2410c;">${order.couponCode}</td></tr>` : ""}
            </table>
          </div>
        </div>

        <!-- Items Table -->
        <table style="width:100%;border-collapse:collapse;margin-bottom:20px;">
          <thead>
            <tr style="background:#1f2937;color:white;">
              <th style="padding:12px;text-align:left;font-size:11px;font-weight:600;border-radius:6px 0 0 0;">#</th>
              <th style="padding:12px;text-align:left;font-size:11px;font-weight:600;">Product</th>
              <th style="padding:12px;text-align:center;font-size:11px;font-weight:600;">Qty</th>
              <th style="padding:12px;text-align:right;font-size:11px;font-weight:600;">Unit Price</th>
              <th style="padding:12px;text-align:right;font-size:11px;font-weight:600;border-radius:0 6px 0 0;">Amount</th>
            </tr>
          </thead>
          <tbody>${itemRows}</tbody>
        </table>

        <!-- Totals -->
        <div style="display:flex;justify-content:flex-end;margin-bottom:30px;">
          <table style="width:280px;font-size:13px;">
            <tr><td style="padding:6px 0;color:#666;">Subtotal</td><td style="padding:6px 0;text-align:right;color:#333;">₹${subtotal.toLocaleString("en-IN")}</td></tr>
            <tr><td style="padding:6px 0;color:#666;">Delivery Fee</td><td style="padding:6px 0;text-align:right;color:${deliveryFee === 0 ? "#16a34a" : "#333"}">${deliveryFee === 0 ? "FREE" : "₹" + deliveryFee}</td></tr>
            ${couponDiscount > 0 ? `<tr><td style="padding:6px 0;color:#16a34a;">Coupon Discount</td><td style="padding:6px 0;text-align:right;color:#16a34a;">-₹${couponDiscount.toLocaleString("en-IN")}</td></tr>` : ""}
            <tr style="border-top:2px solid #c2410c;">
              <td style="padding:12px 0;font-size:16px;font-weight:700;color:#333;">Grand Total</td>
              <td style="padding:12px 0;text-align:right;font-size:18px;font-weight:800;color:#c2410c;">₹${order.totalAmount.toLocaleString("en-IN")}</td>
            </tr>
          </table>
        </div>

        <!-- Footer -->
        <div style="border-top:1px solid #e5e7eb;padding-top:20px;margin-top:20px;">
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;font-size:11px;color:#888;">
            <div>
              <p style="margin:0 0 4px;font-weight:600;color:#666;">Terms & Conditions</p>
              <p style="margin:0;line-height:1.5;">• 7-day return policy for direct purchases<br>• Refunds processed within 5-7 business days<br>• For queries, contact support@theideadecorator.in</p>
            </div>
            <div style="text-align:right;">
              <p style="margin:0 0 4px;font-weight:600;color:#666;">Contact Us</p>
              <p style="margin:0;line-height:1.5;">theideadecorator.in<br>+91 7892430507<br>support@theideadecorator.in</p>
            </div>
          </div>
          <div style="text-align:center;margin-top:25px;padding-top:15px;border-top:1px solid #f0f0f0;">
            <p style="font-size:12px;color:#666;margin:0 0 5px;">Thank you for shopping with <strong style="color:#c2410c;">TheIdeaDecorator</strong>!</p>
            <p style="font-size:10px;color:#aaa;margin:0;">This is a computer-generated invoice and does not require a signature.</p>
            <button onclick="window.print()" class="no-print" style="margin-top:15px;padding:10px 28px;background:#c2410c;color:white;border:none;border-radius:8px;cursor:pointer;font-size:13px;font-weight:600;">🖨️ Print Invoice</button>
          </div>
        </div>
      </div>
    </body></html>`;

    invoiceWindow.document.write(html);
    invoiceWindow.document.close();
  };

  if (orders.length === 0) {
    return (
      <div className="px-4 sm:px-6 lg:px-8 py-20 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-card border border-border flex items-center justify-center">
            <Package className="w-10 h-10 text-muted-foreground/60" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-3">No Orders Yet</h1>
          <p className="text-muted-foreground mb-8">Start shopping to see your orders here.</p>
          <Link href="/products">
            <Button size="lg" className="gap-2">
              <ShoppingBag className="w-4 h-4" /> Shop Now
            </Button>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-foreground mb-8 flex items-center gap-2">
          <Package className="w-6 h-6" /> My Orders
        </h1>

        <div className="space-y-4">
          {orders.map((order, index) => {
            const config = statusConfig[order.status] || statusConfig.pending;
            const StatusIcon = config.icon;
            const isExpanded = expandedOrder === order.id;
            const subtotal = order.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
            const deliveryFee = subtotal > 499 ? 0 : 49;
            const orderDate = new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

            return (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="rounded-2xl border border-border bg-card overflow-hidden"
              >
                {/* Order Header — Always Visible */}
                <div className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-semibold text-foreground">Order #{order.id.slice(0, 8).toUpperCase()}</p>
                          <button
                            onClick={() => { navigator.clipboard.writeText(order.id.slice(0, 8).toUpperCase()); }}
                            className="text-muted-foreground hover:text-foreground"
                            title="Copy Order ID"
                          >
                            <Copy className="w-3 h-3" />
                          </button>
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {orderDate}</span>
                        </p>
                      </div>
                    </div>
                    <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-medium ${config.color}`}>
                      <StatusIcon className="w-3.5 h-3.5" />
                      {config.label}
                    </div>
                  </div>

                  {/* Items List — Detailed */}
                  <div className="space-y-3 mb-4">
                    {order.items.map((item) => (
                      <div key={item.productId} className="flex items-center gap-3 p-3 rounded-xl bg-secondary/50">
                        <Link href={`/products/${item.productId}`} className="shrink-0">
                          <div className="w-16 h-16 rounded-lg bg-secondary overflow-hidden border border-border">
                            {item.image ? (
                              <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-muted-foreground/30">
                                <ShoppingBag className="w-5 h-5" />
                              </div>
                            )}
                          </div>
                        </Link>
                        <div className="flex-1 min-w-0">
                          <Link href={`/products/${item.productId}`} className="hover:text-primary transition-colors">
                            <p className="text-sm font-medium text-foreground line-clamp-1">{item.title}</p>
                          </Link>
                          <p className="text-xs text-muted-foreground mt-0.5">Qty: {item.quantity} × {formatPrice(item.price)}</p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-sm font-bold text-foreground">{formatPrice(item.price * item.quantity)}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Summary Bar */}
                  <div className="flex items-center justify-between pt-3 border-t border-border">
                    <div className="flex items-center gap-4">
                      <div>
                        <p className="text-lg font-bold text-foreground">{formatPrice(order.totalAmount)}</p>
                        <p className="text-[10px] text-muted-foreground">
                          {order.items.length} item{order.items.length !== 1 ? "s" : ""} • {order.paymentMethod === "cod" ? "Cash on Delivery" : order.paymentMethod.toUpperCase()}
                          {order.paymentStatus === "paid" && <span className="text-green-500 ml-1">• Paid</span>}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {/* Action Buttons */}
                      {(order.status === "pending" || order.status === "confirmed") && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            cancelOrder(order.id);
                            // Deduct loyalty points that were earned for this order (1 point per ₹10)
                            const pointsToDeduct = Math.floor(order.totalAmount / 10);
                            if (pointsToDeduct > 0) {
                              useStore.getState().redeemLoyaltyPoints(pointsToDeduct);
                            }
                            // Send cancellation email
                            const email = order.customerEmail || (order.userId?.includes("@") ? order.userId : null) || currentUser?.email;
                            if (email) {
                              fetch("/api/send-status-email", {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({
                                  email,
                                  customerName: order.shippingAddress.fullName,
                                  orderId: order.id,
                                  status: "cancelled",
                                }),
                              }).catch(() => {});
                            }
                          }}
                          className="text-red-400 hover:text-red-300 text-xs h-8"
                        >
                          <XCircle className="w-3.5 h-3.5 mr-1" /> Cancel
                        </Button>
                      )}
                      {order.trackingNumber && order.status !== "delivered" && order.status !== "cancelled" && (
                        <a href={`https://shiprocket.co/tracking/${order.trackingNumber}`} target="_blank" rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-3 h-8 rounded-lg bg-blue-500/10 text-blue-500 text-xs font-medium border border-blue-500/20 hover:bg-blue-500/20 transition-colors">
                          <Truck className="w-3.5 h-3.5" /> Track
                        </a>
                      )}
                      <button onClick={() => handleViewInvoice(order)} className="inline-flex items-center gap-1 px-3 h-8 rounded-lg bg-secondary text-foreground text-xs font-medium border border-border hover:bg-accent transition-colors">
                        <FileText className="w-3.5 h-3.5" /> Invoice
                      </button>
                      <button
                        onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                        className="inline-flex items-center gap-1 px-3 h-8 rounded-lg bg-secondary text-muted-foreground text-xs font-medium border border-border hover:bg-accent hover:text-foreground transition-colors"
                      >
                        {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                        {isExpanded ? "Less" : "Details"}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    className="border-t border-border bg-secondary/30 p-5 space-y-5"
                  >
                    {/* Order Timeline */}
                    <div>
                      <p className="text-xs font-semibold text-foreground mb-3 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-primary" /> Order Timeline
                      </p>
                      <div className="flex items-center gap-1 overflow-x-auto pb-2">
                        {["confirmed", "processing", "shipped", "delivered"].map((step, i) => {
                          const stepConfig = statusConfig[step];
                          const StepIcon = stepConfig.icon;
                          const statusOrder = ["pending", "confirmed", "processing", "shipped", "delivered"];
                          const currentIdx = statusOrder.indexOf(order.status);
                          const stepIdx = statusOrder.indexOf(step);
                          const isCompleted = stepIdx <= currentIdx && order.status !== "cancelled";
                          const isCurrent = step === order.status;

                          return (
                            <div key={step} className="flex items-center gap-1">
                              <div className={`flex flex-col items-center gap-1 px-2`}>
                                <div className={`w-7 h-7 rounded-full flex items-center justify-center ${isCompleted ? "bg-green-500/20 text-green-500" : isCurrent ? stepConfig.color.split(" ").slice(0,1).join(" ") + " " + stepConfig.color.split(" ")[1] : "bg-secondary text-muted-foreground"}`}>
                                  <StepIcon className="w-3.5 h-3.5" />
                                </div>
                                <span className={`text-[9px] capitalize ${isCompleted ? "text-green-500 font-medium" : "text-muted-foreground"}`}>{step}</span>
                              </div>
                              {i < 3 && <div className={`w-8 h-0.5 ${isCompleted && stepIdx < currentIdx ? "bg-green-500" : "bg-border"} mt-[-14px]`} />}
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Shipping Address */}
                      <div className="p-4 rounded-xl bg-card border border-border">
                        <p className="text-xs font-semibold text-foreground mb-2 flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-primary" /> Delivery Address
                        </p>
                        <p className="text-sm font-medium text-foreground">{order.shippingAddress.fullName}</p>
                        <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                          {order.shippingAddress.addressLine1}
                          {order.shippingAddress.addressLine2 && `, ${order.shippingAddress.addressLine2}`}<br />
                          {order.shippingAddress.city}, {order.shippingAddress.state} — {order.shippingAddress.pincode}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1.5">📞 {order.shippingAddress.phone}</p>
                      </div>

                      {/* Payment & Delivery Info */}
                      <div className="p-4 rounded-xl bg-card border border-border">
                        <p className="text-xs font-semibold text-foreground mb-2 flex items-center gap-1.5">
                          <CreditCard className="w-3.5 h-3.5 text-primary" /> Payment & Delivery
                        </p>
                        <div className="space-y-1.5 text-xs">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Payment</span>
                            <span className="text-foreground font-medium uppercase">{order.paymentMethod}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Payment Status</span>
                            <span className={`font-medium capitalize ${order.paymentStatus === "paid" ? "text-green-500" : "text-amber-500"}`}>{order.paymentStatus}</span>
                          </div>
                          {order.estimatedDelivery && order.status !== "delivered" && order.status !== "cancelled" && (
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Est. Delivery</span>
                              <span className="text-foreground font-medium">{new Date(order.estimatedDelivery).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</span>
                            </div>
                          )}
                          {order.trackingNumber && (
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Tracking</span>
                              <span className="text-foreground font-mono text-[10px]">{order.trackingNumber}</span>
                            </div>
                          )}
                          {order.couponCode && (
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Coupon</span>
                              <span className="text-primary font-medium">{order.couponCode} (-{formatPrice(order.couponDiscount || 0)})</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Price Breakdown */}
                    <div className="p-4 rounded-xl bg-card border border-border">
                      <p className="text-xs font-semibold text-foreground mb-2">Price Breakdown</p>
                      <div className="space-y-1.5 text-xs">
                        <div className="flex justify-between"><span className="text-muted-foreground">Subtotal ({order.items.length} items)</span><span className="text-foreground">{formatPrice(subtotal)}</span></div>
                        <div className="flex justify-between"><span className="text-muted-foreground">Delivery</span><span className={deliveryFee === 0 ? "text-green-500" : "text-foreground"}>{deliveryFee === 0 ? "FREE" : formatPrice(deliveryFee)}</span></div>
                        {order.couponDiscount && order.couponDiscount > 0 && (
                          <div className="flex justify-between"><span className="text-green-500">Coupon Discount</span><span className="text-green-500">-{formatPrice(order.couponDiscount)}</span></div>
                        )}
                        <div className="flex justify-between pt-2 border-t border-border"><span className="text-foreground font-semibold">Total Paid</span><span className="text-foreground font-bold text-base">{formatPrice(order.totalAmount)}</span></div>
                      </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="flex flex-wrap gap-2">
                      <Link href="/support">
                        <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-muted-foreground border border-border hover:text-foreground hover:bg-accent transition-colors">
                          <MessageCircle className="w-3.5 h-3.5" /> Need Help?
                        </button>
                      </Link>
                      {order.status === "delivered" && (
                        <Link href={`/products/${order.items[0]?.productId}`}>
                          <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-muted-foreground border border-border hover:text-foreground hover:bg-accent transition-colors">
                            <Star className="w-3.5 h-3.5" /> Write Review
                          </button>
                        </Link>
                      )}
                      {order.status === "delivered" && (
                        <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-muted-foreground border border-border hover:text-foreground hover:bg-accent transition-colors">
                          <RotateCcw className="w-3.5 h-3.5" /> Return / Exchange
                        </button>
                      )}
                      <Link href="/products">
                        <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-primary border border-primary/20 hover:bg-primary/10 transition-colors">
                          <ShoppingBag className="w-3.5 h-3.5" /> Buy Again
                        </button>
                      </Link>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
