"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useStore } from "@/store/useStore";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatPrice, getRelativeTime } from "@/lib/utils";
import { Package, ShoppingBag, Truck, CheckCircle, XCircle, Clock, ArrowRight } from "lucide-react";

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
  const { orders, cancelOrder } = useStore();

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
