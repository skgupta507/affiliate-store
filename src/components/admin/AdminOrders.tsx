"use client";

import { useStore } from "@/store/useStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatPrice, getRelativeTime } from "@/lib/utils";
import { Package, Truck, CheckCircle, XCircle, Clock } from "lucide-react";
import { Order } from "@/types";

const statusOptions: Order["status"][] = ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"];

const statusColors: Record<string, string> = {
  pending: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  confirmed: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  processing: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  shipped: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
  delivered: "bg-green-500/10 text-green-400 border-green-500/20",
  cancelled: "bg-red-500/10 text-red-400 border-red-500/20",
  returned: "bg-orange-500/10 text-orange-400 border-orange-500/20",
};

export function AdminOrders() {
  const { orders, updateOrderStatus } = useStore();

  const handleStatusChange = (order: Order, newStatus: Order["status"]) => {
    updateOrderStatus(order.id, newStatus);

    // Send status email to customer (fire and forget)
    const customerEmail = order.userId || "";
    if (customerEmail) {
      fetch("/api/send-status-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: customerEmail,
          customerName: order.shippingAddress.fullName,
          orderId: order.id,
          status: newStatus,
          trackingNumber: order.trackingNumber,
        }),
      }).catch(() => {});
    }
  };

  if (orders.length === 0) {
    return (
      <Card>
        <CardContent className="py-16 text-center">
          <Package className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white/70 mb-2">No Orders Yet</h3>
          <p className="text-sm text-muted-foreground">Orders will appear here when customers make purchases.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-foreground">All Orders ({orders.length})</h2>
      </div>

      {orders.map((order) => (
        <Card key={order.id}>
          <CardContent className="p-5">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm font-medium text-foreground">Order #{order.id.slice(0, 8)}</p>
                <p className="text-xs text-muted-foreground">{getRelativeTime(order.createdAt)}</p>
              </div>
              <div className={`px-3 py-1 rounded-full border text-xs font-medium capitalize ${statusColors[order.status] || ""}`}>
                {order.status}
              </div>
            </div>

            {/* Items */}
            <div className="space-y-2 mb-4">
              {order.items.map((item) => (
                <div key={item.productId} className="flex items-center gap-3 p-2 rounded-lg bg-secondary">
                  <div className="w-10 h-10 rounded-lg bg-secondary overflow-hidden shrink-0">
                    {item.image && <img src={item.image} alt="" className="w-full h-full object-cover" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-foreground truncate">{item.title}</p>
                    <p className="text-[10px] text-muted-foreground">Qty: {item.quantity} × {formatPrice(item.price)}</p>
                  </div>
                  <p className="text-xs font-medium text-foreground">{formatPrice(item.price * item.quantity)}</p>
                </div>
              ))}
            </div>

            {/* Shipping Address */}
            <div className="p-3 rounded-lg bg-secondary mb-4">
              <p className="text-xs text-muted-foreground mb-1">Ship to:</p>
              <p className="text-xs text-foreground">{order.shippingAddress.fullName}</p>
              <p className="text-[10px] text-muted-foreground">
                {order.shippingAddress.addressLine1}, {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
              </p>
              <p className="text-[10px] text-muted-foreground">Phone: {order.shippingAddress.phone}</p>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-foreground">{formatPrice(order.totalAmount)}</p>
                <p className="text-[10px] text-muted-foreground/60">
                  Payment: {order.paymentMethod.toUpperCase()} • {order.paymentStatus}
                </p>
              </div>

              {/* Status Update */}
              {order.status !== "delivered" && order.status !== "cancelled" && (
                <div className="flex gap-2">
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order, e.target.value as Order["status"])}
                    className="text-xs px-3 py-1.5 rounded-lg bg-secondary border border-border text-foreground appearance-none cursor-pointer"
                    style={{ colorScheme: "dark" }}
                  >
                    {statusOptions.map((s) => (
                      <option key={s} value={s} className="bg-secondary">
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
