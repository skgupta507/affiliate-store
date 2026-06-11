"use client";

import { useEffect, Suspense } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useStore } from "@/store/useStore";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatPrice, getRelativeTime, generateId } from "@/lib/utils";
import { Package, ShoppingBag, Truck, CheckCircle, XCircle, Clock, ArrowRight, FileText } from "lucide-react";

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

    const itemRows = order.items.map((item) => `
      <tr>
        <td style="padding: 10px 12px; border-bottom: 1px solid #f0f0f0; font-size: 14px;">${item.title}</td>
        <td style="padding: 10px 12px; border-bottom: 1px solid #f0f0f0; font-size: 14px; text-align: center;">${item.quantity}</td>
        <td style="padding: 10px 12px; border-bottom: 1px solid #f0f0f0; font-size: 14px; text-align: right;">₹${item.price.toLocaleString("en-IN")}</td>
        <td style="padding: 10px 12px; border-bottom: 1px solid #f0f0f0; font-size: 14px; text-align: right;">₹${(item.price * item.quantity).toLocaleString("en-IN")}</td>
      </tr>
    `).join("");

    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Invoice #${order.id.slice(0, 8).toUpperCase()}</title></head>
    <body style="margin:0;padding:20px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:#fff;">
      <div style="max-width:700px;margin:0 auto;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:30px;padding-bottom:20px;border-bottom:2px solid #c2410c;">
          <div>
            <h1 style="margin:0;font-size:24px;color:#c2410c;">TheIdeaDecorator</h1>
            <p style="margin:4px 0 0;font-size:12px;color:#666;">Tax Invoice</p>
          </div>
          <div style="text-align:right;">
            <p style="margin:0;font-size:14px;font-weight:600;">Invoice #${order.id.slice(0, 8).toUpperCase()}</p>
            <p style="margin:4px 0 0;font-size:12px;color:#666;">${orderDate}</p>
          </div>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-bottom:30px;">
          <div>
            <p style="font-size:11px;color:#666;margin:0 0 6px;font-weight:600;">BILL TO:</p>
            <p style="font-size:14px;margin:0;line-height:1.5;">${order.shippingAddress.fullName}<br>${order.shippingAddress.addressLine1}<br>${order.shippingAddress.city}, ${order.shippingAddress.state} - ${order.shippingAddress.pincode}<br>Phone: ${order.shippingAddress.phone}</p>
          </div>
          <div style="text-align:right;">
            <p style="font-size:11px;color:#666;margin:0 0 6px;font-weight:600;">PAYMENT:</p>
            <p style="font-size:14px;margin:0;text-transform:uppercase;">${order.paymentMethod}</p>
            <p style="font-size:12px;color:#666;margin:4px 0 0;">Status: ${order.paymentStatus}</p>
          </div>
        </div>
        <table style="width:100%;border-collapse:collapse;margin-bottom:20px;">
          <thead><tr style="background:#f9fafb;">
            <th style="padding:10px 12px;text-align:left;font-size:12px;color:#666;">Item</th>
            <th style="padding:10px 12px;text-align:center;font-size:12px;color:#666;">Qty</th>
            <th style="padding:10px 12px;text-align:right;font-size:12px;color:#666;">Price</th>
            <th style="padding:10px 12px;text-align:right;font-size:12px;color:#666;">Total</th>
          </tr></thead>
          <tbody>${itemRows}</tbody>
        </table>
        <div style="text-align:right;border-top:2px solid #c2410c;padding-top:15px;">
          <p style="font-size:20px;color:#c2410c;margin:0;font-weight:700;">Total: ₹${order.totalAmount.toLocaleString("en-IN")}</p>
        </div>
        <div style="margin-top:40px;text-align:center;color:#999;font-size:11px;">
          <p>Thank you for shopping with TheIdeaDecorator!</p>
          <button onclick="window.print()" style="margin-top:10px;padding:8px 20px;background:#c2410c;color:white;border:none;border-radius:6px;cursor:pointer;font-size:13px;">Print Invoice</button>
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

            return (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="p-5 rounded-2xl border border-border bg-card backdrop-blur-sm"
              >
                {/* Order Header */}
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Order #{order.id.slice(0, 8)}</p>
                    <p className="text-xs text-muted-foreground/60">{getRelativeTime(order.createdAt)}</p>
                  </div>
                  <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-medium ${config.color}`}>
                    <StatusIcon className="w-3 h-3" />
                    {config.label}
                  </div>
                </div>

                {/* Items Preview */}
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {order.items.map((item) => (
                    <div key={item.productId} className="shrink-0">
                      <div className="w-16 h-16 rounded-lg bg-secondary overflow-hidden">
                        {item.image ? (
                          <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-muted-foreground/30">
                            <ShoppingBag className="w-6 h-6" />
                          </div>
                        )}
                      </div>
                      <p className="text-[10px] text-muted-foreground mt-1 w-16 truncate">{item.title}</p>
                    </div>
                  ))}
                </div>

                {/* Order Footer */}
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-border/50">
                  <div>
                    <p className="text-sm font-bold text-foreground">{formatPrice(order.totalAmount)}</p>
                    <p className="text-[10px] text-muted-foreground/60">
                      {order.items.length} item{order.items.length > 1 ? "s" : ""} • {order.paymentMethod.toUpperCase()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {(order.status === "pending" || order.status === "confirmed") && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => cancelOrder(order.id)}
                        className="text-red-400 hover:text-red-300 text-xs"
                      >
                        Cancel
                      </Button>
                    )}
                    {order.trackingNumber && order.status !== "delivered" && order.status !== "cancelled" && (
                      <a
                        href={`https://shiprocket.co/tracking/${order.trackingNumber}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-medium border border-blue-200 dark:border-blue-500/20 hover:bg-blue-100 dark:hover:bg-blue-500/20 transition-colors"
                      >
                        <Truck className="w-3 h-3" /> Track Order
                      </a>
                    )}
                    <button
                      onClick={() => handleViewInvoice(order)}
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-secondary text-foreground text-xs font-medium border border-border hover:bg-accent transition-colors"
                    >
                      <FileText className="w-3 h-3" /> Invoice
                    </button>
                    {order.estimatedDelivery && order.status !== "delivered" && order.status !== "cancelled" && (
                      <p className="text-[10px] text-muted-foreground">
                        Est. delivery: {new Date(order.estimatedDelivery).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
